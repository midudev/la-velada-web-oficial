import { $, $$ } from '@/lib/dom-selector'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const CAROUSEL_SWAP_MS = 280
const CAROUSEL_SETTLE_MS = 760
const DEFAULT_PREVIEW_DURATION_SECONDS = 12

type PreviewMode = 'poster' | 'video' | 'sprite'

type VideoTile = HTMLElement & {
  dataset: HTMLElement['dataset'] & {
    carouselMoving?: string
    unwrapping?: string
    videoStatus?: string
    videoId?: string
    videoTitle?: string
    videoReady?: string
    isPlaying?: string
    previewFrameCount?: string
    previewColumns?: string
    previewRows?: string
    previewFps?: string
    previewMode?: PreviewMode
    previewRequested?: string
    previewToken?: string
    previewSheet?: string
  }
}

interface CarouselVideo {
  id: string
  title: string
  cta: string
  status: 'available' | 'locked'
  videoId?: string
  duration?: string
  poster: string
  previewVideo?: string
  previewSheet: string
  previewSize: string
  frameCount: number
  columns: number
  rows: number
  fps: number
}

interface CarouselState {
  activeIndex: number
  videos: CarouselVideo[]
}

interface PreviewState {
  frameId: number
  startedAt: number
  lastFrame: number
  frameOffset: number
}

const states = new WeakMap<VideoTile, PreviewState>()
const failedPreviewSheets = new Set<string>()
const failedPreviewVideos = new Set<string>()
let previewRequestId = 0

export function initVideoPreview(root: Document | HTMLElement = document) {
  const section = $<HTMLElement>('[data-videos-section]', root)
  if (!section || section.dataset.videoInitialized === 'true') return

  section.dataset.videoInitialized = 'true'
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
  const carouselState = getCarouselState(section)
  const carouselTile = $<VideoTile>('[data-video-carousel]', section)
  const webgl = initWebglCarousel(section)

  if (carouselState && carouselTile) {
    initCarousel(section, carouselTile, carouselState, webgl)
    preloadPreviewSheets(carouselState.videos)
  }

  document.addEventListener(
    'astro:before-swap',
    () => {
      for (const tile of $$<VideoTile>('[data-video-tile]', section)) {
        stopPreview(tile)
      }
      webgl?.destroy()
    },
    { once: true },
  )

  for (const tile of $$<VideoTile>('[data-video-tile]', section)) {
    if (tile.dataset.videoStatus !== 'available') continue

    tile.addEventListener('pointerenter', () => startPreview(tile, reducedMotion.matches))
    tile.addEventListener('pointerleave', () => stopPreview(tile))
    tile.addEventListener('focusin', () => startPreview(tile, reducedMotion.matches))
    tile.addEventListener('focusout', () => stopPreview(tile))
    tile.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') startPreview(tile, reducedMotion.matches)
    })
  }

  for (const button of $$<HTMLButtonElement>('[data-video-play]', section)) {
    button.addEventListener('click', () => {
      const tile = button.closest('[data-video-tile]') as VideoTile | null
      if (!tile || tile.dataset.videoStatus !== 'available') return

      if (tile.dataset.videoReady === 'true') {
        togglePlayback(tile, button)
        return
      }

      stopPreview(tile)
      tile.dataset.unwrapping = 'true'
      setTimeout(() => {
        loadIframe(tile, button)
        tile.dataset.unwrapping = 'false'
      }, 420)
    })
  }
}

function getCarouselState(section: HTMLElement) {
  const data = $<HTMLScriptElement>('[data-video-carousel-json]', section)
  if (!data?.textContent) return null

  try {
    return JSON.parse(data.textContent) as CarouselState
  } catch {
    return null
  }
}

function initCarousel(
  section: HTMLElement,
  tile: VideoTile,
  state: CarouselState,
  webgl: ReturnType<typeof initWebglCarousel>,
) {
  if (state.videos.length < 2) return

  let activeIndex = wrapIndex(state.activeIndex, state.videos.length)
  let isAnimating = false
  updateCarousel(section, tile, state.videos, activeIndex, webgl, false)

  for (const nav of $$<HTMLButtonElement>('[data-carousel-direction]', section)) {
    nav.addEventListener('click', () => {
      if (isAnimating) return

      const direction = nav.dataset.carouselDirection === 'prev' ? -1 : 1
      const targetIndex = wrapIndex(activeIndex + direction, state.videos.length)
      isAnimating = true
      transitionCarousel(section, tile, state.videos, targetIndex, direction, webgl, () => {
        activeIndex = targetIndex
        isAnimating = false
      })
    })
  }
}

