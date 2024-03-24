/**
 * Registra el Service Worker si está disponible en el navegador.
 * @function registerServiceWorker
 */
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js")
			.then((registration) => {
				console.info("ServiceWorker registration successful with scope: ", registration.scope)
			}, err => {
				console.info("ServiceWorker registration failed: ", err)
			})
	})
}
