import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const VIEW_BOX = '0 0 303 303'
const GRAD_ID = 'logo-home-grad'
const MASK_ID = 'logo-home-mask'

const LOGO_PATH =
  'm188.1 150.2l90.6 137.4-34.9-16c-7.7-3.5-15.1-7.7-21.9-12.3-15.3-10.4-29-25.3-39.6-43.1l-17.8-30.2-12 18.2-12-18.2-17.7 30.2c-10.6 17.8-24.4 32.7-39.7 43.1-6.8 4.6-14.2 8.8-21.9 12.3l-34.9 16 90.6-137.4-90.6-137.4 34.9 16c7.7 3.5 15.1 7.7 21.9 12.3 15.3 10.4 29.1 25.3 39.7 43.1l17.7 30.2 12-18.2 12 18.2 17.8-30.2c10.6-17.8 24.3-32.7 39.6-43.1 6.8-4.6 14.2-8.8 21.9-12.3l34.9-16zm-21-31.8l18.4 27.9 81.3-123.3-21.2 9.7c-7.5 3.5-14.7 7.5-21.3 12-14.8 10-28 24.5-38.3 41.8zm-128.9-95.4l81.2 123.2 18.4-27.8-18.8-32c-10.3-17.3-23.6-31.7-38.4-41.8-6.6-4.5-13.8-8.5-21.3-11.9zm147.3 131.1l-23.5-35.6-9.5-14.5-9.6 14.5-23.4 35.6-81.3 123.2 21.2-9.7c7.5-3.4 14.6-7.4 21.2-11.9 14.8-10.1 28.1-24.5 38.4-41.8l19.5-33.1 14-23.7 13.9 23.7 19.5 33.1c10.3 17.3 23.6 31.7 38.4 41.8 6.6 4.5 13.8 8.5 21.3 11.9l21.1 9.7zm-23.4 27.8l-9.6-16.2-9.5 16.2 9.5 14.4z'

const ease = [0.23, 1, 0.32, 1] as const
const draw = { duration: 0.5, ease }
const REST_FILL = 'oklch(0.765 0.038 55.5)'

const linkClassName =
  'flex items-center gap-3 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme-gold'

const crest = { rest: {}, hover: {}, tap: {} }

/** Mask stroke reveals gradient fill along the X path; reverses on hover out. */
const maskReveal = {
  rest: {
    pathLength: 0,
    transition: { pathLength: draw },
  },
  hover: {
    pathLength: 1,
    transition: { pathLength: draw },
  },
  tap: { pathLength: 1 },
}

/** Gradient trace stays visible for the whole hover. */
const traceStroke = {
  rest: {
    pathLength: 0,
    opacity: 0,
    transition: {
      pathLength: draw,
      opacity: { duration: 0.2, ease },
    },
  },
  hover: {
    pathLength: 1,
    opacity: 0.85,
    transition: {
      pathLength: draw,
      opacity: { duration: 0.15, ease },
    },
  },
  tap: { pathLength: 1, opacity: 0.85 },
}

type Props = { children: ReactNode }

function CrestSvg() {
  return (
    <motion.svg
      viewBox={VIEW_BOX}
      className="block h-9 w-auto shrink-0 sm:h-10"
      aria-hidden
      variants={crest}
    >
      <defs>
        <linearGradient id={GRAD_ID} x1="15%" y1="5%" x2="90%" y2="95%">
          <stop offset="0%" stopColor="oklch(0.84 0.05 56)" />
          <stop offset="48%" stopColor="oklch(0.66 0.085 56.5)" />
          <stop offset="100%" stopColor="oklch(0.42 0.038 56)" />
        </linearGradient>
        <mask id={MASK_ID}>
          <motion.path
            d={LOGO_PATH}
            fill="none"
            stroke="white"
            strokeWidth={20}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={maskReveal}
          />
        </mask>
      </defs>
      <path fillRule="evenodd" d={LOGO_PATH} fill={REST_FILL} />
      <path
        fillRule="evenodd"
        d={LOGO_PATH}
        fill={`url(#${GRAD_ID})`}
        mask={`url(#${MASK_ID})`}
      />
      <motion.path
        d={LOGO_PATH}
        fill="none"
        stroke={`url(#${GRAD_ID})`}
        strokeWidth={1.15}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        variants={traceStroke}
      />
    </motion.svg>
  )
}

export default function LogoHomeLink({ children }: Props) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <a
        href="/"
        className={linkClassName}
        aria-label="La Velada del Año VI - Inicio"
      >
        <svg viewBox={VIEW_BOX} className="block h-9 w-auto sm:h-10" aria-hidden>
          <path fillRule="evenodd" d={LOGO_PATH} fill={REST_FILL} />
        </svg>
        {children}
      </a>
    )
  }

  return (
    <motion.a
      href="/"
      className={linkClassName}
      aria-label="La Velada del Año VI - Inicio"
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap="tap"
      variants={crest}
    >
      <CrestSvg />
      {children}
    </motion.a>
  )
}
