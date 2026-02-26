import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Board from './Board'
import { createBoard, placeStone } from '../../game/board'

const defaultProps = {
  board: createBoard(),
  currentPlayer: 'white' as const,
  winningLine: null,
  isFinished: false,
  isAiThinking: false,
  onPlace: vi.fn(),
}

describe('Board', () => {
  it('renders a 15x15 grid (225 cells)', () => {
    render(<Board {...defaultProps} />)
    const cells = screen.getAllByRole('button')
    expect(cells).toHaveLength(225)
  })

  it('renders the board container', () => {
    render(<Board {...defaultProps} />)
    expect(screen.getByTestId('game-board')).toBeTruthy()
  })

  it('shows AI thinking overlay when isAiThinking', () => {
    render(<Board {...defaultProps} isAiThinking={true} />)
    expect(screen.getByText('AI 思考中…')).toBeTruthy()
  })

  it('does not show AI thinking overlay normally', () => {
    render(<Board {...defaultProps} isAiThinking={false} />)
    expect(screen.queryByText('AI 思考中…')).toBeNull()
  })

  it('renders placed stones on the board', () => {
    const board = placeStone(createBoard(), { row: 7, col: 7 }, 'white')!
    const { container } = render(<Board {...defaultProps} board={board} />)
    expect(container.querySelector('[class*="stoneWhite"]')).toBeTruthy()
  })
})
