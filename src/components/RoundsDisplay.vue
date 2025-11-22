<template>
  <div v-if="rounds && rounds.length > 0" class="rounds-display">
    <h3>Tournament Schedule</h3>
    <div class="rounds-list">
      <div
        v-for="round in rounds"
        :key="round.roundNumber"
        class="round-card"
      >
        <div class="round-header">
          <span class="round-number">Round {{ round.roundNumber }}</span>
          <span class="game-count">{{ round.gameCount }} games</span>
        </div>
        <div class="round-times">
          <div class="time-info">
            <span class="time-label">Start:</span>
            <span class="time-value">{{ formatDateTime(round.startTime) }}</span>
          </div>
          <div class="time-info">
            <span class="time-label">End:</span>
            <span class="time-value">{{ formatDateTime(round.endTime) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormatting } from '@/composables/useFormatting'
import type { TournamentRound } from '@/types'

defineProps<{
  rounds?: TournamentRound[]
}>()

const { formatDateTime } = useFormatting()
</script>

<style scoped>
.rounds-display {
  margin: 2rem 0;
}

.rounds-display h3 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.rounds-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.round-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s;
}

.round-card:hover {
  border-color: #4299e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.round-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.round-number {
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
}

.game-count {
  font-size: 0.875rem;
  color: #718096;
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.round-times {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.time-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.time-label {
  color: #718096;
  font-weight: 500;
}

.time-value {
  color: #2d3748;
}
</style>
