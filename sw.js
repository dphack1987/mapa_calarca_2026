const CACHE_NAME = 'calarca-2026-v49'; // Nueva versión
const assets = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './imagenes/LOGO CALARCA 2026.jpg',
  './imagenes/mapa/mapa_principal.jpg',
  './imagenes/flores1.jpg',
  './imagenes/franja1.jpg',
  './imagenes/pautaQR.jpg',
  './imagenes/pautas/pauta_albania.jpg',
  './imagenes/pautas/pauta_alcaldia.jpg',
  './imagenes/pautas/pauta_alemania.jpg',
  './imagenes/pautas/pauta_amaranta.jpg',
  './imagenes/pautas/pauta_bendito.jpg',
  './imagenes/pautas/pauta_bisonte.jpg',
  './imagenes/pautas/pauta_chaparral.jpg',
  './imagenes/pautas/pauta_comaparado.jpg',
  './imagenes/pautas/pauta_confia.jpg',
  './imagenes/pautas/pauta_coomocal.jpg',
  './imagenes/pautas/pauta_descanso.jpg',
  './imagenes/pautas/pauta_domo.jpg',
  './imagenes/pautas/pauta_fercho.jpg',
  './imagenes/pautas/pauta_mapa.jpg',
  './imagenes/pautas/pauta_marta.jpg',
  './imagenes/pautas/pauta_master.jpg',
  './imagenes/pautas/pauta_origen.jpg',
  './imagenes/pautas/pauta_peñas.jpg',
  './imagenes/pautas/pauta_quindio_travel.jpg',
  './imagenes/pautas/pauta_quindus.jpg',
  './imagenes/pautas/pauta_quinti.jpg',
  './imagenes/pautas/pauta_raiz.jpg',
  './imagenes/pautas/pauta_recuca.jpg',
  './imagenes/pautas/pauta_rio.jpg',
  './imagenes/pautas/pauta_san_miguel.jpeg',
  './imagenes/pautas/pauta_talanquera.jpg',
  './imagenes/pautas/pauta_tertulia.jpg',
  './imagenes/pautas/pauta_ticlan.jpg',
  './imagenes/casillas_info/casillas tiendas de cafe.jpg',
  './imagenes/casillas_info/casillas_agencias.jpg',
  './imagenes/casillas_info/casillas_alcaldia.jpg',
  './imagenes/casillas_info/casillas_alojamiento.jpg',
  './imagenes/casillas_info/casillas_atractivos.jpg',
  './imagenes/casillas_info/casillas_escuela.jpg',
  './imagenes/casillas_info/casillas_libros.jpg',
  './imagenes/casillas_info/casillas_parrilas.jpg',
  './imagenes/casillas_info/casillas_pizeria.jpg',
  './imagenes/casillas_info/casillas_restaurantes.jpg',
  './imagenes/casillas_info/casillas_taxis.jpg',
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
