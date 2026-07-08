import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const measurementId = 'G-S9BN74J1WR';
const targetFile = resolve('dist/commercial-strategy/index.html');

if (!existsSync(targetFile)) {
  console.log('[analytics] commercial strategy page not found in dist; skipping.');
  process.exit(0);
}

let html = readFileSync(targetFile, 'utf8');

if (html.includes(measurementId) || html.includes('googletagmanager.com/gtag/js')) {
  console.log('[analytics] commercial strategy page already has Google Analytics.');
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

if (!html.includes('</head>')) {
  throw new Error('[analytics] Could not find </head> in commercial strategy page.');
}

html = html.replace('</head>', `${analyticsTag}\n</head>`);
writeFileSync(targetFile, html);
console.log(`[analytics] added Google Analytics ${measurementId} to commercial strategy page.`);
