/* ============================================================
   Service worker minimal — "Service"
   Rôle UNIQUE : permettre l'installation PWA + les notifications.
   IL NE MET RIEN EN CACHE → il ne dépend d'AUCUNE version de l'app.
   Tu le déposes UNE fois sur l'hébergeur, tu n'y retouches jamais.
   Tu peux refaire 100 versions de service_app.html sans le changer.
   ============================================================ */

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// clic sur une notification → ramène l'app au premier plan
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});

// (optionnel) réception de push serveur — non utilisé pour l'instant
self.addEventListener('push', (e) => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch (err) {}
  const title = data.title || 'Service';
  const body = data.body || 'Notification';
  e.waitUntil(self.registration.showNotification(title, { body, tag: data.tag || 'service' }));
});
