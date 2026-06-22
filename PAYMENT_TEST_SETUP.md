# Payment Test Page Setup

Standalone client page:

```text
/test-payments
/payment-test
```

The page posts customer details and document images to the Worker before redirecting to Prodamus via:

```text
https://fasttrack-eng.payform.ru/
```

The test form supports Arrival, Departure, and Combo services. THB is the primary displayed amount; the Worker converts that total to an approximate USD charge using `PRODAMUS_THB_USD_RATE`.

## Cloudflare Storage

The production Worker stores order information in D1:

- `payment_orders`: order status, service, passenger counts, flight/date, email, price, payment URLs, and primary file metadata.
- `payment_uploads`: metadata for every uploaded passport/selfie image.
- `payment_upload_chunks`: base64 chunks for every uploaded image file.
- `payment_events`: order creation, payment returns, and Prodamus webhook payloads.

The form accepts up to 5 passport photos and up to 5 selfies. Each image is validated as an image file and capped at 8 MB.

Create the free D1 database:

```bash
npx wrangler d1 create fasttrack_payments
```

Copy the D1 `database_id` from the first command into `wrangler.jsonc`.

Then apply the migration:

```bash
npx wrangler d1 migrations apply fasttrack_payments --remote
```

R2 is intentionally not required for the current free-only test setup. The form still requires passport/selfie uploads, and the Worker records file names, MIME types, and sizes in D1. Enable R2 later only if you explicitly want persistent image-byte storage.

## Prodamus Secrets

Set the payment form secret key from the Prodamus dashboard:

```bash
npx wrangler secret put PRODAMUS_SECRET_KEY
```

For signed webhook status updates, configure Prodamus to notify:

```text
https://fast-track-phuket.com/api/prodamus-webhook
```

If Prodamus support gives you a `sys` code for dynamic `urlNotification`, add it as a Worker secret or variable named `PRODAMUS_SYS`.

## Temporary URL Override

For a temporary manual test with a prebuilt Prodamus URL, set:

```bash
npx wrangler secret put PRODAMUS_PAYMENT_URL_OVERRIDE
```

Use this only for testing, because an override bypasses the dynamic service/passenger price calculation.
