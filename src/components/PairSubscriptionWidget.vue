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
            <span class="countdown" :class="getCountdownClass(game.minutesUntilGame)">
              {{ formatCountdown(game.minutesUntilGame) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSubscriptions } from '../composables/useSubscriptions'
import type { NotificationPreferences } from '../types'

interface Props {
  tournamentId: string
  pairId: number
  pairDisplayName: string
  deviceId: string
  platform?: string
  pushToken?: string
}

const props = withDefaults(defineProps<Props>(), {
  platform: 'web',
  pushToken: ''
})

const {
  isSubscribed: checkSubscribed,
  getSubscription,
  upcomingGames,
  loading,
  subscribeToPair,
  unsubscribeFromPair,
  updatePreferences
} = useSubscriptions(props.deviceId)

const showPreferences = ref(false)
const localPreferences = ref<NotificationPreferences>({
  notifyBeforeMinutes: 15,
  notifyOnTournamentStart: true,
  notifyBeforeGame: true,
  notifyOnCourtReady: true
})

const isSubscribed = computed(() => 
  checkSubscribed(props.tournamentId, props.pairId)
)

const currentSubscription = computed(() => 
  getSubscription(props.tournamentId, props.pairId)
)

const pairUpcomingGames = computed(() =>
  upcomingGames.value.filter(
    g => g.tournamentId === props.tournamentId && g.pairId === props.pairId
  )
)

// Load preferences when subscription changes
watch(currentSubscription, (subscription) => {
  if (subscription) {
    localPreferences.value = { ...subscription.preferences }
  }
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
.subscribe-btn.subscribed {
  border-color: #28a745;
  color: #28a745;
}

.subscribe-btn.subscribed:hover:not(:disabled) {
  background: #28a745;
  color: white;
}

.subscribe-btn:disabled {
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
