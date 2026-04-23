const CACHE_NAME = 'calarca-2026-v2'; // Versión actualizada
const assets = [
  '/',
  '/index.html?v=2',
  '/styles.css?v=2',
  '/script.js?v=2',
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
