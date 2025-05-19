type BannerId = 'revolut' | 'alsa'
type BannerName = 'Revolut' | 'Alsa'

export interface Banner {
  id: BannerId
  name: BannerName
  url: string
  label: string
  image: {
    logo: any
    width: number
    height: number
  }
}
