import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const measurementId = 'G-S9BN74J1WR';
const distDir = resolve('dist');

// Auto-discover every standalone demo page (dist/<slug>/index.html) rather than
// hardcoding a single page. This is what lets future strategy pages inherit
// analytics automatically instead of being silently skipped.
const targets = [];
if (existsSync(distDir)) {
  for (const entry of readdirSync(distDir)) {
    const dir = join(distDir, entry);
    const indexFile = join(dir, 'index.html');
    if (statSync(dir).isDirectory() && existsSync(indexFile)) {
      targets.push(indexFile);
    }
  }
}

if (targets.length === 0) {
  console.log('[analytics] no standalone demo pages found in dist; skipping.');
  process.exit(0);
}

const analyticsTag = `
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${measurementId}');
</script>
`;

for (const targetFile of targets) {
  let html = readFileSync(targetFile, 'utf8');

  if (html.includes(measurementId) || html.includes('googletagmanager.com/gtag/js')) {
    console.log(`[analytics] ${targetFile} already has Google Analytics.`);
    continue;
  }
  if (!html.includes('</head>')) {
    console.log(`[analytics] skipping ${targetFile}: no </head> found.`);
    continue;
  }

  html = html.replace('</head>', `${analyticsTag}\n</head>`);
  writeFileSync(targetFile, html);
  console.log(`[analytics] added Google Analytics ${measurementId} to ${targetFile}.`);
}
