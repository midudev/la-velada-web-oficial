import type { Artist } from '@/types/artists'

import YandelImage from '@/assets/artists/yandel.webp'
import JuanesImage from '@/assets/artists/juanes.webp'
import LuchoRkLaPanteraImage from '@/assets/artists/luchork-pantera.webp'
import BadGyalImage from '@/assets/artists/badgyal.webp'
import AnuelAAImage from '@/assets/artists/anuel-aa.webp'

export const ARTISTS: Artist[] = [
  {
    id: '0eHQ9o50hj6ZDNBt6Ys1sD',
    slug: 'yandel',
    name: 'Yandel',
    image: YandelImage,
    followers: 24_562_821,
    genres: ['reggaeton', 'urbano latino', 'latin trap'],
    popularity: 78,
    topTracks: [
      {
        id: '4FAKtPVycI4DxoOHC01YqD',
        name: 'Yandel 150',
        album: 'Resistencia',
        durationMs: 216_000,
        streams: 1_034_602_535,
      },
      {
        id: '3Q45K1MUWmLPRmMzGQCi4Z',
        name: 'Permítame',
        album: 'La Melodía de la Calle Updated',
        durationMs: 184_000,
        streams: 789_524_423,
      },
      {
        id: '4l3xGFwoTinvYxsePytOOf',
        name: 'Báilame - Remix',
        album: 'Báilame (Remix)',
        durationMs: 217_000,
        streams: 595_564_561,
      },
      {
        id: '7LABrQFfRYcZUqUwng0Heb',
        name: 'Encantadora',
        album: 'Dangerous',
        durationMs: 240_000,
        streams: 625_491_564,
      },
    ],
    spotifyLinks: [
      { name: 'Yandel', url: 'https://open.spotify.com/artist/0eHQ9o50hj6ZDNBt6Ys1sD' },
    ],
  },
  {
    id: '0UWZUmn7sybxMCqrw9tGa7',
    slug: 'juanes',
    name: 'Juanes',
    image: JuanesImage,
    followers: 20_114_452,
    genres: ['latin rock', 'colombian rock', 'latin pop'],
    popularity: 74,
    topTracks: [
      {
        id: '2EM9zpAc7PVeoAydmbfVIL',
        name: 'La Camisa Negra',
        album: 'Mi Sangre',
        durationMs: 216_706,
        streams: 555_124_607,
      },
      {
        id: '129lYDVKnWtlJc2PZJviuA',
        name: 'A Dios Le Pido',
        album: 'Un Día Normal',
        durationMs: 205_373,
        streams: 426_569_617,
      },
      {
        id: '3b1IQflSLrgzYQPGFzI9cl',
        name: 'Es Por Ti',
        album: 'Un Día Normal',
        durationMs: 250_000,
        streams: 761_251_114,
      },
      {
        id: '1mlGScrDQqHqmhdIqE8MmA',
        name: 'Besos En Guerra',
        album: 'Balas Perdidas',
        durationMs: 231_532,
        streams: 815_776_510,
      },
    ],
    spotifyLinks: [
      { name: 'Juanes', url: 'https://open.spotify.com/artist/0UWZUmn7sybxMCqrw9tGa7' },
    ],
  },
  {
    // Dúo: id compuesto (uno por cada miembro) para poder enlazar a una
    // única ficha; seguidores sumados y popularidad media de ambos.
    id: ['1y6tVxTqgNfqxTayfohSKJ', '0IEzMvarfVycBJAXjjEZOL'].join('-'),
    slug: 'lucho-rk-la-pantera',
    name: 'Lucho Rk & La Pantera',
    image: LuchoRkLaPanteraImage,
    followers: 332_320,
    genres: ['trap canario', 'reggaeton'],
    popularity: 54,
    topTracks: [
      {
        id: '3vYFpgpkQF0EY5E9h9BF1r',
        name: 'CUPIDOxX',
        album: 'CUPIDOxX',
        durationMs: 216_000,
        streams: 40_434_227,
      },
      {
        id: '7wHXS6QZBsliTASlAV8nUw',
        name: 'PINKY PROMISE 2',
        album: 'PINKY PROMISE 2',
        durationMs: 181_000,
        streams: 34_102_627,
      },
      {
        id: '1ouj0AkMXny8V1su2tuoci',
        name: 'TOCATE SOLA',
        album: 'TA FACIL',
        durationMs: 175_000,
        streams: 17_124_002,
      },
      {
        id: '4cAgxAadH8i2QmPtQmK6BK',
        name: 'ALGO VA A PASAR',
        album: 'EL BAIFO',
        durationMs: 248_000,
        streams: 18_332_699,
      },
    ],
    spotifyLinks: [
      { name: 'Lucho RK', url: 'https://open.spotify.com/artist/1y6tVxTqgNfqxTayfohSKJ' },
      { name: 'La Pantera', url: 'https://open.spotify.com/artist/0IEzMvarfVycBJAXjjEZOL' },
    ],
  },
  {
    id: '4F4pp8NUW08JuXwnoxglpN',
    slug: 'bad-gyal',
    name: 'Bad Gyal',
    image: BadGyalImage,
    followers: 13_381_846,
    genres: ['urbano catalan', 'reggaeton', 'dancehall'],
    popularity: 68,
    topTracks: [
      {
        id: '1NCF4UUsuT6Xzw2Zxd43PJ',
        name: 'Chulo pt.2',
        album: 'Chulo pt.2',
        durationMs: 218_000,
        streams: 493_987_343,
      },
      {
        id: '3e4EFbKbdLvnW42xGB6tIx',
        name: 'Fiebre - Prod. King DouDou',
        album: 'Slow Wine Mixtape',
        durationMs: 247_000,
        streams: 297_675_508,
      },
      {
        id: '4OWPAMZcoRwAmMA971KBTh',
        name: 'Blin Blin',
        album: 'Blin Blin',
        durationMs: 144_000,
        streams: 115_973_039,
      },
      {
        id: '4i3eWwG09zTzJy8lItFsXB',
        name: 'Da Me',
        album: 'Más Cara',
        durationMs: 145_000,
        streams: 83_063_734,
      },
    ],
    spotifyLinks: [
      { name: 'Bad Gyal', url: 'https://open.spotify.com/artist/4F4pp8NUW08JuXwnoxglpN' },
    ],
  },
  {
    id: '2R21vXR83lH98kGeO99Y66',
    slug: 'anuel-aa',
    name: 'Anuel AA',
    image: AnuelAAImage,
    followers: 43_957_388,
    genres: ['trap latino', 'reggaeton'],
    popularity: 84,
    topTracks: [
      {
        id: '0KkIkfsLEJbrcIhYsCL7L5',
        name: 'China',
        album: 'Emmanuel',
        durationMs: 301_000,
        streams: 1_401_592_565,
      },
      {
        id: '1LiN0Z98FkR1t0m8KmLcAH',
        name: 'Amanece',
        album: 'Amanece',
        durationMs: 190_000,
        streams: 1_258_271_789,
      },
      {
        id: '5q2JbCNi4FcnglgPfxcV65',
        name: 'Sola (Remix)',
        album: 'Sola (Remix)',
        durationMs: 307_000,
        streams: 1_045_609_442,
      },
      {
        id: '4J1e3hbf0e5YUZjkxyJWD3',
        name: 'La Última Vez',
        album: 'La Última Vez',
        durationMs: 306_000,
        streams: 57_232_452,
      },
    ],
    spotifyLinks: [
      { name: 'Anuel AA', url: 'https://open.spotify.com/artist/2R21vXR83lH98kGeO99Y66' },
    ],
  },
]
