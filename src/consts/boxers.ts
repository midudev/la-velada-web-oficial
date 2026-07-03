export type BoxerGender = 'f' | 'm'

/** Fecha en formato ISO `YYYY-MM-DD`. Evita valores malformados como `'2004'`. */
export type ISODate = `${number}-${number}-${number}`

export interface Boxer {
  id: string
  name: string
  realName: string
  gender: BoxerGender
  birthDate: ISODate | null
  age: number | null
  followersUpdatedAt: ISODate
  socials: { platform: string; username: string; followers?: number; monthlyListeners?: number }[]
  country: string
  previousVeladaWins: number[]
  youtubeChannelId?: string
  ficha?: string
  workout?: {
    videoId: string
    title: string
  }[]
  /** Peso actual en kg. */
  weightKg?: number | null
  /** Peso pactado para el combate de La Velada VI (kg). */
  fightWeightKg?: number | null
  /** Altura en cm. */
  heightCm?: number | null
  /** Alcance (wingspan) en cm. */
  reachCm?: number | null
}

/**
 * Los `id` coinciden exactamente con:
 *  - `/public/character-select/{id}.webp` (miniatura del selector)
 *  - `/public/character-hero/{id}.webp` (recorte grande mostrado en el
 *    hero al hacer hover sobre la miniatura del selector)
 *  - `/public/photos/{id}/01.webp` (foto principal usada en la ficha
 *    del combate)
 *
 * Cualquier renombrado debe mantener esa convención.
 */
