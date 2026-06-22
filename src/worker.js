const defaultPriceUsd = 55;
const defaultFormUrl = 'https://fasttrack-eng.payform.ru/';
const maxUploadSizeBytes = 8 * 1024 * 1024;
const d1UploadChunkSizeBytes = 1024 * 1024;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  },
});

const isFileLike = (value) => value
  && typeof value === 'object'
  && typeof value.arrayBuffer === 'function'
  && typeof value.name === 'string';

const requiredText = (formData, key) => {
  const value = formData.get(key);
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `Missing ${key}.`);
  }
  return value.trim();
};

const requiredInt = (formData, key, minimum) => {
  const value = Number(requiredText(formData, key));
  if (!Number.isFinite(value) || Math.floor(value) !== value || value < minimum) {
    throw new HttpError(400, `Invalid ${key}.`);
  }
  return value;
};

const requiredImage = (formData, key) => {
  const value = formData.get(key);
  if (!isFileLike(value) || value.size === 0) {
    throw new HttpError(400, `Missing ${key}.`);
  }
  if (!String(value.type || '').startsWith('image/')) {
    throw new HttpError(400, `${key} must be an image.`);
  }
  if (value.size > maxUploadSizeBytes) {
    throw new HttpError(400, `${key} is too large.`);
  }
  return value;
};

const parsePriceUsd = (env) => {
  const parsed = Number(env.PRODAMUS_PRICE_USD || defaultPriceUsd);
  if (!Number.isFinite(parsed) || parsed <= 0) return defaultPriceUsd;
  return parsed;
};

const createOrderId = () => {
  const suffix = crypto.randomUUID().replaceAll('-', '').slice(0, 16);
  return `ft_${Date.now().toString(36)}_${suffix}`;
};

