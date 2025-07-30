type ArtistId =
  | 'aitana'
  | 'delarose'
  | 'eladiocarrion'
  | 'grupofrontera'
  | 'losdelrio'
  | 'melendi'
  | 'myketowers'
  | 'deiv'

export interface Artist {
  id: ArtistId
  name: string
  image?: string
  url: string
}
