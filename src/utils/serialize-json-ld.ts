/**
 * Serializa datos JSON-LD para inyectarlos de forma segura en un
 * `<script type="application/ld+json">` vía `set:html`.
 *
 * Escapa `<` como `<` para que ningún valor pueda cerrar el bloque
 * (`</script>`) ni abrir un comentario HTML (`<!--`). Es el mismo criterio
 * que aplica PredictionVoteController al inyectar su config como JSON.
 *
 * Hoy estos datos provienen de constantes de build (evento, boxeadores, FAQ),
 * pero el escape garantiza que añadir contenido con `<` en el futuro no rompa
 * el marcado ni abra una vía de XSS.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c')
}
