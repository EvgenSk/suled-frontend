import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Tournament, Pair, Game } from '@/types'

// Mock the entire API client module
vi.mock('@/api/client', () => ({
  api: {
    getTournaments: vi.fn(),
    uploadTournament: vi.fn(),
    getPairs: vi.fn(),
    getGamesForPair: vi.fn()
  }
}))

import { api } from '@/api/client'

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTournaments', () => {
    it('should fetch tournaments successfully', async () => {
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          name: 'Summer Tournament',
          startDate: '2025-06-01',
          endDate: '2025-06-03',
          location: 'Beach Arena',
          division: 'Mixed',
          description: 'Summer beach volleyball',
          status: 'Active',
          createdDate: '2025-05-01',
          blobFileName: 'tournament.xlsx',
          pairs: [],
          rounds: []
        }
      ]

      vi.mocked(api.getTournaments).mockResolvedValue(mockTournaments)

      const result = await api.getTournaments()
      expect(result).toEqual(mockTournaments)
      expect(api.getTournaments).toHaveBeenCalledOnce()
    })

    it('should handle errors when fetching tournaments', async () => {
      const mockError = new Error('Network error')
      vi.mocked(api.getTournaments).mockRejectedValue(mockError)

      await expect(api.getTournaments()).rejects.toThrow('Network error')
    })
  })

  describe('getPairs', () => {
    it('should fetch pairs for a tournament', async () => {
      const mockPairs: Pair[] = [
        {
          id: 'pair1',
          displayName: 'Team A',
          player1: 'John Doe',
          player2: 'Jane Smith',
          gameCount: 5
        }
      ]

      vi.mocked(api.getPairs).mockResolvedValue(mockPairs)

      const result = await api.getPairs()
      expect(result).toEqual(mockPairs)
      expect(api.getPairs).toHaveBeenCalledOnce()
    })
  })

  describe('getGamesForPair', () => {
    it('should fetch games for a specific pair', async () => {
      const mockGames: Game[] = [
        {
          id: 'game1',
          round: 1,
          courtNumber: 3,
          status: 'Scheduled',
          scheduledTime: '2025-06-01T10:00:00',
          pair1: 'Team A',
          pair2: 'Team B',
          isOurGame: true
        }
      ]

      vi.mocked(api.getGamesForPair).mockResolvedValue(mockGames)

      const result = await api.getGamesForPair('pair-123')
      expect(result).toEqual(mockGames)
      expect(api.getGamesForPair).toHaveBeenCalledWith('pair-123')
    })
  })

  describe('uploadTournament', () => {
    it('should upload a file successfully', async () => {
      const mockFile = new File(['content'], 'tournament.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      vi.mocked(api.uploadTournament).mockResolvedValue({ message: 'Upload successful' })

      const result = await api.uploadTournament(mockFile)
      expect(result).toEqual({ message: 'Upload successful' })
      expect(api.uploadTournament).toHaveBeenCalledWith(mockFile)
    })

    it('should handle upload errors', async () => {
      const mockFile = new File(['content'], 'tournament.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const mockError = new Error('Upload failed')
      vi.mocked(api.uploadTournament).mockRejectedValue(mockError)

      await expect(api.uploadTournament(mockFile)).rejects.toThrow('Upload failed')
    })
  })
})
