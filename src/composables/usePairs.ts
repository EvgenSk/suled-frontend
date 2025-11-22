import { computed, type Ref } from 'vue'
import type { Tournament, Pair } from '@/types'

/**
 * Composable for extracting and managing pairs from tournament data
 */
export function usePairs(tournament: Ref<Tournament | null>) {
  /**
   * Extract pairs from tournament (pair-centered structure)
   */
  const pairs = computed<Pair[]>(() => {
    if (!tournament.value?.pairs || tournament.value.pairs.length === 0) {
      return []
    }

    return tournament.value.pairs.map(p => ({
      id: p.id,
      displayName: p.displayName,
      player1: p.pairInfo.player1.fullName,
      player2: p.pairInfo.player2.fullName,
      gameCount: p.gameCount
    }))
  })

  /**
   * Get games for a specific pair
   */
  const getGamesForPair = (pairId: string) => {
    if (!tournament.value) {
      return []
    }

    const selectedPairData = tournament.value.pairs.find(p => p.id === pairId)
    if (!selectedPairData) {
      return []
    }

    // Convert PairGame to Game format
    return selectedPairData.games.map(game => ({
      id: game.id,
      round: game.round,
      courtNumber: game.courtNumber,
      status: getStatusString(game.status),
      scheduledTime: game.scheduledTime,
      pair1: selectedPairData.displayName,
      pair2: game.opponentPair.displayName,
      isOurGame: true
    }))
  }

  /**
   * Find a pair by ID
   */
  const findPairById = (pairId: string) => {
    return pairs.value.find(p => p.id === pairId)
  }

  return {
    pairs,
    getGamesForPair,
    findPairById
  }
}

/**
 * Helper to convert GameStatus enum to string
 */
function getStatusString(status: number): string {
  const statusMap: Record<number, string> = {
    0: 'Scheduled',
    1: 'InProgress',
    2: 'Completed',
    3: 'Cancelled'
  }
  return statusMap[status] || 'Scheduled'
}
