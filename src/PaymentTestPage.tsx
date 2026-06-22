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

const paymentPriceUsd = 55;
const paymentPriceThb = 1700;
const maxUploadSizeMb = 8;
const maxUploadSizeBytes = maxUploadSizeMb * 1024 * 1024;

type UploadField = 'passportPhoto' | 'selfiePhoto';

type PaymentFormState = {
  email: string;
  arrivalDate: string;
  flightNumber: string;
  passengerCount: number;
  childPassengerCount: number;
  infantPassengerCount: number;
  passportPhoto: File | null;
  selfiePhoto: File | null;
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
  email: '',
  arrivalDate: '',
  flightNumber: '',
  passengerCount: 1,
  childPassengerCount: 0,
  infantPassengerCount: 0,
  passportPhoto: null,
  selfiePhoto: null,
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const formatUsdPrice = (amount: number) => `USD ${new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(amount)}`;

const formatThbPrice = (amount: number) => `THB ${new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
}).format(amount)}`;

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
  const [previews, setPreviews] = useState<Record<UploadField, UploadPreview | null>>({
    passportPhoto: null,
    selfiePhoto: null,
  });
  const previewUrlsRef = useRef<string[]>([]);
  const [fieldError, setFieldError] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>({ type: 'idle' });

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
    const file = event.currentTarget.files?.[0] || null;
    const nextPreview = file ? { name: file.name, url: URL.createObjectURL(file) } : null;
    if (nextPreview) previewUrlsRef.current.push(nextPreview.url);
    setFieldError('');
    setSubmitState({ type: 'idle' });

    setPreviews((current) => {
      const existing = current[field];
      if (existing) URL.revokeObjectURL(existing.url);

      return {
        ...current,
        [field]: nextPreview,
      };
    });

    setForm((current) => ({ ...current, [field]: file }));
  };

  const validateForm = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return 'Enter a valid email address.';
    }

    if (!form.arrivalDate) {
      return 'Choose the arrival date.';
    }

    if (!form.flightNumber.trim()) {
      return 'Enter the flight number.';
    }

    if (form.passengerCount < 1) {
      return 'At least one passenger is required.';
    }

    if (!form.passportPhoto) {
      return 'Upload the passport photo.';
    }

    if (!form.selfiePhoto) {
      return 'Upload the selfie.';
    }

    const passportError = getUploadError(form.passportPhoto);
    if (passportError) return `Passport photo: ${passportError}`;

    const selfieError = getUploadError(form.selfiePhoto);
    if (selfieError) return `Selfie: ${selfieError}`;

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
    payload.set('email', form.email.trim());
    payload.set('arrivalDate', form.arrivalDate);
    payload.set('flightNumber', form.flightNumber.trim().toUpperCase());
    payload.set('passengerCount', String(form.passengerCount));
    payload.set('childPassengerCount', String(form.childPassengerCount));
    payload.set('infantPassengerCount', String(form.infantPassengerCount));
    payload.set('priceUsd', String(paymentPriceUsd));
    if (form.passportPhoto) payload.set('passportPhoto', form.passportPhoto);
    if (form.selfiePhoto) payload.set('selfiePhoto', form.selfiePhoto);

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
              <span className="payment-price-primary">{formatUsdPrice(paymentPriceUsd)}</span>
              <span className="payment-price-secondary">{formatThbPrice(paymentPriceThb)}</span>
            </span>
          </div>
        </div>

        <div className="payment-layout">
          <form className="payment-widget" onSubmit={submitPayment}>
            <div className="payment-heading">
              <p className="payment-kicker">FastTrack Phuket</p>
              <h1 id="payment-title">Arrival Fast Track Request</h1>
            </div>

            <div className="payment-field-grid">
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
                <span><CalendarDays size={16} /> Date of arrival</span>
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
                <span><Plane size={16} /> Flight number</span>
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
                  onChange={(event) => setUploadField('passportPhoto', event)}
                  required
                />
                <span className="payment-upload-copy">
                  <FileImage size={20} />
                  Passport photo
                </span>
                {previews.passportPhoto && (
                  <span className="payment-upload-preview">
                    <img src={previews.passportPhoto.url} alt="" />
                    {form.passportPhoto && (
                      <span>{previews.passportPhoto.name} · {formatFileSize(form.passportPhoto)}</span>
                    )}
                  </span>
                )}
              </label>

              <label className="payment-upload">
                <input
                  type="file"
                  name="selfiePhoto"
                  accept="image/*"
                  onChange={(event) => setUploadField('selfiePhoto', event)}
                  required
                />
                <span className="payment-upload-copy">
                  <FileImage size={20} />
                  Selfie
                </span>
                {previews.selfiePhoto && (
                  <span className="payment-upload-preview">
                    <img src={previews.selfiePhoto.url} alt="" />
                    {form.selfiePhoto && (
                      <span>{previews.selfiePhoto.name} · {formatFileSize(form.selfiePhoto)}</span>
                    )}
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
              <p className="payment-summary-price">{formatUsdPrice(paymentPriceUsd)}</p>
              <p className="payment-summary-converted">{formatThbPrice(paymentPriceThb)}</p>
            </div>
            <dl>
              <div>
                <dt>Total travelers</dt>
                <dd>{totalPassengers}</dd>
              </div>
              <div>
                <dt>Payment currency</dt>
                <dd>USD</dd>
              </div>
              <div>
                <dt>Thai baht reference</dt>
                <dd>{formatThbPrice(paymentPriceThb)}</dd>
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
