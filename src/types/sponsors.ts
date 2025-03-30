type SponsorId =
| "vicio"
| "revolut"
| "alsa"
| "spotify"
| "cerave"
| "grefusa"
| "froneri"
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
| "Froneri"
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