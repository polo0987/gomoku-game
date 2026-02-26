export const BOARD_SIZE = 15
export const WIN_LENGTH = 5

// 搜索方向：右、下、右下、右上
export const DIRECTIONS = [
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: -1, dc: 1 },
] as const

// AI 搜索深度（按难度）
export const AI_DEPTH: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
}

// AI 候选点搜索半径
export const AI_SEARCH_RADIUS = 2

// 每层最多搜索的候选点数（移动排序后取前 N 个，控制搜索爆炸）
export const AI_MAX_CANDIDATES: Record<string, number> = {
  easy: 10,
  medium: 15,
  hard: 20,
}
