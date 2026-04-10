import type { VercelRequest, VercelResponse } from '@vercel/node';

// Compilado pelo Nest antes do deploy; CommonJS em dist/
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createServerlessHandler } = require('../dist/vercel.js') as {
  createServerlessHandler: () => Promise<
    (req: VercelRequest, res: VercelResponse) => unknown
  >;
};

let handlerPromise: ReturnType<typeof createServerlessHandler> | undefined;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!handlerPromise) {
    handlerPromise = createServerlessHandler();
  }
  const h = await handlerPromise;
  return h(req, res);
}
