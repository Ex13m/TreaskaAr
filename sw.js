/* Подстрели треску — service worker.
   HTML/навигация — network-first (всегда свежая версия при онлайне),
   остальные ассеты — cache-first (быстро + офлайн). */
const CACHE = 'treska-v23';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(CORE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// позволяет странице форсировать обновление SW
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

function isHTML(req) {
  return req.mode === 'navigate' ||
         (req.destination === 'document') ||
         /\.html(\?|$)/.test(req.url);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // HTML — network-first: новая версия игры подхватывается сразу при онлайне
  if (isHTML(req)) {
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match('./index.html', { ignoreSearch: true })
                 .then(hit => hit || caches.match('./')))
    );
    return;
  }

  // остальное (Three.js, модели, звуки, иконки) — cache-first
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit ||
      fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => undefined)
    )
  );
});
