<template>
  <div class="games-list">
    <div class="header">
      <h2>Games for {{ pairName || 'Loading...' }}</h2>
      <button @click="refreshGames" :disabled="isLoading" class="btn-refresh">
        {{ isLoading ? '⟳' : '↻' }} Refresh
      </button>
    </div>

    <div v-if="isLoading && games.length === 0" class="loading">
      Loading games...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="games.length === 0" class="empty-state">
      No games found for this pair
    </div>

    <div v-else class="games-table">
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Court</th>
            <th>Time</th>
            <th>Opponents</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="game in games"
            :key="game.id"
            :class="{ 'our-game': game.isOurGame }"
          >
            <td class="round">{{ game.round }}</td>
            <td class="court">{{ game.courtNumber }}</td>
            <td class="time">
              {{ game.scheduledTime ? formatTime(game.scheduledTime) : 'TBD' }}
            </td>
            <td class="opponents">
              <div class="pair-names">
                <span>{{ game.pair1 }}</span>
                <span class="vs">vs</span>
                <span>{{ game.pair2 }}</span>
              </div>
            </td>
            <td>
              <span :class="['status-badge', game.status.toLowerCase()]">
                {{ game.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api/client'
import type { Game } from '@/types'

interface Props {
  pairId: string
  pairName?: string
}

const props = defineProps<Props>()

const games = ref<Game[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const loadGames = async () => {
  isLoading.value = true
  error.value = null

  try {
    games.value = await api.getGamesForPair(props.pairId)
  } catch (err) {
    error.value = `Failed to load games: ${err instanceof Error ? err.message : 'Unknown error'}`
  } finally {
    isLoading.value = false
  }
}

const refreshGames = () => {
  loadGames()
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadGames()
})
</script>

<style scoped>
.games-list {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h2 {
  color: #2c3e50;
  margin: 0;
}

.btn-refresh {
  padding: 0.5rem 1rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  background: #3182ce;
}

.btn-refresh:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.error-message {
  padding: 1rem;
  background: #fed7d7;
  color: #742a2a;
  border-radius: 6px;
  text-align: center;
}

.games-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f7fafc;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
}

tr:last-child td {
  border-bottom: none;
}

tr.our-game {
  background: #fef5e7;
}

tr:hover {
  background: #f7fafc;
}

tr.our-game:hover {
  background: #fcefdb;
}

.round,
.court {
  font-weight: 600;
  color: #2d3748;
}

.pair-names {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.vs {
  color: #a0aec0;
  font-weight: 600;
  font-size: 0.8rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.status-badge.scheduled {
  background: #bee3f8;
  color: #2c5282;
}

.status-badge.completed {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.in-progress {
  background: #feebc8;
  color: #744210;
}

.status-badge.cancelled {
  background: #fed7d7;
  color: #742a2a;
}
</style>
