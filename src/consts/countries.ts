import ar from '../../public/images/flags/ar.webp'
import mx from '../../public/images/flags/mx.webp'
import co from '../../public/images/flags/co.webp'
import es from '../../public/images/flags/es.webp'
import pr from '../../public/images/flags/pr.webp'
import sv from '../../public/images/flags/sv.webp'

export type Country = {
  id: string
  name: string
  image: any // Assuming the image type is any for now
  continent: string
}

export const countries: Country[] = [
  {
    id: 'ar',
    name: 'Argentina',
    image: ar,
    continent: 'South America',
  },
  {
    id: 'mx',
    name: 'México',
    image: mx,
    continent: 'North America',
  },
  {
    id: 'co',
    name: 'Colombia',
    image: co,
    continent: 'South America',
  },
  {
    id: 'es',
    name: 'España',
    image: es,
    continent: 'Europe',
  },
  {
    id: 'pr',
    name: 'Puerto Rico',
    image: pr,
    continent: 'North America',
  },
  {
    id: 'sv',
    name: 'El Salvador',
    image: sv,
    continent: 'Central America',
  },
]
