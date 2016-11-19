/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */


(function (self) {
  'use strict';

  // On install, cache resources and skip waiting so the worker won't
  // wait for clients to be closed before becoming active.
  self.addEventListener('install', event =>
    event.waitUntil(
      oghliner.cacheResources()
      .then(() => self.skipWaiting())
    )
  );

  // On activation, delete old caches and start controlling the clients
  // without waiting for them to reload.
  self.addEventListener('activate', event =>
    event.waitUntil(
      oghliner.clearOtherCaches()
      .then(() => self.clients.claim())
    )
  );

  // Retrieves the request following oghliner strategy.
  self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
      event.respondWith(oghliner.get(event.request));
    } else {
      event.respondWith(self.fetch(event.request));
    }
  });

  var oghliner = self.oghliner = {

    // This is the unique prefix for all the caches controlled by this worker.
    CACHE_PREFIX: 'offline-cache:wfwalker/ebird-mybird:' + (self.registration ? self.registration.scope : '') + ':',

    // This is the unique name for the cache controlled by this version of the worker.
    get CACHE_NAME() {
      return this.CACHE_PREFIX + '160f859913c2ee993606c4f93b7dce4f492b90f8';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      './images/bg_hr.png', // b07cc73aaf2fc0e9841a68d05a46fe53dcbaf0a1
      './images/ebird-favicon.ico', // 783739b89f16a72a7a0a55720ff6acc34048351c
      './images/ebird-favicon.png', // 3f841e97f2ecb0dc0f16478fa57c9dd00b65300f
      './images/openmap.png', // 4dafe3882887be3afcf51d54948c5ceb830616d3
      './images/weather.png', // ac9c676c285f1ca8418e6bda8bccd0afdd922571
      './index.html', // d03b54fcef751a54b30acaad51db90baeb3de2d7
      './scripts/compressed.js', // 9c6e6d7423348c09b22d9de0ada70f7a660e1617
      './styles/app.css', // c286ce14134c87f6540fe96889ee28ec41ca4f00
      './styles/bootstrap-theme.css', // 1468254bdfd4712c9f496b8f521225362a17ed95
      './styles/bootstrap.css', // f597f59f955cda06e5d7a79342d9e0c22b5ec6d2
      './styles/bundle.css', // 900114a59676bebfb674fb7b687d7d3e0bc17ead
      './styles/c3.css', // 317ac8c41b6db673f5c7143526a6157d49cb64b6
      './styles/justifiedGallery.min.css', // 5a0b11287defc4b18fef056675304ee80c686989
      './styles/spinner.css', // cadac5f4fce4b28bfb8ab8de2ed9fc879d321252
      './fonts/glyphicons-halflings-regular.eot', // 86b6f62b7853e67d3e635f6512a5a5efc58ea3c3
      './fonts/glyphicons-halflings-regular.svg', // de51a8494180a6db074af2dee2383f0a363c5b08
      './fonts/glyphicons-halflings-regular.ttf', // 44bc1850f570972267b169ae18f1cb06b611ffa2
      './fonts/glyphicons-halflings-regular.woff', // 278e49a86e634da6f2a02f3b47dd9d2a8f26210f
      './fonts/glyphicons-halflings-regular.woff2', // ca35b697d99cae4d1b60f2d60fcd37771987eb07

    ],

    // Adds the resources to the cache controlled by this worker.
    cacheResources: function () {
      var now = Date.now();
      var baseUrl = self.location;
      return this.prepareCache()
      .then(cache => Promise.all(this.RESOURCES.map(resource => {
        // Bust the request to get a fresh response
        var url = new URL(resource, baseUrl);
        var bustParameter = (url.search ? '&' : '') + '__bust=' + now;
        var bustedUrl = new URL(url.toString());
        bustedUrl.search += bustParameter;

        // But cache the response for the original request
        var requestConfig = { credentials: 'same-origin' };
        var originalRequest = new Request(url.toString(), requestConfig);
        var bustedRequest = new Request(bustedUrl.toString(), requestConfig);
        return fetch(bustedRequest)
        .then(response => {
          if (response.ok) {
            return cache.put(originalRequest, response);
          }
          console.error('Error fetching ' + url + ', status was ' + response.status);
        });
      })));
    },

    // Remove the offline caches not controlled by this worker.
    clearOtherCaches: function () {
      var outOfDate = cacheName => cacheName.startsWith(this.CACHE_PREFIX) && cacheName !== this.CACHE_NAME;

      return self.caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
        .filter(outOfDate)
        .map(cacheName => self.caches.delete(cacheName))
      ));
    },

    // Get a response from the current offline cache or from the network.
    get: function (request) {
      return this.openCache()
      .then(cache => cache.match(() => this.extendToIndex(request)))
      .then(response => {
        if (response) {
          return response;
        }
        return self.fetch(request);
      });
    },

    // Make requests to directories become requests to index.html
    extendToIndex: function (request) {
      var url = new URL(request.url, self.location);
      var path = url.pathname;
      if (path[path.length - 1] !== '/') {
        return request;
      }
      url.pathname += 'index.html';
      return new Request(url.toString(), request);
    },

    // Prepare the cache for installation, deleting it before if it already exists.
    prepareCache: function () {
      return self.caches.delete(this.CACHE_NAME)
      .then(() => this.openCache());
    },

    // Open and cache the offline cache promise to improve the performance when
    // serving from the offline-cache.
    openCache: function () {
      if (!this._cache) {
        this._cache = self.caches.open(this.CACHE_NAME);
      }
      return this._cache;
    }

  };
}(self));