function transitionCarousel(
  section: HTMLElement,
  tile: VideoTile,
  videos: CarouselVideo[],
  targetIndex: number,
  direction: -1 | 1,
  webgl: ReturnType<typeof initWebglCarousel>,
  onDone: () => void,
) {
  const stage = $<HTMLElement>('[data-video-stage]', section)

  stopPreview(tile)
  tile.dataset.carouselMoving = 'true'
  if (stage) {
    stage.dataset.carouselMoving = 'true'
    stage.dataset.carouselDirection = direction === 1 ? 'next' : 'prev'
    stage.dataset.carouselPhase = 'exit'
  }
  webgl?.setActive(targetIndex)

  window.setTimeout(() => {
    updateCarousel(section, tile, videos, targetIndex, webgl, false)
    if (stage) stage.dataset.carouselPhase = 'enter'
  }, CAROUSEL_SWAP_MS)

  window.setTimeout(() => {
    tile.dataset.carouselMoving = 'false'
    if (stage) {
      stage.dataset.carouselMoving = 'false'
      stage.dataset.carouselDirection = ''
      stage.dataset.carouselPhase = ''
    }
    onDone()
  }, CAROUSEL_SETTLE_MS)
}

function updateCarousel(
  section: HTMLElement,
  tile: VideoTile,
  videos: CarouselVideo[],
  activeIndex: number,
  webgl: ReturnType<typeof initWebglCarousel>,
  animate: boolean,
) {
  const active = videos[activeIndex]
  const prev = videos[wrapIndex(activeIndex - 1, videos.length)]
  const next = videos[wrapIndex(activeIndex + 1, videos.length)]
  const prevLabel = $<HTMLElement>('[data-carousel-slot="prev"]', section)
  const nextLabel = $<HTMLElement>('[data-carousel-slot="next"]', section)
  const prevPanel = $<HTMLElement>('[data-carousel-panel="prev"]', section)
  const nextPanel = $<HTMLElement>('[data-carousel-panel="next"]', section)
  const stage = $<HTMLElement>('[data-video-stage]', section)
  const duration = $<HTMLElement>('[data-video-duration]', tile)
  const playButton = $<HTMLButtonElement>('[data-video-play]', tile)
  const frame = $<HTMLElement>('[data-video-frame]', tile)
  const previewVideo = $<HTMLVideoElement>('[data-video-preview-video]', tile)
  const lockedLayer = $<HTMLElement>('[data-video-locked-layer]', tile)

  stopPreview(tile)
  frame?.replaceChildren()
  tile.dataset.videoReady = 'false'
  tile.dataset.isPlaying = 'false'
  tile.dataset.videoStatus = active.status
  tile.dataset.videoId = active.videoId ?? ''
  tile.dataset.videoTitle = active.title
  tile.dataset.previewFrameCount = String(active.frameCount)
  tile.dataset.previewColumns = String(active.columns)
  tile.dataset.previewRows = String(active.rows)
  tile.dataset.previewFps = String(active.fps)
  tile.dataset.previewSheet = active.frameCount > 0 ? active.previewSheet : ''
  tile.style.setProperty('--video-poster', `url('${active.poster}')`)
  tile.style.setProperty('--video-preview-sheet', `url('${active.previewSheet}')`)
  tile.style.setProperty('--video-preview-size', active.previewSize)
  tile.style.setProperty('--video-preview-position', '0% 0%')
  setPreviewMode(tile, 'poster')
  updatePreviewVideo(previewVideo, active)
  tile.setAttribute('aria-label', `${active.status === 'available' ? 'Reproducir' : 'Próximamente'}: ${active.title}`)

  if (prevLabel) prevLabel.textContent = getNavLabel(prev)
  if (nextLabel) nextLabel.textContent = getNavLabel(next)
  updatePanel(prevPanel, prev)
  updatePanel(nextPanel, next)
  if (duration) duration.textContent = active.duration ?? ''
  if (playButton) {
    playButton.setAttribute(
      'aria-label',
      active.status === 'available' ? `Reproducir ${active.title}` : `${active.title}. Próximamente.`,
    )
  }
  lockedLayer?.setAttribute('aria-hidden', active.status === 'available' ? 'true' : 'false')

  webgl?.setActive(activeIndex)

  if (!animate) return

  tile.dataset.carouselMoving = 'true'
  if (stage) stage.dataset.carouselMoving = 'true'
}

function getNavLabel(video: CarouselVideo) {
  return video.id === 'pesaje' ? 'PESAJE' : video.title.toUpperCase()
}

function updatePanel(panel: HTMLElement | null, video: CarouselVideo) {
  if (!panel) return

  const title = $<HTMLElement>('[data-carousel-panel-title]', panel)
  const cta = $<HTMLElement>('[data-carousel-panel-cta]', panel)

  panel.dataset.panelStatus = video.status
  panel.style.setProperty(
    '--carousel-panel-poster',
    video.status === 'locked' ? 'none' : `url('${video.poster}')`,
  )
  if (title) title.textContent = getNavLabel(video)
  if (cta) cta.textContent = video.cta
}