const bytesToBase64 = (bytes) => {
  let binary = '';
  const encodeChunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += encodeChunkSize) {
    const chunk = bytes.subarray(offset, offset + encodeChunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
};

const prepareCustomerFileStorage = async (env, orderId, field, file, now) => {
  const uploadId = crypto.randomUUID();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const chunks = [];

  for (let offset = 0; offset < bytes.length; offset += d1UploadChunkSizeBytes) {
    chunks.push(bytesToBase64(bytes.subarray(offset, offset + d1UploadChunkSizeBytes)));
  }

  const statements = [
    env.PAYMENTS_DB.prepare(`
      INSERT INTO payment_uploads (
        id, order_id, field, file_name, content_type, size, chunk_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      uploadId,
      orderId,
      field,
      file.name,
      file.type || 'application/octet-stream',
      file.size,
      chunks.length,
      now,
    ),
    ...chunks.map((chunk, index) => env.PAYMENTS_DB.prepare(`
      INSERT INTO payment_upload_chunks (
        upload_id, chunk_index, data_base64
      ) VALUES (?, ?, ?)
    `).bind(uploadId, index, chunk)),
  ];

  return {
    statements,
    upload: {
      objectKey: `d1://payment_uploads/${uploadId}`,
      fileName: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
      chunkCount: chunks.length,
    },
  };
};

const createPaymentEventStatement = (env, orderId, eventType, status, verified, payload) => (
  env.PAYMENTS_DB.prepare(`
    INSERT INTO payment_events (
      id, order_id, event_type, status, verified, payload, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(),
    orderId || null,
    eventType,
    status || null,
    verified ? 1 : 0,
    JSON.stringify(payload || {}),
    new Date().toISOString(),
  )
);

const insertPaymentEvent = async (env, orderId, eventType, status, verified, payload) => {
  if (!env.PAYMENTS_DB) return;

  await createPaymentEventStatement(env, orderId, eventType, status, verified, payload).run();
};

const createPaymentOrderStatement = (env, order, storage, prodamusPaymentUrl, resolvedPayment, now) => {
  const priceUsd = parsePriceUsd(env);
  const priceCents = Math.round(priceUsd * 100);

  return env.PAYMENTS_DB.prepare(`
    INSERT INTO payment_orders (
      id, created_at, updated_at, status, price_cents, currency, email,
      arrival_date, flight_number, passenger_count, child_passenger_count,
      infant_passenger_count, passport_object_key, passport_file_name,
      passport_content_type, passport_size, selfie_object_key, selfie_file_name,
      selfie_content_type, selfie_size, prodamus_payment_url, resolved_payment_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    order.orderId,
    now,
    now,
    'created',
    priceCents,
    'usd',
    order.email,
    order.arrivalDate,
    order.flightNumber,
    order.passengerCount,
    order.childPassengerCount,
    order.infantPassengerCount,
    storage.passport.objectKey,
    storage.passport.fileName,
    storage.passport.contentType,
    storage.passport.size,
    storage.selfie.objectKey,
    storage.selfie.fileName,
    storage.selfie.contentType,
    storage.selfie.size,
    prodamusPaymentUrl,
    resolvedPayment.paymentUrl,
  );
};

const createOrderCreatedEventStatement = (env, order, storage, prodamusPaymentUrl, resolvedPayment) => {
  const priceUsd = parsePriceUsd(env);

  return createPaymentEventStatement(env, order.orderId, 'order_created', 'created', true, {
    email: order.email,
    arrivalDate: order.arrivalDate,
    flightNumber: order.flightNumber,
    passengerCount: order.passengerCount,
    childPassengerCount: order.childPassengerCount,
    infantPassengerCount: order.infantPassengerCount,
    priceCents: Math.round(priceUsd * 100),
    passportUpload: storage.passport,
    selfieUpload: storage.selfie,
    prodamusPaymentUrl,
    resolvedPaymentUrl: resolvedPayment.paymentUrl,
    resolvedInBackground: resolvedPayment.resolvedInBackground,
    routeTrace: resolvedPayment.routeTrace,
  });
};

const normalizeForSignature = (value) => {
  if (value === null || value === undefined) return '';

  if (Array.isArray(value)) {
    return value.map((item) => normalizeForSignature(item));
  }

  if (typeof value === 'object') {
    const sorted = {};
    for (const key of Object.keys(value).filter((key) => key !== 'signature' && key !== 'sign').sort()) {
      sorted[key] = normalizeForSignature(value[key]);
    }
    return sorted;
  }

  return String(value);
};

const toHex = (buffer) => Array.from(new Uint8Array(buffer))
  .map((byte) => byte.toString(16).padStart(2, '0'))
  .join('')
  .toUpperCase();

const createProdamusSignature = async (data, secretKey) => {
  const normalized = normalizeForSignature(data);
  const payload = JSON.stringify(normalized).replace(/\//g, '\\/');
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
};

const constantTimeEqual = (left, right) => {
  const leftValue = String(left || '').toUpperCase();
  const rightValue = String(right || '').toUpperCase();
  if (leftValue.length !== rightValue.length) return false;

  let mismatch = 0;
  for (let index = 0; index < leftValue.length; index += 1) {
    mismatch |= leftValue.charCodeAt(index) ^ rightValue.charCodeAt(index);
  }
  return mismatch === 0;
};

const appendQueryValue = (params, key, value) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => appendQueryValue(params, `${key}[${index}]`, item));
    return;
  }

  if (value && typeof value === 'object') {
    Object.keys(value).forEach((childKey) => appendQueryValue(params, `${key}[${childKey}]`, value[childKey]));
    return;
  }

  params.append(key, String(value));
};

const buildQueryString = (data) => {
  const params = new URLSearchParams();
  Object.keys(data).forEach((key) => appendQueryValue(params, key, data[key]));
  return params.toString();
};

const createPaymentUrl = async (env, request, order) => {
  if (!env.PRODAMUS_SECRET_KEY) {
    throw new HttpError(503, 'Prodamus secret key is not configured.');
  }

  const origin = new URL(request.url).origin;
  const formUrl = new URL(env.PRODAMUS_FORM_URL || defaultFormUrl);
  const priceUsd = parsePriceUsd(env).toFixed(2);
  const productName = env.PRODAMUS_PRODUCT_NAME || 'Phuket Airport Fast Track Arrival';
  const customerExtra = [
    `Arrival: ${order.arrivalDate}`,
    `Flight: ${order.flightNumber}`,
    `Passengers: ${order.passengerCount}`,
    `Children: ${order.childPassengerCount}`,
    `Infants: ${order.infantPassengerCount}`,
  ].join('; ');

  const payload = {
    order_id: order.orderId,
    customer_email: order.email,
    products: [
      {
        sku: 'fasttrack-arrival',
        name: productName,
        price: priceUsd,
        quantity: '1',
        type: 'service',
      },
    ],
    customer_extra: customerExtra,
    do: 'pay',
    urlReturn: `${origin}/payment-result?status=back&order_id=${encodeURIComponent(order.orderId)}`,
    urlSuccess: `${origin}/payment-result?status=success&order_id=${encodeURIComponent(order.orderId)}`,
    currency: 'usd',
    payments_limit: '1',
    installments_disabled: '1',
    callbackType: 'json',
  };

  if (env.PRODAMUS_SYS) {
    payload.sys = env.PRODAMUS_SYS;
    payload.urlNotification = `${origin}/api/prodamus-webhook`;
  }

  if (env.PRODAMUS_PAYMENT_METHOD) {
    payload.payment_method = env.PRODAMUS_PAYMENT_METHOD;
  }

  payload.signature = await createProdamusSignature(payload, env.PRODAMUS_SECRET_KEY);
  formUrl.search = buildQueryString(payload);
  return formUrl.toString();
};

