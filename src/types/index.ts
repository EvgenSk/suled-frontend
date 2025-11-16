/**
 * TypeScript types matching backend C# DTOs
 * Generated from SuledFunctions.Contracts
 */

export interface Tournament {
  id: string
  name: string
  startDate: string | null
  endDate: string | null
  location: string
  division: string
  description: string
  status: string
  gameCount: number
  createdDate: string
}

export interface Pair {
  id: string
  displayName: string
  player1: string
  player2: string
}

export interface Game {
  id: string
  round: number
  courtNumber: number
  status: string
  scheduledTime: string | null
  pair1: string
  pair2: string
  isOurGame: boolean
}

export interface UploadTournamentRequest {
  file: File
}

export interface ApiResponse<T> {
  data: T
  error?: string
}
