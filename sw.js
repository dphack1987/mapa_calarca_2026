const CACHE_NAME = 'calarca-2026-v1';
const assets = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/imagenes/LOGO CALARCA 2026.jpg',
  '/imagenes/calarca 2026 mapa cara 2.jpg',
  '/imagenes/flores1.jpg',
  '/imagenes/franja1.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
