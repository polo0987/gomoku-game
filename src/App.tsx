import { useEffect, useRef, useState } from 'react'
import { useGameState } from './hooks/useGameState'
import { getBestMove } from './game/ai'
import type { GameMode, AIDifficulty, Stone } from './game/types'
import Board from './components/Board/Board'
import GameInfo from './components/GameInfo/GameInfo'
import GameControls from './components/GameControls/GameControls'
import WinnerModal from './components/WinnerModal/WinnerModal'
import ModeSelector from './components/ModeSelector/ModeSelector'
import styles from './App.module.css'

export default function App() {
  const { state, placeStoneAction, undoMove, restartGame, setMode, backToMenu } = useGameState()
  const [isAiThinking, setIsAiThinking] = useState(false)
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // AI 落子逻辑
  useEffect(() => {
    const { gamePhase, gameMode, currentPlayer, aiPlaysAs, board, aiDifficulty } = state

    const isAiTurn =
      gamePhase === 'playing' &&
      gameMode === 'pve' &&
      currentPlayer === aiPlaysAs

    if (!isAiTurn) return

    setIsAiThinking(true)

    // 延迟一帧，让 UI 更新先渲染，再执行 AI 计算
    aiTimerRef.current = setTimeout(() => {
      const move = getBestMove(board, aiPlaysAs, aiDifficulty)
      if (move) placeStoneAction(move)
      setIsAiThinking(false)
    }, 80)

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current)
    }
  }, [state, placeStoneAction])

  const handleStart = (mode: GameMode, difficulty: AIDifficulty, aiPlaysAs: Stone) => {
    setMode(mode, difficulty, aiPlaysAs)
  }

  if (state.gamePhase === 'mode-select') {
    return (
      <div className={styles.page}>
        <ModeSelector onStart={handleStart} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Left panel */}
        <div className={styles.sidebar}>
          <GameInfo
            currentPlayer={state.currentPlayer}
            moveCount={state.moveCount}
            gameMode={state.gameMode}
            aiDifficulty={state.aiDifficulty}
            aiPlaysAs={state.aiPlaysAs}
            winner={state.winner}
          />
          <GameControls
            canUndo={state.moveHistory.length > 0 && state.gamePhase === 'playing'}
            onUndo={undoMove}
            onRestart={restartGame}
            onBackToMenu={backToMenu}
          />
        </div>

        {/* Board */}
        <Board
          board={state.board}
          currentPlayer={state.currentPlayer}
          winningLine={state.winningLine}
          isFinished={state.gamePhase === 'finished'}
          isAiThinking={isAiThinking}
          onPlace={placeStoneAction}
        />
      </div>

      {state.gamePhase === 'finished' && state.winner && (
        <WinnerModal
          winner={state.winner}
          gameMode={state.gameMode}
          aiPlaysAs={state.aiPlaysAs}
          onRestart={restartGame}
          onBackToMenu={backToMenu}
        />
      )}
    </div>
  )
}
