import type { TrackedPair, Tournament, UpcomingGame, NextGameInfo } from '../types'

const STORAGE_KEY = 'suled_tracked_pairs'
const TOURNAMENTS_CACHE_KEY = 'suled_tournaments_cache'

/**
 * Local storage service for tracking pairs and tournaments
 * No backend needed - all data stored locally
 */
export class LocalStorageService {
  /**
   * Get all tracked pairs from local storage
   */
  static getTrackedPairs(): TrackedPair[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading tracked pairs:', error)
      return []
    }
  }

  /**
   * Add a pair to tracking
   */
  static addTrackedPair(
    tournamentId: string,
    tournamentName: string,
    pairId: number,
    pairDisplayName: string
  ): TrackedPair {
    const pairs = this.getTrackedPairs()
    
    // Check if already tracked
    const existing = pairs.find(
      p => p.tournamentId === tournamentId && p.pairId === pairId
    )
    
    if (existing) {
      return existing
    }

    const newPair: TrackedPair = {
      tournamentId,
      tournamentName,
      pairId,
      pairDisplayName,
      addedDate: new Date().toISOString()
    }

    pairs.push(newPair)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs))
    
    return newPair
  }

  /**
   * Remove a tracked pair
   */
  static removeTrackedPair(tournamentId: string, pairId: number): void {
    const pairs = this.getTrackedPairs()
    const filtered = pairs.filter(
      p => !(p.tournamentId === tournamentId && p.pairId === pairId)
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }

  /**
   * Check if a pair is tracked
   */
  static isTracked(tournamentId: string, pairId: number): boolean {
    const pairs = this.getTrackedPairs()
    return pairs.some(p => p.tournamentId === tournamentId && p.pairId === pairId)
  }

  /**
   * Clear all tracked pairs
   */
  static clearAllTrackedPairs(): void {
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * Cache tournament data locally
   */
  static cacheTournament(tournament: Tournament): void {
    try {
      const cache = this.getTournamentsCache()
      cache[tournament.id] = {
        tournament,
        cachedAt: new Date().toISOString()
      }
      localStorage.setItem(TOURNAMENTS_CACHE_KEY, JSON.stringify(cache))
    } catch (error) {
      console.error('Error caching tournament:', error)
    }
  }

  /**
   * Get cached tournament
   */
  static getCachedTournament(tournamentId: string): Tournament | null {
    try {
      const cache = this.getTournamentsCache()
      const cached = cache[tournamentId]
      
      if (!cached) return null

      // Cache valid for 24 hours
      const cachedDate = new Date(cached.cachedAt)
      const now = new Date()
      const hoursSinceCached = (now.getTime() - cachedDate.getTime()) / (1000 * 60 * 60)
      
      if (hoursSinceCached > 24) {
        // Cache expired
        delete cache[tournamentId]
        localStorage.setItem(TOURNAMENTS_CACHE_KEY, JSON.stringify(cache))
        return null
      }

      return cached.tournament
    } catch (error) {
      console.error('Error reading cached tournament:', error)
      return null
    }
  }

  /**
   * Get all cached tournaments
   */
  private static getTournamentsCache(): Record<string, { tournament: Tournament; cachedAt: string }> {
    try {
      const stored = localStorage.getItem(TOURNAMENTS_CACHE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Error reading tournaments cache:', error)
      return {}
    }
  }

  /**
   * Get all upcoming games for tracked pairs
   */
  static getUpcomingGames(): UpcomingGame[] {
    const trackedPairs = this.getTrackedPairs()
    const upcomingGames: UpcomingGame[] = []
    const now = new Date()

    for (const tracked of trackedPairs) {
      const tournament = this.getCachedTournament(tracked.tournamentId)
      if (!tournament || !tournament.startDate) continue

      const pair = tournament.pairs.find(p => p.pairInfo.id === tracked.pairId.toString())
      if (!pair) continue

      // Get games for this pair
      for (const game of pair.games) {
        const round = tournament.rounds.find(r => r.roundNumber === game.round)
        if (!round) continue

        // Calculate game time
        const tournamentDate = new Date(tournament.startDate)
        const [hours, minutes, seconds] = round.startTime.split(':').map(Number)
        const gameTime = new Date(tournamentDate)
        gameTime.setHours(hours, minutes, seconds || 0)

        // Only include upcoming games (within next 24 hours)
        const hoursUntilGame = (gameTime.getTime() - now.getTime()) / (1000 * 60 * 60)
        if (hoursUntilGame >= 0 && hoursUntilGame <= 24) {
          upcomingGames.push({
            tournamentId: tournament.id,
            tournamentName: tournament.name,
            pairId: tracked.pairId,
            pairDisplayName: tracked.pairDisplayName,
            round: game.round,
            courtNumber: game.courtNumber,
            opponentPairName: game.opponentPair.displayName,
            scheduledTime: gameTime,
            status: game.status !== undefined && game.status !== null ? game.status.toString() : 'Unknown'
          })
        }
      }
    }

    // Sort by scheduled time
    return upcomingGames.sort((a, b) => 
      a.scheduledTime.getTime() - b.scheduledTime.getTime()
    )
  }

  /**
   * Get the next game (soonest upcoming game)
   */
  static getNextGame(): NextGameInfo | null {
    const upcomingGames = this.getUpcomingGames()
    if (upcomingGames.length === 0) return null

    const nextGame = upcomingGames[0]
    const now = new Date()
    const minutesUntilStart = Math.round(
      (nextGame.scheduledTime.getTime() - now.getTime()) / (1000 * 60)
    )

    return {
      tournamentName: nextGame.tournamentName,
      pairDisplayName: nextGame.pairDisplayName,
      round: nextGame.round,
      courtNumber: nextGame.courtNumber,
      opponentPairName: nextGame.opponentPairName,
      scheduledTime: nextGame.scheduledTime,
      minutesUntilStart
    }
  }

  /**
   * Clear old cached tournaments
   */
  static clearOldCache(): void {
    try {
      const cache = this.getTournamentsCache()
      const now = new Date()
      let hasChanges = false

      for (const [tournamentId, cached] of Object.entries(cache)) {
        const cachedDate = new Date(cached.cachedAt)
        const hoursSinceCached = (now.getTime() - cachedDate.getTime()) / (1000 * 60 * 60)
        
        if (hoursSinceCached > 24) {
          delete cache[tournamentId]
          hasChanges = true
        }
      }

      if (hasChanges) {
        localStorage.setItem(TOURNAMENTS_CACHE_KEY, JSON.stringify(cache))
      }
    } catch (error) {
      console.error('Error clearing old cache:', error)
    }
  }
}
