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
      <PairSelector
        :pairs="pairs"
        :selected-pair-id="selectedPairId"
        @select="handlePairSelect"
      />

      <PairGamesDisplay
        v-if="selectedPairId"
        ref="gamesDisplayRef"
        :pair-id="selectedPairId"
        :pair-name="selectedPair?.displayName"
        :games="gamesForSelectedPair"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useTournament } from '@/composables/useTournaments'
import { usePairs } from '@/composables/usePairs'
import PairSelector from '@/components/PairSelector.vue'
import PairGamesDisplay from '@/components/PairGamesDisplay.vue'

const route = useRoute()
const tournamentId = route.params.id as string

const { tournament, isLoading, error, loadTournament } = useTournament(tournamentId)
const { pairs, getGamesForPair, findPairById } = usePairs(tournament)

const selectedPairId = ref<string | null>(null)
const gamesDisplayRef = ref<InstanceType<typeof PairGamesDisplay> | null>(null)

const handlePairSelect = (pairId: string) => {
  selectedPairId.value = pairId
}

// Auto-scroll to games section when a pair is selected
watch(selectedPairId, async (newValue) => {
  if (newValue && gamesDisplayRef.value?.gamesContainer) {
    await nextTick()
    gamesDisplayRef.value.gamesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})

const selectedPair = computed(() =>
  selectedPairId.value ? findPairById(selectedPairId.value) : null
)

// Get games for the selected pair
const gamesForSelectedPair = computed(() => {
  if (!selectedPairId.value) {
    return []
  }
  return getGamesForPair(selectedPairId.value)
})

onMounted(async () => {
  await loadTournament()
  
  // Auto-select first pair if available
  if (pairs.value.length > 0) {
    selectedPairId.value = pairs.value[0].id
  }
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

.loading {
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
</style>
