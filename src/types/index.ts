/**
 * TypeScript types matching backend C# DTOs
 * Generated from SuledFunctions.Contracts
 */

export interface Player {
  name: string
  surname: string
  fullName: string
}

export interface PairInfo {
  id: string
  displayName: string
  player1: Player
  player2: Player
}

export enum GameStatus {
  Scheduled = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}

export interface PairGame {
  id: string
  tournamentId: string
  round: number
  courtNumber: number
  opponentPair: PairInfo
  scheduledTime: string | null
  status: GameStatus
}

export interface TournamentPair {
  pairInfo: PairInfo
  games: PairGame[]
  id: string
  displayName: string
  gameCount: number
}

export interface Tournament {
  id: string
  name: string
  startDate: string | null
  endDate: string | null
  location: string
  division: string
  description: string
  status: string
  createdDate: string
  blobFileName: string
  pairs: TournamentPair[]
}

export interface Pair {
  id: string
  displayName: string
  player1: string
  player2: string
  gameCount: number
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
