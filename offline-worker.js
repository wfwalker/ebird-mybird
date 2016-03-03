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
      return this.CACHE_PREFIX + '3b08e817bdc8061507bf2fc0a360484332c589b3';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      './images/bg_hr.png', // b07cc73aaf2fc0e9841a68d05a46fe53dcbaf0a1
      './images/blacktocat.png', // b3f0b0d7c7f103e37c8c05ffbec11d07b3a23645
      './images/cookbook.png', // 14236001cf83475d4018ab7e66f9be83199b6953
      './images/ebird-favicon.ico', // 783739b89f16a72a7a0a55720ff6acc34048351c
      './images/ebird-favicon.png', // 3f841e97f2ecb0dc0f16478fa57c9dd00b65300f
      './images/icon_download.png', // 166867841b1cd0c08246cc00a16f36b8777f0fff
      './images/sprite_download.png', // 6e7e6d4aafb6b0f526feb0369038efd8c8f1fb6d
      './index.html', // 512aebfa178bdfe3414b1e0fa3bd23e684b9ee82
      './scripts/compressed.js', // d104b04748bb75abc9b88c1cb91bf4389dde286a
      './data/day-names.json', // ce3df432195a3d0e7f6e92e2083eed468dc0e796
      './data/ebird.csv', // 4a04be050491756c3a45779bb865230d3d2a8c59
      './data/omitted-common-names.json', // 2a2dfcf3b8c01de450738adc77352c1b53d97081
      './data/photos.json', // 1165b2e21278f1109e7d23105749fc49355ac0bc
      './styles/app.css', // 10d1fd63dca95c39a2c273bd4d9eca23b2cae7e0
      './styles/bundle.css', // 13afea256f48a3010d2d2e808b6fbd263176dce4
      './styles/c3.min.css', // 0ed505e8458512b29c9925c83316a48b1b838b10
      './styles/github-light.css', // 70cce7c65d29afbb8e5c5f6068e20c41ac4c8fde
      './styles/stylesheet.css', // eb63af06a216272c796103c67c290023e9e867dd

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
