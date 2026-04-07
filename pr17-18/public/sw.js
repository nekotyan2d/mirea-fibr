const CACHE_NAME = "v3";

const APP_SHELL_URLS = self.__APP_SHELL_URLS__ || [];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL_URLS))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener("activate", (event) => {
    const cacheWhiteList = [CACHE_NAME];

    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (!cacheWhiteList.includes(cacheName)) {
                            return caches.delete(cacheName);
                        }
                    }),
                );
            })
            .then(() => self.clients.claim()),
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const requestUrl = new URL(request.url);

    if (requestUrl.pathname.startsWith("/socket.io")) {
        event.respondWith(fetch(request));
        return;
    }

    if (request.method !== "GET" || request.origin !== self.location.origin) {
        event.respondWith(fetch(request));
        return;
    }

    event.respondWith(
        caches
            .match(request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status == 200) {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, networkResponse.clone());
                            return networkResponse;
                        });
                    }
                    return networkResponse;
                });
            })
            .catch(() => {
                console.error("No network connection", event.request.url);
                return;
            }),
    );
});

self.addEventListener("push", (event) => {
    const defaultPayload = {
        title: "Новое уведомление",
        body: "У вас есть новое событие",
    };

    let payload = defaultPayload;

    if (event.data) {
        try {
            payload = { ...defaultPayload, ...event.data.json() };
        } catch {
            payload = { ...defaultPayload, body: event.data.text() };
        }
    }

    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: "/icons/favicon-128x128.png",
            badge: "/icons/favicon-64x64.png",
            ...(payload.actions && { actions: payload.actions }),
            data: {
                url: "/",
                reminderId: payload.data.reminderId,
            },
        }),
    );
});

self.addEventListener("notificationclick", (event) => {
    console.log(event);
    if (event.action == "snooze") {
        const reminderId = event.notification.data.reminderId;

        event.waitUntil(
            fetch("http://localhost:3001/snooze", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    reminderId: reminderId,
                }),
            })
                .then(() => {
                    event.notification.close();
                    console.log("отправлено");
                })
                .catch((e) => console.error(e)),
        );

        return;
    }

    event.notification.close();

    const targetUrl = event.notification?.data?.url || "/";

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
            for (const client of clientsArr) {
                if (client.url.includes(targetUrl) && "focus" in client) {
                    return client.focus();
                }
            }

            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }

            return undefined;
        }),
    );
});
