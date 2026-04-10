import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';

// Em produção: api/_nest_dist/ é preenchido por scripts/prepare-vercel-api.cjs após nest build
const vercelEntry = path.join(__dirname, '_nest_dist', 'vercel.js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createServerlessHandler } = require(vercelEntry) as {
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
