/**
 * Fallback de imágenes sin manejadores `onerror` inline (que obligarían a
 * `'unsafe-inline'` en la CSP y no se pueden cubrir con nonce/hash).
 *
 * Uso: en el `<img>` se declara `data-img-fallback` con una lista de orígenes
 * separados por `|` que se prueban en orden ante cada error de carga. El token
 * especial `remove` elimina el elemento (p. ej. avatares: deja ver las
 * iniciales que hay debajo).
 *
 *   <img src="…maxres.jpg" data-img-fallback="…hq.jpg|https://cdn…/logo.webp" />
 *   <img src={user.image}  data-img-fallback="remove" />
 *
 * Los eventos `error` de recursos no burbujean, así que se captura en fase de
 * captura a nivel de `document`. Además barremos las imágenes que ya hubieran
 * fallado antes de registrar el listener (p. ej. el avatar del header, que no
 * es lazy y puede fallar antes de que corra este módulo diferido).
 */

const FALLBACK_SELECTOR = 'img[data-img-fallback]'

function applyNextFallback(img: HTMLImageElement) {
  const remaining = img.dataset.imgFallback
  if (!remaining) return

  const [next, ...rest] = remaining.split('|')
  // Consumimos el origen actual: si este también falla, el siguiente error
  // tomará el resto de la cadena.
  img.dataset.imgFallback = rest.join('|')

  if (next === 'remove') {
    img.remove()
    return
  }

  if (next) img.src = next
}

let listenerAttached = false

export function initImageFallback() {
  if (!listenerAttached) {
    listenerAttached = true
    document.addEventListener(
      'error',
      (event) => {
        const target = event.target
        if (target instanceof HTMLImageElement && target.dataset.imgFallback != null) {
          applyNextFallback(target)
        }
      },
      true,
    )
  }

  // Recupera imágenes que ya fallaron antes de llegar aquí.
  document.querySelectorAll<HTMLImageElement>(FALLBACK_SELECTOR).forEach((img) => {
    if (img.complete && img.naturalWidth === 0) applyNextFallback(img)
  })
}
