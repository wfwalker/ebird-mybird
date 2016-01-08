/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */


(function (self) {
  'use strict';

  // On install, cache resources and skip waiting so the worker won't
  // wait for clients to be closed before becoming active.
  self.addEventListener('install', function (event) {
    event.waitUntil(oghliner.cacheResources().then(function () {
      return self.skipWaiting();
    }));
  });

  // On activation, delete old caches and start controlling the clients
  // without waiting for them to reload.
  self.addEventListener('activate', function (event) {
    event.waitUntil(oghliner.clearOtherCaches().then(function () {
      return self.clients.claim();
    }));
  });

  // Retrieves the request following oghliner strategy.
  self.addEventListener('fetch', function (event) {
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
      return this.CACHE_PREFIX + 'b1b78eecff8d2b56ed9c440c97b60ff589d5e1b1';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      './', // cache always the current root to make the default page available
      './images/bg_hr.png', // b07cc73aaf2fc0e9841a68d05a46fe53dcbaf0a1
      './images/blacktocat.png', // b3f0b0d7c7f103e37c8c05ffbec11d07b3a23645
      './images/cookbook.png', // 14236001cf83475d4018ab7e66f9be83199b6953
      './images/ebird-favicon.ico', // 783739b89f16a72a7a0a55720ff6acc34048351c
      './images/ebird-favicon.png', // 3f841e97f2ecb0dc0f16478fa57c9dd00b65300f
      './images/icon_download.png', // 166867841b1cd0c08246cc00a16f36b8777f0fff
      './images/sprite_download.png', // 6e7e6d4aafb6b0f526feb0369038efd8c8f1fb6d
      './index.html', // 2026a58e64ffeb98be0acc05593828a863efc88f
      './scripts/compressed.js', // 1cb816b6e66c56824f8a0d7a9b0339690fe7f7bc
      './data/day-names.json', // b3f7ae075cba79adddd0d413a0138c8a273e020a
      './data/ebird.csv', // 69a5aacea861887696adb297f3fdfa108a7815a6
      './data/omitted-common-names.json', // 2a2dfcf3b8c01de450738adc77352c1b53d97081
      './data/photos.json', // fe84f9692db9890741f2c58259c81b8cf31d7c96
      './styles/app.css', // 15756eb8ae0f716387bc6f9c346e9cd7c8df9c23
      './styles/bundle.css', // fa81877fa3627e8391be7dafc5d7cbf36429fdd5
      './styles/c3.min.css', // 0ed505e8458512b29c9925c83316a48b1b838b10
      './styles/github-light.css', // 70cce7c65d29afbb8e5c5f6068e20c41ac4c8fde
      './styles/stylesheet.css', // 50a86a6576fa01c3fe7fecfcb3f043ac1dd58456

    ],

    // Adds the resources to the cache controlled by this worker.
    cacheResources: function () {
      var now = Date.now();
      var baseUrl = self.location;
      return this.prepareCache()
      .then(function (cache) {
        return Promise.all(this.RESOURCES.map(function (resource) {
          // Bust the request to get a fresh response
          var url = new URL(resource, baseUrl);
          var bustParameter = (url.search ? '&' : '') + '__bust=' + now;
          var bustedUrl = new URL(url.toString());
          bustedUrl.search += bustParameter;

          // But cache the response for the original request
          var requestConfig = { credentials: 'same-origin' };
          var originalRequest = new Request(url.toString(), requestConfig);
          var bustedRequest = new Request(bustedUrl.toString(), requestConfig);
          return fetch(bustedRequest).then(function (response) {
            if (response.ok) {
              return cache.put(originalRequest, response);
            }
            console.error('Error fetching ' + url + ', status was ' + response.status);
          });
        }));
      }.bind(this));
    },

    // Remove the offline caches not controlled by this worker.
    clearOtherCaches: function () {
      var deleteIfNotCurrent = function (cacheName) {
        if (cacheName.indexOf(this.CACHE_PREFIX) !== 0 || cacheName === this.CACHE_NAME) {
          return Promise.resolve();
        }
        return self.caches.delete(cacheName);
      }.bind(this);

      return self.caches.keys()
      .then(function (cacheNames) {
        return Promise.all(cacheNames.map(deleteIfNotCurrent));
      });

    },

    // Get a response from the current offline cache or from the network.
    get: function (request) {
      return this.openCache()
      .then(function (cache) {
        return cache.match(request);
      })
      .then(function (response) {
        if (response) {
          return response;
        }
        return self.fetch(request);
      });
    },

    // Prepare the cache for installation, deleting it before if it already exists.
    prepareCache: function () {
      return self.caches.delete(this.CACHE_NAME).then(this.openCache.bind(this));
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
