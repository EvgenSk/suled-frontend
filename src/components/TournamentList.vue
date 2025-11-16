<template>
  <div class="tournament-list">
    <div class="header">
      <h2>Tournaments</h2>
      <button @click="refreshTournaments" :disabled="isLoading" class="btn-refresh">
        {{ isLoading ? '⟳' : '↻' }} Refresh
      </button>
    </div>

    <div v-if="isLoading && tournaments.length === 0" class="loading">
      Loading tournaments...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="tournaments.length === 0" class="empty-state">
      <p>No tournaments found</p>
      <p class="hint">Upload a tournament Excel file to get started</p>
    </div>

    <div v-else class="tournament-grid">
      <div
        v-for="tournament in tournaments"
        :key="tournament.id"
        class="tournament-card"
        @click="selectTournament(tournament)"
      >
        <h3>{{ tournament.name }}</h3>
        
        <div class="tournament-info">
          <div class="info-row">
            <span class="label">📍</span>
            <span>{{ tournament.location || 'No location' }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">🏆</span>
            <span>{{ tournament.division || 'No division' }}</span>
          </div>
          
          <div class="info-row" v-if="tournament.startDate">
            <span class="label">📅</span>
            <span>{{ formatDate(tournament.startDate) }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">🎮</span>
            <span>{{ tournament.gameCount }} games</span>
          </div>
        </div>

        <div class="tournament-footer">
          <span :class="['status-badge', tournament.status.toLowerCase()]">
            {{ tournament.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/client'
import type { Tournament } from '@/types'

const router = useRouter()
const tournaments = ref<Tournament[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const loadTournaments = async () => {
  isLoading.value = true
  error.value = null

  try {
    tournaments.value = await api.getTournaments()
  } catch (err) {
    error.value = `Failed to load tournaments: ${err instanceof Error ? err.message : 'Unknown error'}`
  } finally {
    isLoading.value = false
  }
}

const refreshTournaments = () => {
  loadTournaments()
}

const selectTournament = (tournament: Tournament) => {
  router.push(`/tournament/${tournament.id}`)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

onMounted(() => {
  loadTournaments()
})
</script>

<style scoped>
.tournament-list {
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

.empty-state .hint {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #a0aec0;
}

.error-message {
  padding: 1rem;
  background: #fed7d7;
  color: #742a2a;
  border-radius: 6px;
  text-align: center;
}

.tournament-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.tournament-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tournament-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #4299e1;
}

.tournament-card h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.25rem;
}

.tournament-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;
}

.info-row .label {
  font-size: 1rem;
}

.tournament-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.completed {
  background: #bee3f8;
  color: #2c5282;
}

.status-badge.upcoming {
  background: #feebc8;
  color: #744210;
}
</style>
