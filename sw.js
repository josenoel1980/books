const CACHE = 'book-library-v8';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Delete ALL old caches
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});

// Network-first for everything — no caching at all
// Prevents stale cached HTML/JS from being served
self.addEventListener('fetch', e => {
  // Don't intercept non-GET or cross-origin API requests at all
  const url = new URL(e.request.url);
  const isCrossOrigin = url.origin !== self.location.origin;
  if (isCrossOrigin || e.request.method !== 'GET') return;
  // For same-origin: always go to network, no cache
  e.respondWith(fetch(e.request));
});
