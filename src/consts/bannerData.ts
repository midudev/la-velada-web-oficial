import RevolutBanner from '@/assets/banners/revolut.webp'
import AlsaBanner from '@/assets/banners/alsa.webp'
import type { Banner } from '@/types/bannerType'

export const BANNERS: Banner[] = [
  {
    id: 'revolut',
    name: 'Revolut',
    url: 'https://www.revolut.com/es-ES/velada5-revolut',
    label: 'Ir a la promoción de Revolut',
    image: {
      logo: RevolutBanner.src,
      width: 600,
      height: 200,
    },
  },
  {
    id: 'alsa',
    name: 'Alsa',
    url: 'https://alsabuslaveladav.qr4events.com/?utm_source=twitch&utm_medium=socialmedia&utm_campaign=2025_05_busesveladav&utm_content=',
    label: 'Ir a la promoción de Alsa',
    image: {
      logo: AlsaBanner.src,
      width: 600,
      height: 200,
    },
  },
]
