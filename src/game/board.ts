import type { BoardState, CellState, Position, Stone } from './types'
import { BOARD_SIZE, DIRECTIONS, WIN_LENGTH } from './constants'

export const createBoard = (): BoardState =>
  Array.from({ length: BOARD_SIZE }, () =>
    Array.from<CellState>({ length: BOARD_SIZE }).fill(null)
  )

export const isValidPosition = ({ row, col }: Position): boolean =>
  row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE

/** Returns new board with stone placed, or null if move is invalid */
export const placeStone = (
  board: BoardState,
  position: Position,
  stone: Stone
): BoardState | null => {
  const { row, col } = position
  if (!isValidPosition(position)) return null
  if (board[row][col] !== null) return null

  return board.map((r, ri) =>
    ri === row
      ? r.map((cell, ci) => (ci === col ? stone : cell))
      : r
  )
}

interface WinResult {
  winner: Stone
  line: ReadonlyArray<Position>
}

/** Checks entire board for a winner. Returns winner + winning line, or null. */
export const checkWinner = (board: BoardState): WinResult | null => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const stone = board[row][col]
      if (stone === null) continue

      for (const { dr, dc } of DIRECTIONS) {
        const line: Position[] = [{ row, col }]

        for (let i = 1; i < WIN_LENGTH; i++) {
          const nr = row + dr * i
          const nc = col + dc * i
          if (!isValidPosition({ row: nr, col: nc })) break
          if (board[nr][nc] !== stone) break
          line.push({ row: nr, col: nc })
        }

        if (line.length === WIN_LENGTH) {
          return { winner: stone, line }
        }
      }
    }
  }
  return null
}

export const isBoardFull = (board: BoardState): boolean =>
  board.every(row => row.every(cell => cell !== null))
