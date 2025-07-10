import RevolutBanner from '@/assets/banners/revolut.webp'
import AlsaBanner from '@/assets/banners/alsa.webp'
import type { Banner } from '@/types/bannerType'

export const BANNERS: Banner[] = [
  {
    id: 'revolut',
    name: 'Revolut',
    url: 'https://get.revolut.com/z4lF/velada5nl',
    label: 'Ir a la promoción de Revolut',
    image: {
      logo: RevolutBanner,
      width: 600,
      height: 200,
    },
  },
  {
    id: 'alsa',
    name: 'Alsa',
    url: 'https://alsabuslaveladav.qr4events.com/?utm_source=home&utm_medium=web&utm_campaign=2025_05_busesveladav&utm_content=',
    label: 'Ir a la promoción de Alsa',
    image: {
      logo: AlsaBanner,
      width: 600,
      height: 200,
    },
  },
]
