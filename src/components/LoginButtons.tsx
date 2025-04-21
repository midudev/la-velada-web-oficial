import React from 'react'
import { signIn, signOut } from 'auth-astro/client'
import { Twitch } from 'lucide-react'

type Props = {
  isLoggedIn: boolean
}

export default function LoginButtons({ isLoggedIn }: Props) {
  return (
    <div className="flex flex-col gap-4 items-center mt-4">
      {!isLoggedIn ? (
        <button
          onClick={() => signIn("twitch")}
          className="group relative overflow-hidden text-white space-x-2 inline-flex items-center justify-center border-2 border-white rounded-lg px-4 py-2 animate-fade-in animate-delay-700 z-10 leading-relaxed font-medium tracking-wider transition hover:scale-105 neon-button"
        >
          <div className="width-full absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"></div>
          <Twitch className="w-5 h-5" />
          <span>Iniciar Sesión</span>
        </button>
      ) : (
        <button
          onClick={() => signOut()}
          className="group relative overflow-hidden text-white space-x-2 inline-flex items-center justify-center border-2 border-white rounded-lg px-4 py-2 animate-fade-in animate-delay-700 z-10 leading-relaxed font-medium tracking-wider transition hover:scale-105 neon-button"
        >
          <div className="width-full opacity- absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"></div>
          <Twitch className="w-5 h-5" />
          <span>Cerrar sesión</span>
        </button>
      )}

      <style>
        {`
          .neon-button {;
          cursor: pointer;
            text-shadow: 0 0 7px #fff;
            background: rgba(100, 24, 161, 0.38);
            box-shadow: 0 0 .2rem rgba(255, 255, 255, 0.40),
                        0 0 .2rem rgba(255, 255, 255, 0.40),
                        0 0 2rem rgba(145, 70, 255, 0.40);
          }
        `}
      </style>
    </div>
  )
}