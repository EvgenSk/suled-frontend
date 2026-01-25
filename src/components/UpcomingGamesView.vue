<template>
  <div class="upcoming-games-view">
    <h2>🔔 My Upcoming Games</h2>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="sortedUpcomingGames.length === 0" class="empty">
      <p>📭 No upcoming games</p>
      <p class="hint">Track pairs to see your upcoming games here</p>
    </div>

    <div v-else class="games-list">
      <!-- Next Game Highlight -->
      <div v-if="nextGame" class="next-game-card">
        <div class="next-label">NEXT GAME</div>
        <h3>{{ nextGame.tournamentName }}</h3>
        <div class="game-main-info">
          <div class="court-large">Court {{ nextGame.courtNumber }}</div>
          <div class="game-details-large">
            <div class="pair-name">{{ nextGame.pairDisplayName }}</div>
            <div class="vs">vs</div>
            <div class="opponent">{{ nextGame.opponentPairName }}</div>
          </div>
        </div>
        <div class="game-timing">
          <div class="time">{{ formatGameTime(nextGame.scheduledTime) }}</div>
          <div :class="['countdown-large', getCountdownClass(nextGame.minutesUntilGame)]">
            {{ formatCountdown(nextGame.minutesUntilGame) }}
          </div>
        </div>
        <div class="round-info">Round {{ nextGame.round }}</div>
      </div>

      <!-- Other Upcoming Games -->
      <div v-if="otherGames.length > 0" class="other-games">
        <h3>Later Games</h3>
        <div
          v-for="game in otherGames"
          :key="`${game.tournamentId}-${game.pairId}-${game.round}`"
          class="game-card"
        >
          <div class="game-header">
            <span class="tournament-name">{{ game.tournamentName }}</span>
            <span class="court-badge">Court {{ game.courtNumber }}</span>
          </div>
          <div class="game-content">
            <div class="pairs">
              <div class="pair">{{ game.pairDisplayName }}</div>
              <div class="vs-small">vs</div>
              <div class="opponent">{{ game.opponentPairName }}</div>
            </div>
            <div class="game-meta">
              <span class="time">{{ formatGameTime(game.scheduledTime) }}</span>
              <span class="round">Round {{ game.round }}</span>
            </div>
            <div :class="['countdown', getCountdownClass(game.minutesUntilGame)]">
              {{ formatCountdown(game.minutesUntilGame) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tracked Pairs -->
    <div v-if="trackedPairs.length > 0" class="tracked-section">
      <h3>⭐ Tracked Pairs</h3>
      <div class="tracked-list">
        <div
          v-for="tracked in trackedPairs"
          :key="`${tracked.tournamentId}-${tracked.pairId}`"
          class="tracked-card"
        >
          <div class="tracked-info">
            <div class="tracked-pair">{{ tracked.pairDisplayName }}</div>
            <div class="tracked-meta">
              <span class="tournament-name">{{ tracked.tournamentName }}</span>
              <span class="added">
                {{ formatDate(tracked.addedDate) }}
              </span>
            </div>
          </div>
          <button
            @click="handleUntrack(tracked.tournamentId, tracked.pairId)"
            class="untrack-btn"
            title="Stop tracking"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrackedPairs } from '../composables/useTrackedPairs'

const {
  trackedPairs,
  sortedUpcomingGames,
  nextGame,
  untrackPair
} = useTrackedPairs()

const loading = computed(() => false)
const error = computed(() => null)

const otherGames = computed(() => sortedUpcomingGames.value.slice(1))

const handleUntrack = (tournamentId: string, pairId: number) => {
  if (confirm('Are you sure you want to stop tracking this pair?')) {
    untrackPair(tournamentId, pairId)
  }
}

const formatGameTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const formatCountdown = (minutes: number) => {
  if (minutes < 0) return 'Started'
  if (minutes < 60) return `in ${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `in ${hours}h ${mins}m`
}

const getCountdownClass = (minutes: number) => {
  if (minutes < 0) return 'past'
  if (minutes <= 5) return 'urgent'
  if (minutes <= 15) return 'soon'
  return 'future'
}
</script>

<style scoped>
.upcoming-games-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

h2 {
  margin: 0 0 1.5rem 0;
  color: #212529;
}

h3 {
  margin: 1.5rem 0 1rem 0;
  color: #495057;
  font-size: 1.1rem;
}

.loading, .error, .empty {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.error {
  color: #dc3545;
}

.empty .hint {
  font-size: 0.9rem;
  color: #adb5bd;
}

/* Next Game Card */
.next-game-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.next-label {
  background: rgba(255, 255, 255, 0.2);
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
}

.next-game-card h3 {
  margin: 0 0 1rem 0;
  color: white;
  font-size: 1.25rem;
}

.game-main-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1rem;
}

.court-large {
  background: rgba(255, 255, 255, 0.25);
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  min-width: 100px;
}

.game-details-large {
  flex: 1;
}

.pair-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.vs {
  font-size: 0.85rem;
  opacity: 0.8;
  margin: 0.25rem 0;
}

.opponent {
  font-size: 1.1rem;
}

.game-timing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.time {
  font-size: 1.25rem;
  font-weight: 600;
}

.countdown-large {
  font-size: 1.5rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 8px;
}

.round-info {
  text-align: center;
  margin-top: 0.75rem;
  opacity: 0.9;
}

/* Other Games */
.other-games {
  margin-top: 2rem;
}

.game-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.game-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f3f5;
}

.tournament-name {
  font-weight: 600;
  color: #495057;
}

.court-badge {
  background: #007bff;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.game-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pairs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pair {
  font-weight: 600;
  color: #212529;
}

.vs-small {
  color: #adb5bd;
  font-size: 0.85rem;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #6c757d;
}

.countdown {
  align-self: flex-start;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.countdown.urgent {
  background: #dc3545;
  color: white;
}

.countdown.soon {
  background: #ffc107;
  color: #212529;
}

.countdown.future {
  background: #e9ecef;
  color: #495057;
}

.countdown.past {
  background: #6c757d;
  color: white;
}

/* Tracked Pairs Section */
.tracked-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
}

.tracked-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.tracked-info {
  flex: 1;
}

.tracked-pair {
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.25rem;
}

.tracked-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #6c757d;
}

.tracked-meta .tournament-name {
  color: #495057;
}

.untrack-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #dc3545;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.untrack-btn:hover {
  opacity: 1;
}
</style>
