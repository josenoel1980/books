const CACHE = 'book-library-v6';

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
  // Only cache same-origin requests; skip ALL external APIs
  if (!url.startsWith(self.location.origin)) return;
  if (url.includes('supabase') ||
      url.includes('anthropic') ||
      url.includes('cdnjs') ||
      url.includes('jsdelivr') ||
      url.includes('googleapis') ||
      url.includes('openlibrary') ||
      url.includes('goodreads')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