function wrapIndex(index: number, length: number) {
  return (index + length) % length
}

function startPreview(tile: VideoTile, reducedMotion: boolean) {
  if (
    reducedMotion ||
    tile.dataset.videoReady === 'true' ||
    tile.dataset.unwrapping === 'true' ||
    states.has(tile)
  ) return

  const token = String(++previewRequestId)
  tile.dataset.previewRequested = 'true'
  tile.dataset.previewToken = token
  const video = $<HTMLVideoElement>('[data-video-preview-video]', tile)
  if (video?.src && !failedPreviewVideos.has(video.currentSrc || video.src)) {
    seekPreviewVideo(video)
    void video.play().then(
      () => {
        if (isCurrentPreviewRequest(tile, token)) {
          setPreviewMode(tile, 'video')
        }
      },
      (error) => {
        if (!isCurrentPreviewRequest(tile, token)) return

        if (!isInterruptedPlayback(error)) {
          failedPreviewVideos.add(video.currentSrc || video.src)
        }
        startSpritePreview(tile, token)
      },
    )
    return
  }

  startSpritePreview(tile, token)
}

function startSpritePreview(tile: VideoTile, token = tile.dataset.previewToken) {
  if (states.has(tile)) return
  if (!token || !isCurrentPreviewRequest(tile, token)) return

  const previewSheet = tile.dataset.previewSheet
  if (!previewSheet || failedPreviewSheets.has(previewSheet)) return

  const frameCount = toNumber(tile.dataset.previewFrameCount)
  const fps = toNumber(tile.dataset.previewFps)
  if (frameCount <= 1 || fps <= 0) return

  setPreviewMode(tile, 'sprite')

  const state = {
    frameId: 0,
    startedAt: performance.now(),
    lastFrame: -1,
    frameOffset: getRandomFrameOffset(frameCount),
  }

  const tick = (now: number) => {
    const elapsed = now - state.startedAt
    const frame = (state.frameOffset + Math.floor((elapsed / 1000) * fps)) % frameCount
    if (frame !== state.lastFrame) {
      setFrame(tile, frame)
      state.lastFrame = frame
    }
    state.frameId = requestAnimationFrame(tick)
  }

  states.set(tile, state)
  state.frameId = requestAnimationFrame(tick)
}

function stopPreview(tile: VideoTile) {
  delete tile.dataset.previewRequested
  delete tile.dataset.previewToken
  setPreviewMode(tile, 'poster')

  const video = $<HTMLVideoElement>('[data-video-preview-video]', tile)
  if (video) {
    video.pause()
    video.currentTime = 0
  }

  const state = states.get(tile)
  if (!state) {
    tile.style.setProperty('--video-preview-position', '0% 0%')
    return
  }

  cancelAnimationFrame(state.frameId)
  states.delete(tile)
  tile.style.setProperty('--video-preview-position', '0% 0%')
}

function setPreviewMode(tile: VideoTile, mode: PreviewMode) {
  tile.dataset.previewMode = mode
}

function isCurrentPreviewRequest(tile: VideoTile, token: string) {
  return tile.dataset.previewRequested === 'true' && tile.dataset.previewToken === token
}

function setFrame(tile: VideoTile, frame: number) {
  const columns = toNumber(tile.dataset.previewColumns)
  const rows = toNumber(tile.dataset.previewRows)
  if (columns <= 1 || rows <= 1) return

  const column = frame % columns
  const row = Math.floor(frame / columns)
  const x = (column / (columns - 1)) * 100
  const y = (row / (rows - 1)) * 100

  tile.style.setProperty('--video-preview-position', `${x}% ${y}%`)
}

function preloadPreviewSheets(videos: CarouselVideo[]) {
  const sheets = new Set(
    videos
      .filter((video) => video.status === 'available' && video.frameCount > 1)
      .map((video) => video.previewSheet),
  )

  const load = () => {
    for (const sheet of sheets) {
      const image = new Image()
      image.decoding = 'async'
      image.onerror = () => failedPreviewSheets.add(sheet)
      image.src = sheet
      void image.decode?.().catch(() => failedPreviewSheets.add(sheet))
    }
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(load, { timeout: 1200 })
    return
  }

  window.setTimeout(load, 250)
}

function updatePreviewVideo(video: HTMLVideoElement | null, active: CarouselVideo) {
  if (!video) return

  video.pause()
  video.currentTime = 0
  video.poster = active.poster

  if (active.status !== 'available' || !active.previewVideo) {
    video.removeAttribute('src')
    video.load()
    return
  }

  video.onerror = () => failedPreviewVideos.add(video.currentSrc || video.src)

  if (!video.src.endsWith(active.previewVideo)) {
    video.src = active.previewVideo
    video.load()
  }
}

