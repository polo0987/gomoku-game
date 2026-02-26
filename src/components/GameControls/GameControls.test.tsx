import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GameControls from './GameControls'

const defaultProps = {
  canUndo: true,
  onUndo: vi.fn(),
  onRestart: vi.fn(),
  onBackToMenu: vi.fn(),
}

describe('GameControls', () => {
  it('renders all control buttons', () => {
    render(<GameControls {...defaultProps} />)
    expect(screen.getByText('↩ 悔棋')).toBeTruthy()
    expect(screen.getByText('↺ 重新开始')).toBeTruthy()
    expect(screen.getByText('返回菜单')).toBeTruthy()
  })

  it('calls onUndo when undo button clicked', () => {
    const onUndo = vi.fn()
    render(<GameControls {...defaultProps} onUndo={onUndo} />)
    fireEvent.click(screen.getByText('↩ 悔棋'))
    expect(onUndo).toHaveBeenCalledOnce()
  })

  it('disables undo button when canUndo is false', () => {
    render(<GameControls {...defaultProps} canUndo={false} />)
    const undoBtn = screen.getByText('↩ 悔棋')
    expect(undoBtn.closest('button')).toBeDisabled()
  })

  it('calls onRestart when restart clicked', () => {
    const onRestart = vi.fn()
    render(<GameControls {...defaultProps} onRestart={onRestart} />)
    fireEvent.click(screen.getByText('↺ 重新开始'))
    expect(onRestart).toHaveBeenCalledOnce()
  })

  it('calls onBackToMenu when back button clicked', () => {
    const onBackToMenu = vi.fn()
    render(<GameControls {...defaultProps} onBackToMenu={onBackToMenu} />)
    fireEvent.click(screen.getByText('返回菜单'))
    expect(onBackToMenu).toHaveBeenCalledOnce()
  })
})
