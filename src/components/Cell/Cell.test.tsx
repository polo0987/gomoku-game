import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Cell from './Cell'

const defaultProps = {
  row: 0,
  col: 0,
  stone: null,
  isWinning: false,
  currentPlayer: 'white' as const,
  disabled: false,
  onPlace: vi.fn(),
}

describe('Cell', () => {
  it('renders an empty cell', () => {
    render(<Cell {...defaultProps} />)
    const cell = screen.getByRole('button')
    expect(cell).toBeTruthy()
  })

  it('calls onPlace when clicked on empty cell', () => {
    const onPlace = vi.fn()
    render(<Cell {...defaultProps} onPlace={onPlace} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPlace).toHaveBeenCalledWith({ row: 0, col: 0 })
  })

  it('does not call onPlace when disabled', () => {
    const onPlace = vi.fn()
    render(<Cell {...defaultProps} disabled={true} onPlace={onPlace} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPlace).not.toHaveBeenCalled()
  })

  it('does not call onPlace when cell is occupied', () => {
    const onPlace = vi.fn()
    render(<Cell {...defaultProps} stone="white" onPlace={onPlace} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPlace).not.toHaveBeenCalled()
  })

  it('renders white stone when stone is white', () => {
    const { container } = render(<Cell {...defaultProps} stone="white" />)
    expect(container.querySelector('[class*="stoneWhite"]')).toBeTruthy()
  })

  it('renders black stone when stone is black', () => {
    const { container } = render(<Cell {...defaultProps} stone="black" />)
    expect(container.querySelector('[class*="stoneBlack"]')).toBeTruthy()
  })

  it('applies winning class when isWinning is true', () => {
    const { container } = render(<Cell {...defaultProps} stone="white" isWinning={true} />)
    expect(container.querySelector('[class*="winning"]')).toBeTruthy()
  })

  it('handles keyboard Enter to place stone', () => {
    const onPlace = vi.fn()
    render(<Cell {...defaultProps} onPlace={onPlace} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(onPlace).toHaveBeenCalledWith({ row: 0, col: 0 })
  })

  it('has correct aria-label', () => {
    render(<Cell {...defaultProps} row={2} col={3} stone="black" />)
    const cell = screen.getByRole('button')
    expect(cell.getAttribute('aria-label')).toContain('Row 3')
    expect(cell.getAttribute('aria-label')).toContain('Column 4')
    expect(cell.getAttribute('aria-label')).toContain('black stone')
  })
})
