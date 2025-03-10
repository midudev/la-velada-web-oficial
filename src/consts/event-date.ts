export const EVENT_TIMESTAMP = 1741631400000

export const isEventExpired = (): boolean => {
  const currentTimestamp = new Date().getTime()
  return currentTimestamp > EVENT_TIMESTAMP
}

export const getTwitchUrl = (channel: string): string => {
  const twitchParentUrl = import.meta.env.PROD ? "www.infolavelada.com" : "localhost"
  return `https://player.twitch.tv/?channel=${channel}&parent=${twitchParentUrl}`
}
