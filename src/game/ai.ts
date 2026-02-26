import type { BoardState, Position, Stone, AIDifficulty } from './types'
import { BOARD_SIZE, AI_DEPTH, AI_SEARCH_RADIUS, AI_MAX_CANDIDATES } from './constants'
import { placeStone, checkWinner, isBoardFull } from './board'
import { evaluateBoard } from './scoring'

const opponent = (stone: Stone): Stone => (stone === 'white' ? 'black' : 'white')

/** 获取所有候选落子位置（已有棋子周围 radius 范围内的空格） */
export const getCandidates = (board: BoardState): Position[] => {
  const hasAny = board.some(row => row.some(cell => cell !== null))

  if (!hasAny) {
    const center = Math.floor(BOARD_SIZE / 2)
    return [{ row: center, col: center }]
  }

  const candidates = new Set<string>()

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === null) continue
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

const DIRS = [[0,1],[1,0],[1,1],[-1,1]] as const

/**
 * 轻量威胁评分：统计一个位置周围各方向的最长连子数。
 * 比调用 evaluateBoard 快 ~100x，用于移动排序。
 */
const quickThreatScore = (board: BoardState, pos: Position, stone: Stone): number => {
  const def = opponent(stone)
  let score = 0

  for (const [dr, dc] of DIRS) {
    // 己方连子
    let own = 1
    for (let i = 1; i <= 4; i++) {
      const r = pos.row + dr * i; const c = pos.col + dc * i
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== stone) break
      own++
    }
    for (let i = 1; i <= 4; i++) {
      const r = pos.row - dr * i; const c = pos.col - dc * i
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== stone) break
      own++
    }
    // 对方连子（阻挡价值）
    let opp = 1
    for (let i = 1; i <= 4; i++) {
      const r = pos.row + dr * i; const c = pos.col + dc * i
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== def) break
      opp++
    }
    for (let i = 1; i <= 4; i++) {
      const r = pos.row - dr * i; const c = pos.col - dc * i
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== def) break
      opp++
    }
    score += own * own + opp * opp
  }
  return score
}

/**
 * 移动排序 + 候选点限制。
 * 用轻量威胁评分排序（O(1) per candidate），不做完整棋盘评估。
 */
const sortAndLimitCandidates = (
  candidates: Position[],
  board: BoardState,
  aiStone: Stone,
  maxCount: number
): Position[] => {
  if (candidates.length <= maxCount) {
    candidates.sort((a, b) =>
      quickThreatScore(board, b, aiStone) - quickThreatScore(board, a, aiStone)
    )
    return candidates
  }

  const scored = candidates.map(pos => ({
    pos,
    score: quickThreatScore(board, pos, aiStone),
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, maxCount).map(s => s.pos)
}

const minimax = (
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiStone: Stone,
  maxCandidates: number
): number => {
  const winResult = checkWinner(board)
  if (winResult) {
    const multiplier = winResult.winner === aiStone ? 1 : -1
    return multiplier * (100000 + depth * 10)
  }

  if (isBoardFull(board) || depth === 0) {
    return evaluateBoard(board, aiStone)
  }

  const currentStone = isMaximizing ? aiStone : opponent(aiStone)
  const rawCandidates = getCandidates(board)
  const candidates = sortAndLimitCandidates(rawCandidates, board, aiStone, maxCandidates)

  if (isMaximizing) {
    let best = -Infinity
    for (const pos of candidates) {
      const newBoard = placeStone(board, pos, currentStone)
      if (!newBoard) continue
      const score = minimax(newBoard, depth - 1, alpha, beta, false, aiStone, maxCandidates)
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  } else {
    let best = Infinity
    for (const pos of candidates) {
      const newBoard = placeStone(board, pos, currentStone)
      if (!newBoard) continue
      const score = minimax(newBoard, depth - 1, alpha, beta, true, aiStone, maxCandidates)
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
  const maxCandidates = AI_MAX_CANDIDATES[difficulty] ?? 15
  const sortedCandidates = sortAndLimitCandidates(candidates, board, aiStone, maxCandidates)

  let bestScore = -Infinity
  let bestMove: Position | null = null

  for (const pos of sortedCandidates) {
    const newBoard = placeStone(board, pos, aiStone)
    if (!newBoard) continue

    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, aiStone, maxCandidates)
    if (score > bestScore) {
      bestScore = score
      bestMove = pos
    }
  }

  return bestMove
}
