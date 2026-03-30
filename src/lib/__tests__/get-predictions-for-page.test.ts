import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPredictionsForPage } from '../get-predictions-for-page'

const mockPredictions = [
  { combat_id: 'combat-1', fighter_id: 'fighter-a', percentage: 60, votes: 60 },
  { combat_id: 'combat-1', fighter_id: 'fighter-b', percentage: 40, votes: 40 },
]

describe('getPredictionsForPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should fetch from API when no cache exists', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ predictions: mockPredictions })),
    )
    await getPredictionsForPage()
    expect(fetchSpy).toHaveBeenCalledWith('/api/predictions')
  })

  it('should store fetched predictions in localStorage', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ predictions: mockPredictions })),
    )
    await getPredictionsForPage()
    const cached = JSON.parse(localStorage.getItem('predictions-cache')!)
    expect(cached.predictions).toEqual(mockPredictions)
    expect(cached.timestamp).toBeDefined()
  })

  it('should use cached data when cache is fresh', async () => {
    localStorage.setItem(
      'predictions-cache',
      JSON.stringify({
        predictions: mockPredictions,
        timestamp: Date.now(),
      }),
    )
    const fetchSpy = vi.spyOn(global, 'fetch')
    await getPredictionsForPage()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('should fetch from API when cache is expired', async () => {
    localStorage.setItem(
      'predictions-cache',
      JSON.stringify({
        predictions: mockPredictions,
        timestamp: Date.now() - 20_000,
      }),
    )
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ predictions: mockPredictions })),
    )
    await getPredictionsForPage()
    expect(fetchSpy).toHaveBeenCalledWith('/api/predictions')
  })

  it('should dispatch update-prediction-bar events', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ predictions: mockPredictions })),
    )
    const received: CustomEvent[] = []
    const handler = (e: Event) => received.push(e as CustomEvent)
    document.addEventListener('update-prediction-bar', handler)
    await getPredictionsForPage()
    document.removeEventListener('update-prediction-bar', handler)
    expect(received).toHaveLength(2)
    expect(received[0].detail.id).toBe('combat-1')
    expect(received[0].detail.data.fighter_id).toBe('fighter-a')
  })

  it('should handle invalid cache JSON gracefully', async () => {
    localStorage.setItem('predictions-cache', 'not-valid-json')
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ predictions: mockPredictions })),
    )
    await getPredictionsForPage()
    expect(console.error).toHaveBeenCalledWith(
      'Error al parsear datos de caché:',
      expect.any(SyntaxError),
    )
  })

  it('should handle fetch errors gracefully', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))
    await getPredictionsForPage()
    expect(console.error).toHaveBeenCalledWith(
      'Error al obtener predicciones:',
      expect.any(Error),
    )
  })
})