export const BOXERS: Boxer[] = [
  {
    id: 'alondrissa',
    heightCm: 160,
    name: 'Alondrissa',
    gender: 'f',
    realName: 'Alondra Michelle',
    country: 'pr',
    previousVeladaWins: [],
    birthDate: '2001-10-30',
    age: 24,
    youtubeChannelId: 'UCMhJtoft9mSZ_T1FEV__LXA',
    followersUpdatedAt: '2026-06-29',
    socials: [
      { platform: 'tiktok', username: 'pastelera27', followers: 5_900_000 },
      { platform: 'twitch', username: 'alondrissa', followers: 1_800_000 },
      { platform: 'tiktok', username: 'alondrisaa', followers: 1_800_000 },
      { platform: 'instagram', username: 'alondraa.michellee', followers: 1_500_000 },
      { platform: 'youtube', username: 'AlondrissaOfficial', followers: 1_240_000 },
      { platform: 'youtube', username: 'AlondrissaPluss', followers: 1_010_000 },
      { platform: 'kick', username: 'alondrissa', followers: 633_700 },
      { platform: 'youtube', username: 'AlondraMichelleVlogs', followers: 351_000 },
      { platform: 'kick', username: 'alondrissapluss', followers: 71_500 },
    ],
    ficha: `Alondrissa es creadora de contenido puertorriqueña y una de las streamers más 
    destacadas del panorama actual en Latinoamérica. Su crecimiento ha venido impulsado por 
    su estilo natural, su humor sin filtros y su capacidad para conectar con una audiencia muy 
    amplia a través de directos y contenido viral. A lo largo de su trayectoria ha construido 
    una comunidad muy sólida, especialmente en plataformas como Twitch, TikTok y YouTube, donde
     combina entretenimiento, interacción con seguidores y contenido dinámico que la ha convertido 
     en una de las figuras más reconocidas del streaming actual. Ahora afronta un reto 
     completamente distinto. De los directos… al ring. La Velada VI supone para Alondrissa un 
     cambio radical, donde tendrá que enfrentarse a meses de preparación física y mental para 
     competir en un deporte totalmente nuevo para ella. Sin experiencia previa en el boxeo, el
      desafío será adaptarse a la exigencia del combate y demostrar disciplina dentro del 
      cuadrilátero. Un perfil acostumbrado a la exposición constante y a la presión del directo…
      pero que ahora tendrá que demostrarlo golpe a golpe. 🥊`,

    workout: [
      {
        videoId: '6BMdwhu2f0g',
        title: 'PELEO EN LA VELADA DEL AÑO VI',
      },
      {
        videoId: '_q7KA1Vw24I',
        title: 'UN DIA ENTRENANDO CONMIGO ',
      },
      {
        videoId: 'hNMGa52cdGw',
        title: 'MI CARA A CARA CON ANGIE ',
      },
    ],
  },
  {
    id: 'angie-velasco',
    heightCm: 156,
    name: 'Angie Velasco',
    gender: 'f',
    realName: 'Angie Rocío Velasco',
    country: 'ar',
    previousVeladaWins: [],
    birthDate: '1998-10-30',
    age: 27,
    youtubeChannelId: 'UC2rScBVAJSkL4qXn-27t80A',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'youtube', username: 'AngieVelasco', followers: 6_140_000 },
      { platform: 'youtube', username: 'angievelasco2.0', followers: 342_000 },
      { platform: 'tiktok', username: 'angievelasco98', followers: 4_900_000 },
      { platform: 'instagram', username: 'angievelasco08', followers: 2_200_000 },
      { platform: 'x', username: 'AngieVelasco08', followers: 1_800_000 },
    ],
    ficha: `Angie Velasco es creadora de contenido argentina y una de las youtubers más reconocidas dentro del panorama digital en Latinoamérica. Su crecimiento ha venido impulsado por su estilo cercano, su espontaneidad y su capacidad para conectar con millones de seguidores a través de contenido variado y entretenido.
            A lo largo de su trayectoria ha construido una comunidad masiva, especialmente en YouTube, donde acumula millones de suscriptores gracias a sus vlogs, retos y experiencias personales que la han convertido en una figura muy influyente en redes.
            Ahora afronta un reto completamente distinto.
            De los vídeos… al ring.
            La Velada VI supone para Angie un cambio radical, donde tendrá que enfrentarse a meses de preparación física y mental para competir en un deporte totalmente nuevo para ella. Sin experiencia previa en el boxeo, el desafío será adaptarse a la exigencia del combate y demostrar disciplina dentro del cuadrilátero.
            Un perfil con gran presencia mediática, acostumbrado a la exposición y a millones de espectadores…
            pero que ahora tendrá que demostrarlo golpe a golpe. 🥊`,
    workout: [
      {
        videoId: 'DGHzGPJT4OE',
        title: 'Un día conmigo Entrenando para la Velada',
      },
    ],
  },
  {
    id: 'clersss',
    heightCm: 167,
    name: 'Clersss',
    realName: 'Clara Merino',
    country: 'es',
    previousVeladaWins: [],
    birthDate: '2001-09-15',
    gender: 'f',
    age: 24,
    youtubeChannelId: 'UCYa7uV_ICFXbho_JRyv0nFA',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'tiktok', username: 'clersssss', followers: 2_600_000 },
      { platform: 'instagram', username: 'clersssss', followers: 707_000 },
      { platform: 'youtube', username: 'clersssss', followers: 14_200 },
    ],
    ficha: `Clerss es creadora de contenido española y una de las influencers más reconocidas dentro del panorama actual en redes sociales. Su crecimiento ha venido impulsado por su personalidad directa, su estilo cercano y su capacidad para conectar con el público a través de contenido dinámico y entretenido.
            A lo largo de los últimos años ha construido una comunidad muy sólida, especialmente en plataformas como TikTok e Instagram, donde combina humor, lifestyle y tendencias con un enfoque muy personal que la ha hecho destacar.
            Ahora afronta un reto completamente distinto.
            De las redes sociales… al ring.
            La Velada VI supone para Clerss una oportunidad para salir de su zona de confort y enfrentarse a meses de preparación física y mental. Sin experiencia previa en el boxeo, tendrá que adaptarse rápidamente a un deporte exigente, donde la disciplina y la resistencia serán clave.
            Un perfil con carácter, acostumbrado a la exposición pública y a la presión…
            pero que ahora tendrá que demostrarlo dentro del cuadrilátero. 🥊`,
  },
  {
    id: 'edu-aguirre',
    heightCm: 180,
    name: 'Edu Aguirre',
    realName: 'Eduardo Aguirre',
    country: 'es',
    previousVeladaWins: [],
    gender: 'm',
    birthDate: '1988-01-14',
    age: 38,
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'instagram', username: 'eduaguirre7', followers: 1_100_000 },
      { platform: 'x', username: 'EduAguirre7', followers: 771_700 },
    ],
    ficha: `Edu Aguirre es periodista deportivo y una de las caras más reconocidas de la televisión deportiva en España, especialmente por su papel en programas como El Chiringuito de Jugones, donde se ha hecho un nombre por su estilo directo, intenso y sin filtros.
          Su carrera ha estado siempre ligada al fútbol, muy conectado al entorno del Real Madrid y conocido también por su cercanía con figuras como Cristiano Ronaldo.
          A base de exclusivas, debates y presencia mediática, ha conseguido consolidarse como uno de los comunicadores más visibles del panorama deportivo.
          Pero ahora cambia completamente de escenario.
          De los platós al ring.
          La Velada VI supone su primer gran reto físico real. Sin experiencia previa en el boxeo profesional, Edu se enfrenta a meses de preparación donde tendrá que demostrar disciplina, resistencia y, sobre todo, capacidad para competir en un terreno totalmente nuevo para él.
          Un perfil competitivo, acostumbrado a la presión mediática… 
          pero que ahora tendrá que demostrarlo con guantes puestos. 🥊`,
    workout: [
      {
        videoId: 'Ri41stA8eaA',
        title: 'Entrenando con THEGREFG | Edu Aguirre, camino a La Velada #14',
      },
      {
        videoId: 'oNExZ6xDjXk',
        title: '¿ALFREDO DURO me REVIENTA? | Edu Aguirre, camino a La Velada #13',
      },
      {
        videoId: 'qAVys_o4cD4',
        title:
          'ENTRENO con el EQUIPO NACIONAL de BOXEO ESPAÑOL | Edu Aguirre, camino a La Velada #12',
      },
      {
        videoId: 'XmlJ4gxeylw',
        title: 'EDU AGUIRRE, camino a LA VELADA #1 | Lo que no se vio de la presentación',
      },
      {
        videoId: '1lGloTjF8_U',
        title: 'EDU AGUIRRE, camino a LA VELADA #2 | El primer día | Chiringuito Inside',
      },
      {
        videoId: 'qad1F6Yc53I',
        title:
          'BOXEANDO con el ENTRENADOR de TOPURIA | Edu Aguirre, camino a La Velada #3 | Chiringuito Inside',
      },
      {
        videoId: 'rLjYpBJoNyw',
        title: 'BOXEADOR y PADRE | Edu Aguirre, camino a La Velada #4',
      },
      {
        videoId: 'dTE-wmA5Sv0',
        title: 'OMAR MONTES me manda al HOSPITAL | Edu Aguirre, camino a La Velada #6',
      },
      {
        videoId: '_HCDLUadRFY',
        title:
          'Un día con ILIA TOPURIA, PABLO MOTOS y OMAR MONTES | Edu Aguirre, camino a La Velada #7',
      },
      {
        videoId: 'AghX-do5sE4',
        title: 'NECESITO RECUPERARME | Edu Aguirre, Camino a La Velada #8',
      },
      {
        videoId: 'IE9vwSwqV1U',
        title: 'Sobreviví a un Entrenamiento con Madelman... | Edu Aguirre, Camino a La Velada #9',
      },
      {
        videoId: 'oNExZ6xDjXk',
        title: '¿ALFREDO DURO me REVIENTA? | Edu Aguirre, camino a La Velada #13',
      },
    ],
  },
  {
    id: 'fabiana-sevillano',
    heightCm: 165,
    name: 'Fabiana Sevillano',
    realName: 'Fabiana Sevillano',
    country: 'es',
    previousVeladaWins: [],
    gender: 'f',
    birthDate: '2002-01-08',
    age: 24,
    youtubeChannelId: 'UCcV3n8U3gkPKYxHerfsrk7A',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'tiktok', username: 'fabiana.sevillano', followers: 2_100_000 },
      { platform: 'instagram', username: 'fabiana.sevillano', followers: 1_000_000 },
      { platform: 'youtube', username: 'FabianaSevillano', followers: 183_000 },
    ],
    ficha: `Fabiana Sevillano es creadora de contenido española y una de las influencers más destacadas de TikTok dentro del panorama juvenil actual. Su crecimiento en redes ha venido marcado por su estilo cercano, su humor cotidiano y su capacidad para conectar con una audiencia muy amplia a través de vídeos virales y contenido de entretenimiento.
A lo largo de los últimos años ha consolidado una comunidad muy activa, especialmente en plataformas como TikTok e Instagram, donde combina tendencias, lifestyle y situaciones del día a día con un estilo muy reconocible.
Ahora da un giro completamente inesperado a su carrera digital.
Del contenido viral… al ring.
La Velada VI supone para Fabiana un reto totalmente nuevo, donde tendrá que dejar atrás su entorno habitual para enfrentarse a meses de preparación física y mental. Sin experiencia previa en boxeo, el desafío será adaptarse a un deporte exigente que no perdona errores.
Un perfil acostumbrado a la cámara, a la presión de las redes y a la exposición pública…
pero que ahora tendrá que demostrarlo todo bajo los focos del ring. 🥊
`,
    workout: [
      {
        videoId: 'AE4StCGLEcA',
        title: 'LA VELADA - Queda un mes | Capítulo 4',
      },
      {
        videoId: 'wkWbbHspRzM',
        title: 'LA VELADA - Primeros sparrings | Capítulo 3',
      },
      {
        videoId: 'Zv9QJf8uAOM',
        title: 'LA VELADA - Bien, mal, cansada | Capítulo 2',
      },
      {
        videoId: 'JWqJ22YGvjM',
        title: 'LA VELADA - Yo amargá no voy a ir | Capítulo 1',
      },
      {
        videoId: '-IvaT8PKc1w',
        title: 'Así fue mi presentación de LA VELADA DEL AÑO VI',
      },
    ],
  },
  {
    id: 'fernanfloo',
    heightCm: 186,
    name: 'Fernanfloo',
    gender: 'm',
    realName: 'Luis Fernando Flores Alvarado',
    country: 'sv',
    previousVeladaWins: [],
    birthDate: '1993-07-07',
    age: 32,
    youtubeChannelId: 'UCV4xOVpbcV8SdueDCOxLXtQ',
    followersUpdatedAt: '2026-06-27',
    socials: [
      { platform: 'youtube', username: 'Fernanfloo', followers: 50_400_000 },
      { platform: 'tiktok', username: 'fernanfloo', followers: 18_700_000 },
      { platform: 'instagram', username: 'fernanfloo', followers: 11_500_000 },
      { platform: 'youtube', username: 'Fernan', followers: 4_000_000 },
      { platform: 'twitch', username: 'fernanfloo', followers: 3_500_000 },
    ],
    ficha: `Fernanfloo es creador de contenido salvadoreño y una de las mayores leyendas de YouTube en habla hispana. Su impacto en la plataforma ha sido masivo, acumulando decenas de millones de suscriptores y convirtiéndose en uno de los canales más influyentes de toda Latinoamérica.
Su estilo único, basado en el humor, la energía y los gameplays, marcó a toda una generación y lo posicionó como uno de los referentes absolutos del entretenimiento digital.
Ahora afronta un reto completamente inesperado.
De YouTube… al ring.
La Velada VI supondría para Fernanfloo un cambio radical, enfrentándose a un deporte totalmente distinto al que ha desarrollado durante años. Sin experiencia previa en boxeo, el desafío estaría en adaptarse a la exigencia física y mental del combate.
Una leyenda de internet, acostumbrado a millones de espectadores…
pero que ahora tendría que demostrarlo golpe a golpe. 🥊`,

    workout: [
      {
        videoId: 'JflVnA3Woro',
        title: 'VlogSito España Por La Velada Del Año 6',
      },
    ],
  },

  {
    id: 'gaston-edul',
    heightCm: 170,
    name: 'Gastón Edul',
    realName: 'Gastón Edul',
    gender: 'm',
    country: 'ar',
    previousVeladaWins: [],
    birthDate: '1995-12-31',
    age: 30,
    youtubeChannelId: 'UCZGr6IbuqQayELgiLivhnKA',
    followersUpdatedAt: '2026-06-10',
    socials: [
      { platform: 'instagram', username: 'gastonedul', followers: 2_400_000 },
      { platform: 'tiktok', username: 'gastonedul', followers: 1_900_000 },
      { platform: 'x', username: 'gastonedul', followers: 1_200_000 },
      { platform: 'youtube', username: 'gastonedul', followers: 510_000 },
    ],
    ficha: `Gastón Edul es periodista deportivo argentino y una de las caras más reconocidas en redes dentro del periodismo actual. Su crecimiento ha venido de la mano de la inmediatez y cercanía con la audiencia, cubriendo especialmente la actualidad de la selección argentina y grandes competiciones internacionales.
Se ha hecho muy popular por su estilo directo, su presencia constante en eventos importantes y su capacidad para informar en tiempo real, lo que le ha llevado a construir una comunidad muy sólida en plataformas digitales.
Ahora, como muchos otros perfiles de esta Velada VI, cambia completamente de terreno.
De informar sobre el deporte… a practicarlo.
Para Edul, este reto supone salir de su zona habitual y enfrentarse a meses de preparación física y mental en un contexto totalmente distinto al que está acostumbrado. Sin experiencia previa en el boxeo, tendrá que demostrar disciplina, resistencia y capacidad de adaptación dentro del ring.
Un perfil mediático, acostumbrado a la presión y a estar en el foco…
pero que ahora tendrá que responder golpe a golpe. 🥊`,
    workout: [
      {
        videoId: 'FrirlWQUOrE',
        title: 'VOY A PELEAR EN LA VELADA DEL AÑO | Cara a Cara con Edu Aguirre',
      },
      {
        videoId: 'eu3ku2A4c_s',
        title:
          'MANO A MANO CON MARAVILLA MARTÍNEZ | Consejos de un Campeón Mundial para La Velada del Año',
      },
      {
        videoId: 'vj-GPlmP19Y',
        title: 'PELEO CONTRA UN CAMPEÓN DEL MUNDO | Sparring vs. Maravilla Martínez',
      },

      {
        videoId: 'H5ANqu6eKDw',
        title: 'PELEO CONTRA UN BOXEADOR PROFESIONAL EN KANSAS CITY - VLOG #3',
      },
    ],
  },

  {
    id: 'gero-arias',
    heightCm: 172,
    name: 'Gero Arias',
    realName: 'Gerónimo Arias',
    gender: 'm',
    country: 'ar',
    previousVeladaWins: [],
    birthDate: '2003-04-01',
    age: 23,
    youtubeChannelId: 'UClYcutwIFo-UoNRw2_3Kwaw',
    followersUpdatedAt: '2026-06-29',
    socials: [
      { platform: 'tiktok', username: 'geroooo_ariass366', followers: 10_100_000 },
      { platform: 'instagram', username: 'geroooo_arias2.0', followers: 5_800_000 },
      { platform: 'youtube', username: 'geroariass', followers: 3_840_000 },
      { platform: 'tiktok', username: 'geroariass2.0', followers: 3_100_000 },
      { platform: 'instagram', username: 'geroooo_arias', followers: 1_300_000 },
      { platform: 'kick', username: 'gerooo_arias', followers: 242_700 },
    ],
    ficha: `Gero Arias es creador de contenido argentino y una de las figuras más virales dentro del fitness y los retos físicos en redes sociales. Su crecimiento ha venido impulsado por su disciplina, su constancia y su capacidad para enganchar a la audiencia con desafíos exigentes y contenido motivacional.
A lo largo de su trayectoria ha construido una comunidad muy sólida, especialmente en TikTok e Instagram, donde comparte entrenamientos, retos personales y evolución física, lo que le ha permitido posicionarse como uno de los perfiles fitness más reconocidos del panorama digital.
Ahora cambia completamente de escenario.
De los retos físicos… al ring.
La Velada VI supone para Gero Arias un paso más allá en su evolución, enfrentándose a meses de preparación específica para competir en un deporte completamente distinto. Aunque su base física puede jugar a su favor, el boxeo exige técnica, estrategia y resistencia en combate real.
Un perfil acostumbrado al esfuerzo, a la disciplina y a superarse constantemente…
pero que ahora tendrá que demostrarlo bajo presión y frente a un rival. 🥊`,
    workout: [
      {
        videoId: 'gYFAIm9fo5M',
        title: 'Puse a Prueba el Limite de Belcast',
      },
      {
        videoId: 'HzZ5j6Lm8aU',
        title: 'Acepté una PELEA ILEGAL antes de LA VELADA',
      },
      {
        videoId: 'WSB2fbqqzSw',
        title: 'Puse a Prueba el Limite de Rivers',
      },
      {
        videoId: 'Uu9ncwoUBus',
        title: 'Boxee en el Barrio más Peligroso de México',
      },
      {
        videoId: '8b63j6136RI',
        title: 'Sobreviví 72h en un Campamento de Boxeo con Milica',
      },
      {
        videoId: 'fvIVHMDXvgs',
        title: 'Peleé Contra un Campeón Mundial de Boxeo',
      },
      {
        videoId: 'lrUJJaolMf0',
        title: 'Lo que no se vió en la Presentación de la Velada Del Año 6',
      },
      {
        videoId: 'fvIVHMDXvgs',
        title: 'Peleé Contra un Campeón Mundial de Boxeo',
      },
      {
        videoId: '8b63j6136RI',
        title: 'Sobreviví 72h en un Campamento de Boxeo con Milica',
      },
      {
        videoId: 'Uu9ncwoUBus',
        title: 'Boxee en el Barrio más Peligroso de México',
      },
      {
        videoId: 'WSB2fbqqzSw',
        title: 'Puse a Prueba el Limite de Rivers',
      },
      {
        videoId: 'GQXwAqOvpAM',
        title: 'Competí Contra Atletas de Cada Categoría Olímpica',
      },
    ],
  },
  {
    id: 'illojuan',
    heightCm: 182,
    name: 'IlloJuan',
    realName: 'Juan Alberto García Gámez',
    gender: 'm',
    country: 'es',
    previousVeladaWins: [],
    birthDate: '1994-06-22',
    age: 31,
    fightWeightKg: 77,
    youtubeChannelId: 'UCKvoBRFqMNqvuSvFBiNadgw',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'twitch', username: 'illojuan', followers: 4_600_000 },
      { platform: 'youtube', username: 'IlloJuan_', followers: 2_810_000 },
      { platform: 'x', username: 'illojuan', followers: 2_100_000 },
      { platform: 'instagram', username: 'illojuan', followers: 1_900_000 },
    ],
    ficha: `Uno de los streamers más queridos y seguidos de España.
IlloJuan ha construido una comunidad enorme gracias a su naturalidad, su cercanía y su capacidad para entretener durante horas en directo, convirtiéndose en una de las figuras clave de Twitch en habla hispana.
Su contenido, centrado en gaming, charlas y reacciones, le ha permitido conectar de forma muy directa con su audiencia, creando una base de seguidores extremadamente fiel.
Pero ahora… cambia completamente el escenario.
De los directos… al ring.
La Velada VI supone para IlloJuan un reto totalmente distinto, donde tendrá que enfrentarse a meses de preparación física y mental para competir en un deporte exigente y fuera de su zona de confort. Sin experiencia previa en el boxeo, el desafío será adaptarse al ritmo del combate y demostrar disciplina dentro del cuadrilátero.
De entretener a miles en streaming… a competir bajo presión real.
Un perfil acostumbrado al foco y a la exposición constante…
pero que ahora tendrá que demostrarlo golpe a golpe. 🥊`,
    workout: [
      {
        videoId: 'UVJ16oc3zaI',
        title: 'SI TE CAES, TE LEVANTAS 🦍 - LA VELADA #4',
      },
      {
        videoId: 'QkTrqtCr5EY',
        title: 'MI PRIMER SPARRING 👊🏻 - LA VELADA #3',
      },
      {
        videoId: 'wmpLU5CfrD4',
        title: 'ENTRENAMIENTO MILITAR 🚀 - LA VELADA #2',
      },
      {
        videoId: '_zwISEtB1rk',
        title: 'EL RETO DE MI VIDA 🥊 - LA VELADA #1',
      },
    ],
  },
  {
    id: 'kidd-keo',
    heightCm: 170,
    name: 'Kidd Keo',
    realName: 'Padua Keoma Salas Sánchez',
    gender: 'm',
    country: 'es',
    previousVeladaWins: [],
    birthDate: '1995-09-27',
    age: 30,
    youtubeChannelId: 'UCBCD1nIuiH-d10_l6Q-8rRg',
    followersUpdatedAt: '2026-06-29',
    socials: [
      { platform: 'youtube', username: 'YKMGOfficial', followers: 4_950_000 },
      { platform: 'spotify', username: 'Kidd Keo', monthlyListeners: 3_900_000 },
      { platform: 'tiktok', username: 'keogang', followers: 954_500 },
      { platform: 'instagram', username: 'thekiddkeo', followers: 3_000_000 },
      { platform: 'spotify', username: 'Kidd Keo', followers: 961_700 },
      { platform: 'x', username: 'KiddKeo95Flames', followers: 515_300 },
      { platform: 'twitch', username: 'TheKiddKeo95', followers: 208_630 },
    ],
    ficha: `Kidd Keo es artista español y una de las figuras más influyentes del trap en España. Su crecimiento ha estado marcado por un estilo rompedor, letras directas y una fuerte personalidad que le ha permitido diferenciarse dentro de la escena urbana.
A lo largo de su carrera ha construido una comunidad muy sólida y una identidad propia dentro del género, siendo uno de los pioneros en llevar el trap en español a un nivel más internacional.
Ahora cambia completamente de terreno.
De la música… al ring.
La Velada VI supone para Kidd Keo un reto totalmente distinto, donde tendrá que enfrentarse a meses de preparación física y mental para competir en un deporte exigente y completamente nuevo para él. Sin experiencia previa en el boxeo, el desafío será adaptarse al ritmo del combate y demostrar disciplina dentro del cuadrilátero.
Un perfil con carácter fuerte, acostumbrado a la presión y a la exposición mediática…
pero que ahora tendrá que demostrarlo golpe a golpe. 🥊`,
  },
  {
    id: 'la-parce',
    heightCm: 158,
    name: 'La Parce',
    realName: 'Valeria',
    gender: 'f',
    country: 'co',
    previousVeladaWins: [],
    birthDate: '2002-06-18',
    age: 23,
    youtubeChannelId: 'UCpkHmV8jZGISRr18KrJgR_A',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'tiktok', username: 'laparcec', followers: 1_200_000 },
      { platform: 'instagram', username: '_laparce_', followers: 574_000 },
      { platform: 'youtube', username: 'laparseyt', followers: 288_000 },
      { platform: 'twitch', username: 'laparce', followers: 234_100 },
      { platform: 'kick', username: 'laparce', followers: 131_100 },
    ],
    ficha: `La Parce es creadora de contenido colombiana y una de las figuras emergentes más destacadas en redes sociales dentro del ámbito del entretenimiento digital. Su crecimiento ha estado impulsado por su personalidad carismática, su naturalidad frente a cámara y su capacidad para conectar con el público a través de contenido cercano y dinámico.
A lo largo de su trayectoria ha ido construyendo una comunidad muy fiel, especialmente en plataformas como TikTok e Instagram, donde comparte vídeos de humor, lifestyle y tendencias que le han permitido ganar visibilidad dentro del panorama internacional.
Ahora afronta uno de los mayores retos de su carrera.
De las redes sociales… al ring.
La Velada VI supone para La Parce un cambio radical, donde tendrá que enfrentarse a meses de preparación física y mental para competir en un deporte completamente nuevo para ella. Sin experiencia previa en boxeo, el desafío será adaptarse a la exigencia del combate y demostrar disciplina dentro del cuadrilátero.
Un perfil en pleno crecimiento, con ambición y proyección… pero que ahora tendrá que demostrarlo golpe a golpe. 🥊`,
    workout: [
      {
        videoId: 'hnseJg3DZzo',
        title: 'VOY A PELEAR EN LA VELADA DEL AÑO 6 | VLOG | La Parce',
      },
    ],
  },
  {
    id: 'lit-killah',
    heightCm: 172,
    name: 'Lit Killah',
    realName: 'Mauro Román Monzón',
    gender: 'm',
    country: 'ar',
    previousVeladaWins: [],
    birthDate: '1999-10-04',
    age: 26,
    youtubeChannelId: 'UCExVswmCLmkkoBkjBp3Ta9Q',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'instagram', username: 'litkillah', followers: 8_400_000 },
      { platform: 'spotify', username: 'LIT killah', monthlyListeners: 7_300_000 },
      { platform: 'youtube', username: 'litkillah', followers: 6_490_000 },
      { platform: 'tiktok', username: 'litkillah', followers: 3_900_000 },
    ],
    ficha: `Lit Killah es artista argentino y una de las figuras más destacadas de la música urbana en habla hispana. Su crecimiento ha venido de la mano de éxitos virales, colaboraciones con grandes nombres del género y una presencia constante en la escena musical internacional.
A lo largo de su carrera ha construido una comunidad masiva de seguidores, consolidándose como uno de los referentes del movimiento urbano argentino gracias a su estilo versátil y su capacidad para adaptarse a distintos sonidos.
Ahora cambia completamente de escenario.
De los escenarios… al ring.
La Velada VI supone para Lit Killah un reto totalmente diferente, donde tendrá que enfrentarse a meses de preparación física y mental para competir en un deporte exigente y completamente nuevo para él. Sin experiencia previa en el boxeo, el desafío será adaptarse al ritmo del combate y demostrar disciplina dentro del cuadrilátero.
Un perfil acostumbrado a la presión de los focos y a grandes audiencias…
pero que ahora tendrá que demostrarlo golpe a golpe. 🥊`,
    workout: [
      {
        videoId: 'IU2GF78lnao',
        title: 'CAMINO A LA VELADA | PARTE 1',
      },
      {
        videoId: 'TCdUZ-_MZtc',
        title: 'LIT KILLAH vs KIDD KEO, TIENE SENTIDO ESTA PELEA?',
      },
    ],
  },
  {
    id: 'marta-diaz',
    heightCm: 168,
    name: 'Marta Díaz',
    realName: 'Marta Díaz García',
    gender: 'f',
    country: 'es',
    previousVeladaWins: [],
    birthDate: '2000-10-30',
    age: 25,
    youtubeChannelId: 'UCF1h4Bry3S9fL12D15H5P7Q',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'tiktok', username: 'maarta_diaz', followers: 7_200_000 },
      { platform: 'instagram', username: 'martaa_diiaz', followers: 3_600_000 },
      { platform: 'youtube', username: 'martadiaz1', followers: 1_990_000 },
    ],
    ficha: `Marta Díaz es creadora de contenido española y una de las influencers más consolidadas del panorama digital en España. Su crecimiento ha sido constante a lo largo de los años, construyendo una comunidad masiva gracias a su contenido de lifestyle, moda y experiencias personales.
Con millones de seguidores en plataformas como YouTube, Instagram y TikTok, se ha convertido en una de las figuras más influyentes entre el público joven, destacando por su cercanía, su naturalidad y su capacidad para mantenerse relevante con el paso del tiempo.
Ahora afronta uno de los retos más exigentes de su carrera.
Un cambio radical en su trayectoria.
La Velada VI marca su salto a un terreno completamente distinto, donde tendrá que dejar atrás su zona de confort para enfrentarse a meses de preparación física y mental. Sin experiencia previa en el boxeo, el desafío será adaptarse a un deporte que exige disciplina, resistencia y mentalidad competitiva.
De las redes sociales y los eventos… a un combate real.
Un perfil acostumbrado al foco mediático y a la presión constante…
pero que ahora tendrá que demostrarlo dentro del ring. 🥊`,
    workout: [
      {
        videoId: 'plWZbt_DFCw',
        title: 'MI RUTINA PARA LA VELADA *Episodio 1* - Marta Diaz',
      },
    ],
  },
  {
    id: 'natalia-mx',
    heightCm: 168,
    name: 'Natalia MX',
    realName: 'Natalia García',
    gender: 'f',
    country: 'mx',
    previousVeladaWins: [],
    birthDate: '2000-04-01',
    age: 26,
    youtubeChannelId: 'UCLmWjPj5qLmqSCcoL1FNf1Q',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'tiktok', username: '_nataliamx', followers: 986_800 },
      { platform: 'instagram', username: '_nataliamx', followers: 868_000 },
      { platform: 'twitch', username: 'nataliamx', followers: 211_000 },
      { platform: 'youtube', username: 'NataliaMX', followers: 66_800 },
    ],
    ficha: `Natalia MX es creadora de contenido mexicana y una de las figuras más destacadas dentro del entretenimiento digital en habla hispana. Su crecimiento en redes ha venido impulsado por su personalidad enérgica, su cercanía con la audiencia y su capacidad para generar contenido variado que conecta con millones de seguidores.
A lo largo de su trayectoria ha construido una comunidad muy sólida, especialmente en plataformas como TikTok e Instagram, donde combina humor, lifestyle y tendencias con un estilo muy característico.
Ahora se enfrenta a un desafío completamente distinto.
De las redes sociales… al ring.
La Velada VI supone para Natalia MX un cambio radical, donde tendrá que someterse a meses de preparación física y mental para competir en un deporte totalmente nuevo para ella. Sin experiencia previa en el boxeo, el reto será adaptarse a la exigencia del combate y demostrar disciplina dentro del cuadrilátero.
Un perfil con gran presencia mediática, acostumbrado a estar en el foco…
pero que ahora tendrá que demostrarlo golpe a golpe. 🥊`,
    workout: [
      {
        videoId: 'b7KZHgHpsWI',
        title: 'ENTRENANDO PARA LA VELADA DEL AÑO || VLOG',
      },
    ],
  },
  {
    id: 'plex',
    heightCm: 197,
    name: 'Plex',
    realName: 'Daniel Alonso Góndez',
    gender: 'm',
    country: 'es',
    previousVeladaWins: [2024],
    birthDate: '2001-09-20',
    age: 24,
    youtubeChannelId: 'UCl8bYBm0XAP23mReE11IBOA',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'youtube', username: 'YoSoyPlex', followers: 14_800_000 },
      { platform: 'tiktok', username: 'yosoyplex', followers: 12_100_000 },
      { platform: 'instagram', username: 'plex', followers: 3_200_000 },
    ],
    ficha: `Yosoyplex es creador de contenido español y uno de los youtubers más influyentes del panorama actual. Su crecimiento ha sido meteórico gracias a su contenido de aventuras, retos extremos y viajes por todo el mundo, con los que ha conseguido enganchar a millones de seguidores.
Con una comunidad masiva en YouTube y redes sociales, se ha consolidado como uno de los perfiles más potentes en habla hispana, destacando por la ambición de sus proyectos y su capacidad para ir siempre un paso más allá.
Pero ahora cambia el enfoque.
Un reto completamente distinto.
La Velada VI supone para Plex un nuevo paso dentro del boxeo amateur, donde ya cuenta con experiencia previa en este tipo de eventos. Ahora no se trata solo de debutar, sino de mejorar su rendimiento y demostrar evolución dentro del ring.
De recorrer el mundo… a subirse a un cuadrilátero.
Un perfil acostumbrado a los retos extremos y a la presión constante…
pero que ahora tendrá que demostrarlo golpe a golpe. 🥊`,
    workout: [
      {
        videoId: 'FYUozoDoN9c',
        title: 'GREFG VS PLEX | VELADA DEL AÑO 6',
      },
    ],
  },
  {
    id: 'roro',
    heightCm: 150,
    name: 'RoRo',
    realName: 'Rocío López Bueno',
    gender: 'f',
    country: 'es',
    previousVeladaWins: [],
    birthDate: '2002-03-01',
    age: 24,
    fightWeightKg: 52,
    youtubeChannelId: 'UCrzySRaber8_-52PPh0GG2g',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'tiktok', username: 'roro.bueno', followers: 9_700_000 },
      { platform: 'instagram', username: 'whoisroro', followers: 4_700_000 },
      { platform: 'youtube', username: 'roroobuenoo', followers: 208_000 },
    ],
    ficha: `Roro es creadora de contenido española y una de las figuras más virales del momento en redes sociales. Su crecimiento ha sido explosivo gracias a su estilo cercano, su espontaneidad y su capacidad para generar contenido que conecta rápidamente con millones de usuarios.
A lo largo de su trayectoria ha construido una comunidad enorme, especialmente en TikTok, donde sus vídeos de recetas y cocina se han hecho virales, convirtiéndola en una de las influencers más comentadas del panorama actual.
Ahora cambia completamente de escenario.
De las recetas… al ring.
La Velada VI supone para Roro un reto totalmente nuevo, donde tendrá que enfrentarse a meses de preparación física y mental para competir en un deporte exigente y desconocido para ella. Sin experiencia previa en el boxeo, el desafío será adaptarse al ritmo del combate y demostrar disciplina dentro del cuadrilátero.
Un perfil acostumbrado a la exposición constante y a la presión de las redes…
pero que ahora tendrá que demostrarlo golpe a golpe. 🥊`,
    workout: [
      {
        videoId: 'b4YZtb6lkpI',
        title: 'Rivers... voy a por ti.',
      },
      {
        videoId: 'IcGLCqFRfE4',
        title: 'Me Enfrenté a un Monje Shaolín...',
      },
      {
        videoId: 'V6xAOfEPdpE',
        title: 'Mi vida a un mes de pelear en La Velada...',
      },
    ],
  },
  {
    id: 'samy-rivers',
    heightCm: 158,
    name: 'Samy Rivers',
    realName: 'Samantha Guadalupe Rivera Treviño',
    gender: 'f',
    country: 'mx',
    previousVeladaWins: [2023],
    birthDate: '1998-08-20',
    age: 27,
    fightWeightKg: 52,
    youtubeChannelId: 'UCW3bX8K5LuQHw8cKc3U8iUg',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'tiktok', username: 'rivers.gg', followers: 8_600_000 },
      { platform: 'twitch', username: 'rivers_gg', followers: 6_900_000 },
      { platform: 'instagram', username: 'samyrivera', followers: 6_100_000 },
      { platform: 'x', username: 'samyriveratv', followers: 6_400_000 },
      { platform: 'youtube', username: 'Rivers_gg', followers: 4_540_000 },
    ],

    ficha: ` Samy Rivers es creadora de contenido mexicana y una de las streamers más destacadas del panorama actual en habla hispana. Su crecimiento ha venido impulsado por su carisma, su cercanía con la audiencia y su presencia constante en plataformas como Twitch y YouTube.
A lo largo de su trayectoria ha construido una comunidad muy sólida, participando en grandes eventos del mundo streamer y consolidándose como una figura relevante dentro del entretenimiento digital.
A diferencia de otros participantes, Samy Rivers ya cuenta con experiencia previa en el boxeo tras su participación en anteriores ediciones de La Velada, donde ha demostrado disciplina, resistencia y capacidad de adaptación dentro del ring.
Ahora vuelve a enfrentarse a un nuevo desafío.
Con experiencia, confianza y más preparación.
La Velada VI supone para Samy una oportunidad para seguir creciendo dentro del boxeo amateur, enfrentándose a nuevos rivales y elevando su nivel competitivo.
Un perfil acostumbrado a la presión del directo y al foco mediático…
que ahora tendrá que volver a demostrarlo golpe a golpe. 🥊
      `,
    workout: [
      {
        videoId: 'TcjSRGm_FDA',
        title: 'Regreso a la velada del año ',
      },
      {
        videoId: 'WPpozQubJm8',
        title: 'MI PRIMER ENTRENAMIENTO DESPUÉS DE 3 AÑOS',
      },
      {
        videoId: 'kfsfN50CYzY',
        title: 'Entrenamiento de BOX con PIO FC',
      },
      {
        videoId: 'SR_SKdi-xw8',
        title: 'Entrené con Canelo Álvarez y Eddy Reynoso | Camino a La Velada VI',
      },
      {
        videoId: '7qzy2sL2Uss',
        title: 'Me pegué con Lupita Villalobos antes de que...',
      },
      {
        videoId: 'tBnsvXAmszc',
        title: 'Boxeamos a CIEGAS con @geroariass rumbo a La Velada VI',
      },
      {
        videoId: 'Og2tZlNiZSc',
        title: 'NOS DIMOS CON TODO ft. ARIA BELA',
      },
      {
        videoId: 'GkhX2_HLmU0',
        title: '¿Cuánto aguantará Carlos Belcast mi ENTRENAMIENTO? - La Velada 6',
      },
    ],
  },
  {
    id: 'tatiana-kaer',
    heightCm: 165,
    name: 'Tatiana Käer',
    realName: 'Tatiana Käer',
    gender: 'f',
    country: 'es',
    previousVeladaWins: [],
    birthDate: '2004-08-28',
    age: 21,
    youtubeChannelId: 'UCZh4XmGTOxSJAsjZLDkZArA',
    followersUpdatedAt: '2026-05-14',
    socials: [
      { platform: 'tiktok', username: 'tatianakaer', followers: 19_300_000 },
      { platform: 'instagram', username: 'tatianakaer', followers: 4_800_000 },
      { platform: 'youtube', username: 'Tatianakaher', followers: 650_000 },
    ],
    ficha: `Tatiana Kaer es creadora de contenido española y una de las figuras emergentes dentro del panorama digital actual. Su crecimiento ha venido impulsado por su estilo cercano, su naturalidad frente a cámara y su capacidad para conectar con la audiencia a través de contenido dinámico y entretenido.
A lo largo de su trayectoria ha ido construyendo una comunidad muy activa en plataformas como TikTok e Instagram, donde comparte contenido de lifestyle, tendencias y situaciones del día a día que le han permitido ganar visibilidad dentro del entorno digital.
Ahora afronta uno de los retos más importantes de su carrera.
Un cambio total de escenario.
La Velada VI supone para Tatiana Kaer un paso fuera de su zona de confort, enfrentándose a meses de preparación física y mental para competir en un deporte exigente y completamente nuevo para ella. Sin experiencia previa en el boxeo, el desafío será adaptarse al ritmo del combate y demostrar disciplina dentro del cuadrilátero.
De las redes sociales… a un combate real.
Un perfil en crecimiento, con ambición y proyección…
pero que ahora tendrá que demostrarlo golpe a golpe. 🥊`,
  },
  {
    id: 'thegrefg',
    heightCm: 178,
    name: 'TheGrefg',
    realName: 'David Cánovas Martínez',
    gender: 'm',
    country: 'es',
    previousVeladaWins: [2025],
    birthDate: '1997-04-24',
    age: 29,
    fightWeightKg: 77,
    youtubeChannelId: 'UCCEmjNPpJYhGDgaEqeeA4HA',
    followersUpdatedAt: '2026-06-29',
    socials: [
      { platform: 'youtube', username: 'TheGrefg', followers: 19_700_000 },
      { platform: 'twitch', username: 'thegrefg', followers: 12_300_000 },
      { platform: 'tiktok', username: 'thegrefg', followers: 9_600_000 },
      { platform: 'x', username: 'TheGrefg', followers: 8_100_000 },
      { platform: 'instagram', username: 'thegrefg', followers: 7_500_000 },
      { platform: 'kick', username: 'thegrefg', followers: 380_000 },
    ],
    ficha: `Uno de los creadores de contenido más influyentes de España.
TheGrefg ha marcado una era en YouTube y Twitch, batiendo récords históricos y construyendo una de las comunidades más grandes del mundo hispanohablante.
Su impacto va mucho más allá del gaming, consolidándose como una figura clave dentro del entretenimiento digital y participando en algunos de los eventos más importantes del sector.
Pero en los últimos años… ha ido un paso más allá.
De streamer… a competidor.
Tras su paso por La Velada, donde ya ha demostrado nivel dentro del ring, Grefg llega con experiencia, preparación y una mentalidad mucho más competitiva.
Esto ya no es debutar.
Es rendir al máximo nivel.
Un perfil acostumbrado a la presión, al foco mediático y a competir frente a millones…
que ahora tendrá que volver a demostrarlo golpe a golpe. 🥊`,
    workout: [
      {
        videoId: 'URCFTAXdkgY',
        title: 'Entrenando con Marta, Fabiana y Roro para la Velada - TheGrefg',
      },
      {
        videoId: 'wgq2RBOJ79o',
        title: 'GREFG VS BOXEADOR NOOB, AMATEUR Y PRO',
      },
      {
        videoId: '3eeK-5l-ess',
        title: 'GREFG VS VIRUZZ | VELADA DEL AÑO 6',
      },
      {
        videoId: 'UVJXna7nW3A',
        title: 'GYM GRATIS VS CARO EN ESTADOS UNIDOS - TheGrefg',
      },
      {
        videoId: 'Oso5MnqqYyo',
        title: 'MI FÍSICO PARA LA VELADA DEL AÑO 6 - TheGrefg',
      },
      {
        videoId: 'zNGq9kbZNF4',
        title: 'PELEO EN LA VELADA DEL AÑO 6 - TheGrefg',
      },
    ],
  },
  {
    id: 'viruzz',
    heightCm: 183,
    name: 'Viruzz',
    realName: 'Víctor Mélida Cambra',
    gender: 'm',
    country: 'es',
    previousVeladaWins: [2022, 2024, 2025],
    birthDate: '1992-05-01',
    age: 34,
    youtubeChannelId: 'UCvGiJYBPgVP7W1ypE3DKOqA',
    followersUpdatedAt: '2026-06-27',
    socials: [
      { platform: 'youtube', username: 'byViruZz', followers: 6_210_000 },
      { platform: 'instagram', username: 'victormelida', followers: 1_800_000 },
      { platform: 'tiktok', username: 'victormelida', followers: 1_700_000 },
      { platform: 'x', username: 'byViruZz', followers: 1_000_000 },
      { platform: 'twitch', username: 'byviruzz', followers: 433_441 },
    ],
    ficha: `Viruzz es creador de contenido español y una de las figuras más destacadas del panorama streamer en España. Su trayectoria en redes ha estado marcada por el contenido gaming, entretenimiento y una evolución muy fuerte hacia el deporte de contacto en los últimos años.
A diferencia de otros participantes, Viruzz ya cuenta con experiencia previa en el boxeo tras su paso por varias ediciones de La Velada, donde ha demostrado un alto nivel de preparación, adaptación y competitividad dentro del ring.
Ahora vuelve a enfrentarse a un nuevo reto.
Con experiencia, presión y expectativas altas.
La Velada VI supone para Viruzz una nueva oportunidad para seguir consolidándose dentro del boxeo amateur de eventos, donde ya no se trata solo de debutar, sino de mantener el nivel frente a rivales cada vez más preparados.
Un perfil con recorrido en el ring, acostumbrado al foco mediático y a la exigencia del combate…
que ahora tendrá que volver a demostrarlo golpe a golpe. 🥊`,
    workout: [
      {
        videoId: 'A_xqXAHX-aE',
        title: 'MI PRIMER SPARRING DE LA VELADA DEL AÑO 6',
      },
      {
        videoId: 'OiaefT8lSb8',
        title: 'Gero, no veas este vídeo...',
      },
    ],
  },
]

