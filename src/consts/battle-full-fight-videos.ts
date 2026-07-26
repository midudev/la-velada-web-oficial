export type BattleFullFightVideoUrl =
  `https://www.youtube.com/watch?${string}` | `https://youtu.be/${string}`

export const battleFullFightVideoUrlsById: Partial<Record<string, BattleFullFightVideoUrl>> = {
  'edu-aguirre-vs-gaston-edul': 'https://youtu.be/xq5R5-y8Vdk',
  'la-parce-vs-fabiana-sevillano': 'https://youtu.be/V8HA2ulaPn4',
  'clersss-vs-natalia-mx': 'https://youtu.be/vLf4GLhG5kY?',
  'lit-killah-vs-kidd-keo': 'https://youtu.be/78E9ySOqKCU',
  'alondrissa-vs-angie-velasco': 'https://youtu.be/zgxdAAOSXrg',
  'viruzz-vs-gero-arias': 'https://youtu.be/-oOgvnNXw6I',
  'samy-rivers-vs-roro': 'https://youtu.be/3imtByLgWJk',
  'marta-diaz-vs-tatiana-kaer': 'https://youtu.be/SI4y71bT9g0',
  'plex-vs-fernanfloo': 'https://youtu.be/yZFahvrjvn0',
  'illojuan-vs-thegrefg': 'https://youtu.be/oeSbZZRzxMk',
}
