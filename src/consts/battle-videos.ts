export interface BattleVideoSources {
  desktop: BattleVideoVariant
  mobile: BattleVideoVariant
}

export interface BattleVideoVariant {
  mp4: BattleVideoUrl
  webm: BattleVideoUrl
}

type BattleVideoFormat = 'mp4' | 'webm'
export type BattleVideoUrl = `https://cdn.infolavelada.com/vs/${string}.${BattleVideoFormat}`

const BATTLE_VIDEO_CDN_URL = 'https://cdn.infolavelada.com/vs'

function createBattleVideoSources(
  horizontalAsset: string,
  verticalAsset: string,
): BattleVideoSources {
  return {
    desktop: {
      mp4: `${BATTLE_VIDEO_CDN_URL}/${horizontalAsset}.mp4` as BattleVideoUrl,
      webm: `${BATTLE_VIDEO_CDN_URL}/${horizontalAsset}.webm` as BattleVideoUrl,
    },
    mobile: {
      mp4: `${BATTLE_VIDEO_CDN_URL}/${verticalAsset}.mp4` as BattleVideoUrl,
      webm: `${BATTLE_VIDEO_CDN_URL}/${verticalAsset}.webm` as BattleVideoUrl,
    },
  }
}

export const battleVideosById: Partial<Record<string, BattleVideoSources>> = {
  'edu-aguirre-vs-gaston-edul': createBattleVideoSources(
    'edu-aguirre-vs-gaston-edul-horizontal',
    'edu-aguirre-vs-gaston-edul-vettical',
  ),
  'la-parce-vs-fabiana-sevillano': createBattleVideoSources(
    'fabiana-sevillano-vs-la-parce-horizontal',
    'fabiana-sevillano-vs-la-parce-vertical',
  ),
  'clersss-vs-natalia-mx': createBattleVideoSources(
    'clers-vs-natalia-horizontal',
    'clers-vs-natalia-vertical',
  ),
  'lit-killah-vs-kidd-keo': createBattleVideoSources(
    'lit-vs-keo-horizontal',
    'lit-vs-keo-vertical',
  ),
  'alondrissa-vs-angie-velasco': createBattleVideoSources(
    'alondrissa-vs-angie-velasco-horizontal',
    'alondrissa-vs-angie-velasco-vertical',
  ),
  'viruzz-vs-gero-arias': createBattleVideoSources(
    'gero-vs-viruz-horizontal',
    'gero-vs-viruz-vertical',
  ),
  'samy-rivers-vs-roro': createBattleVideoSources(
    'roro-vs-samy-rivera-horizontal',
    'roro-vs-samy-rivera-vertical',
  ),
  'marta-diaz-vs-tatiana-kaer': createBattleVideoSources(
    'marta-tatiana-horizontal',
    'marta-tatiana-vertical',
  ),
  'plex-vs-fernanfloo': createBattleVideoSources(
    'prex-vs-fernandfloo-horizontal',
    'prex-vs-fernandfloo-vertical',
  ),
  'illojuan-vs-thegrefg': createBattleVideoSources(
    'illojuan-vs-grefg-horizontal',
    'illojuan-vs-grefg-vertical',
  ),
}
