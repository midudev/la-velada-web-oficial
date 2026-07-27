import type { Artist } from '@/types/artists'

import YandelImage from '@/assets/artists/yandel.webp'
import JuanesImage from '@/assets/artists/juanes.webp'
import LuchoRkLaPanteraImage from '@/assets/artists/luchork-pantera.webp'
import BadGyalImage from '@/assets/artists/badgyal.webp'
import AnuelAAImage from '@/assets/artists/anuel-aa.webp'

export const ARTISTS: Artist[] = [
  {
    id: '0UWZUmn7sybxMCqrw9tGa7',
    slug: 'juanes',
    name: 'Juanes',
    image: JuanesImage,
    followers: 20_114_452,
    genres: ['latin rock', 'colombian rock', 'latin pop'],
    popularity: 74,
    setlist: [
      { name: 'A Dios le pido', spotifyId: '129lYDVKnWtlJc2PZJviuA', timestamp: '0:00' },
      { name: 'Nada valgo sin tu amor', spotifyId: '6QdwofpqDvvNxX88C9A0iQ', timestamp: '5:01' },
      { name: 'Fotografía', spotifyId: '6iYKxptkFN2JWFiW3kRQTw', timestamp: '9:17' },
      { name: 'La Camisa Negra', spotifyId: '2EM9zpAc7PVeoAydmbfVIL', timestamp: '13:13' },
    ],
    spotifyLinks: [
      { name: 'Juanes', url: 'https://open.spotify.com/artist/0UWZUmn7sybxMCqrw9tGa7' },
    ],
    videoId: 'zEWtFIG_JqM',
  },
  {
    id: '2R21vXR83lH98kGeO99Y66',
    slug: 'anuel-aa',
    name: 'Anuel AA',
    image: AnuelAAImage,
    followers: 43_957_388,
    genres: ['trap latino', 'reggaeton'],
    popularity: 84,
    setlist: [
      { name: 'Sola', spotifyId: '11t1vuAGzmJCbSBYMtKOaD', timestamp: '0:00' },
      { name: 'Amanece', spotifyId: '1LiN0Z98FkR1t0m8KmLcAH', timestamp: '2:26' },
      { name: '¿Qué Nos Pasó?', spotifyId: '7k3qWn8D43a5ISa3x8lJux', timestamp: '5:23' },
      { name: 'Más rica que ayer', spotifyId: '3XjvMZqm2AQ8thMCD6w9w2', timestamp: '8:01' },
      { name: 'Adicto', spotifyId: '6z4MJx1ALpLDdL9ERfWNAk', timestamp: '10:58' },
      { name: 'Las más bonitas son p*t*s', spotifyId: '4vJaNTSA8fYLLLSauHmkLe', timestamp: '12:49' },
    ],
    spotifyLinks: [
      { name: 'Anuel AA', url: 'https://open.spotify.com/artist/2R21vXR83lH98kGeO99Y66' },
    ],
    videoId: 'EZ94kdYNbG4',
  },
  {
    id: '4F4pp8NUW08JuXwnoxglpN',
    slug: 'bad-gyal',
    name: 'Bad Gyal',
    image: BadGyalImage,
    followers: 13_381_846,
    genres: ['urbano catalan', 'reggaeton', 'dancehall'],
    popularity: 68,
    setlist: [
      { name: 'Más Cara', spotifyId: '0RrwwLDXmvCGXXzuDgwvOZ', timestamp: '0:00' },
      { name: 'Te Daré', spotifyId: '1LuWSWqoc2jtCbnOWlQipQ', timestamp: '1:20' },
      { name: 'Fashion Girl pt.2', spotifyId: '6EKUSdzaD9zRaaR5Yg0SoC', timestamp: '3:20' },
      { name: 'Choque', spotifyId: '68KElV3TDyDy2zHPCWjUyt', timestamp: '4:58' },
      { name: 'La Iniciativa', spotifyId: '3BTX3OqRaBA9UL47BeIluP', timestamp: '7:02' },
      { name: 'Da Me', spotifyId: '4i3eWwG09zTzJy8lItFsXB', timestamp: '8:50' },
      { name: 'Chulo Pt.2', spotifyId: '1NCF4UUsuT6Xzw2Zxd43PJ', timestamp: '10:33' },
    ],
    spotifyLinks: [
      { name: 'Bad Gyal', url: 'https://open.spotify.com/artist/4F4pp8NUW08JuXwnoxglpN' },
    ],
    videoId: 'NXjpaDPAh_U',
  },
  {
    id: '0eHQ9o50hj6ZDNBt6Ys1sD',
    slug: 'yandel',
    name: 'Yandel',
    image: YandelImage,
    followers: 24_562_821,
    genres: ['reggaeton', 'urbano latino', 'latin trap'],
    popularity: 78,
    setlist: [
      { name: 'Encantadora', spotifyId: '7LABrQFfRYcZUqUwng0Heb', timestamp: '0:00' },
      { name: 'Yandel 150', spotifyId: '4FAKtPVycI4DxoOHC01YqD', timestamp: '1:28' },
      { name: 'Teléfono', spotifyId: '614NVFo5csQqRnryl4jXs2', timestamp: '2:33' },
      { name: 'Mírala Bien', spotifyId: '04uA3BJ1Rj8DBKkpKCABJx', timestamp: '4:17' },
      { name: 'Rakata', spotifyId: '1kQqiC1rS1FiuVpeBKN0QN', timestamp: '4:53' },
      { name: 'Pam Pam Medley', timestamp: '6:33' },
      { name: 'Mayor que yo', spotifyId: '1xjZNgfNUtyylJjUBm4ETa', timestamp: '7:28' },
      { name: 'Hasta Abajo', spotifyId: '3IUoP1TdDW0UnNIPBSMFsh', timestamp: '12:00' },
      { name: 'Sexy Movimiento', spotifyId: '1Kgyx7NLtzsa3gWV1efGHu', timestamp: '13:39' },
      { name: 'Algo Me Gusta', spotifyId: '2Tmx0vqg8slooo8XBJXOjh', timestamp: '15:23' },
    ],
    spotifyLinks: [
      { name: 'Yandel', url: 'https://open.spotify.com/artist/0eHQ9o50hj6ZDNBt6Ys1sD' },
    ],
    videoId: 'GAwv_KL0BUc',
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
    setlist: [
      { name: 'Bane', spotifyId: '60GKG0wbJXlwYLV6JwpNkO', timestamp: '0:00' },
      { name: 'Tócate Sola', spotifyId: '1ouj0AkMXny8V1su2tuoci', timestamp: '4:32' },
      { name: 'Gout', spotifyId: '27hhDyCqi0cLgl5rmcXOXX', timestamp: '6:13' },
      { name: 'Aire', spotifyId: '6nloIaklTZd2Sbpk4laaeJ', timestamp: '8:07' },
      { name: 'CupidoxX', spotifyId: '3vYFpgpkQF0EY5E9h9BF1r', timestamp: '12:18' },
      { name: 'Pinky Promise 2', spotifyId: '7wHXS6QZBsliTASlAV8nUw', timestamp: '16:10' },
    ],
    spotifyLinks: [
      { name: 'Lucho RK', url: 'https://open.spotify.com/artist/1y6tVxTqgNfqxTayfohSKJ' },
      { name: 'La Pantera', url: 'https://open.spotify.com/artist/0IEzMvarfVycBJAXjjEZOL' },
    ],
    videoId: 'zsb1D8Rb9nA',
  },
]
