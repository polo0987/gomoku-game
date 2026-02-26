export type Stone = 'black' | 'white'
export type CellState = Stone | null

export type BoardState = ReadonlyArray<ReadonlyArray<CellState>>

export interface Position {
  readonly row: number
  readonly col: number
}

export type GameMode = 'pvp' | 'pve'
export type AIDifficulty = 'easy' | 'medium' | 'hard'
export type GamePhase = 'mode-select' | 'playing' | 'finished'

export interface GameState {
  readonly board: BoardState
  readonly currentPlayer: Stone
  readonly winner: Stone | 'draw' | null
  readonly winningLine: ReadonlyArray<Position> | null
  readonly gameMode: GameMode
  readonly aiDifficulty: AIDifficulty
  readonly aiPlaysAs: Stone
  readonly gamePhase: GamePhase
  readonly moveHistory: ReadonlyArray<Position>
  readonly moveCount: number
}

export type GameAction =
  | { type: 'PLACE_STONE'; position: Position }
  | { type: 'UNDO_MOVE' }
  | { type: 'RESTART_GAME' }
  | { type: 'SET_MODE'; mode: GameMode; difficulty?: AIDifficulty; aiPlaysAs?: Stone }
  | { type: 'BACK_TO_MENU' }
