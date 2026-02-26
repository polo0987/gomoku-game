import { describe, it, expect } from 'vitest'
import {
  createBoard,
  placeStone,
  checkWinner,
  isBoardFull,
  isValidPosition,
} from './board'
import { BOARD_SIZE } from './constants'

describe('createBoard', () => {
  it('creates a 15x15 board filled with null', () => {
    const board = createBoard()
    expect(board).toHaveLength(BOARD_SIZE)
    for (const row of board) {
      expect(row).toHaveLength(BOARD_SIZE)
      for (const cell of row) {
        expect(cell).toBeNull()
      }
    }
  })

  it('returns a new board each time', () => {
    const b1 = createBoard()
    const b2 = createBoard()
    expect(b1).not.toBe(b2)
  })
})

describe('placeStone', () => {
  it('returns a new board with the stone placed', () => {
    const board = createBoard()
    const newBoard = placeStone(board, { row: 0, col: 0 }, 'white')
    expect(newBoard![0][0]).toBe('white')
    expect(board[0][0]).toBeNull() // original unchanged
  })

  it('does not mutate the original board', () => {
    const board = createBoard()
    placeStone(board, { row: 7, col: 7 }, 'black')
    expect(board[7][7]).toBeNull()
  })

  it('returns null when position is already occupied', () => {
    const board = createBoard()
    const b2 = placeStone(board, { row: 0, col: 0 }, 'white')
    expect(b2).not.toBeNull()
    const b3 = placeStone(b2!, { row: 0, col: 0 }, 'black')
    expect(b3).toBeNull()
  })

  it('returns null for out-of-bounds position', () => {
    const board = createBoard()
    expect(placeStone(board, { row: -1, col: 0 }, 'white')).toBeNull()
    expect(placeStone(board, { row: 0, col: BOARD_SIZE }, 'white')).toBeNull()
  })
})

describe('checkWinner', () => {
  const makeBoard = (moves: Array<{ row: number; col: number; stone: 'black' | 'white' }>) => {
    let board = createBoard()
    for (const { row, col, stone } of moves) {
      const next = placeStone(board, { row, col }, stone)
      if (next) board = next
    }
    return board
  }

  it('returns null on empty board', () => {
    expect(checkWinner(createBoard())).toBeNull()
  })

  it('detects horizontal win', () => {
    const board = makeBoard([
      { row: 7, col: 0, stone: 'white' },
      { row: 7, col: 1, stone: 'white' },
      { row: 7, col: 2, stone: 'white' },
      { row: 7, col: 3, stone: 'white' },
      { row: 7, col: 4, stone: 'white' },
    ])
    const result = checkWinner(board)
    expect(result?.winner).toBe('white')
    expect(result?.line).toHaveLength(5)
  })

  it('detects vertical win', () => {
    const board = makeBoard([
      { row: 0, col: 7, stone: 'black' },
      { row: 1, col: 7, stone: 'black' },
      { row: 2, col: 7, stone: 'black' },
      { row: 3, col: 7, stone: 'black' },
      { row: 4, col: 7, stone: 'black' },
    ])
    const result = checkWinner(board)
    expect(result?.winner).toBe('black')
  })

  it('detects diagonal win (top-left to bottom-right)', () => {
    const board = makeBoard([
      { row: 0, col: 0, stone: 'white' },
      { row: 1, col: 1, stone: 'white' },
      { row: 2, col: 2, stone: 'white' },
      { row: 3, col: 3, stone: 'white' },
      { row: 4, col: 4, stone: 'white' },
    ])
    const result = checkWinner(board)
    expect(result?.winner).toBe('white')
  })

  it('detects anti-diagonal win (top-right to bottom-left)', () => {
    const board = makeBoard([
      { row: 0, col: 4, stone: 'black' },
      { row: 1, col: 3, stone: 'black' },
      { row: 2, col: 2, stone: 'black' },
      { row: 3, col: 1, stone: 'black' },
      { row: 4, col: 0, stone: 'black' },
    ])
    const result = checkWinner(board)
    expect(result?.winner).toBe('black')
  })

  it('does not trigger on 4 in a row', () => {
    const board = makeBoard([
      { row: 7, col: 0, stone: 'white' },
      { row: 7, col: 1, stone: 'white' },
      { row: 7, col: 2, stone: 'white' },
      { row: 7, col: 3, stone: 'white' },
    ])
    expect(checkWinner(board)).toBeNull()
  })

  it('detects win at board edge', () => {
    const board = makeBoard([
      { row: 14, col: 10, stone: 'black' },
      { row: 14, col: 11, stone: 'black' },
      { row: 14, col: 12, stone: 'black' },
      { row: 14, col: 13, stone: 'black' },
      { row: 14, col: 14, stone: 'black' },
    ])
    const result = checkWinner(board)
    expect(result?.winner).toBe('black')
  })

  it('returns the correct 5-cell winning line', () => {
    const board = makeBoard([
      { row: 5, col: 5, stone: 'white' },
      { row: 5, col: 6, stone: 'white' },
      { row: 5, col: 7, stone: 'white' },
      { row: 5, col: 8, stone: 'white' },
      { row: 5, col: 9, stone: 'white' },
    ])
    const result = checkWinner(board)
    expect(result?.line).toEqual([
      { row: 5, col: 5 },
      { row: 5, col: 6 },
      { row: 5, col: 7 },
      { row: 5, col: 8 },
      { row: 5, col: 9 },
    ])
  })
})

describe('isBoardFull', () => {
  it('returns false for empty board', () => {
    expect(isBoardFull(createBoard())).toBe(false)
  })

  it('returns true for a completely filled board', () => {
    let board = createBoard()
    let stone: 'black' | 'white' = 'white'
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const next = placeStone(board, { row: r, col: c }, stone)
        if (next) board = next
        stone = stone === 'white' ? 'black' : 'white'
      }
    }
    expect(isBoardFull(board)).toBe(true)
  })
})

describe('isValidPosition', () => {
  it('returns true for valid positions', () => {
    expect(isValidPosition({ row: 0, col: 0 })).toBe(true)
    expect(isValidPosition({ row: 7, col: 7 })).toBe(true)
    expect(isValidPosition({ row: 14, col: 14 })).toBe(true)
  })

  it('returns false for out-of-bounds positions', () => {
    expect(isValidPosition({ row: -1, col: 0 })).toBe(false)
    expect(isValidPosition({ row: 0, col: -1 })).toBe(false)
    expect(isValidPosition({ row: BOARD_SIZE, col: 0 })).toBe(false)
    expect(isValidPosition({ row: 0, col: BOARD_SIZE })).toBe(false)
  })
})
