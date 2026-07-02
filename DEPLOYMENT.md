# Deployment

Production deploys use Cloudflare Workers through `npm run deploy`.

## Cloudflare credentials

Do not commit Cloudflare secret values. The local deploy script reads credentials from macOS Keychain.

Current local credential setup:

- Valid deploy path: Global API Key plus account email in Keychain.
- Global API Key service: `fast-track-phuket-cloudflare-global-api-key`
- Global API Key account: `CLOUDFLARE_API_KEY`
- Email service: `fast-track-phuket-cloudflare-email`
- Email account: `CLOUDFLARE_EMAIL`

The script also supports a scoped API token:

- API token service: `fast-track-phuket-cloudflare-api-token`
- API token account: `CLOUDFLARE_API_TOKEN`

As of 2026-07-02, the Global API Key plus email path was verified and used successfully for production deploy. The stored scoped API token existed but was invalid, and Wrangler OAuth login failed during token exchange.

## Commands

Verify Cloudflare auth without printing secrets:

```bash
CLOUDFLARE_API_KEY="$(security find-generic-password -s fast-track-phuket-cloudflare-global-api-key -a CLOUDFLARE_API_KEY -w 2>/dev/null)" \
CLOUDFLARE_EMAIL="$(security find-generic-password -s fast-track-phuket-cloudflare-email -a CLOUDFLARE_EMAIL -w 2>/dev/null)" \
npx wrangler whoami
```

Deploy production:

```bash
npm run deploy
```

After a successful SEO/content deploy, notify search engines:

```bash
npm run indexnow:submit
```
