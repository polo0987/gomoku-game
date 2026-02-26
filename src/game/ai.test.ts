import { describe, it, expect } from 'vitest'
import { getBestMove, getCandidates } from './ai'
import { createBoard, placeStone } from './board'

const makeBoard = (moves: Array<{ row: number; col: number; stone: 'black' | 'white' }>) => {
  let board = createBoard()
  for (const { row, col, stone } of moves) {
    const next = placeStone(board, { row, col }, stone)
    if (next) board = next
  }
  return board
}

describe('getCandidates', () => {
  it('returns center on empty board', () => {
    const board = createBoard()
    const candidates = getCandidates(board)
    expect(candidates.some(p => p.row === 7 && p.col === 7)).toBe(true)
  })

  it('includes positions adjacent to existing stones', () => {
    const board = makeBoard([{ row: 7, col: 7, stone: 'white' }])
    const candidates = getCandidates(board)
    expect(candidates.some(p => p.row === 7 && p.col === 8)).toBe(true)
    expect(candidates.some(p => p.row === 8 && p.col === 8)).toBe(true)
  })

  it('does not include already occupied positions', () => {
    const board = makeBoard([{ row: 7, col: 7, stone: 'white' }])
    const candidates = getCandidates(board)
    expect(candidates.some(p => p.row === 7 && p.col === 7)).toBe(false)
  })
})

describe('getBestMove', () => {
  it('returns a valid position on empty board', () => {
    const board = createBoard()
    const move = getBestMove(board, 'white', 'easy')
    expect(move).not.toBeNull()
    expect(move!.row).toBeGreaterThanOrEqual(0)
    expect(move!.col).toBeGreaterThanOrEqual(0)
  })

  it('completes a winning move (5 in a row) when available', () => {
    // white has 4 in a row, AI should complete to 5
    const board = makeBoard([
      { row: 7, col: 5, stone: 'white' },
      { row: 7, col: 6, stone: 'white' },
      { row: 7, col: 7, stone: 'white' },
      { row: 7, col: 8, stone: 'white' },
      // gap: (7,9) is the winning move
      { row: 0, col: 0, stone: 'black' }, // filler
    ])
    const move = getBestMove(board, 'white', 'medium')
    expect(move).not.toBeNull()
    // Should place at (7,4) or (7,9) to complete 5 in a row
    const isWinningMove =
      (move!.row === 7 && move!.col === 9) ||
      (move!.row === 7 && move!.col === 4)
    expect(isWinningMove).toBe(true)
  })

  it('blocks opponent four-in-a-row (one open end)', () => {
    // black has 4 in a row at row 7 (cols 5-8)
    // left end (col 4) is blocked by white, only (7,9) is open → only blocking move
    const board = makeBoard([
      { row: 7, col: 4, stone: 'white' }, // blocks left end
      { row: 7, col: 5, stone: 'black' },
      { row: 7, col: 6, stone: 'black' },
      { row: 7, col: 7, stone: 'black' },
      { row: 7, col: 8, stone: 'black' },
    ])
    const move = getBestMove(board, 'white', 'medium')
    expect(move).not.toBeNull()
    // Must block at (7,9) — only open end
    expect(move!.row).toBe(7)
    expect(move!.col).toBe(9)
  })

  it('returns null when board is full', () => {
    let board = createBoard()
    let stone: 'black' | 'white' = 'white'
    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        const next = placeStone(board, { row: r, col: c }, stone)
        if (next) board = next
        stone = stone === 'white' ? 'black' : 'white'
      }
    }
    const move = getBestMove(board, 'white', 'easy')
    expect(move).toBeNull()
  })
})
