import { test, expect } from '@playwright/test'

test.describe('双人对战 (PvP)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // 选择双人对战并开始
    await page.getByText('双人对战').click()
    await page.getByText('开始游戏').click()
  })

  test('进入游戏后显示棋盘', async ({ page }) => {
    await expect(page.getByTestId('game-board')).toBeVisible()
  })

  test('白棋先行 — 游戏信息面板显示白棋激活', async ({ page }) => {
    // 游戏信息面板应显示白棋当前激活（有箭头指示）
    await expect(page.getByText('玩家一（白）')).toBeVisible()
  })

  test('点击棋盘格可以落子', async ({ page }) => {
    const board = page.getByTestId('game-board')
    // 点击中心格 (7,7)
    await board.getByRole('button').nth(7 * 15 + 7).click()
    // 落子后玩家切换到黑棋
    await expect(page.getByText('玩家二（黑）')).toBeVisible()
  })

  test('悔棋功能', async ({ page }) => {
    const board = page.getByTestId('game-board')
    await board.getByRole('button').nth(7 * 15 + 7).click() // 白棋落子
    await page.getByText('↩ 悔棋').click()
    // 回到第 0 手
    await expect(page.getByText('第 0 手')).toBeVisible()
  })

  test('重新开始清空棋盘', async ({ page }) => {
    const board = page.getByTestId('game-board')
    await board.getByRole('button').nth(7 * 15 + 7).click()
    await page.getByText('↺ 重新开始').click()
    await expect(page.getByText('第 0 手')).toBeVisible()
  })

  test('返回菜单回到模式选择', async ({ page }) => {
    await page.getByText('返回菜单').click()
    await expect(page.getByText('开始游戏')).toBeVisible()
  })

  test('白棋五连获胜', async ({ page }) => {
    // 在 row=7 下白棋5子，中间穿插黑棋避开干扰
    // 白: (7,0-4), 黑: (8,0-3)
    const board = page.getByTestId('game-board')
    const moves = [
      7 * 15 + 0, // white (7,0)
      8 * 15 + 0, // black (8,0)
      7 * 15 + 1, // white (7,1)
      8 * 15 + 1, // black (8,1)
      7 * 15 + 2, // white (7,2)
      8 * 15 + 2, // black (8,2)
      7 * 15 + 3, // white (7,3)
      8 * 15 + 3, // black (8,3)
      7 * 15 + 4, // white (7,4) — white wins!
    ]
    for (const idx of moves) {
      await board.getByRole('button').nth(idx).click()
    }
    // 胜利弹窗应出现
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('白棋胜利！')).toBeVisible()
  })

  test('胜利弹窗 — 点击再来一局重新开始', async ({ page }) => {
    const board = page.getByTestId('game-board')
    const moves = [
      7 * 15 + 0, 8 * 15 + 0,
      7 * 15 + 1, 8 * 15 + 1,
      7 * 15 + 2, 8 * 15 + 2,
      7 * 15 + 3, 8 * 15 + 3,
      7 * 15 + 4,
    ]
    for (const idx of moves) {
      await board.getByRole('button').nth(idx).click()
    }
    await page.getByText('再来一局').click()
    await expect(page.getByTestId('game-board')).toBeVisible()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})
