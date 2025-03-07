export const checkIsChannelOnlineInTwitch = async (channel: string): Promise<boolean> => {
	const url = `https://midudev-apis.midudev.workers.dev/uptime/${channel}`

	try {
		const res = await fetch(url)
		if (!res.ok) return false

		const data = await res.json()
		return data.online
	} catch (err) {
		return false
	}
}