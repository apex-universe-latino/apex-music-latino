const CACHE_NAME = 'apex-portal-v2';
const ASSETS = [
  '/artist-portal/index.html',
  '/css/themes.css',
  '/Branding /aml_favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
