var CACHE_NAME = 'visioni-platform-v4';
var APP_SHELL = [
  '/platform/',
  '/radar/',
  '/wp-content/plugins/visioni-platform/assets/css/visioni-platform-app.css',
  '/wp-content/plugins/visioni-platform/assets/js/visioni-platform-app.js',
  '/wp-content/plugins/visioni-platform/assets/css/visioni-radar.css',
  '/wp-content/plugins/visioni-platform/assets/js/visioni-radar.js',
  '/wp-content/plugins/visioni-platform/assets/branding/visioni-radar-mark.svg',
  '/wp-content/plugins/visioni-platform/assets/branding/visioni-radar-wordmark.svg',
  '/wp-content/plugins/visioni-platform/assets/icons/visioni-radar-icon-192.png',
  '/wp-content/plugins/visioni-platform/assets/icons/visioni-radar-icon-512.png',
  '/wp-content/plugins/visioni-platform/assets/app/visioni-platform.webmanifest'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL).catch(function () {
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  var isPlatformHtml = ['/platform/', '/radar/', '/anticipa/', '/distretto/', '/profezia/', '/eredita/', '/live/'].indexOf(url.pathname) !== -1 || url.pathname.indexOf('/my-area/') === 0;
  var isPluginAsset = url.pathname.indexOf('/wp-content/plugins/visioni-platform/') === 0 || url.pathname === '/visioni-platform-sw.js';

  if (!isPlatformHtml && !isPluginAsset) {
    return;
  }

  if (isPlatformHtml) {
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, copy);
          });
          return response;
        })
        .catch(function () {
          return caches.match(event.request).then(function (cached) {
            return cached || caches.match('/platform/');
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });
        return response;
      });
    })
  );
});

self.addEventListener('push', function (event) {
  var data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }

  var title = data.title || '2D Radar';
  var body = data.body || 'Nuova opportunita immobiliare compatibile.';
  var icon = data.icon || '/wp-content/plugins/visioni-platform/assets/icons/visioni-radar-icon-192.png';
  var badge = data.badge || '/wp-content/plugins/visioni-platform/assets/icons/visioni-radar-icon-192.png';
  var url = data.url || '/platform/';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      badge: badge,
      data: { url: url }
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var targetUrl = (event.notification && event.notification.data && event.notification.data.url) || '/platform/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
      return null;
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
