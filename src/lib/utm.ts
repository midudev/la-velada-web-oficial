/**
 * Helpers para añadir parámetros UTM a las URLs de los patrocinadores.
 *
 * Mantenemos un esquema consistente en toda la web para que el equipo de
 * marketing pueda atribuir correctamente el tráfico que se envía desde
 * `infolavelada.com` a cada marca. Los valores por defecto identifican
 * la web actual y la edición vigente; cada llamada puede personalizar el
 * `medium` (zona de la web) y el `content` (patrocinador concreto).
 */

interface UtmParams {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
}

const DEFAULT_SOURCE = 'infolavelada'
const DEFAULT_CAMPAIGN = 'velada-vi'

/**
 * Devuelve la URL recibida con parámetros UTM añadidos.
 *
 * Si la URL ya contiene alguno de los parámetros UTM (por ejemplo, porque
 * el patrocinador proporciona su propio enlace con tracking), se respetan
 * los valores existentes y solo se rellenan los que falten. Si la URL no
 * es válida, se devuelve sin modificar.
 */
export function withUtm(
  url: string,
  {
    source = DEFAULT_SOURCE,
    medium,
    campaign = DEFAULT_CAMPAIGN,
    content,
    term,
  }: UtmParams = {}
): string {
  try {
    const target = new URL(url)

    // Solo enlaces web. `new URL` acepta `javascript:`, `data:`, etc.; aunque
    // hoy las entradas son URLs de patrocinadores de confianza, rechazar otros
    // esquemas evita un open-redirect/XSS si en el futuro llega input dinámico.
    if (target.protocol !== 'http:' && target.protocol !== 'https:') {
      return url
    }

    const setIfMissing = (key: string, value: string | undefined) => {
      if (!value) return
      if (target.searchParams.has(key)) return
      target.searchParams.set(key, value)
    }

    setIfMissing('utm_source', source)
    setIfMissing('utm_medium', medium)
    setIfMissing('utm_campaign', campaign)
    setIfMissing('utm_content', content)
    setIfMissing('utm_term', term)

    return target.toString()
  } catch {
    return url
  }
}
