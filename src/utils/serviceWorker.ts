// @ts-nocheck

import { registerRoute } from "workbox-routing"
import { CacheFirst } from "workbox-strategies"
import { NetworkFirst } from "workbox-strategies"
import { precacheAndRoute } from "workbox-precaching"

// Define a caching strategy.
const cacheFirst = new CacheFirst()
const networkFirst = new NetworkFirst()

// Register a route that handles image and video requests.
registerRoute(
	// Match any request that ends with .png, .jpg, .jpeg, .svg, .gif, .webp, .ico, .mp4, .webm, .ogv.
	/.*\.(?:png|jpg|jpeg|svg|gif|webp|ico|mp4|webm|ogv)$/,
	// Apply the cache first strategy to these requests.
	cacheFirst
);

// Register a route that handles other requests.
registerRoute(
	// Match any request that does not end with .png, .jpg, .jpeg, .svg, .gif, .webp, .ico, .mp4, .webm, .ogv.
	/^((?!.*\.(?:png|jpg|jpeg|svg|gif|webp|ico|mp4|webm|ogv)$).)*$/,
	// Apply the network first strategy to these requests.
	networkFirst
);

// Precache and route the files specified in __WB_MANIFEST.
precacheAndRoute(self.__WB_MANIFEST);
