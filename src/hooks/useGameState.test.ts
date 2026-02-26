import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from './useGameState'

describe('useGameState initial state', () => {
  it('starts at mode-select phase', () => {
    const { result } = renderHook(() => useGameState())
    expect(result.current.state.gamePhase).toBe('mode-select')
  })

  it('white goes first', () => {
    const { result } = renderHook(() => useGameState())
    act(() => { result.current.setMode('pvp') })
    expect(result.current.state.currentPlayer).toBe('white')
  })
})

describe('placeStoneAction', () => {
  it('places a stone and switches player', () => {
    const { result } = renderHook(() => useGameState())
    act(() => { result.current.setMode('pvp') })
    act(() => { result.current.placeStoneAction({ row: 7, col: 7 }) })
    expect(result.current.state.board[7][7]).toBe('white')
    expect(result.current.state.currentPlayer).toBe('black')
  })

  it('ignores invalid (occupied) position', () => {
    const { result } = renderHook(() => useGameState())
    act(() => { result.current.setMode('pvp') })
    act(() => { result.current.placeStoneAction({ row: 7, col: 7 }) })
    act(() => { result.current.placeStoneAction({ row: 7, col: 7 }) }) // occupied
    expect(result.current.state.board[7][7]).toBe('white') // still white
    expect(result.current.state.currentPlayer).toBe('black') // still black's turn
  })

  it('does not mutate previous board state', () => {
    const { result } = renderHook(() => useGameState())
    act(() => { result.current.setMode('pvp') })
    const boardBefore = result.current.state.board
    act(() => { result.current.placeStoneAction({ row: 7, col: 7 }) })
    expect(boardBefore[7][7]).toBeNull()
  })

  it('detects winner after 5 in a row', () => {
    const { result } = renderHook(() => useGameState())
    act(() => { result.current.setMode('pvp') })
    // white: (7,0..4), black: (0,0..3)
    const moves = [
      { row: 7, col: 0 }, // white
      { row: 0, col: 0 }, // black
      { row: 7, col: 1 }, // white
      { row: 0, col: 1 }, // black
      { row: 7, col: 2 }, // white
      { row: 0, col: 2 }, // black
      { row: 7, col: 3 }, // white
      { row: 0, col: 3 }, // black
      { row: 7, col: 4 }, // white wins!
    ]
    act(() => {
      for (const pos of moves) {
        result.current.placeStoneAction(pos)
      }
    })
    expect(result.current.state.winner).toBe('white')
    expect(result.current.state.gamePhase).toBe('finished')
    expect(result.current.state.winningLine).toHaveLength(5)
  })

  it('does not allow moves after game is finished', () => {
    const { result } = renderHook(() => useGameState())
    act(() => { result.current.setMode('pvp') })
    const moves = [
      { row: 7, col: 0 }, { row: 0, col: 0 },
      { row: 7, col: 1 }, { row: 0, col: 1 },
      { row: 7, col: 2 }, { row: 0, col: 2 },
      { row: 7, col: 3 }, { row: 0, col: 3 },
      { row: 7, col: 4 }, // white wins
    ]
    act(() => {
      for (const pos of moves) result.current.placeStoneAction(pos)
    })
    act(() => { result.current.placeStoneAction({ row: 8, col: 8 }) })
    expect(result.current.state.board[8][8]).toBeNull()
  })
})

describe('undoMove', () => {
  it('undoes the last move', () => {
    const { result } = renderHook(() => useGameState())
    act(() => { result.current.setMode('pvp') })
    act(() => { result.current.placeStoneAction({ row: 7, col: 7 }) })
    act(() => { result.current.undoMove() })
    expect(result.current.state.board[7][7]).toBeNull()
    expect(result.current.state.currentPlayer).toBe('white')
    expect(result.current.state.moveCount).toBe(0)
  })

  it('does nothing if no moves have been made', () => {
    const { result } = renderHook(() => useGameState())
    act(() => { result.current.setMode('pvp') })
    act(() => { result.current.undoMove() })
    expect(result.current.state.moveCount).toBe(0)
  })
})

describe('restartGame', () => {
  it('resets board but keeps game mode', () => {
    const { result } = renderHook(() => useGameState())
    act(() => { result.current.setMode('pvp') })
    act(() => { result.current.placeStoneAction({ row: 7, col: 7 }) })
    act(() => { result.current.restartGame() })
    expect(result.current.state.board[7][7]).toBeNull()
    expect(result.current.state.gameMode).toBe('pvp')
    expect(result.current.state.currentPlayer).toBe('white')
    expect(result.current.state.moveCount).toBe(0)
  })
})

describe('backToMenu', () => {
  it('returns to mode-select phase', () => {
    const { result } = renderHook(() => useGameState())
    act(() => { result.current.setMode('pvp') })
    act(() => { result.current.backToMenu() })
    expect(result.current.state.gamePhase).toBe('mode-select')
  })
})