const gatewayUrlPattern = /https?:\/\/(?:ecomm\.kapital24\.uz(?::\d+)?|prodamus\.online)\/[^"'<>\s]+/i;

const decodeHtmlUrl = (value) => value
  .replace(/&amp;/g, '&')
  .replace(/&#x2F;/gi, '/')
  .replace(/\\\//g, '/');

const extractGatewayUrl = (html) => {
  const match = html.match(gatewayUrlPattern);
  return match ? decodeHtmlUrl(match[0]) : '';
};

const resolvePaymentUrl = async (initialUrl) => {
  let currentUrl = initialUrl;
  const visited = [];

  for (let step = 0; step < 8; step += 1) {
    visited.push(currentUrl);

    let response;

    try {
      response = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'user-agent': 'Mozilla/5.0 FastTrackPaymentResolver/1.0',
        },
      });
    } catch (error) {
      return {
        paymentUrl: initialUrl,
        routeTrace: visited,
        resolvedInBackground: false,
        resolveError: error instanceof Error ? error.message : 'Payment routing failed.',
      };
    }

    const location = response.headers.get('location');
    if (location) {
      currentUrl = new URL(location, currentUrl).toString();
      if (gatewayUrlPattern.test(currentUrl)) break;
      continue;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const html = await response.text();
      const extractedUrl = extractGatewayUrl(html);

      if (extractedUrl) {
        currentUrl = new URL(extractedUrl, currentUrl).toString();
        break;
      }
    }

    if (response.url && response.url !== currentUrl && gatewayUrlPattern.test(response.url)) {
      currentUrl = response.url;
    }
    break;
  }

  if (!gatewayUrlPattern.test(currentUrl) && currentUrl !== initialUrl) {
    currentUrl = initialUrl;
  }

  return {
    paymentUrl: currentUrl,
    routeTrace: visited,
    resolvedInBackground: currentUrl !== initialUrl,
  };
};

const createPaymentIntent = async (request, env) => {
  if (!env.PAYMENTS_DB) {
    throw new HttpError(503, 'Payment database is not configured.');
  }

  const formData = await request.formData();
  const email = requiredText(formData, 'email').toLowerCase();
  const arrivalDate = requiredText(formData, 'arrivalDate');
  const flightNumber = requiredText(formData, 'flightNumber').toUpperCase();
  const passengerCount = requiredInt(formData, 'passengerCount', 1);
  const childPassengerCount = requiredInt(formData, 'childPassengerCount', 0);
  const infantPassengerCount = requiredInt(formData, 'infantPassengerCount', 0);
  const passportPhoto = requiredImage(formData, 'passportPhoto');
  const selfiePhoto = requiredImage(formData, 'selfiePhoto');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'Invalid email.');
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(arrivalDate)) {
    throw new HttpError(400, 'Invalid arrival date.');
  }

  const orderId = createOrderId();
  const order = {
    orderId,
    email,
    arrivalDate,
    flightNumber,
    passengerCount,
    childPassengerCount,
    infantPassengerCount,
  };

  const prodamusPaymentUrl = await createPaymentUrl(env, request, order);
  const resolvedPayment = await resolvePaymentUrl(prodamusPaymentUrl);
  const now = new Date().toISOString();
  const passportStorage = await prepareCustomerFileStorage(env, orderId, 'passport', passportPhoto, now);
  const selfieStorage = await prepareCustomerFileStorage(env, orderId, 'selfie', selfiePhoto, now);
  const storage = {
    passport: passportStorage.upload,
    selfie: selfieStorage.upload,
  };

  await env.PAYMENTS_DB.batch([
    createPaymentOrderStatement(env, order, storage, prodamusPaymentUrl, resolvedPayment, now),
    ...passportStorage.statements,
    ...selfieStorage.statements,
    createOrderCreatedEventStatement(env, order, storage, prodamusPaymentUrl, resolvedPayment),
  ]);

  return jsonResponse({ orderId, paymentUrl: resolvedPayment.paymentUrl });
};

