export type BoxerTrainingVideoUrl =
  | `https://www.youtube.com/watch?${string}`
  | `https://youtu.be/${string}`

/**
 * Vídeo de YouTube del entrenamiento de cada participante, indexado por el
 * `id` del boxeador (ver `BOXERS` en `@/consts/boxers`).
 *
 * La sección de entrenamiento solo se renderiza para los boxeadores que
 * tengan una entrada aquí; el resto mantiene el bloque «Ficha en
 * preparación». Para añadir un vídeo basta con pegar la URL de YouTube
 * (formato `https://youtu.be/ID` o `https://www.youtube.com/watch?v=ID`).
 *
 * @example
 * 'illojuan': 'https://youtu.be/dQw4w9WgXcQ',
 */
export const boxerTrainingVideoUrlsById: Partial<Record<string, BoxerTrainingVideoUrl>> = {
  // alondrissa: '',
  // 'angie-velasco': '',
  // clersss: '',
  // 'edu-aguirre': '',
  // 'fabiana-sevillano': '',
  // fernanfloo: '',
  // 'gaston-edul': '',
  // 'gero-arias': '',
  // illojuan: '',
  // 'kidd-keo': '',
  // 'la-parce': '',
  // 'lit-killah': '',
  // 'marta-diaz': '',
  // 'natalia-mx': '',
  // plex: '',
  // roro: '',
  // 'samy-rivers': '',
  // 'tatiana-kaer': '',
  // thegrefg: '',
  // viruzz: '',
}

/** Devuelve la URL del vídeo de entrenamiento de un boxeador, o `null`. */
export function getBoxerTrainingVideoUrl(boxerId: string): BoxerTrainingVideoUrl | null {
  return boxerTrainingVideoUrlsById[boxerId] ?? null
}
