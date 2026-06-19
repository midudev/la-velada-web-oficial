// Allows importing asset files like SVGs from Astro components and TypeScript.
// This prevents "Cannot find module" diagnostics for image and font imports.

declare module '*.svg' {
  import type { ComponentType, SVGProps } from 'react'
  const content: ComponentType<SVGProps<SVGSVGElement>>
  export default content
}

declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.webp'
declare module '*.avif'
declare module '*.gif'
