import { useId, useSyncExternalStore, type ReactNode } from 'react'
import { LazyMotion, domAnimation, m, useReducedMotion, type Transition } from 'motion/react'

const crest = {
  viewBox: '0 0 303 303',
  path: 'm188.1 150.2l90.6 137.4-34.9-16c-7.7-3.5-15.1-7.7-21.9-12.3-15.3-10.4-29-25.3-39.6-43.1l-17.8-30.2-12 18.2-12-18.2-17.7 30.2c-10.6 17.8-24.4 32.7-39.7 43.1-6.8 4.6-14.2 8.8-21.9 12.3l-34.9 16 90.6-137.4-90.6-137.4 34.9 16c7.7 3.5 15.1 7.7 21.9 12.3 15.3 10.4 29.1 25.3 39.7 43.1l17.7 30.2 12-18.2 12 18.2 17.8-30.2c10.6-17.8 24.3-32.7 39.6-43.1 6.8-4.6 14.2-8.8 21.9-12.3l34.9-16zm-21-31.8l18.4 27.9 81.3-123.3-21.2 9.7c-7.5 3.5-14.7 7.5-21.3 12-14.8 10-28 24.5-38.3 41.8zm-128.9-95.4l81.2 123.2 18.4-27.8-18.8-32c-10.3-17.3-23.6-31.7-38.4-41.8-6.6-4.5-13.8-8.5-21.3-11.9zm147.3 131.1l-23.5-35.6-9.5-14.5-9.6 14.5-23.4 35.6-81.3 123.2 21.2-9.7c7.5-3.4 14.6-7.4 21.2-11.9 14.8-10.1 28.1-24.5 38.4-41.8l19.5-33.1 14-23.7 13.9 23.7 19.5 33.1c10.3 17.3 23.6 31.7 38.4 41.8 6.6 4.5 13.8 8.5 21.3 11.9l21.1 9.7zm-23.4 27.8l-9.6-16.2-9.5 16.2 9.5 14.4z',
  fill: 'oklch(0.765 0.038 55.5)',
} as const

const springPath: Transition = { type: 'spring', stiffness: 260, damping: 32, bounce: 0 }
const springScale: Transition = { type: 'spring', stiffness: 180, damping: 28, bounce: 0.04 }
const springPress: Transition = { type: 'spring', stiffness: 480, damping: 34, bounce: 0 }

const linkClass =
  'flex items-center gap-3 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme-gold [@media(hover:hover)_and_(pointer:fine)]:transition-[filter] [@media(hover:hover)_and_(pointer:fine)]:duration-300 [@media(hover:hover)_and_(pointer:fine)]:ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:drop-shadow-[0_0_18px_oklch(0.72_0.07_56/0.42)]'

const svgClass = 'block h-9 w-auto shrink-0 origin-center sm:h-10'

// Shared path animation states (mask draw + stroke trace share rest/tap)
const pathRest = { pathLength: 0, transition: { pathLength: springPath } }
const pathTap = { pathLength: 1 }

const pathDraw = {
  rest: pathRest,
  hover: { pathLength: 1, transition: { pathLength: springPath } },
  tap: pathTap,
}

const pathTrace = {
  rest: pathRest,
  hover: { pathLength: 1, transition: { pathLength: { ...springPath, delay: 0.16 } } },
  tap: pathTap,
}

const crestVariants = {
  rest: { scale: 1, transition: springScale },
  hover: { scale: 1.03, transition: springScale },
  tap: { scale: 0.98, transition: springPress },
}

const fillFade = {
  rest: { opacity: 1, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } },
  hover: { opacity: 0, transition: { duration: 0.38, ease: [0.23, 1, 0.32, 1], delay: 0.45 } },
  tap: { opacity: 0 },
}

const mobileMenuToggleEvent = 'header:mobile-menu-toggle'

function useMobileMenuOpen() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const handleToggle = (event: Event) => {
        mobileMenuOpen = (event as CustomEvent<{ open: boolean }>).detail.open
        onStoreChange()
      }

      document.addEventListener(mobileMenuToggleEvent, handleToggle)
      return () => document.removeEventListener(mobileMenuToggleEvent, handleToggle)
    },
    () => mobileMenuOpen,
    () => false,
  )
}

let mobileMenuOpen = false

export default function LogoHomeLink({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const menuOpen = useMobileMenuOpen()
  const uid = useId().replace(/:/g, '')
  const gradId = `logo-grad-${uid}`
  const maskId = `logo-mask-${uid}`

  if (reduceMotion) {
    return (
      <a href="/" className={linkClass} aria-label="La Velada del Año VI - Inicio">
        <svg viewBox={crest.viewBox} className={svgClass} aria-hidden>
          <path fillRule="evenodd" d={crest.path} fill={crest.fill} />
        </svg>
        {children}
      </a>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.a
        href="/"
        className={linkClass}
        aria-label="La Velada del Año VI - Inicio"
        initial="rest"
        animate={menuOpen ? 'hover' : 'rest'}
        whileHover="hover"
        whileFocus="hover"
        whileTap="tap"
      >
        <m.svg viewBox={crest.viewBox} className={svgClass} aria-hidden variants={crestVariants}>
          <defs>
            <linearGradient id={gradId} x1="15%" y1="5%" x2="90%" y2="95%">
              <stop offset="0%" stopColor="oklch(0.88 0.055 56)" />
              <stop offset="42%" stopColor="oklch(0.7 0.09 56.5)" />
              <stop offset="100%" stopColor="oklch(0.38 0.04 56)" />
            </linearGradient>
            <mask id={maskId}>
              <m.path
                d={crest.path}
                fill="none"
                stroke="white"
                strokeWidth={18}
                strokeLinecap="butt"
                initial={false}
                variants={pathDraw}
              />
            </mask>
          </defs>
          <m.path
            fillRule="evenodd"
            d={crest.path}
            fill={crest.fill}
            initial={false}
            variants={fillFade}
          />
          <path
            fillRule="evenodd"
            d={crest.path}
            fill={`url(#${gradId})`}
            mask={`url(#${maskId})`}
          />
          <m.path
            d={crest.path}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={1.25}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={false}
            variants={pathTrace}
          />
        </m.svg>
        {children}
      </m.a>
    </LazyMotion>
  )
}
