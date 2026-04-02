self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : { title: 'Nuova opportunita 2D', body: 'Apri per dettagli' };
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/favicon.ico',
      data: payload.data || {},
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/radar';
  event.waitUntil(clients.openWindow(url));
});
