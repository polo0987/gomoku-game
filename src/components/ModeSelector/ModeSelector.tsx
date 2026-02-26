import { useState } from 'react'
import type { GameMode, AIDifficulty, Stone } from '../../game/types'
import styles from './ModeSelector.module.css'

interface ModeSelectorProps {
  onStart: (mode: GameMode, difficulty: AIDifficulty, aiPlaysAs: Stone) => void
}

export default function ModeSelector({ onStart }: ModeSelectorProps) {
  const [mode, setMode] = useState<GameMode>('pvp')
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium')
  const [humanColor, setHumanColor] = useState<Stone>('white')

  const handleStart = () => {
    const aiPlaysAs: Stone = humanColor === 'white' ? 'black' : 'white'
    onStart(mode, difficulty, aiPlaysAs)
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>五子棋</div>
      <div className={styles.subtitle}>Gomoku · 白棋先行</div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>游戏模式</div>
        <div className={styles.modeButtons}>
          <button
            className={`${styles.modeBtn} ${mode === 'pvp' ? styles.selected : ''}`}
            onClick={() => setMode('pvp')}
          >
            <span className={styles.modeIcon}>👥</span>
            <span className={styles.modeName}>双人对战</span>
          </button>
          <button
            className={`${styles.modeBtn} ${mode === 'pve' ? styles.selected : ''}`}
            onClick={() => setMode('pve')}
          >
            <span className={styles.modeIcon}>🤖</span>
            <span className={styles.modeName}>人机对战</span>
          </button>
        </div>
      </div>

      {mode === 'pve' && (
        <>
          <div className={styles.section}>
            <div className={styles.sectionLabel}>AI 难度</div>
            <div className={styles.difficultyButtons}>
              {(['easy', 'medium', 'hard'] as AIDifficulty[]).map(d => (
                <button
                  key={d}
                  className={`${styles.diffBtn} ${difficulty === d ? styles.selected : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {{ easy: '简单', medium: '中等', hard: '困难' }[d]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>我执</div>
            <div className={styles.colorButtons}>
              <button
                className={`${styles.colorBtn} ${humanColor === 'white' ? styles.selected : ''}`}
                onClick={() => setHumanColor('white')}
              >
                <span className={`${styles.colorDot} ${styles.white}`} />
                白棋（先手）
              </button>
              <button
                className={`${styles.colorBtn} ${humanColor === 'black' ? styles.selected : ''}`}
                onClick={() => setHumanColor('black')}
              >
                <span className={`${styles.colorDot} ${styles.black}`} />
                黑棋（后手）
              </button>
            </div>
          </div>
        </>
      )}

      <button className={styles.startBtn} onClick={handleStart}>
        开始游戏
      </button>
      <div className={styles.note}>规则：横竖斜方向连续五子获胜</div>
    </div>
  )
}
