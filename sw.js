// Pilothouse Capture Tools — offline cache
// When you change a tool, bump v1 -> v2 (etc.) so phones pull the new version.
const CACHE = 'pilothouse-v1';
const FILES = [
  './',
  './survey-findings-capture.html',
  './survey-equipment-capture.html',
  './survey-engine-oil-capture.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});