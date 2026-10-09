const CACHE='control-negocio-v25-movil-shell';
const APP=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('control-negocio-')&&k!==CACHE).map(k=>caches.delete(k)))),
  self.clients.claim()
])));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.endsWith('/sw.js'))return;
  e.respondWith(fetch(e.request).then(res=>{
    if(res.ok&&(e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('.webmanifest'))){
      const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));
    }
    return res;
  }).catch(()=>caches.match(e.request).then(c=>c||caches.match('./index.html'))));
});