/** Conjunto de variantes de una imagen del boxeador. Las versiones
 *  `avif` y `webp` están optimizadas (mucho más pequeñas que el PNG)
 *  y se generan con `pnpm generate:character-images`. */
export interface BoxerImageVariants {
  avif: string
  webp: string
}

/** Variantes de la miniatura del selector (carpeta `character-select`). */
export function getBoxerSelectImages(boxer: Boxer): BoxerImageVariants {
  return {
    avif: `https://cdn.infolavelada.com/character-select/${boxer.id}.avif`,
    webp: `https://cdn.infolavelada.com/character-select/${boxer.id}.webp`,
  }
}

/** Devuelve la ruta a la imagen de selección (miniatura) de un boxeador,
 *  formato WebP. Para mejor rendimiento, prefiere `getBoxerSelectImages`. */
export function getBoxerSelectImage(boxer: Boxer): string {
  return getBoxerSelectImages(boxer).webp
}

/** Variantes del recorte grande para el hero (carpeta `character-hero`). */
export function getBoxerHeroImages(boxer: Boxer): BoxerImageVariants {
  return {
    avif: `https://cdn.infolavelada.com/character-hero/${boxer.id}.avif`,
    webp: `https://cdn.infolavelada.com/character-hero/${boxer.id}.webp`,
  }
}

