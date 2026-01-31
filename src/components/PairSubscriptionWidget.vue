<template>
  <div class="tracking-widget">
    <!-- Tracking Toggle Button -->
    <button
      :class="['track-btn', { tracked: isTracked }]"
      @click="toggleTracking"
    >
      <span class="icon">{{ isTracked ? '⭐' : '☆' }}</span>
      <span class="text">
        {{ isTracked ? 'Tracking' : 'Track This Pair' }}
      </span>
    </button>

    <!-- Upcoming Games for this Pair -->
    <div v-if="isTracked && pairUpcomingGames.length > 0" class="upcoming-games">
      <h4>📅 Upcoming Games</h4>
      <div
        v-for="game in pairUpcomingGames"
        :key="`${game.round}-${game.courtNumber}`"
        class="game-card"
      >
        <div class="game-info">
          <div class="court-badge">Court {{ game.courtNumber }}</div>
          <div class="round">Round {{ game.round }}</div>
        </div>
        <div class="game-details">
          <div class="opponent">vs {{ game.opponentPairName }}</div>
          <div class="time">
            {{ formatGameTime(game.scheduledTime) }}
            <span class="countdown" :class="getCountdownClass(getMinutesUntil(game.scheduledTime))">
              {{ formatCountdown(getMinutesUntil(game.scheduledTime)) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrackedPairs } from '../composables/useTrackedPairs'

interface Props {
  tournamentId: string
  tournamentName: string
  pairId: number
  pairDisplayName: string
}

const props = defineProps<Props>()

const {
  isTracked: checkIsTracked,
  getGamesForPair,
  toggleTracking: toggle
} = useTrackedPairs()

const isTracked = computed(() => 
  checkIsTracked(props.tournamentId, props.pairId)
)

const pairUpcomingGames = computed(() =>
  getGamesForPair(props.tournamentId, props.pairId)
)

const toggleTracking = () => {
  toggle(
    props.tournamentId,
    props.tournamentName,
    props.pairId,
    props.pairDisplayName
  )
}

const formatGameTime = (scheduledTime?: Date) => {
  if (!scheduledTime) return 'Time TBD'
  const date = new Date(scheduledTime)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

const getMinutesUntil = (scheduledTime: Date): number => {
  const now = new Date()
  const diff = scheduledTime.getTime() - now.getTime()
  return Math.floor(diff / 60000)
}

const formatCountdown = (minutes: number) => {
  if (minutes < 0) return 'In progress'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const getCountdownClass = (minutes: number) => {
  if (minutes < 0) return 'past'
  if (minutes < 15) return 'urgent'
  if (minutes < 60) return 'soon'
  return 'future'
}
</script>

<style scoped>
.tracking-widget {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.track-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #6c757d;
  border-radius: 6px;
  background: white;
  color: #6c757d;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.track-btn:hover:not(:disabled) {
  background: #6c757d;
  color: white;
}

.track-btn.tracked {
  border-color: #28a745;
  color: #28a745;
}

.track-btn.tracked:hover:not(:disabled) {
  background: #28a745;
  color: white;
}

.track-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  font-size: 1.25rem;
}

.upcoming-games {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.upcoming-games h4 {
  margin: 0 0 0.75rem 0;
  color: #495057;
  font-size: 0.95rem;
}

.game-card {
  background: white;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  gap: 0.75rem;
  border-left: 4px solid #007bff;
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 80px;
}

.court-badge {
  background: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

.round {
  font-size: 0.8rem;
  color: #6c757d;
  text-align: center;
}

.game-details {
  flex: 1;
}

.opponent {
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.25rem;
}

.time {
  font-size: 0.85rem;
  color: #6c757d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.countdown {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
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
</style>
