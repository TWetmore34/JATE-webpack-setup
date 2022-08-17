const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

// diff between stalewhilerevalidate and cachefirst?
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    // look up what these r doing
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    // similar to sessions?
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

// this is unmentioned in the activities. were importing it from workbox recipies tho so thats where to start
warmStrategyCache({
  urls: ['./index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching (does this just mean static assets ie pictures and css?)
registerRoute(
  ({ request }) => ['style','script','worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
    ]
  })
)