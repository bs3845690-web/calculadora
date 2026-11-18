const CACHE_NAME = 'calculadora-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Instalación: Guarda los archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Fuerza la activación inmediata
  );
});

// 2. Activación: Limpia cachés antiguas si actualizas la app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch: Intercepta las peticiones (Estrategia Cache First)
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en caché, lo devuelve (modo offline)
      if (cachedResponse) {
        return cachedResponse;
      }
      // Si no, lo busca en internet
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      }).catch(() => {
        // Fallback si no hay internet y no está en caché
        // (Para esta app no es crítico porque todo está cacheado)
      });
    })
  );
});