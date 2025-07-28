import { Auth } from 'auth-astro'
import Twitch from '@auth/core/providers/twitch'

// Tipos para TypeScript
interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Profile {
  sub?: string
  display_name?: string
  email?: string
  profile_image_url?: string
}

interface Token {
  sub?: string
  name?: string | null
  email?: string | null
  picture?: string | null
  id?: string
}

if (!import.meta.env.TWITCH_CLIENT_ID) {
  console.warn('TWITCH_CLIENT_ID no está definido en las variables de entorno')
}

if (!import.meta.env.TWITCH_CLIENT_SECRET) {
  console.warn('TWITCH_CLIENT_SECRET no está definido en las variables de entorno')
}

if (!import.meta.env.AUTH_SECRET) {
  console.warn('AUTH_SECRET no está definido en las variables de entorno. Usando valor por defecto para desarrollo.')
}

// Configuración de autenticación
export const authConfig = {
  providers: [
    Twitch({
      clientId: import.meta.env.TWITCH_CLIENT_ID || '',
      clientSecret: import.meta.env.TWITCH_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'user:read:email',
        },
      },
    }),
  ],
  // URL de redirección después del inicio de sesión
  pages: {
    signIn: '/porra',
    error: '/porra',
  },
  // Configuración de la sesión
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        if (token.sub) session.user.id = token.sub
        if (token.name) session.user.name = token.name
        if (token.email) session.user.email = token.email
        if (token.picture) session.user.image = token.picture
      }
      return session
    },
    async jwt({ token, user, account, profile }: { token: Token; user?: any; account?: any; profile?: Profile }) {
      // Pasar datos del perfil de Twitch al token
      if (profile) {
        token.id = profile.sub || user?.id
        token.name = profile.display_name || user?.name
        token.email = profile.email || user?.email
        token.picture = profile.profile_image_url || user?.image
      }
      return token
    },
  },
  // Usar variables de entorno para la clave secreta
  secret: import.meta.env.AUTH_SECRET || 'un-secreto-seguro-para-desarrollo',
  debug: Boolean(import.meta.env.DEV),
  trustHost: true,
}

export const { get, post } = Auth(authConfig)
