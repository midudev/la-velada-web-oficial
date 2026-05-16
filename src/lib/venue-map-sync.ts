export type VenueMapSync = (root: HTMLElement, open: boolean) => void

let syncVenueMap: VenueMapSync | null = null

export function registerVenueMapSync(handler: VenueMapSync) {
  syncVenueMap = handler
}

export function setVenueMapOpen(root: HTMLElement, open: boolean) {
  syncVenueMap?.(root, open)
}
