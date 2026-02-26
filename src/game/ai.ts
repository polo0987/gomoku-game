import type { BoardState, Position, Stone, AIDifficulty } from './types'
import { BOARD_SIZE, AI_DEPTH, AI_SEARCH_RADIUS } from './constants'
import { placeStone, checkWinner, isBoardFull } from './board'
import { evaluateBoard } from './scoring'

const opponent = (stone: Stone): Stone => (stone === 'white' ? 'black' : 'white')

/** 获取所有候选落子位置（已有棋子周围 radius 范围内的空格） */
export const getCandidates = (board: BoardState): Position[] => {
  const hasAny = board.some(row => row.some(cell => cell !== null))

  if (!hasAny) {
    // 空棋盘：返回中心点
    const center = Math.floor(BOARD_SIZE / 2)
    return [{ row: center, col: center }]
  }

  const candidates = new Set<string>()

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === null) continue
      // 在已有棋子周围搜索
      for (let dr = -AI_SEARCH_RADIUS; dr <= AI_SEARCH_RADIUS; dr++) {
        for (let dc = -AI_SEARCH_RADIUS; dc <= AI_SEARCH_RADIUS; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === null) {
            candidates.add(`${nr},${nc}`)
          }
        }
      }
    }
  }

  return Array.from(candidates).map(key => {
    const [row, col] = key.split(',').map(Number)
    return { row, col }
  })
}

const minimax = (
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiStone: Stone
): number => {
  const winResult = checkWinner(board)
  if (winResult) {
    const multiplier = winResult.winner === aiStone ? 1 : -1
    return multiplier * (100000 + depth * 10) // 越快赢越好
  }

  if (isBoardFull(board) || depth === 0) {
    return evaluateBoard(board, aiStone)
  }

  const currentStone = isMaximizing ? aiStone : opponent(aiStone)
  const candidates = getCandidates(board)

  if (isMaximizing) {
    let best = -Infinity
    for (const pos of candidates) {
      const newBoard = placeStone(board, pos, currentStone)
      if (!newBoard) continue
      const score = minimax(newBoard, depth - 1, alpha, beta, false, aiStone)
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break // Alpha-Beta 剪枝
    }
    return best
  } else {
    let best = Infinity
    for (const pos of candidates) {
      const newBoard = placeStone(board, pos, currentStone)
      if (!newBoard) continue
      const score = minimax(newBoard, depth - 1, alpha, beta, true, aiStone)
      best = Math.min(best, score)
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }
}

/** 获取AI最优落子位置 */
export const getBestMove = (
  board: BoardState,
  aiStone: Stone,
  difficulty: AIDifficulty
): Position | null => {
  const candidates = getCandidates(board)
  if (candidates.length === 0) return null

  const depth = AI_DEPTH[difficulty] ?? 2
  let bestScore = -Infinity
  let bestMove: Position | null = null

  for (const pos of candidates) {
    const newBoard = placeStone(board, pos, aiStone)
    if (!newBoard) continue

    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, aiStone)
    if (score > bestScore) {
      bestScore = score
      bestMove = pos
    }
  }

  return bestMove
}
