import { execFileSync, spawnSync } from 'node:child_process';

// Future release note:
// Keep deploy credentials out of the repo. Prefer a scoped API token in
// macOS Keychain, or pass CLOUDFLARE_API_TOKEN in CI. If Cloudflare only
// provides a Global API Key, store it with CLOUDFLARE_EMAIL in Keychain too.
// This lets `npm run deploy` work locally without committing secrets.
const TOKEN_KEYCHAIN_SERVICE = 'fast-track-phuket-cloudflare-api-token';
const TOKEN_KEYCHAIN_ACCOUNT = 'CLOUDFLARE_API_TOKEN';
const GLOBAL_KEYCHAIN_SERVICE = 'fast-track-phuket-cloudflare-global-api-key';
const GLOBAL_KEYCHAIN_ACCOUNT = 'CLOUDFLARE_API_KEY';
const EMAIL_KEYCHAIN_SERVICE = 'fast-track-phuket-cloudflare-email';
const EMAIL_KEYCHAIN_ACCOUNT = 'CLOUDFLARE_EMAIL';

const readSecretFromKeychain = (service, account) => {
  try {
    return execFileSync('security', [
      'find-generic-password',
      '-s',
      service,
      '-a',
      account,
      '-w',
    ], { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};

const token = process.env.CLOUDFLARE_API_TOKEN
  || readSecretFromKeychain(TOKEN_KEYCHAIN_SERVICE, TOKEN_KEYCHAIN_ACCOUNT);
const globalApiKey = process.env.CLOUDFLARE_API_KEY
  || readSecretFromKeychain(GLOBAL_KEYCHAIN_SERVICE, GLOBAL_KEYCHAIN_ACCOUNT);
const email = process.env.CLOUDFLARE_EMAIL
  || readSecretFromKeychain(EMAIL_KEYCHAIN_SERVICE, EMAIL_KEYCHAIN_ACCOUNT);

const cloudflareEnv = globalApiKey && email
  ? { CLOUDFLARE_API_KEY: globalApiKey, CLOUDFLARE_EMAIL: email }
  : { CLOUDFLARE_API_TOKEN: token };

if (!token && (!globalApiKey || !email)) {
  console.error(`Cloudflare credentials not found.

Create a Cloudflare API token with Workers Scripts edit/deploy permissions, then store it:

security add-generic-password -U \\
  -s ${TOKEN_KEYCHAIN_SERVICE} \\
  -a ${TOKEN_KEYCHAIN_ACCOUNT} \\
  -w '<token>'

Or store a Global API Key and account email:

security add-generic-password -U \\
  -s ${GLOBAL_KEYCHAIN_SERVICE} \\
  -a ${GLOBAL_KEYCHAIN_ACCOUNT} \\
  -w '<global-api-key>'

security add-generic-password -U \\
  -s ${EMAIL_KEYCHAIN_SERVICE} \\
  -a ${EMAIL_KEYCHAIN_ACCOUNT} \\
  -w '<cloudflare-email>'

After that, run: npm run deploy
`);
  process.exit(1);
}

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...cloudflareEnv },
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
};

run('npm', ['run', 'build']);

// Next deploy note: this command intentionally relies on wrangler.jsonc for
// the Worker name, dist asset directory, and SPA fallback behavior. Update
// wrangler.jsonc for release-target changes instead of adding CLI flags here.
run('npx', ['wrangler', 'deploy']);
