<template>
  <div class="pair-selector">
    <h2>Select a Pair</h2>
    
    <div v-if="pairs.length === 0" class="empty-state">
      No pairs found for this tournament
    </div>

    <div v-else class="pairs-grid">
      <button
        v-for="pair in pairs"
        :key="pair.id"
        @click="$emit('select', pair.id)"
        :class="['pair-card', { active: selectedPairId === pair.id }]"
      >
        <div class="pair-name">{{ pair.displayName }}</div>
        <div class="players">
          <span>{{ pair.player1 }}</span>
          <span class="divider">&</span>
          <span>{{ pair.player2 }}</span>
        </div>
        <div class="game-count">
          🎮 {{ pair.gameCount }} {{ pair.gameCount === 1 ? 'game' : 'games' }}
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pair } from '@/types'

defineProps<{
  pairs: Pair[]
  selectedPairId: string | null
}>()

defineEmits<{
  select: [pairId: string]
}>()
</script>

<style scoped>
.pair-selector {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pair-selector h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
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

.game-count {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  color: #718096;
  font-size: 0.85rem;
  font-weight: 500;
}

.pair-card.active .game-count {
  color: #2c5282;
}
</style>
