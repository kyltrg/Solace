self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {
    title: "Solace",
    body: "You have a new notification",
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/assets/logo/icon.png",
      badge: "/assets/logo/icon.png",
      data: { url: data.url ?? "/home" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data?.url ?? "/home";
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});
