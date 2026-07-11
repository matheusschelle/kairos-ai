/* Kairos AI — service worker: network-first (sempre pega a versão nova online) */
const CACHE = 'kairos-ai-v8';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Nunca interceptar chamadas de API (Groq, ElevenLabs) — sempre rede direta.
  if (url.hostname.includes('groq.com') || url.hostname.includes('elevenlabs.io')) return;
  if (e.request.method !== 'GET') return;
  // NETWORK-FIRST: tenta a rede; se online, atualiza o cache e mostra o mais novo.
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() =>
      caches.match(e.request).then(hit => hit || caches.match('./index.html'))
    )
  );
});
