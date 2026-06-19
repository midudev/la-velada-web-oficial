// Allows JSX/IntrinsicElements to be used without TS errors in .astro files
// Keeps editor from showing "JSX element implicitly has type 'any'" diagnostics

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}

export {}
