importScripts('/js/urlsToCache.js');

const CACHE_NAME = 'v1_cache_lavelada_site';
const urlsToCache = self.__precacheManifest;

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			const cachePromises = urlsToCache.map(urlToCache => {
				return cache.add(urlToCache).catch(err => {
					console.error(`Caching failed for ${urlToCache}: ${err}`);
					throw err;
				});
			});
			return Promise.all(cachePromises);
		})
	);
});

self.addEventListener('fetch', event => {
	console.log('Interceptando solicitud para:', event.request.url);

	event.respondWith(
		caches.match(event.request)
			.then(response => {
				console.log('Respuesta encontrada en caché:', response);

				if (response) {
					return response;
				}

				console.log('No se encontró en caché, buscando en la red:', event.request.url);
				return fetch(event.request).then(networkResponse => {
					console.log('Actualizando caché con la respuesta de la red para:', event.request.url);
					caches.open(CACHE_NAME).then(cache => {
						cache.put(event.request, networkResponse.clone());
					});
					return networkResponse;
				});
			}).catch(error => {
			console.error('Error al interceptar la solicitud:', event.request.url, error);
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
