const CACHE_NAME = 'calarca-2026-v16'; // Nueva versión
const assets = [
  './',
  './index.html?v=16',
  './styles.css?v=16',
  './script.js?v=16',
  './manifest.json',
  './imagenes/LOGO CALARCA 2026.jpg',
  './imagenes/calarca 2026 mapa cara 2.jpg',
  './imagenes/flores1.jpg',
  './imagenes/franja1.jpg',
  './imagenes/pautaQR.jpg',
  './imagenes/pautas/pauta_san_miguel.jpeg',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', e => {
  self.skipWaiting(); // Fuerza a que el nuevo Service Worker se active de inmediato
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => {
      return self.clients.claim(); // Toma el control de las pestañas abiertas inmediatamente
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
