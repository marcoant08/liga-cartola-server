const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const target = path.join(root, 'api', '_nest_dist');

function rimraf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

rimraf(target);
if (!fs.existsSync(dist)) {
  console.error('prepare-vercel-api: dist/ não existe. Rode nest build antes.');
  process.exit(1);
}
copyRecursive(dist, target);
console.log('prepare-vercel-api: dist/ copiado para api/_nest_dist/');
