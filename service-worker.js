const CACHE_NAME = 'Sergio-CV-Maker';
const urlsToCache = [
  './index.html',
  './',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/pizzip@3.0.6/dist/pizzip.min.js',
  'https://unpkg.com/docxtemplater@3.30.2/build/docxtemplater.js',
  'https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://via.placeholder.com/120',
  // Nouveaux chemins pour les icônes si elles sont à la racine
  './icon-192x192.png',
  './icon-512x512.png',
  './icon-maskable-512x512.png',
  './favicon-32x32.png', // Si vous l'avez
  './favicon-16x16.png', // Si vous l'avez
  './apple-touch-icon.png', // Si vous l'avez
  './favicon.ico', // Si vous l'avez
  './safari-pinned-tab.svg' // Si vous l'avez
];
// Événement 'install' : le Service Worker est installé
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert ! Ajout des ressources...');
        return cache.addAll(urlsToCache); // Ajoute toutes les URL définies au cache
      })
      .then(() => self.skipWaiting()) // Force l'activation du nouveau SW immédiatement
      .catch(error => {
        console.error('Échec de l\'ajout des ressources au cache:', error);
      })
  );
});

// Événement 'fetch' : intercepte les requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si une ressource est trouvée dans le cache, la retourner
        if (response) {
          return response;
        }
        // Sinon, la récupérer via le réseau
        return fetch(event.request).catch(() => {
          // Si la requête réseau échoue (ex: hors ligne)
          console.log('Requête réseau échouée et pas d\'entrée de cache pour:', event.request.url);
          // Vous pourriez ici retourner une page d'erreur ou une ressource de secours
          // Ex: return caches.match('/offline.html');
        });
      })
  );
});

// Événement 'activate' : le Service Worker est activé
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprime les anciens caches qui ne sont plus dans la liste blanche
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Permet au SW de prendre le contrôle des pages existantes
  );
});