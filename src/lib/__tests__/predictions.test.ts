import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/database', () => ({
  turso: {
    execute: vi.fn(),
    batch: vi.fn(),
  },
}))

vi.mock('@/consts/fighters', () => ({
  FIGHTERS: [
    { id: 'fighter-a', name: 'Fighter A' },
    { id: 'fighter-b', name: 'Fighter B' },
  ],
}))

vi.mock('@/consts/combats', () => ({
  COMBATS: [{ id: 'combat-1', number: 1, fighters: ['fighter-a', 'fighter-b'] }],
}))

import { turso } from '@/lib/database'

const mockedTurso = vi.mocked(turso)

// Re-import the module fresh for each test to reset in-memory cache
async function importPredictions() {
  vi.resetModules()
  // Re-mock after resetModules
  vi.doMock('@/lib/database', () => ({
    turso: mockedTurso,
  }))
  vi.doMock('@/consts/fighters', () => ({
    FIGHTERS: [
      { id: 'fighter-a', name: 'Fighter A' },
      { id: 'fighter-b', name: 'Fighter B' },
    ],
  }))
  vi.doMock('@/consts/combats', () => ({
    COMBATS: [{ id: 'combat-1', number: 1, fighters: ['fighter-a', 'fighter-b'] }],
  }))
  return await import('../predictions')
}

describe('getPredictionsByCombat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null when no predictions exist', async () => {
    const { getPredictionsByCombat } = await importPredictions()
    mockedTurso.execute.mockResolvedValue({ rows: [], columns: [], rowsAffected: 0, lastInsertRowid: undefined })

    const result = await getPredictionsByCombat('nonexistent-combat')
    expect(result).toBeNull()
  })

  it('should return predictions with calculated percentages', async () => {
    const { getPredictionsByCombat } = await importPredictions()
    mockedTurso.execute.mockResolvedValue({
      rows: [
        { id: '1', combat_id: 'combat-1', fighter_id: 'fighter-a', votes: 75, created_at: '', updated_at: '' },
        { id: '2', combat_id: 'combat-1', fighter_id: 'fighter-b', votes: 25, created_at: '', updated_at: '' },
      ],
      columns: [],
      rowsAffected: 0,
      lastInsertRowid: undefined,
    })

    const result = await getPredictionsByCombat('combat-1')

    expect(result).not.toBeNull()
    expect(result!.combat_id).toBe('combat-1')
    expect(result!.total_votes).toBe(100)
    expect(result!.predictions).toHaveLength(2)
    expect(result!.predictions[0].percentage).toBe(75)
    expect(result!.predictions[1].percentage).toBe(25)
  })

  it('should handle zero total votes without division error', async () => {
    const { getPredictionsByCombat } = await importPredictions()
    mockedTurso.execute.mockResolvedValue({
      rows: [
        { id: '1', combat_id: 'combat-1', fighter_id: 'fighter-a', votes: 0, created_at: '', updated_at: '' },
      ],
      columns: [],
      rowsAffected: 0,
      lastInsertRowid: undefined,
    })

    const result = await getPredictionsByCombat('combat-1')
    expect(result!.predictions[0].percentage).toBe(0)
  })
})

describe('getAllPredictions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should group predictions by combat', async () => {
    const { getAllPredictions } = await importPredictions()
    mockedTurso.execute.mockResolvedValue({
      rows: [
        { id: '1', combat_id: 'combat-1', fighter_id: 'fighter-a', votes: 60, created_at: '', updated_at: '' },
        { id: '2', combat_id: 'combat-1', fighter_id: 'fighter-b', votes: 40, created_at: '', updated_at: '' },
      ],
      columns: [],
      rowsAffected: 0,
      lastInsertRowid: undefined,
    })

    const result = await getAllPredictions()
    expect(result).toHaveLength(1)
    expect(result[0].combat_id).toBe('combat-1')
    expect(result[0].total_votes).toBe(100)
  })

  it('should return empty array when no predictions exist', async () => {
    const { getAllPredictions } = await importPredictions()
    mockedTurso.execute.mockResolvedValue({ rows: [], columns: [], rowsAffected: 0, lastInsertRowid: undefined })

    const result = await getAllPredictions()
    expect(result).toEqual([])
  })
})

describe('registerVote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should throw for an invalid combat id', async () => {
    const { registerVote } = await importPredictions()
    await expect(registerVote('invalid-combat', 'fighter-a', 'user-1')).rejects.toThrow(
      'Error al registrar voto',
    )
  })

  it('should register a first vote successfully', async () => {
    const { registerVote } = await importPredictions()
    // No existing vote
    mockedTurso.execute.mockResolvedValueOnce({
      rows: [],
      columns: [],
      rowsAffected: 0,
      lastInsertRowid: undefined,
    })

    // Batch succeeds
    mockedTurso.batch.mockResolvedValueOnce([])

    // New vote count
    mockedTurso.execute.mockResolvedValueOnce({
      rows: [{ votes: 1 }],
      columns: [],
      rowsAffected: 0,
      lastInsertRowid: undefined,
    })

    const result = await registerVote('combat-1', 'fighter-a', 'user-1')
    expect(result.combat_id).toBe('combat-1')
    expect(result.fighter_id).toBe('fighter-a')
    expect(result.votes).toBe(1)
  })

  it('should return current votes when user votes for same fighter again', async () => {
    const { registerVote } = await importPredictions()
    // Existing vote for same fighter
    mockedTurso.execute.mockResolvedValueOnce({
      rows: [{ fighter_id: 'fighter-a' }],
      columns: [],
      rowsAffected: 0,
      lastInsertRowid: undefined,
    })

    // Current prediction count
    mockedTurso.execute.mockResolvedValueOnce({
      rows: [{ votes: 5 }],
      columns: [],
      rowsAffected: 0,
      lastInsertRowid: undefined,
    })

    const result = await registerVote('combat-1', 'fighter-a', 'user-1')
    expect(result.votes).toBe(5)
    // Should NOT have called batch (no vote change needed)
    expect(mockedTurso.batch).not.toHaveBeenCalled()
  })
})

describe('getUserVotes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return user votes', async () => {
    const { getUserVotes } = await importPredictions()
    mockedTurso.execute.mockResolvedValue({
      rows: [
        { combat_id: 'combat-1', fighter_id: 'fighter-a', created_at: '2026-03-29' },
      ],
      columns: [],
      rowsAffected: 0,
      lastInsertRowid: undefined,
    })

    const result = await getUserVotes('user-1')
    expect(result).toHaveLength(1)
    expect(result[0].combat_id).toBe('combat-1')
    expect(result[0].fighter_id).toBe('fighter-a')
  })

  it('should return empty array for user with no votes', async () => {
    const { getUserVotes } = await importPredictions()
    mockedTurso.execute.mockResolvedValue({ rows: [], columns: [], rowsAffected: 0, lastInsertRowid: undefined })

    const result = await getUserVotes('user-no-votes')
    expect(result).toEqual([])
  })
})

describe('getCombatStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null for a combat with no predictions', async () => {
    const { getCombatStats } = await importPredictions()
    mockedTurso.execute.mockResolvedValue({ rows: [], columns: [], rowsAffected: 0, lastInsertRowid: undefined })

    const result = await getCombatStats('nonexistent-combat')
    expect(result).toBeNull()
  })
})
