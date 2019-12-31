const compilationTime='113110';let urlsToCache = [
  '/palette/index.html',
  '/palette/manifest.json',
  '/palette/css/style.css',
  '/palette/js/script.js'
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(compilationTime).then(function(cache) {
      return cache.addAll(urlsToCache);
    }),
    caches.keys().then(function(cacheNames) {
      cacheNames.forEach(function(cacheName) {
        if (cacheName !== compilationTime) caches.delete(cacheName)
      })
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith( async function() {
    caches.match(event.request)
      .then(function(response) {
        if (response) { return response; }
        const responce = await fetch(event.request);
        const responseToCache = response.clone();
        event.waitUntil(async function () {
          const cache = await caches.open(cacheName);
          await cache.put(event.request, responseToCache);
        }());
        return responce;
      })
    }
  );
});
