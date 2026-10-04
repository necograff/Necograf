const CACHE = 'control-negocio-v22-shell';
const APP = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (e.request.method !== 'GET') return;
  if (u.pathname.endsWith('/sw.js')) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && (e.request.mode === 'navigate' || u.pathname.endsWith('.html') || u.pathname.endsWith('.webmanifest'))) {
        const copy = r.clone(); caches.open(CACHE).then(c=>c.put(e.request, copy));
      }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
