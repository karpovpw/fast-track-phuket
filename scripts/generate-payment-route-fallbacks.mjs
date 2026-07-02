import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distRoot = path.resolve('dist');
const sourceIndex = path.join(distRoot, 'index.html');
const paymentRoutes = ['test-payments', 'payment-test', 'payment-result'];
const sourceHtml = await readFile(sourceIndex, 'utf8');

// Strip the injected SEO fallback (marker comments from
// generate-app-language-pages.mjs) and keep these utility routes out of
// search results: they duplicate the shell and have no standalone value.
let paymentHtml = sourceHtml.replace(
  /<!-- seo-fallback:start -->[\s\S]*?<!-- seo-fallback:end -->/,
  '<div id="root"></div>',
);
paymentHtml = paymentHtml.replace(
  /<meta name="robots" content="[^"]*" \/>/,
  '<meta name="robots" content="noindex, nofollow" />',
);
paymentHtml = paymentHtml.replace(/\s*<link rel="canonical" href="[^"]*" \/>/, '');
paymentHtml = paymentHtml.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>/g, '');

await Promise.all(paymentRoutes.map(async (route) => {
  const routeDir = path.join(distRoot, route);
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, 'index.html'), paymentHtml);
}));

console.log(`Generated noindex payment route fallbacks for ${paymentRoutes.map((route) => `/${route}/`).join(', ')}`);
