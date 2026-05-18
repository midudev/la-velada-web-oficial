export const NAV_ITEMS = [
  {
    label: 'BOXEADORES',
    href: '/boxeadores',
    disabled: false,
  },
  {
    label: 'COMBATES',
    href: '/#cartelera',
    disabled: true,
    note: 'PRÓXIMAMENTE',
  },
  {
    label: 'PRONÓSTICOS',
    href: '/pronosticos',
    disabled: true,
    note: 'PRÓXIMAMENTE',
  },
] as const

export type NavItem = (typeof NAV_ITEMS)[number]

export const shouldReloadNavItem = (currentPath: string, href: string) =>
  currentPath === '/' && href === '/boxeadores'
