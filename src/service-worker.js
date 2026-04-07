// Adicione isso ao seu arquivo de Service Worker
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Notificação', body: 'Nova atualização!' };
  
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: { url: '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // Abre o app ao clicar
  );
});