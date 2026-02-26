import { memo } from 'react'
import type { CellState, Stone, Position } from '../../game/types'
import styles from './Cell.module.css'

interface CellProps {
  row: number
  col: number
  stone: CellState
  isWinning: boolean
  currentPlayer: Stone
  disabled: boolean
  onPlace: (pos: Position) => void
}

const Cell = memo(({ row, col, stone, isWinning, currentPlayer, disabled, onPlace }: CellProps) => {
  const isEmpty = stone === null
  const canClick = isEmpty && !disabled

  const handleClick = () => {
    if (canClick) onPlace({ row, col })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && canClick) {
      e.preventDefault()
      onPlace({ row, col })
    }
  }

  return (
    <div
      role="button"
      aria-label={`Row ${row + 1}, Column ${col + 1}${stone ? `, ${stone} stone` : ''}`}
      aria-disabled={!canClick}
      tabIndex={canClick ? 0 : -1}
      className={`${styles.cell} ${isEmpty ? styles.noStone : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {stone && (
        <div
          className={`${styles.stone} ${stone === 'white' ? styles.stoneWhite : styles.stoneBlack} ${isWinning ? styles.winning : ''}`}
        />
      )}
      {isEmpty && !disabled && (
        <div className={`${styles.hoverHint} ${currentPlayer === 'white' ? styles.hoverHintWhite : styles.hoverHintBlack}`} />
      )}
    </div>
  )
})

Cell.displayName = 'Cell'
export default Cell