const parseWebhookBody = async (request) => {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const payload = await request.json();
    return { payload, signatureCandidates: [payload, payload.submit].filter(Boolean) };
  }

  const formData = await request.formData();
  const flatPayload = {};
  for (const [key, value] of formData.entries()) {
    flatPayload[key] = typeof value === 'string' ? value : value.name;
  }

  return { payload: flatPayload, signatureCandidates: [flatPayload] };
};

const extractOrderId = (payload) => {
  const submit = payload && typeof payload === 'object' ? payload.submit : null;
  return payload?.order_num
    || payload?.order_id
    || submit?.order_num
    || submit?.order_id
    || '';
};

const extractProviderOrderId = (payload) => {
  const submit = payload && typeof payload === 'object' ? payload.submit : null;
  return payload?.order_id || submit?.order_id || null;
};

const extractPaymentStatus = (payload) => {
  const submit = payload && typeof payload === 'object' ? payload.submit : null;
  return payload?.payment_status || submit?.payment_status || payload?.status || submit?.status || 'webhook_received';
};

const handleProdamusWebhook = async (request, env) => {
  if (!env.PAYMENTS_DB) {
    throw new HttpError(503, 'Payment database is not configured.');
  }

  if (!env.PRODAMUS_SECRET_KEY) {
    throw new HttpError(503, 'Prodamus secret key is not configured.');
  }

  const signature = request.headers.get('Sign') || request.headers.get('sign');
  if (!signature) {
    throw new HttpError(401, 'Missing Prodamus signature.');
  }

  const { payload, signatureCandidates } = await parseWebhookBody(request);
  let verified = false;

  for (const candidate of signatureCandidates) {
    const expected = await createProdamusSignature(candidate, env.PRODAMUS_SECRET_KEY);
    if (constantTimeEqual(expected, signature)) {
      verified = true;
      break;
    }
  }

  if (!verified) {
    throw new HttpError(401, 'Invalid Prodamus signature.');
  }

  const orderId = extractOrderId(payload);
  const providerOrderId = extractProviderOrderId(payload);
  const paymentStatus = extractPaymentStatus(payload);
  const now = new Date().toISOString();

  await insertPaymentEvent(env, orderId, 'prodamus_webhook', paymentStatus, true, payload);

  if (orderId) {
    await env.PAYMENTS_DB.prepare(`
      UPDATE payment_orders
      SET status = ?, payment_status = ?, provider_order_id = COALESCE(?, provider_order_id),
          webhook_verified = 1, raw_webhook_payload = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      `payment_${paymentStatus}`,
      paymentStatus,
      providerOrderId,
      JSON.stringify(payload),
      now,
      orderId,
    ).run();
  }

  return jsonResponse({ ok: true });
};

const handlePaymentReturn = async (request, env) => {
  if (!env.PAYMENTS_DB) {
    throw new HttpError(503, 'Payment database is not configured.');
  }

  const payload = await request.json();
  const orderId = typeof payload.orderId === 'string' ? payload.orderId : '';
  const status = typeof payload.status === 'string' ? payload.status : 'return';

  if (!orderId) {
    throw new HttpError(400, 'Missing orderId.');
  }

  const now = new Date().toISOString();
  await insertPaymentEvent(env, orderId, 'payment_return', status, false, payload);
  await env.PAYMENTS_DB.prepare(`
    UPDATE payment_orders
    SET status = CASE WHEN payment_status IS NULL THEN ? ELSE status END,
        last_return_status = ?, raw_return_payload = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    `return_${status}`,
    status,
    JSON.stringify(payload),
    now,
    orderId,
  ).run();

  return jsonResponse({ ok: true });
};

const handleApiRequest = async (request, env) => {
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (url.pathname === '/api/payment-intents' && request.method === 'POST') {
    return createPaymentIntent(request, env);
  }

  if (url.pathname === '/api/payment-return' && request.method === 'POST') {
    return handlePaymentReturn(request, env);
  }

  if (url.pathname === '/api/prodamus-webhook' && request.method === 'POST') {
    return handleProdamusWebhook(request, env);
  }

  return jsonResponse({ error: 'Not found.' }, 404);
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname.startsWith('/api/')) {
        return await handleApiRequest(request, env);
      }

      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }

      return new Response('Not found', { status: 404 });
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      const message = error instanceof Error ? error.message : 'Unexpected error.';
      return jsonResponse({ error: message }, status);
    }
  },
};
