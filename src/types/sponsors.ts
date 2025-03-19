type SponsorId =
| "vicio"
| "revolut"
| "alsa"
| "spotify"
| "cerave"
| "grefusa"
| "maxibon"
| "infojobs"
| "coca-cola"
| "mahou"
| "nothing"

type SponsorName = 
| "Vicio"
| "Revolut"
| "Alsa"
| "Spotify"
| "Cerave"
| "Grefusa"
| "Maxibon"
| "Infojobs"
| "Coca-Cola"
| "Mahou"
| "Nothing"

export interface Sponsors {
  id: SponsorId
  name: SponsorName
  url: string
  label: string
  image: {
    logo: any
    width: number
    height: number
  }
}