/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TURSO_DATABASE_URL: string
  readonly TURSO_AUTH_TOKEN: string
  readonly AUTH_SECRET: string
  readonly TWITCH_CLIENT_ID: string
  readonly TWITCH_CLIENT_SECRET: string
  readonly NEXTAUTH_URL: string
  readonly NEXTAUTH_SECRET: string
  readonly DEV: boolean
}

declare module '*.svg' {
  import type { ComponentType, SVGProps } from 'astro/types'
  const component: ComponentType<SVGProps<'svg'>>
  export default component
}

declare module '*.svg?component' {
  import type { ComponentType, SVGProps } from 'astro/types'
  const component: ComponentType<SVGProps<'svg'>>
  export default component
}

declare module '*.svg?url' {
  const path: string
  export default path
}
