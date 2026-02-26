import type { BoardState, Stone } from './types'
import { BOARD_SIZE, WIN_LENGTH } from './constants'

// 棋型分值表
const SCORES = {
  FIVE: 100000,       // 连五（必胜）
  OPEN_FOUR: 10000,   // 活四
  BLOCKED_FOUR: 1000, // 冲四
  OPEN_THREE: 1000,   // 活三
  BLOCKED_THREE: 100, // 眠三
  OPEN_TWO: 100,      // 活二
  BLOCKED_TWO: 10,    // 眠二
} as const

/**
 * 对一段连子评分
 * @param count     连续同色棋子数
 * @param openEnds  开放端数（0=两端堵死, 1=一端开放, 2=两端开放）
 * @param isAI      是否是AI自身
 */
export const getLineScore = (count: number, openEnds: number, _isAI: boolean): number => {
  if (count <= 0) return 0

  // 五连及以上直接获胜，无论两端是否被堵
  if (count >= WIN_LENGTH) return SCORES.FIVE

  if (openEnds === 0) return 0

  if (count === 4) {
    return openEnds === 2 ? SCORES.OPEN_FOUR : SCORES.BLOCKED_FOUR
  }

  if (count === 3) {
    return openEnds === 2 ? SCORES.OPEN_THREE : SCORES.BLOCKED_THREE
  }

  if (count === 2) {
    return openEnds === 2 ? SCORES.OPEN_TWO : SCORES.BLOCKED_TWO
  }

  return 0
}

/** 评估一条线（横/竖/斜），累加分值 */
const evaluateLine = (
  cells: ReadonlyArray<Stone | null>,
  attacker: Stone,
  defender: Stone
): number => {
  let score = 0
  const len = cells.length

  let i = 0
  while (i < len) {
    const stone = cells[i]
    if (stone === null) { i++; continue }

    // 找连续同色棋子
    let count = 1
    while (i + count < len && cells[i + count] === stone) count++

    // 判断两端是否开放
    const leftOpen = i > 0 && cells[i - 1] === null
    const rightOpen = i + count < len && cells[i + count] === null
    const openEnds = (leftOpen ? 1 : 0) + (rightOpen ? 1 : 0)

    const lineScore = getLineScore(count, openEnds, stone === attacker)

    if (stone === attacker) {
      score += lineScore
    } else if (stone === defender) {
      score -= lineScore
    }

    i += count
  }

  return score
}

/** 提取棋盘上所有方向的线段 */
const extractLines = (board: BoardState): ReadonlyArray<ReadonlyArray<Stone | null>> => {
  const lines: Array<Array<Stone | null>> = []

  // 横行
  for (let r = 0; r < BOARD_SIZE; r++) {
    lines.push([...board[r]])
  }

  // 竖列
  for (let c = 0; c < BOARD_SIZE; c++) {
    lines.push(Array.from({ length: BOARD_SIZE }, (_, r) => board[r][c]))
  }

  // 主对角线 (↘)
  for (let start = -(BOARD_SIZE - WIN_LENGTH); start <= BOARD_SIZE - WIN_LENGTH; start++) {
    const line: Array<Stone | null> = []
    for (let i = 0; i < BOARD_SIZE; i++) {
      const r = i + start
      if (r >= 0 && r < BOARD_SIZE) line.push(board[r][i])
    }
    if (line.length >= WIN_LENGTH) lines.push(line)
  }

  // 反对角线 (↙)
  for (let start = WIN_LENGTH - 1; start < 2 * BOARD_SIZE - WIN_LENGTH; start++) {
    const line: Array<Stone | null> = []
    for (let i = 0; i < BOARD_SIZE; i++) {
      const r = start - i
      if (r >= 0 && r < BOARD_SIZE) line.push(board[r][i])
    }
    if (line.length >= WIN_LENGTH) lines.push(line)
  }

  return lines
}

/**
 * 对整个棋盘评估分值（正 = 对attacker有利，负 = 对defender有利）
 */
export const evaluateBoard = (board: BoardState, attacker: Stone): number => {
  const defender: Stone = attacker === 'white' ? 'black' : 'white'
  const lines = extractLines(board)
  return lines.reduce((total, line) => total + evaluateLine(line, attacker, defender), 0)
}
