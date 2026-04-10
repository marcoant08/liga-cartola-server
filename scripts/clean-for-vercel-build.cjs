const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function rm(p) {
  fs.rmSync(path.join(root, p), { recursive: true, force: true });
}

// Evita build incremental “vazio” quando dist/ foi apagado mas .tsbuildinfo ficou (comum na Vercel / CI)
for (const f of ['tsconfig.build.tsbuildinfo', 'tsconfig.tsbuildinfo']) {
  try {
    fs.unlinkSync(path.join(root, f));
  } catch {
    /* ok */
  }
}

rm('dist');
rm(path.join('api', '_nest_dist'));
