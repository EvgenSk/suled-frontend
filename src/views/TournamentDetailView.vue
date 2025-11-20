<template>
  <div class="tournament-detail-view">
    <div class="breadcrumb">
      <router-link to="/">← Back to Tournaments</router-link>
    </div>

    <div v-if="isLoading" class="loading">
      Loading tournament details...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="content">
      <div class="pairs-section">
        <h2>Select a Pair</h2>
        
        <div v-if="pairs.length === 0" class="empty-state">
          No pairs found for this tournament
        </div>

        <div v-else class="pairs-grid">
          <button
            v-for="pair in pairs"
            :key="pair.id"
            @click="selectedPairId = pair.id"
            :class="['pair-card', { active: selectedPairId === pair.id }]"
          >
            <div class="pair-name">{{ pair.displayName }}</div>
            <div class="players">
              <span>{{ pair.player1 }}</span>
              <span class="divider">&</span>
              <span>{{ pair.player2 }}</span>
            </div>
          </button>
        </div>
      </div>

      <div v-if="selectedPairId" class="games-section">
        <GamesList
          :pair-id="selectedPairId"
          :pair-name="selectedPair?.displayName"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api/client'
import GamesList from '@/components/GamesList.vue'
import type { Pair } from '@/types'

const route = useRoute()
const tournamentId = route.params.id as string

const pairs = ref<Pair[]>([])
const selectedPairId = ref<string | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const selectedPair = computed(() =>
  pairs.value.find(p => p.id === selectedPairId.value)
)

const loadPairs = async () => {
  isLoading.value = true
  error.value = null

  try {
    pairs.value = await api.getPairs(tournamentId)
    // Auto-select first pair if available
    if (pairs.value.length > 0) {
      selectedPairId.value = pairs.value[0].id
    }
  } catch (err) {
    error.value = `Failed to load pairs: ${err instanceof Error ? err.message : 'Unknown error'}`
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadPairs()
})
</script>

<style scoped>
.tournament-detail-view {
  min-height: 100vh;
  background: #f7fafc;
  padding: 2rem;
}

.breadcrumb {
  max-width: 1200px;
  margin: 0 auto 2rem;
}

.breadcrumb a {
  color: #4299e1;
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.error-message {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background: #fed7d7;
  color: #742a2a;
  border-radius: 6px;
  text-align: center;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.pairs-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pairs-section h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.pairs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.pair-card {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.pair-card:hover {
  border-color: #4299e1;
  transform: translateY(-2px);
}

.pair-card.active {
  background: #ebf8ff;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.pair-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.players {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;
}

.players .divider {
  color: #a0aec0;
  font-weight: 600;
  margin: 0 0.25rem;
}

.games-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
