<template>
  <div v-if="pairId" ref="gamesContainer" class="pair-games-display">
    <GamesList
      :pair-id="pairId"
      :pair-name="pairName"
      :games="games"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GamesList from '@/components/GamesList.vue'
import type { Game } from '@/types'

defineProps<{
  pairId: string | null
  pairName?: string
  games: Game[]
}>()

const gamesContainer = ref<HTMLElement | null>(null)

defineExpose({
  gamesContainer
})
</script>

<style scoped>
.pair-games-display {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 3px solid #e2e8f0;
  scroll-margin-top: 2rem;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
