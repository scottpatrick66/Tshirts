
const CACHE = 'tee-cache-v2';
const BASE = (() => {
  try {
    const url = new URL(self.location.href);
    return url.pathname.replace(/sw\.js$/, '');
  } catch { return '/'; }
})();
const ASSETS = [
  `${BASE}`,
  `${BASE}index.html`,
  `${BASE}styles.css`,
  `${BASE}app.js`,
  `${BASE}manifest.webmanifest`,
  `${BASE}icons/icon-192.png`,
  `${BASE}icons/icon-512.png`
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin && url.pathname.startsWith(BASE)) {
    e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
  }
});
