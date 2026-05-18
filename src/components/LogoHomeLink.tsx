import { useId, useSyncExternalStore, type ReactNode } from 'react'
import { motion, useReducedMotion, type Transition, type Variants } from 'motion/react'
import { HEADER_MOBILE_MENU_OPEN_ATTR, HEADER_SELECTOR } from '@/consts/header-dom'
import { LOGO_CREST, LOGO_HOME_ARIA } from '@/consts/logo-crest'
import { $ } from '@/lib/dom-selector'

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const EASE_FILM = [0.77, 0, 0.175, 1] as const
/** Draw along the path — slow ease-in so the trace reads as deliberate, not a snap. */
const EASE_DRAW = [0.42, 0, 0.18, 1] as const

const LINK_CLASS =
  'flex items-center gap-3 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-theme-gold [@media(hover:hover)_and_(pointer:fine)]:transition-[filter] [@media(hover:hover)_and_(pointer:fine)]:duration-500 [@media(hover:hover)_and_(pointer:fine)]:hover:drop-shadow-[0_0_18px_oklch(0.72_0.07_56/0.42)]'

const SVG_CLASS = 'block h-9 w-auto shrink-0 origin-center sm:h-10'

function useMobileMenuOpen() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const header = $(HEADER_SELECTOR)
      if (!header) return () => {}
      const observer = new MutationObserver(onStoreChange)
      observer.observe(header, {
        attributes: true,
        attributeFilter: [HEADER_MOBILE_MENU_OPEN_ATTR],
      })
      return () => observer.disconnect()
    },
    () => $(HEADER_SELECTOR)?.getAttribute(HEADER_MOBILE_MENU_OPEN_ATTR) === 'true',
    () => false,
  )
}

type StrokeDrawOpts = {
  enterSec: number
  enterDelay?: number
  exitSec: number
  exitDelay?: number
}

/** Mask/trace use tweened pathLength (not spring) so enter/exit stay readable and in sync on leave. */
function strokeDraw({
  enterSec,
  enterDelay = 0,
  exitSec,
  exitDelay = 0,
}: StrokeDrawOpts): Variants {
  return {
    rest: {
      pathLength: 0,
      opacity: 0,
      transition: {
        pathLength: { duration: exitSec, ease: EASE_FILM, delay: exitDelay },
        opacity: { duration: exitSec * 0.9, ease: EASE_OUT, delay: exitDelay },
      },
    },
    hover: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: enterSec, ease: EASE_DRAW, delay: enterDelay },
        opacity: {
          duration: Math.min(enterSec * 0.55, 0.5),
          ease: EASE_OUT,
          delay: enterDelay + 0.06,
        },
      },
    },
    tap: { pathLength: 1, opacity: 1 },
  }
}

const CREST_EXIT: Transition = { duration: 0.45, ease: EASE_FILM }
const CREST_SPRING: Transition = {
  type: 'spring',
  stiffness: 165,
  damping: 20,
  bounce: 0.08,
}

const crestMotion: Variants = {
  rest: { scale: 1, transition: CREST_EXIT },
  hover: { scale: 1.05, transition: CREST_SPRING },
  tap: { scale: 1.02, transition: { duration: 0.14, ease: EASE_OUT } },
}

const flatFill: Variants = {
  rest: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } },
  hover: {
    opacity: 0,
    transition: { duration: 0.48, ease: EASE_FILM, delay: 0.18 },
  },
  tap: { opacity: 0 },
}

/** Enter: mask draws, then trace. Exit: same duration, no stagger — collapses together. */
const maskDraw = strokeDraw({ enterSec: 0.82, exitSec: 0.5 })
const traceDraw = strokeDraw({ enterSec: 0.72, enterDelay: 0.22, exitSec: 0.5 })

/** Parent carrier so `whileHover` drives child `crestMotion` / stroke variants. */
const linkVariants: Variants = { rest: {}, hover: {}, tap: {} }

type CrestProps = { gradId: string; maskId: string }

function Crest({ gradId, maskId }: CrestProps) {
  const { viewBox, path, restFill } = LOGO_CREST

  return (
    <motion.svg viewBox={viewBox} className={SVG_CLASS} aria-hidden variants={crestMotion}>
      <defs>
        <linearGradient id={gradId} x1="15%" y1="5%" x2="90%" y2="95%">
          <stop offset="0%" stopColor="oklch(0.88 0.055 56)" />
          <stop offset="42%" stopColor="oklch(0.7 0.09 56.5)" />
          <stop offset="100%" stopColor="oklch(0.38 0.04 56)" />
        </linearGradient>
        <mask id={maskId}>
          <motion.path
            d={path}
            fill="none"
            stroke="white"
            strokeWidth={22}
            strokeLinecap="butt"
            strokeLinejoin="round"
            initial={false}
            variants={maskDraw}
          />
        </mask>
      </defs>
      <motion.path
        fillRule="evenodd"
        d={path}
        fill={restFill}
        initial={false}
        variants={flatFill}
      />
      <path fillRule="evenodd" d={path} fill={`url(#${gradId})`} mask={`url(#${maskId})`} />
      <motion.path
        d={path}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={false}
        variants={traceDraw}
      />
    </motion.svg>
  )
}

export default function LogoHomeLink({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const menuOpen = useMobileMenuOpen()
  const uid = useId().replace(/:/g, '')
  const gradId = `logo-grad-${uid}`
  const maskId = `logo-mask-${uid}`

  if (reduceMotion) {
    return (
      <a href="/" className={LINK_CLASS} aria-label={LOGO_HOME_ARIA}>
        <svg viewBox={LOGO_CREST.viewBox} className={SVG_CLASS} aria-hidden>
          <path fillRule="evenodd" d={LOGO_CREST.path} fill={LOGO_CREST.restFill} />
        </svg>
        {children}
      </a>
    )
  }

  return (
    <motion.a
      href="/"
      className={LINK_CLASS}
      aria-label={LOGO_HOME_ARIA}
      variants={linkVariants}
      initial="rest"
      animate={menuOpen ? 'hover' : 'rest'}
      whileHover="hover"
      whileFocus="hover"
      whileTap="tap"
    >
      <Crest gradId={gradId} maskId={maskId} />
      {children}
    </motion.a>
  )
}
