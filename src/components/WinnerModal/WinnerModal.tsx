import { memo } from 'react'
import type { Stone, GameMode } from '../../game/types'
import styles from './WinnerModal.module.css'

interface WinnerModalProps {
  winner: Stone | 'draw'
  gameMode: GameMode
  aiPlaysAs: Stone
  onRestart: () => void
  onBackToMenu: () => void
}

const WinnerModal = memo(({ winner, gameMode, aiPlaysAs, onRestart, onBackToMenu }: WinnerModalProps) => {
  const isDraw = winner === 'draw'

  const getTitle = () => {
    if (isDraw) return '平局！'
    if (gameMode === 'pve') {
      const humanWon = winner !== aiPlaysAs
      return humanWon ? '你赢了！' : 'AI 获胜！'
    }
    return winner === 'white' ? '白棋胜利！' : '黑棋胜利！'
  }

  const getEmoji = () => {
    if (isDraw) return '🤝'
    if (gameMode === 'pve') {
      const humanWon = winner !== aiPlaysAs
      return humanWon ? '🎉' : '🤖'
    }
    return '🏆'
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="游戏结束">
      <div className={styles.modal}>
        <div className={styles.emoji}>{getEmoji()}</div>
        <div className={styles.title}>{getTitle()}</div>
        <div className={styles.subtitle}>
          {isDraw ? (
            '棋盘已满，双方平局'
          ) : (
            <>
              <span className={`${styles.winnerStone} ${styles[winner as Stone]}`} />
              {winner === 'white' ? '白' : '黑'}棋方获胜
            </>
          )}
        </div>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onRestart}>
            再来一局
          </button>
          <button className={styles.btnSecondary} onClick={onBackToMenu}>
            返回菜单
          </button>
        </div>
      </div>
    </div>
  )
})

WinnerModal.displayName = 'WinnerModal'
export default WinnerModal
