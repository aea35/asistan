// sw.js dosyasının tamamı:

const CACHE_NAME = 'alptekin-pro-v1'; // Versiyonu değiştirdik ki tarayıcı yenilesin

const OFFLINE_DOSYALAR = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './images.png',
  './logo.png',
  './categories.js',
  './dictionary.js',
  './hikayedata.js',
  './data.js',
  './chess.html',
  './sudoku.html',
  './bulmaca.html',
  './libs/worker.min.js',
  './libs/tesseract.min.js',
  './libs/tesseract-core.wasm',
  './libs/tesseract-core.wasm.js',
  './libs/cropper.min.css',
  './libs/cropper.min.js',
  './libs/tur.traineddata.gz',
  './assets/logo.png',
  // SATRANÇ TAŞLARI VE SESLERİ (Eksik olan kısım burasıydı)
  './assets/imaj/B.svg', './assets/imaj/K.svg', './assets/imaj/N.svg', './assets/imaj/P.svg', './assets/imaj/Q.svg', './assets/imaj/R.svg',
  './assets/imaj/b1.svg', './assets/imaj/k1.svg', './assets/imaj/n1.svg', './assets/imaj/p1.svg', './assets/imaj/q1.svg', './assets/imaj/r1.svg',
  './assets/sound/move.mp3', './assets/sound/capture.mp3','./assets/sound/clap.mp3', './assets/sound/wrong.mp3', './assets/sound/check.mp3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Tüm varlıklar (taşlar dahil) önbelleğe alınıyor...');
      return cache.addAll(OFFLINE_DOSYALAR);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(names.map((name) => {
        if (name !== CACHE_NAME) return caches.delete(name);
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Dış API'leri ve Firebase'i pas geç
  if (url.origin.includes('translated.net') || url.origin.includes('lingva.ml') || url.origin.includes('firebaseapp.com')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});

// sw.js dosyanın install olayını şu şekilde güncelle:
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Dosyalar önbelleğe alınıyor...');
      return cache.addAll(OFFLINE_DOSYALAR);
    }).then(() => {
      // Önbellekleme bittiğinde tüm açık sayfalara mesaj gönder
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'CACHE_COMPLETED', message: 'Uygulama artık internetsiz çalışabilir!' });
        });
      });
    })
  );
});