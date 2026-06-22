const url = process.env.VIDEO_SECTION_URL ?? 'http://127.0.0.1:4321/'
const response = await fetch(url)

if (!response.ok) {
  throw new Error(`Expected ${url} to respond 200, got ${response.status}`)
}

const html = await response.text()
const compactHtml = html.replace(/\s+/g, '')
const checks = [
  ['renders the videos section', html.includes('data-videos-section')],
  ['renders left carousel slot', html.includes('video-side-rail-left')],
  ['renders right carousel slot', html.includes('video-side-rail-right')],
  ['renders curved carousel panels', html.includes('video-carousel-belt')],
  ['renders full-stage carousel canvas', html.includes('video-carousel-canvas')],
  ['uses vertical carousel panel motion', html.includes('rotateX(-44deg)') && html.includes('rotateX(44deg)')],
  [
    'keeps carousel state inside the videos section',
    /<section[^>]*data-videos-section[\s\S]*data-video-carousel-json[\s\S]*<\/section>/.test(html),
  ],
  ['renders previous carousel panel', html.includes('data-carousel-panel="prev"')],
  ['renders next carousel panel', html.includes('data-carousel-panel="next"')],
  ['uses svg mark for locked carousel panel fallback', html.includes('--carousel-panel-mark: url(\'/logo.svg\')')],
  ['does not use blurry png mark as carousel panel fallback', !html.includes('--carousel-panel-poster: url(\'/logo-mark.png\')')],
  ['left slot points to previous item', html.includes('data-carousel-direction="prev"')],
  ['right slot points to next item', html.includes('data-carousel-direction="next"')],
  ['slot hover nudges both labels toward center', compactHtml.includes('--video-label-nudge:0.45rem')],
  ['keeps Cara a Cara visible', html.includes('CARA A CARA')],
  ['keeps Pesaje visible', html.includes('PESAJE')],
  ['uses the Ibai thumbnail as the resting image', html.includes('/videos/thumbnails/presentacion.webp')],
  ['uses generated smooth hover preview video', html.includes('/videos/presentacion/preview.mp4')],
  ['uses generated hover preview spritesheet', html.includes('/videos/presentacion/preview-sheet.webp')],
  ['enables animated hover preview frames', html.includes('data-preview-frame-count="96"')],
  ['does not render side slot glow carets', !html.includes('video-side-caret')],
  ['does not style side-slot pseudo gradients', !html.includes('video-side-rail::before')],
  ['does not glow slot text', !html.includes('text-shadow:0 0 28px') && !html.includes('text-shadow: 0 0 28px')],
  ['does not use the old decorative WebGL scanline shader', !html.includes('scan =') && !html.includes('wave =')],
  [
    'uses end-to-end left section mask',
    /\.videos-section[^,{]*::before/.test(compactHtml) &&
      compactHtml.includes(':has(.video-side-rail-left:hover)::before'),
  ],
  [
    'uses end-to-end right section mask',
    /\.videos-section[^,{]*::after/.test(compactHtml) &&
      compactHtml.includes(':has(.video-side-rail-right:hover)::after'),
  ],
  ['does not load YouTube iframe before click', !html.includes('<iframe')],
]

const failures = checks.filter(([, passed]) => !passed).map(([name]) => name)

if (failures.length > 0) {
  throw new Error(`Video section e2e failed:\n- ${failures.join('\n- ')}`)
}

console.log('Video section e2e passed')
