export const isFirefox = (): boolean => {
	return typeof InstallTrigger !== "undefined"
}
