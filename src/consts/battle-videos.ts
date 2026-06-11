export interface BattleVideoSources {
  desktop: `/videos/${string}.mp4`
  mobile: `/videos/${string}.mp4`
}

export const battleVideosById: Partial<Record<string, BattleVideoSources>> = {
  'illojuan-vs-thegrefg': {
    desktop: '/videos/combates/illojuan-vs-thegrefg/desktop.mp4',
    mobile: '/videos/combates/illojuan-vs-thegrefg/mobile.mp4',
  },
}
