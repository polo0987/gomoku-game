import { memo } from 'react'
import type { BoardState, Stone, Position } from '../../game/types'
import { BOARD_SIZE } from '../../game/constants'
import Cell from '../Cell/Cell'
import styles from './Board.module.css'

interface BoardProps {
  board: BoardState
  currentPlayer: Stone
  winningLine: ReadonlyArray<Position> | null
  isFinished: boolean
  isAiThinking: boolean
  onPlace: (pos: Position) => void
}

const isWinningCell = (winningLine: ReadonlyArray<Position> | null, row: number, col: number) =>
  winningLine?.some(p => p.row === row && p.col === col) ?? false

const cellSize = Math.min(Math.floor((Math.min(window.innerWidth * 0.55, window.innerHeight * 0.85) - 40) / BOARD_SIZE), 44)

const Board = memo(({ board, currentPlayer, winningLine, isFinished, isAiThinking, onPlace }: BoardProps) => {
  return (
    <div className={styles.boardWrapper}>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
        }}
        data-testid="game-board"
      >
        {Array.from({ length: BOARD_SIZE }, (_, row) =>
          Array.from({ length: BOARD_SIZE }, (_, col) => (
            <Cell
              key={`${row}-${col}`}
              row={row}
              col={col}
              stone={board[row][col]}
              isWinning={isWinningCell(winningLine, row, col)}
              currentPlayer={currentPlayer}
              disabled={isFinished || isAiThinking}
              onPlace={onPlace}
            />
          ))
        )}
      </div>
      {isAiThinking && (
        <div className={styles.aiThinking}>
          <div className={styles.spinner} />
          AI 思考中…
        </div>
      )}
    </div>
  )
})

Board.displayName = 'Board'
export default Board
