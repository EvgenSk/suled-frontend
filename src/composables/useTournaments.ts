import { ref } from 'vue'
import { api } from '@/api/client'
import type { Tournament } from '@/types'

/**
 * Composable for tournament operations
 */
export function useTournaments() {
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
    return loadTournaments()
  }

  return {
    tournaments,
    isLoading,
    error,
    loadTournaments,
    refreshTournaments
  }
}

/**
 * Composable for single tournament operations
 */
export function useTournament(tournamentId: string) {
  const tournament = ref<Tournament | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadTournament = async () => {
    isLoading.value = true
    error.value = null

    try {
      tournament.value = await api.getTournament(tournamentId)
    } catch (err) {
      error.value = `Failed to load tournament: ${err instanceof Error ? err.message : 'Unknown error'}`
    } finally {
      isLoading.value = false
    }
  }

  return {
    tournament,
    isLoading,
    error,
    loadTournament
  }
}

/**
 * Composable for tournament upload
 */
export function useTournamentUpload() {
  const isUploading = ref(false)
  const uploadError = ref<string | null>(null)
  const uploadSuccess = ref(false)

  const uploadTournament = async (file: File) => {
    isUploading.value = true
    uploadError.value = null
    uploadSuccess.value = false

    try {
      await api.uploadTournament(file)
      uploadSuccess.value = true
    } catch (err) {
      uploadError.value = err instanceof Error ? err.message : 'Upload failed'
      throw err
    } finally {
      isUploading.value = false
    }
  }

  const resetUploadState = () => {
    uploadError.value = null
    uploadSuccess.value = false
  }

  return {
    isUploading,
    uploadError,
    uploadSuccess,
    uploadTournament,
    resetUploadState
  }
}
