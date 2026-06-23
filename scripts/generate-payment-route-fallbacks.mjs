import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distRoot = path.resolve('dist');
const sourceIndex = path.join(distRoot, 'index.html');
const paymentRoutes = ['test-payments', 'payment-test', 'payment-result'];
const sourceHtml = await readFile(sourceIndex, 'utf8');
const paymentHtml = sourceHtml.replace(
  /<div id="root">[\s\S]*?<\/div>\s*(?=<noscript>)/,
  '<div id="root"></div>\n    ',
);

await Promise.all(paymentRoutes.map(async (route) => {
  const routeDir = path.join(distRoot, route);
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, 'index.html'), paymentHtml);
}));

console.log(`Generated payment route fallbacks for ${paymentRoutes.map((route) => `/${route}/`).join(', ')}`);
