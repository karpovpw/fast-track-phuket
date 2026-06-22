import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileImage,
  Mail,
  Plane,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';

const thbToUsdRate = 31.5;
const maxUploadSizeMb = 8;
const maxUploadSizeBytes = maxUploadSizeMb * 1024 * 1024;
const maxUploadFiles = 5;

const paymentServices = {
  arr: {
    title: 'Arrival Fast Track',
    dateLabel: 'Date of arrival',
    flightLabel: 'Arrival flight number',
    single: 1700,
    group: 1600,
    child: 850,
  },
  dep: {
    title: 'Departure VIP',
    dateLabel: 'Date of departure',
    flightLabel: 'Departure flight number',
    single: 1800,
    group: 1700,
    child: 900,
  },
  combo: {
    title: 'Arrival + Departure VIP Combo',
    dateLabel: 'First service date',
    flightLabel: 'Main flight number',
    single: 3300,
    group: 3100,
    child: 1650,
  },
} as const;

type PaymentServiceCode = keyof typeof paymentServices;
type UploadField = 'passportPhoto' | 'selfiePhoto';

type PaymentFormState = {
  serviceCode: PaymentServiceCode;
  email: string;
  arrivalDate: string;
  flightNumber: string;
  passengerCount: number;
  childPassengerCount: number;
  infantPassengerCount: number;
  passportPhoto: File[];
  selfiePhoto: File[];
};

type UploadPreview = {
  name: string;
  url: string;
};

type SubmitState =
  | { type: 'idle' }
  | { type: 'submitting' }
  | { type: 'redirecting'; orderId: string }
  | { type: 'error'; message: string };

const initialFormState: PaymentFormState = {
  serviceCode: 'arr',
  email: '',
  arrivalDate: '',
  flightNumber: '',
  passengerCount: 1,
  childPassengerCount: 0,
  infantPassengerCount: 0,
  passportPhoto: [],
  selfiePhoto: [],
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const formatApproxUsdPrice = (amount: number) => `≈ ${new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(amount)}`;

const formatThbPrice = (amount: number) => `THB ${new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
}).format(amount)}`;

const usdApproxForThb = (thbAmount: number) => Math.max(1, Math.round(thbAmount / thbToUsdRate));

const calculateServicePriceThb = (
  serviceCode: PaymentServiceCode,
  passengerCount: number,
  childPassengerCount: number,
) => {
  const service = paymentServices[serviceCode];
  const payingPassengers = passengerCount + childPassengerCount;
  const adultPrice = payingPassengers > 1 ? service.group : service.single;

  return (passengerCount * adultPrice) + (childPassengerCount * service.child);
};

const normalizeCount = (value: string, fallback: number) => {
  if (value === '') return 0;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.floor(parsed));
};

const getUploadError = (file: File) => {
  if (!file.type.startsWith('image/')) {
    return 'Upload an image file.';
  }

  if (file.size > maxUploadSizeBytes) {
    return `Maximum file size is ${maxUploadSizeMb} MB.`;
  }

  return '';
};

const getUploadListError = (files: File[], label: string) => {
  if (files.length > maxUploadFiles) {
    return `${label}: upload no more than ${maxUploadFiles} images.`;
  }

  for (const file of files) {
    const error = getUploadError(file);
    if (error) return `${label}: ${file.name}: ${error}`;
  }

  return '';
};

const formatFileSize = (file: File) => {
  if (file.size < 1024 * 1024) {
    return `${Math.max(1, Math.round(file.size / 1024))} KB`;
  }

  return `${(file.size / 1024 / 1024).toFixed(1)} MB`;
};

