const appCacheName = 'mws-restaurant-v2';

const staticItems = [
  '/',
  'restaurant.html',
  'js/main.js',
  'js/restaurant_info.js',
  'css/styles.css'
];

// Add some static items to cahce, does not include images
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(appCacheName).then(cache => {
    return cache.addAll(staticItems);
  }));
});

// Clean up old cache when activating sw
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.filter(cacheName => { 
      return cacheName.startsWith('mws-restaurant') && cacheName !== appCacheName;
    })
    .map(cacheName => caches.delete(cacheName))
  );
  }));
});

self.addEventListener('fetch', (e) => {
  const reqURL = new URL(e.request.url);
  // Only respond to requests coming from the same origin
  if ((reqURL.origin === location.origin || reqURL.hostname === 'localhost') && reqURL.port !== '1337') {
    e.respondWith(caches.open(appCacheName).then((cache) => {
      // We want to serve the restaurant skeleton regardless of what paramaters are passed
      if (reqURL.pathname === '/restaurant.html') {
        return cache.match('/restaurant.html').then(res => {
          return res;
        });
      }
      // Check if the current request is cached
      return cache.match(e.request).then((res) => {
        // Return the cached response or if not available then fetch from network.
        return res || fetch(e.request).then(res => {
          return cache.add(e.request).then(() => {
            return res;
          })
        });
      });
    }));
  }
});