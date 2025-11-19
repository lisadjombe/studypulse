const CACHE_NAME = 'studypulse-cache-v1';
const PRECACHE_ASSETS = [
  '/studypulse/',
  '/studypulse/index.html',
  '/studypulse/styles.css',
  '/studypulse/script.js',
  '/studypulse/manifest.json'
];

// Instalación: cachear recursos esenciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activación: limpiar caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

// Fetch: responder desde cache, fallback a red
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cachedResp => {
      if (cachedResp) {
        fetch(req).then(networkResp => {
          if (networkResp && networkResp.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(req, networkResp.clone()));
          }
        }).catch(()=>{});
        return cachedResp;
      }
      return fetch(req).then(networkResp => {
        if (!networkResp || !networkResp.ok) return networkResp;
        const copy = networkResp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return networkResp;
      }).catch(() => {
        return caches.match('/studypulse/index.html');
      });
    })
  );
});
