import { memo } from 'react'
import type { Stone, GameMode, AIDifficulty } from '../../game/types'
import styles from './GameInfo.module.css'

interface GameInfoProps {
  currentPlayer: Stone
  moveCount: number
  gameMode: GameMode
  aiDifficulty: AIDifficulty
  aiPlaysAs: Stone
  winner: Stone | 'draw' | null
}

const DIFFICULTY_LABEL: Record<AIDifficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
}

const GameInfo = memo(({ currentPlayer, moveCount, gameMode, aiDifficulty, aiPlaysAs, winner }: GameInfoProps) => {
  const humanPlaysAs: Stone = gameMode === 'pve' ? (aiPlaysAs === 'white' ? 'black' : 'white') : 'white'

  const renderPlayer = (stone: Stone) => {
    const isActive = currentPlayer === stone && winner === null
    const isHuman = gameMode === 'pvp' || stone === humanPlaysAs
    const label = gameMode === 'pvp'
      ? (stone === 'white' ? '玩家一（白）' : '玩家二（黑）')
      : (isHuman ? `玩家（${stone === 'white' ? '白' : '黑'}）` : `AI（${stone === 'white' ? '白' : '黑'}）`)

    return (
      <div key={stone} className={`${styles.playerRow} ${isActive ? styles.active : ''}`}>
        <div className={`${styles.stoneDot} ${styles[stone]}`} />
        <span className={styles.playerLabel}>{label}</span>
        {gameMode === 'pve' && isHuman && <span className={styles.youBadge}>YOU</span>}
        {isActive && <span className={styles.currentArrow}>◀</span>}
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <div className={styles.title}>五子棋</div>
      <div className={styles.divider} />
      {renderPlayer('white')}
      {renderPlayer('black')}
      <div className={styles.divider} />
      <div className={styles.stats}>第 {moveCount} 手</div>
      {gameMode === 'pve' && (
        <div className={styles.modeBadge}>人机对战 · {DIFFICULTY_LABEL[aiDifficulty]}</div>
      )}
      {gameMode === 'pvp' && (
        <div className={styles.modeBadge}>双人对战</div>
      )}
    </div>
  )
})

GameInfo.displayName = 'GameInfo'
export default GameInfo