const PaymentResultPage = () => {
  const [statusSaved, setStatusSaved] = useState(false);
  const [statusError, setStatusError] = useState('');

  const result = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      orderId: params.get('order_id') || '',
      status: params.get('status') || 'return',
    };
  }, []);

  useEffect(() => {
    if (!result.orderId) return;

    fetch('/api/payment-return', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(result),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Could not save payment return status.');
        setStatusSaved(true);
      })
      .catch((error: unknown) => {
        setStatusError(error instanceof Error ? error.message : 'Could not save payment return status.');
      });
  }, [result]);

  const isSuccess = result.status === 'success';
  const title = isSuccess ? 'Payment Received' : 'Payment Not Completed';
  const body = isSuccess
    ? 'We received your payment return and will confirm your arrival request shortly.'
    : 'This payment was returned or closed before completion. Your request details were saved, but payment is not complete.';

  return (
    <main className="payment-page">
      <section className="payment-result-panel" aria-labelledby="payment-result-title">
        <div className="payment-result-icon" aria-hidden="true">
          <CheckCircle2 size={32} />
        </div>
        <p className="payment-kicker">FastTrack Phuket</p>
        <h1 id="payment-result-title">{title}</h1>
        <p>{body}</p>
        {result.orderId && <p className="payment-result-id">Order {result.orderId}</p>}
        {statusSaved && <p className="payment-inline-success">Request updated.</p>}
        {statusError && <p className="payment-inline-error">{statusError}</p>}
      </section>
    </main>
  );
};

