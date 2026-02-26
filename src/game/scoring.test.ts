import { describe, it, expect } from 'vitest'
import { evaluateBoard, getLineScore } from './scoring'
import { createBoard, placeStone } from './board'

const makeBoard = (moves: Array<{ row: number; col: number; stone: 'black' | 'white' }>) => {
  let board = createBoard()
  for (const { row, col, stone } of moves) {
    const next = placeStone(board, { row, col }, stone)
    if (next) board = next
  }
  return board
}

describe('getLineScore', () => {
  it('returns 0 for an empty line', () => {
    expect(getLineScore(0, 0, false)).toBe(0)
  })

  it('assigns highest score to 5 in a row', () => {
    const five = getLineScore(5, 0, false)
    const four = getLineScore(4, 1, true)
    expect(five).toBeGreaterThan(four)
  })

  it('assigns higher score to open-ended groups', () => {
    const openThree = getLineScore(3, 2, true)
    const blockedThree = getLineScore(3, 1, true)
    expect(openThree).toBeGreaterThan(blockedThree)
  })

  it('assigns 0 to fully blocked single stone', () => {
    expect(getLineScore(1, 0, true)).toBe(0)
  })
})

describe('evaluateBoard', () => {
  it('returns 0 for empty board', () => {
    expect(evaluateBoard(createBoard(), 'black')).toBe(0)
  })

  it('returns a positive score when attacker has advantage', () => {
    // white has 4 in a row, attacker is white
    const board = makeBoard([
      { row: 7, col: 5, stone: 'white' },
      { row: 7, col: 6, stone: 'white' },
      { row: 7, col: 7, stone: 'white' },
      { row: 7, col: 8, stone: 'white' },
    ])
    const score = evaluateBoard(board, 'white')
    expect(score).toBeGreaterThan(0)
  })

  it('returns a negative score when opponent has advantage', () => {
    // black has 4 in a row, attacker is white
    const board = makeBoard([
      { row: 7, col: 5, stone: 'black' },
      { row: 7, col: 6, stone: 'black' },
      { row: 7, col: 7, stone: 'black' },
      { row: 7, col: 8, stone: 'black' },
    ])
    const score = evaluateBoard(board, 'white')
    expect(score).toBeLessThan(0)
  })

  it('assigns very high score for 5 in a row to attacker', () => {
    const board = makeBoard([
      { row: 7, col: 5, stone: 'white' },
      { row: 7, col: 6, stone: 'white' },
      { row: 7, col: 7, stone: 'white' },
      { row: 7, col: 8, stone: 'white' },
      { row: 7, col: 9, stone: 'white' },
    ])
    const score = evaluateBoard(board, 'white')
    expect(score).toBeGreaterThan(50000)
  })

  it('assigns very negative score for 5 in a row to opponent', () => {
    const board = makeBoard([
      { row: 7, col: 5, stone: 'black' },
      { row: 7, col: 6, stone: 'black' },
      { row: 7, col: 7, stone: 'black' },
      { row: 7, col: 8, stone: 'black' },
      { row: 7, col: 9, stone: 'black' },
    ])
    const score = evaluateBoard(board, 'white')
    expect(score).toBeLessThan(-50000)
  })
})
