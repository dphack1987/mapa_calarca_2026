const CACHE_NAME = 'calarca-2026-v3'; // Nueva versión
const assets = [
  './',
  './index.html?v=3',
  './styles.css?v=3',
  './script.js?v=3',
  './manifest.json',
  './imagenes/LOGO CALARCA 2026.jpg',
  './imagenes/calarca 2026 mapa cara 2.jpg',
  './imagenes/flores1.jpg',
  './imagenes/franja1.jpg',
  './imagenes/pautaQR.jpg',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
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
