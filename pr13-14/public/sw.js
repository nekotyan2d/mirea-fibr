const CACHE_NAME = "v3";

const urlsToCache = [
    "/icons/apple-touch-icon-57x57.png",
    "/icons/apple-touch-icon-114x114.png",
    "/icons/apple-touch-icon-120x120.png",
    "/icons/apple-touch-icon.png",
    "/icons/favicon-16x16.png",
    "/icons/favicon-32x32.png",
    "/icons/favicon-48x48.png",
    "/icons/favicon-64x64.png",
    "/icons/favicon-128x128.png",
    "/icons/favicon-256x256.png",
    "/icons/favicon-512x512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
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
    event.respondWith(
        caches
            .match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status == 200) {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
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
