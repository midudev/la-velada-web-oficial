export type BattleFaceToFaceVideoUrl = `https://www.youtube.com/watch?${string}` | `https://youtu.be/${string}`

export const battleFaceToFaceVideoUrlsById: Partial<Record<string, BattleFaceToFaceVideoUrl>> = {
  'alondrissa-vs-angie-velasco': 'https://youtu.be/egYBxDTpx9w?si=z5yYe54PWp5qfMkT',
  'viruzz-vs-gero-arias': 'https://youtu.be/260TXvUXM_k?si=kKgDPg7Yvidl_BLU',
  'samy-rivers-vs-roro': 'https://youtu.be/9a5h7emOK6c?si=GmK0K237ZTE27Uib',
  'marta-diaz-vs-tatiana-kaer': 'https://youtu.be/kruLhBzu7Ng?si=qQ0IM-CIO6dMW-ej',
  'plex-vs-fernanfloo': 'https://youtu.be/KBFiBAmIigg?si=pqR8ao-e-NHLxmnU',
  'illojuan-vs-thegrefg': 'https://youtu.be/t50lOZ1rneE?si=bImWTCXKyd3Rcu9U',
}
