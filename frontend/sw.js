// AegisPath Service Worker for Progressive Web App (PWA) Offline & Installability
const CACHE_NAME = 'aegispath-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './art.html',
  './css/style.css',
  './manifest.json',
  './js/app.js',
  './js/router.js',
  './js/mockData.js',
  './js/i18n.js',
  './js/svgAssets.js',
  './js/api.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first strategy so changes are immediately visible
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
