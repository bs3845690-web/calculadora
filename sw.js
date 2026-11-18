self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('calc-v2').then((cache) => {
            return cache.addAll(['./index.html', './manifest.json']);
        })
    );
});
