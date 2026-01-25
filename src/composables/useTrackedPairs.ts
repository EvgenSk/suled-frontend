import { ref, computed, onMounted } from 'vue'
import { LocalStorageService } from '../services/localStorage'
import type { TrackedPair, UpcomingGame, NextGameInfo } from '../types'

/**
 * Composable for tracking pairs locally (no backend needed)
 */
export function useTrackedPairs() {
  const trackedPairs = ref<TrackedPair[]>([])
  const upcomingGames = ref<UpcomingGame[]>([])

  // Load tracked pairs from local storage
  const loadTrackedPairs = () => {
    trackedPairs.value = LocalStorageService.getTrackedPairs()
    upcomingGames.value = LocalStorageService.getUpcomingGames()
  }

  // Check if a pair is tracked
  const isTracked = (tournamentId: string, pairId: number): boolean => {
    return LocalStorageService.isTracked(tournamentId, pairId)
  }

  // Add a pair to tracking
  const trackPair = (
    tournamentId: string,
    tournamentName: string,
    pairId: number,
    pairDisplayName: string
  ): TrackedPair => {
    const tracked = LocalStorageService.addTrackedPair(
      tournamentId,
      tournamentName,
      pairId,
      pairDisplayName
    )
    loadTrackedPairs()
    return tracked
  }

  // Remove a tracked pair
  const untrackPair = (tournamentId: string, pairId: number): void => {
    LocalStorageService.removeTrackedPair(tournamentId, pairId)
    loadTrackedPairs()
  }

  // Toggle tracking for a pair
  const toggleTracking = (
    tournamentId: string,
    tournamentName: string,
    pairId: number,
    pairDisplayName: string
  ): boolean => {
    if (isTracked(tournamentId, pairId)) {
      untrackPair(tournamentId, pairId)
      return false
    } else {
      trackPair(tournamentId, tournamentName, pairId, pairDisplayName)
      return true
    }
  }

  // Get upcoming games sorted by time
  const sortedUpcomingGames = computed(() => {
    return [...upcomingGames.value].sort(
      (a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime()
    )
  })

  // Get next game (soonest)
  const nextGame = computed((): NextGameInfo | null => {
    return LocalStorageService.getNextGame()
  })

  // Get games for a specific pair
  const getGamesForPair = (tournamentId: string, pairId: number): UpcomingGame[] => {
    return upcomingGames.value.filter(
      g => g.tournamentId === tournamentId && g.pairId === pairId
    )
  }

  // Refresh upcoming games
  const refreshUpcomingGames = () => {
    upcomingGames.value = LocalStorageService.getUpcomingGames()
  }

  // Clear all tracked pairs
  const clearAllTracked = () => {
    LocalStorageService.clearAllTrackedPairs()
    loadTrackedPairs()
  }

  // Auto-load on mount
  onMounted(() => {
    loadTrackedPairs()
  })

  return {
    trackedPairs,
    upcomingGames,
    sortedUpcomingGames,
    nextGame,
    isTracked,
    trackPair,
    untrackPair,
    toggleTracking,
    getGamesForPair,
    loadTrackedPairs,
    refreshUpcomingGames,
    clearAllTracked
  }
}
