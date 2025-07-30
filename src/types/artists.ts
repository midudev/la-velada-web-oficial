type ArtistId =
  | 'aitana'
  | 'delarose'
  | 'eladiocarrion'
  | 'grupofrontera'
  | 'losdelrio'
  | 'melendi'
  | 'myketowers'

export interface Artist {
  id: ArtistId
  name: string
  image?: string
  url: string
}
