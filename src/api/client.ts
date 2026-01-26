import axios, { AxiosInstance } from 'axios'
import type { Tournament, Pair, Game } from '@/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error)
        return Promise.reject(error)
      }
    )
  }

  // Tournament endpoints
  async getTournaments(): Promise<Tournament[]> {
    const response = await this.client.get<{ data: Tournament[], success: boolean }>('/tournaments')
    return response.data.data
  }

  async uploadTournament(file: File): Promise<{ message: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.client.post('/tournament/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  // Pair endpoints
  async getPairs(): Promise<Pair[]> {
    const response = await this.client.get<{ pairs: Pair[], totalPairs: number }>('/pairs')
    return response.data.pairs
  }

  // Game endpoints
  async getGamesForPair(pairId: string): Promise<Game[]> {
    const response = await this.client.get<{ pairId: string, games: Game[], totalGames: number }>(`/games/pair/${pairId}`)
    return response.data.games
  }

  // Get tournament by ID
  async getTournament(id: string): Promise<Tournament> {
    const response = await this.client.get<Tournament>(`/tournament/${id}`)
    return response.data
  }
}

// Export singleton instance
export const api = new ApiClient()
