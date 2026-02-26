import { memo } from 'react'
import styles from './GameControls.module.css'

interface GameControlsProps {
  canUndo: boolean
  onUndo: () => void
  onRestart: () => void
  onBackToMenu: () => void
}

const GameControls = memo(({ canUndo, onUndo, onRestart, onBackToMenu }: GameControlsProps) => (
  <div className={styles.controls}>
    <button
      className={`${styles.btn} ${styles.btnSecondary}`}
      onClick={onUndo}
      disabled={!canUndo}
      aria-label="悔棋"
    >
      ↩ 悔棋
    </button>
    <button
      className={`${styles.btn} ${styles.btnPrimary}`}
      onClick={onRestart}
      aria-label="重新开始"
    >
      ↺ 重新开始
    </button>
    <button
      className={`${styles.btn} ${styles.btnDanger}`}
      onClick={onBackToMenu}
      aria-label="返回菜单"
    >
      返回菜单
    </button>
  </div>
))

GameControls.displayName = 'GameControls'
export default GameControls