function seekPreviewVideo(video: HTMLVideoElement) {
  const duration = Number.isFinite(video.duration) && video.duration > 1
    ? video.duration
    : DEFAULT_PREVIEW_DURATION_SECONDS

  try {
    video.currentTime = Math.random() * Math.max(0, duration - 1)
  } catch {
    // Some browsers reject seeks before metadata is available; play from poster frame.
  }
}

function getRandomFrameOffset(frameCount: number) {
  return Math.floor(Math.random() * frameCount)
}

function isInterruptedPlayback(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

function loadIframe(tile: VideoTile, button: HTMLButtonElement) {
  const videoId = tile.dataset.videoId
  const mount = $<HTMLElement>('[data-video-frame]', tile)
  if (!videoId || !mount) return

  stopPreview(tile)

  const iframe = document.createElement('iframe')
  const params = new URLSearchParams({
    autoplay: '1',
    playsinline: '1',
    rel: '0',
    enablejsapi: '1',
    modestbranding: '1',
  })

  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`
  iframe.title = tile.dataset.videoTitle ?? 'La Presentación'
  iframe.allow =
    'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen'
  iframe.setAttribute('allowfullscreen', '')
  iframe.className = 'absolute inset-0 h-full w-full border-0'

  mount.replaceChildren(iframe)
  tile.dataset.videoReady = 'true'
  tile.dataset.isPlaying = 'true'
  setButton(button, true, tile.dataset.videoTitle)
}

function initWebglCarousel(tile: HTMLElement) {
  const canvas = $<HTMLCanvasElement>('[data-video-webgl]', tile)
  const gl = canvas?.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: true,
  })
  if (!canvas || !gl) return null

  const vertex = `
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      uv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `
  const fragment = `
    precision mediump float;
    varying vec2 uv;
    uniform float time;
    uniform float active;
    uniform vec2 resolution;

    void main() {
      vec2 p = uv - 0.5;
      float sweep = p.y + sin(p.x * 2.8 + active * 1.5) * 0.18;
      float ribbon = smoothstep(0.24, 0.0, abs(sweep));
      float edge = smoothstep(0.62, 0.12, abs(p.y));
      float center = smoothstep(0.72, 0.1, abs(p.x));
      float vignette = smoothstep(0.9, 0.16, length(p));
      float pulse = 0.82 + sin(time * 2.8 + active) * 0.18;
      vec3 gold = vec3(0.76, 0.58, 0.28);
      float alpha = ribbon * edge * center * vignette * pulse * 0.24;
      gl_FragColor = vec4(gold, alpha);
    }
  `

  const program = createProgram(gl, vertex, fragment)
  if (!program) return null

  const buffer = gl.createBuffer()
  const position = gl.getAttribLocation(program, 'position')
  const time = gl.getUniformLocation(program, 'time')
  const active = gl.getUniformLocation(program, 'active')
  const resolution = gl.getUniformLocation(program, 'resolution')
  let activeValue = 0
  let raf = 0

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  )

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    const scale = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.floor(rect.width * scale))
    const height = Math.max(1, Math.floor(rect.height * scale))
    if (canvas.width === width && canvas.height === height) return
    canvas.width = width
    canvas.height = height
    gl.viewport(0, 0, width, height)
  }

  const render = (now: number) => {
    resize()
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    gl.uniform1f(time, now * 0.001)
    gl.uniform1f(active, activeValue)
    gl.uniform2f(resolution, canvas.width, canvas.height)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    raf = requestAnimationFrame(render)
  }

  raf = requestAnimationFrame(render)

  return {
    setActive(index: number) {
      activeValue = index
    },
    destroy() {
      cancelAnimationFrame(raf)
    },
  }
}

function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  if (!vertex || !fragment) return null

  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program

  gl.deleteProgram(program)
  return null
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader

  gl.deleteShader(shader)
  return null
}

function togglePlayback(tile: VideoTile, button: HTMLButtonElement) {
  const iframe = $<HTMLIFrameElement>('iframe', tile)
  const shouldPlay = tile.dataset.isPlaying !== 'true'
  if (!iframe?.contentWindow) return

  iframe.contentWindow.postMessage(
    JSON.stringify({
      event: 'command',
      func: shouldPlay ? 'playVideo' : 'pauseVideo',
      args: [],
    }),
    'https://www.youtube-nocookie.com',
  )

  tile.dataset.isPlaying = String(shouldPlay)
  setButton(button, shouldPlay, tile.dataset.videoTitle)
}

function setButton(button: HTMLButtonElement, isPlaying: boolean, title = 'La Presentación') {
  button.setAttribute(
    'aria-label',
    `${isPlaying ? 'Pausar' : 'Reproducir'} ${title}`,
  )
}

function toNumber(value: string | undefined) {
  return Number.parseInt(value ?? '0', 10)
}
