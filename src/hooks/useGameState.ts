import { useReducer, useCallback } from 'react'
import type { GameState, GameAction, Stone, GameMode, AIDifficulty, Position } from '../game/types'
import { createBoard, placeStone, checkWinner, isBoardFull } from '../game/board'

const initialBoard = createBoard()

export const createInitialState = (): GameState => ({
  board: initialBoard,
  currentPlayer: 'white', // 白棋先行
  winner: null,
  winningLine: null,
  gameMode: 'pvp',
  aiDifficulty: 'medium',
  aiPlaysAs: 'black',
  gamePhase: 'mode-select',
  moveHistory: [],
  moveCount: 0,
})

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_MODE': {
      return {
        ...createInitialState(),
        gameMode: action.mode,
        aiDifficulty: action.difficulty ?? 'medium',
        aiPlaysAs: action.aiPlaysAs ?? 'black',
        gamePhase: 'playing',
      }
    }

    case 'PLACE_STONE': {
      if (state.gamePhase !== 'playing') return state
      if (state.winner !== null) return state

      const newBoard = placeStone(state.board, action.position, state.currentPlayer)
      if (!newBoard) return state // invalid move

      const winResult = checkWinner(newBoard)
      const full = isBoardFull(newBoard)

      return {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === 'white' ? 'black' : 'white',
        winner: winResult ? winResult.winner : full ? 'draw' : null,
        winningLine: winResult ? winResult.line : null,
        gamePhase: winResult || full ? 'finished' : 'playing',
        moveHistory: [...state.moveHistory, action.position],
        moveCount: state.moveCount + 1,
      }
    }

    case 'UNDO_MOVE': {
      if (state.moveHistory.length === 0) return state
      if (state.gamePhase === 'mode-select') return state

      // 人机模式下撤销两步（AI那步也撤销）
      const stepsToUndo = state.gameMode === 'pve' && state.moveHistory.length >= 2 ? 2 : 1
      const newHistory = state.moveHistory.slice(0, -stepsToUndo)

      // 从头重建棋盘
      let board = createBoard()
      const startPlayer: Stone = 'white'
      let currentPlayer: Stone = startPlayer

      for (const pos of newHistory) {
        const next = placeStone(board, pos, currentPlayer)
        if (next) {
          board = next
          currentPlayer = currentPlayer === 'white' ? 'black' : 'white'
        }
      }

      return {
        ...state,
        board,
        currentPlayer,
        winner: null,
        winningLine: null,
        gamePhase: 'playing',
        moveHistory: newHistory,
        moveCount: newHistory.length,
      }
    }

    case 'RESTART_GAME': {
      return {
        ...createInitialState(),
        gameMode: state.gameMode,
        aiDifficulty: state.aiDifficulty,
        aiPlaysAs: state.aiPlaysAs,
        gamePhase: 'playing',
      }
    }

    case 'BACK_TO_MENU': {
      return createInitialState()
    }

    default:
      return state
  }
}

export const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)

  const placeStoneAction = useCallback((position: Position) => {
    dispatch({ type: 'PLACE_STONE', position })
  }, [])

  const undoMove = useCallback(() => {
    dispatch({ type: 'UNDO_MOVE' })
  }, [])

  const restartGame = useCallback(() => {
    dispatch({ type: 'RESTART_GAME' })
  }, [])

  const setMode = useCallback((mode: GameMode, difficulty?: AIDifficulty, aiPlaysAs?: Stone) => {
    dispatch({ type: 'SET_MODE', mode, difficulty, aiPlaysAs })
  }, [])

  const backToMenu = useCallback(() => {
    dispatch({ type: 'BACK_TO_MENU' })
  }, [])

  return {
    state,
    placeStoneAction,
    undoMove,
    restartGame,
    setMode,
    backToMenu,
  }
}
