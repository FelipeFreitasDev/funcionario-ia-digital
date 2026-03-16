/**
 * Service Worker - Handle push notifications
 */

// Listen for push events
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received:", event);

  if (!event.data) {
    console.log("[SW] No data in push event");
    return;
  }

  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon-192x192.png",
      badge: data.badge || "/badge-72x72.png",
      tag: data.tag || "notification",
      data: data.data || {},
      requireInteraction: false,
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error("[SW] Error parsing push data:", error);
  }
});

// Listen for notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.notification.tag);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // If not open, open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Listen for notification close
self.addEventListener("notificationclose", (event) => {
  console.log("[SW] Notification closed:", event.notification.tag);
});

// Handle service worker activation
self.addEventListener("activate", (event) => {
  console.log("[SW] Service worker activated");
  event.waitUntil(clients.claim());
});

// Handle service worker installation
self.addEventListener("install", (event) => {
  console.log("[SW] Service worker installed");
  self.skipWaiting();
});
