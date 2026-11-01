const CACHE_NAME = 'mesario-v29';
const ASSETS = [
  './',
  './index.html',
  './pagina2.html',
  './css/style.css?v=20',
  './js/script.js?v=4',
  './js/script2.js?v=6',
  './js/audio.js?v=3',
  './manifest.json?v=2',
  './favicon.svg',
  './img/icon.svg',
  './img/fondo-corazones.svg',
  './img/foto1.jpg',
  './img/foto2.jpg',
  './img/foto3.jpg',
  './img/foto4.jpg',
  './img/foto5.jpg',
  './img/foto6.jpg',
  './img/foto7.jpg',
  './img/momento-especial.jpg',
  './audio/atado-a-tu-amor.mp3'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Eliminar cachés de versiones anteriores
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Solo interceptar peticiones GET del mismo origen
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