/** Anchos de las variantes responsive del recorte de hero. Deben coincidir con
 *  los que genera `scripts/convert-character-images.mjs` y existir en el CDN. */
export const BOXER_HERO_VARIANT_WIDTHS = [320, 480, 640, 960] as const
/** Ancho real del recorte completo (`{id}.avif|webp`), que cierra el srcset. */
export const BOXER_HERO_FULL_WIDTH = 1066

/**
 * `srcset` responsive del recorte de hero, pensado para la grid de
 * `/boxeadores`, donde la imagen se muestra en tarjetas pequeñas (~165-330px).
 * Sin esto el navegador descarga siempre el recorte completo (1066px). Cada
 * variante `-{w}` la genera el script de conversión y debe estar subida al CDN;
 * el tamaño completo cierra el srcset como mayor descriptor. */
export function getBoxerHeroSrcset(boxer: Boxer): BoxerImageVariants {
  const base = `https://cdn.infolavelada.com/character-hero/${boxer.id}`
  const build = (ext: 'avif' | 'webp') =>
    [
      ...BOXER_HERO_VARIANT_WIDTHS.map((width) => `${base}-${width}.${ext} ${width}w`),
      `${base}.${ext} ${BOXER_HERO_FULL_WIDTH}w`,
    ].join(', ')

  return { avif: build('avif'), webp: build('webp') }
}

/**
 * Devuelve la ruta al recorte grande del boxeador usado en el hero al
 * hacer hover sobre la miniatura del selector, formato WebP. Para mejor
 * rendimiento, prefiere `getBoxerHeroImages`.
 */
export function getBoxerHeroImage(boxer: Boxer): string {
  return getBoxerHeroImages(boxer).webp
}

/** Devuelve la ruta a la foto principal del boxeador (01.webp). */
export function getBoxerPhoto(boxer: Boxer): string {
  return `/photos/${boxer.id}/01.webp`
}

/** Mapa rápido para acceder a un boxer por su id. */
export const BOXERS_BY_ID: Record<string, Boxer> = Object.fromEntries(
  BOXERS.map((boxer) => [boxer.id, boxer]),
)

/** Nombre legible por código de país. */
export const COUNTRY_NAMES: Record<string, string> = {
  es: 'España',
  mx: 'México',
  co: 'Colombia',
  ar: 'Argentina',
  sv: 'El Salvador',
  pr: 'Puerto Rico',
}

/** Etiqueta legible por género. */
export const GENDER_LABELS: Record<BoxerGender, string> = {
  f: 'Femenino',
  m: 'Masculino',
}
