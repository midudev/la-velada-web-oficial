export type VideoStatus = 'available' | 'locked'
export type VideoSpan = 'big' | 'small'

export interface VideoPreview {
  durationSeconds: number
  frameCount: number
  columns: number
  rows: number
  fps: number
  width: number
  height: number
}

export interface VideoItem {
  id: string
  title: string
  cta: 'VER VÍDEO' | 'PRÓXIMAMENTE'
  status: VideoStatus
  span: VideoSpan
  duration?: string
  videoId?: string
  poster?: string
  previewVideo?: string
  previewSheet?: string
  preview?: VideoPreview
}

export const VIDEOS = [
  {
    id: 'presentacion',
    title: 'La Presentación',
    cta: 'VER VÍDEO',
    status: 'available',
    span: 'big',
    duration: '01:28',
    videoId: 'h-jWhM3ne5U',
    poster: '/videos/thumbnails/presentacion.webp',
    previewVideo: '/videos/presentacion/preview.mp4',
    previewSheet: '/videos/presentacion/preview-sheet.webp',
    preview: {
      durationSeconds: 12,
      frameCount: 96,
      columns: 12,
      rows: 8,
      fps: 8,
      width: 512,
      height: 288,
    },
  },
  {
    id: 'pesaje',
    title: 'El Pesaje',
    cta: 'PRÓXIMAMENTE',
    status: 'locked',
    span: 'small',
  },
  {
    id: 'cara-a-cara',
    title: 'Cara a Cara',
    cta: 'PRÓXIMAMENTE',
    status: 'locked',
    span: 'small',
  },
] as const satisfies readonly VideoItem[]
