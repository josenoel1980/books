const CACHE = 'book-library-v4';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.add('./index.html').catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Skip all external/API requests
  if (!url.startsWith(self.location.origin) ||
      url.includes('supabase') ||
      url.includes('anthropic') ||
      url.includes('cdnjs') ||
      url.includes('jsdelivr') ||
      url.includes('openlibrary')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
