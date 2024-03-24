importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);


importScripts('/urlsToCache.js');

const CACHE_NAME = 'v1_cache_lavelada_site';
const urlsToCache = self.__precacheManifest;

// Añade un evento 'install' al service worker.
// Este evento se dispara cuando el service worker se instala.
self.addEventListener('install', event => {

  // Utiliza event.waitUntil para asegurarte de que la instalación no se complete hasta que el código dentro de waitUntil se haya completado.
  event.waitUntil(

    // Abre el cache con el nombre especificado en CACHE_NAME.
    caches.open(CACHE_NAME).then(cache => {

      // Mapea el array urlsToCache, devolviendo una promesa para cada URL que se va a cachear.
      const cachePromises = urlsToCache.map(urlToCache => {

        // Intenta añadir la URL al cache.
        // Si la solicitud para cachear la URL falla, se registra un error en la consola y se lanza el error para que pueda ser manejado por Promise.all.
        return cache.add(urlToCache).catch(err => {
          console.error(`Caching failed for ${urlToCache}: ${err}`);
          throw err;
        });
      });

      // Devuelve una promesa que se resuelve cuando todas las promesas en cachePromises se han resuelto.
      // Esto significa que la instalación no se completará hasta que todas las URLs hayan sido cacheadas o hayan fallado.
      return Promise.all(cachePromises);
    })
  );
});

// Añade un evento 'fetch' al service worker.
// Este evento se dispara cada vez que se realiza una solicitud de red.
self.addEventListener('fetch', event => {
  console.log('Intercepting request for:', event.request.url);

  // Utiliza event.respondWith para interceptar la solicitud y proporcionar una respuesta.
  event.respondWith(

    // Intenta encontrar una respuesta en caché para la solicitud.
    caches.match(event.request)
      .then(response => {
        console.log('Response found in cache:', response);

        // Si se encuentra una respuesta en caché, la devuelve.
        if (response) {
          return response;
        }

        console.log('Not found in cache, searching the network:', event.request.url);

        // Si no se encuentra una respuesta en caché, realiza la solicitud a la red.
        return fetch(event.request).then(networkResponse => {
          console.log('Updating cache with network response for:', event.request.url);

          // Abre el caché y actualiza la respuesta en caché para la solicitud con la respuesta de la red.
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });

          // Devuelve la respuesta de la red.
          return networkResponse;
        });
      }).catch(error => {
        console.error('Error intercepting request:', event.request.url, error);
      })
  );
});

self.addEventListener('activate', event => {
	event.waitUntil(self.clients.claim());

	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
