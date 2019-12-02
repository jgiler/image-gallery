const FILES_TO_CACHE = [
  "/",
  "/offline.html",
  "/index.html",
  "/assets/css/style.css",
  "/assets/js/app.js",
  "/assets/js/loadImages.js",
  "/assets/js/install.js",
  "/assets/images/1.jpg",
  "/assets/images/2.jpg",
  "/assets/images/3.jpg",
  "/assets/images/4.jpg",
  "/assets/images/5.jpg",
  "/assets/images/6.jpg",
  "/assets/images/7.jpg",
  "/assets/images/8.jpg",
  "/assets/images/9.jpg",
  "/assets/images/10.jpg",
  "/assets/images/11.jpg",
  "/assets/images/12.jpg",
  "/assets/images/13.jpg",
  "/assets/images/14.jpg",
  "/assets/images/15.jpg",
  "/assets/images/16.jpg",
  "/assets/images/17.jpg",
  "/assets/images/18.jpg",
  "/assets/images/19.jpg",
  "/assets/images/20.jpg",
  "/assets/images/21.jpg",
  "/assets/images/22.jpg",
  "/assets/images/23.jpg",
  "/assets/images/24.jpg",
  "/assets/images/25.jpg",
  "/assets/images/26.jpg",
  "/assets/images/27.jpg",
  "/assets/images/28.jpg",
  "/assets/images/29.jpg",
  "/assets/images/30.jpg",
  "/assets/images/31.jpg",
  "/assets/images/32.jpg",
  "/assets/images/33.jpg",
  "/assets/images/34.jpg",
  "/assets/images/35.jpg",
  "/assets/images/36.jpg",
  "/assets/images/37.jpg",
  "/assets/images/38.jpg"
];
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
// install
self.addEventListener("install", function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});
// activate
self.addEventListener("activate", function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});
// fetch - Note that this represents a caching strategy
// for data and static assets
self.addEventListener("fetch", function(evt) {
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              // Offline First Experience for Users
              return cache.match(evt.request);
            });
        })
        .catch(err => console.log(err))
    );
    return;
  }
  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});
