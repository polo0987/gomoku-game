import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WinnerModal from './WinnerModal'

const defaultProps = {
  winner: 'white' as const,
  gameMode: 'pvp' as const,
  aiPlaysAs: 'black' as const,
  onRestart: vi.fn(),
  onBackToMenu: vi.fn(),
}

describe('WinnerModal', () => {
  it('shows white wins in pvp mode', () => {
    render(<WinnerModal {...defaultProps} winner="white" />)
    expect(screen.getByText('白棋胜利！')).toBeTruthy()
  })

  it('shows black wins in pvp mode', () => {
    render(<WinnerModal {...defaultProps} winner="black" />)
    expect(screen.getByText('黑棋胜利！')).toBeTruthy()
  })

  it('shows draw result', () => {
    render(<WinnerModal {...defaultProps} winner="draw" />)
    expect(screen.getByText('平局！')).toBeTruthy()
    expect(screen.getByText('棋盘已满，双方平局')).toBeTruthy()
  })

  it('shows human wins in pve mode', () => {
    render(<WinnerModal {...defaultProps} gameMode="pve" winner="white" aiPlaysAs="black" />)
    expect(screen.getByText('你赢了！')).toBeTruthy()
  })

  it('shows ai wins in pve mode', () => {
    render(<WinnerModal {...defaultProps} gameMode="pve" winner="black" aiPlaysAs="black" />)
    expect(screen.getByText('AI 获胜！')).toBeTruthy()
  })

  it('calls onRestart when restart button clicked', () => {
    const onRestart = vi.fn()
    render(<WinnerModal {...defaultProps} onRestart={onRestart} />)
    fireEvent.click(screen.getByText('再来一局'))
    expect(onRestart).toHaveBeenCalledOnce()
  })

  it('calls onBackToMenu when back button clicked', () => {
    const onBackToMenu = vi.fn()
    render(<WinnerModal {...defaultProps} onBackToMenu={onBackToMenu} />)
    fireEvent.click(screen.getByText('返回菜单'))
    expect(onBackToMenu).toHaveBeenCalledOnce()
  })

  it('has dialog role for accessibility', () => {
    render(<WinnerModal {...defaultProps} />)
    expect(screen.getByRole('dialog')).toBeTruthy()
  })
})
