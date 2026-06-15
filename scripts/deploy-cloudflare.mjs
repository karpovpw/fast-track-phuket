import { execFileSync, spawnSync } from 'node:child_process';

const KEYCHAIN_SERVICE = 'fast-track-phuket-cloudflare-api-token';
const KEYCHAIN_ACCOUNT = 'CLOUDFLARE_API_TOKEN';

const readTokenFromKeychain = () => {
  try {
    return execFileSync('security', [
      'find-generic-password',
      '-s',
      KEYCHAIN_SERVICE,
      '-a',
      KEYCHAIN_ACCOUNT,
      '-w',
    ], { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};

const token = process.env.CLOUDFLARE_API_TOKEN || readTokenFromKeychain();

if (!token) {
  console.error(`Cloudflare API token not found.

Create a Cloudflare API token with Workers Scripts edit/deploy permissions, then store it:

security add-generic-password -U \\
  -s ${KEYCHAIN_SERVICE} \\
  -a ${KEYCHAIN_ACCOUNT} \\
  -w '<token>'

After that, run: npm run deploy
`);
  process.exit(1);
}

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, CLOUDFLARE_API_TOKEN: token },
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
};

run('npm', ['run', 'build']);

// Next deploy note: this command intentionally relies on wrangler.jsonc for
// the Worker name, dist asset directory, and SPA fallback behavior.
run('npx', ['wrangler', 'deploy']);
