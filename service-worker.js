const CACHE_NAME = "farmacia-cache-v2";

// Archivos que se guardan en el celular
const ARCHIVOS = [
  "./",
  "./index.html",
  "./app.js",
  "./style.css",
  "./data.json",
  "./manifest.json"
];

// Al instalar: guarda todo en el celular
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ARCHIVOS);
    })
  );
  self.skipWaiting();
});

// Al activar: borra cachés viejas
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Al buscar archivos: primero caché, luego internet
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        // Si hay internet, actualiza la caché
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    }).catch(() => caches.match("./index.html"))
  );
});
