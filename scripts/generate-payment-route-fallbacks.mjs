import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const distRoot = path.resolve('dist');
const sourceIndex = path.join(distRoot, 'index.html');
const paymentRoutes = ['test-payments', 'payment-test', 'payment-result'];

await Promise.all(paymentRoutes.map(async (route) => {
  const routeDir = path.join(distRoot, route);
  await mkdir(routeDir, { recursive: true });
  await copyFile(sourceIndex, path.join(routeDir, 'index.html'));
}));

console.log(`Generated payment route fallbacks for ${paymentRoutes.map((route) => `/${route}/`).join(', ')}`);