const PaymentTestPage = () => {
  const [form, setForm] = useState<PaymentFormState>(initialFormState);
  const [previews, setPreviews] = useState<Record<UploadField, UploadPreview[]>>({
    passportPhoto: [],
    selfiePhoto: [],
  });
  const previewUrlsRef = useRef<string[]>([]);
  const [fieldError, setFieldError] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>({ type: 'idle' });
  const currentService = paymentServices[form.serviceCode];
  const paymentPriceThb = useMemo(() => calculateServicePriceThb(
    form.serviceCode,
    form.passengerCount,
    form.childPassengerCount,
  ), [form.serviceCode, form.passengerCount, form.childPassengerCount]);
  const paymentPriceUsd = useMemo(() => usdApproxForThb(paymentPriceThb), [paymentPriceThb]);

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const totalPassengers = form.passengerCount + form.childPassengerCount + form.infantPassengerCount;
  const isSubmitting = submitState.type === 'submitting' || submitState.type === 'redirecting';
  const submitError = submitState.type === 'error' ? submitState.message : '';

  const setServiceField = (value: string) => {
    if (!(value in paymentServices)) return;

    setFieldError('');
    setSubmitState({ type: 'idle' });
    setForm((current) => ({ ...current, serviceCode: value as PaymentServiceCode }));
  };

  const setTextField = (field: 'email' | 'arrivalDate' | 'flightNumber', value: string) => {
    setFieldError('');
    setSubmitState({ type: 'idle' });
    setForm((current) => ({ ...current, [field]: value }));
  };

  const setCountField = (
    field: 'passengerCount' | 'childPassengerCount' | 'infantPassengerCount',
    value: string,
  ) => {
    setFieldError('');
    setSubmitState({ type: 'idle' });
    setForm((current) => ({ ...current, [field]: normalizeCount(value, current[field]) }));
  };

  const setUploadField = (field: UploadField, event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files || []);
    const nextPreviews = files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    nextPreviews.forEach((preview) => previewUrlsRef.current.push(preview.url));
    setFieldError('');
    setSubmitState({ type: 'idle' });

    setPreviews((current) => {
      current[field].forEach((existing) => URL.revokeObjectURL(existing.url));

      return {
        ...current,
        [field]: nextPreviews,
      };
    });

    setForm((current) => ({ ...current, [field]: files }));
  };

  const validateForm = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return 'Enter a valid email address.';
    }

    if (!(form.serviceCode in paymentServices)) {
      return 'Choose the service.';
    }

    if (!form.arrivalDate) {
      return 'Choose the service date.';
    }

    if (!form.flightNumber.trim()) {
      return 'Enter the flight number.';
    }

    if (form.passengerCount < 1) {
      return 'At least one passenger is required.';
    }

    if (form.passportPhoto.length === 0) {
      return 'Upload at least one passport photo.';
    }

    if (form.selfiePhoto.length === 0) {
      return 'Upload at least one selfie.';
    }

    const passportError = getUploadListError(form.passportPhoto, 'Passport photos');
    if (passportError) return passportError;

    const selfieError = getUploadListError(form.selfiePhoto, 'Selfies');
    if (selfieError) return selfieError;

    return '';
  };

  const submitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setSubmitState({ type: 'submitting' });

    const payload = new FormData();
    payload.set('serviceCode', form.serviceCode);
    payload.set('email', form.email.trim());
    payload.set('arrivalDate', form.arrivalDate);
    payload.set('flightNumber', form.flightNumber.trim().toUpperCase());
    payload.set('passengerCount', String(form.passengerCount));
    payload.set('childPassengerCount', String(form.childPassengerCount));
    payload.set('infantPassengerCount', String(form.infantPassengerCount));
    payload.set('priceUsd', String(paymentPriceUsd));
    payload.set('priceThb', String(paymentPriceThb));
    form.passportPhoto.forEach((file) => payload.append('passportPhoto', file));
    form.selfiePhoto.forEach((file) => payload.append('selfiePhoto', file));

    try {
      const response = await fetch('/api/payment-intents', {
        method: 'POST',
        body: payload,
      });
      const result = await response.json() as { orderId?: string; paymentUrl?: string; error?: string };

      if (!response.ok || !result.paymentUrl || !result.orderId) {
        throw new Error(result.error || 'Could not create the payment.');
      }

      setSubmitState({ type: 'redirecting', orderId: result.orderId });
      window.location.assign(result.paymentUrl);
    } catch (error: unknown) {
      setSubmitState({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not create the payment.',
      });
    }
  };

  if (window.location.pathname.startsWith('/payment-result')) {
    return <PaymentResultPage />;
  }

  return (
    <main className="payment-page">
      <section className="payment-shell" aria-labelledby="payment-title">
        <div className="payment-brand-row">
          <div className="payment-logo">FAST<span>TRACK</span></div>
          <div className="payment-price-pill">
            <CreditCard size={16} />
            <span className="payment-price-stack">
              <span className="payment-price-primary">{formatThbPrice(paymentPriceThb)}</span>
              <span className="payment-price-secondary">({formatApproxUsdPrice(paymentPriceUsd)})</span>
            </span>
          </div>
        </div>

        <section className="payment-meeting-guide" aria-labelledby="payment-meeting-title">
          <div className="payment-meeting-copy">
            <p className="payment-kicker">Что делать в день оказания услуги</p>
            <h2 id="payment-meeting-title">Место встречи в аэропорту</h2>
            <p>
              После заказа услуги в назначенный день сотрудник иммиграции будет ждать вас у стойки информации,
              которая находится в главном холе прилета перед стойками иммиграционного контроля
            </p>
          </div>
          <figure className="payment-meeting-image">
            <img
              src="/arrival-meeting-point.jpg"
              alt="Information desk and Meet Here sign at Phuket airport arrival hall"
              loading="eager"
              width="1536"
              height="1152"
            />
          </figure>
        </section>

        <div className="payment-layout">
          <form className="payment-widget" onSubmit={submitPayment}>
            <div className="payment-heading">
              <p className="payment-kicker">FastTrack Phuket</p>
              <h1 id="payment-title">{currentService.title} Request</h1>
            </div>

            <div className="payment-field-grid">
              <label className="payment-field payment-field-wide">
                <span><ShieldCheck size={16} /> Service</span>
                <select
                  name="serviceCode"
                  value={form.serviceCode}
                  onChange={(event) => setServiceField(event.currentTarget.value)}
                  required
                >
                  {Object.entries(paymentServices).map(([code, service]) => {
                    const servicePrice = calculateServicePriceThb(
                      code as PaymentServiceCode,
                      form.passengerCount,
                      form.childPassengerCount,
                    );

                    return (
                      <option key={code} value={code}>
                        {service.title} - {formatThbPrice(servicePrice)} ({formatApproxUsdPrice(usdApproxForThb(servicePrice))})
                      </option>
                    );
                  })}
                </select>
              </label>

              <label className="payment-field">
                <span><Mail size={16} /> Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(event) => setTextField('email', event.currentTarget.value)}
                  autoComplete="email"
                  placeholder="client@example.com"
                  required
                />
              </label>

              <label className="payment-field">
                <span><CalendarDays size={16} /> {currentService.dateLabel}</span>
                <input
                  type="date"
                  name="arrivalDate"
                  min={todayIso()}
                  value={form.arrivalDate}
                  onChange={(event) => setTextField('arrivalDate', event.currentTarget.value)}
                  required
                />
              </label>

              <label className="payment-field payment-field-wide">
                <span><Plane size={16} /> {currentService.flightLabel}</span>
                <input
                  type="text"
                  name="flightNumber"
                  value={form.flightNumber}
                  onChange={(event) => setTextField('flightNumber', event.currentTarget.value)}
                  autoComplete="off"
                  placeholder="TG 221"
                  required
                />
              </label>
            </div>

            <div className="payment-passenger-grid">
              <label className="payment-field">
                <span><UsersRound size={16} /> Passengers</span>
                <input
                  type="number"
                  name="passengerCount"
                  min="1"
                  inputMode="numeric"
                  value={form.passengerCount}
                  onChange={(event) => setCountField('passengerCount', event.currentTarget.value)}
                  required
                />
              </label>

              <label className="payment-field">
                <span><UserRound size={16} /> Children</span>
                <input
                  type="number"
                  name="childPassengerCount"
                  min="0"
                  inputMode="numeric"
                  value={form.childPassengerCount}
                  onChange={(event) => setCountField('childPassengerCount', event.currentTarget.value)}
                />
              </label>

              <label className="payment-field">
                <span><UserRound size={16} /> Infants</span>
                <input
                  type="number"
                  name="infantPassengerCount"
                  min="0"
                  inputMode="numeric"
                  value={form.infantPassengerCount}
                  onChange={(event) => setCountField('infantPassengerCount', event.currentTarget.value)}
                />
              </label>
            </div>

            <div className="payment-upload-grid">
              <label className="payment-upload">
                <input
                  type="file"
                  name="passportPhoto"
                  accept="image/*"
                  multiple
                  onChange={(event) => setUploadField('passportPhoto', event)}
                  required
                />
                <span className="payment-upload-copy">
                  <FileImage size={20} />
                  Passport photos
                </span>
                <span className="payment-upload-help">Upload one or more images, up to {maxUploadFiles} files.</span>
                {previews.passportPhoto.length > 0 && (
                  <span className="payment-upload-preview-list">
                    {previews.passportPhoto.map((preview, index) => (
                      <span className="payment-upload-preview" key={preview.url}>
                        <img src={preview.url} alt="" />
                        <span>{preview.name} · {formatFileSize(form.passportPhoto[index])}</span>
                      </span>
                    ))}
                  </span>
                )}
              </label>

              <label className="payment-upload">
                <input
                  type="file"
                  name="selfiePhoto"
                  accept="image/*"
                  multiple
                  onChange={(event) => setUploadField('selfiePhoto', event)}
                  required
                />
                <span className="payment-upload-copy">
                  <FileImage size={20} />
                  Selfies
                </span>
                <span className="payment-upload-help">Upload one or more images, up to {maxUploadFiles} files.</span>
                {previews.selfiePhoto.length > 0 && (
                  <span className="payment-upload-preview-list">
                    {previews.selfiePhoto.map((preview, index) => (
                      <span className="payment-upload-preview" key={preview.url}>
                        <img src={preview.url} alt="" />
                        <span>{preview.name} · {formatFileSize(form.selfiePhoto[index])}</span>
                      </span>
                    ))}
                  </span>
                )}
              </label>
            </div>

            {(fieldError || submitError) && (
              <p className="payment-inline-error">{fieldError || submitError}</p>
            )}

            {submitState.type === 'redirecting' && (
              <p className="payment-inline-success">Order {submitState.orderId} saved. Redirecting to payment.</p>
            )}

            <button className="payment-submit" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Saving order' : 'Continue to payment'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <aside className="payment-summary" aria-label="Payment summary">
            <div>
              <p className="payment-summary-label">Amount due</p>
              <p className="payment-summary-price">{formatThbPrice(paymentPriceThb)}</p>
              <p className="payment-summary-converted">({formatApproxUsdPrice(paymentPriceUsd)})</p>
            </div>
            <dl>
              <div>
                <dt>Service</dt>
                <dd>{currentService.title}</dd>
              </div>
              <div>
                <dt>Total travelers</dt>
                <dd>{totalPassengers}</dd>
              </div>
              <div>
                <dt>Adults</dt>
                <dd>{form.passengerCount}</dd>
              </div>
              <div>
                <dt>Children</dt>
                <dd>{form.childPassengerCount}</dd>
              </div>
              <div>
                <dt>Infants</dt>
                <dd>{form.infantPassengerCount}</dd>
              </div>
              <div>
                <dt>Approximate card charge</dt>
                <dd>{formatApproxUsdPrice(paymentPriceUsd)}</dd>
              </div>
            </dl>
            <p className="payment-security-note">
              <ShieldCheck size={18} />
              Order details are saved before opening the payment page.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default PaymentTestPage;
