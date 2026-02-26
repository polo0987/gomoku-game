import { test, expect } from '@playwright/test'

test.describe('人机对战 (PvE)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('人机对战').click()
    // 选择简单难度（避免 AI 耗时过长）
    await page.getByText('简单').click()
    await page.getByText('开始游戏').click()
  })

  test('进入游戏显示人机对战信息', async ({ page }) => {
    await expect(page.getByText('人机对战')).toBeVisible()
    await expect(page.getByTestId('game-board')).toBeVisible()
  })

  test('玩家落子后 AI 自动落子', async ({ page }) => {
    // 白棋（玩家）落子
    const board = page.getByTestId('game-board')
    await board.getByRole('button').nth(7 * 15 + 7).click()

    // 等待 AI 思考完成并落子（最多 3 秒）
    await expect(page.getByText('第 2 手')).toBeVisible({ timeout: 3000 })
  })

  test('显示 YOU 标签标记玩家', async ({ page }) => {
    await expect(page.getByText('YOU')).toBeVisible()
  })

  test('可以悔棋（撤销玩家和 AI 的棋）', async ({ page }) => {
    const board = page.getByTestId('game-board')
    await board.getByRole('button').nth(7 * 15 + 7).click()
    // 等待 AI 落子
    await expect(page.getByText('第 2 手')).toBeVisible({ timeout: 3000 })
    // 悔棋应撤销 2 步
    await page.getByText('↩ 悔棋').click()
    await expect(page.getByText('第 0 手')).toBeVisible()
  })
})

test.describe('模式选择界面', () => {
  test('显示所有选项', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('五子棋')).toBeVisible()
    await expect(page.getByText('双人对战')).toBeVisible()
    await expect(page.getByText('人机对战')).toBeVisible()
    await expect(page.getByText('开始游戏')).toBeVisible()
  })

  test('选人机对战后显示难度选项', async ({ page }) => {
    await page.goto('/')
    await page.getByText('人机对战').click()
    await expect(page.getByText('简单')).toBeVisible()
    await expect(page.getByText('中等')).toBeVisible()
    await expect(page.getByText('困难')).toBeVisible()
  })

  test('选人机对战后显示颜色选项', async ({ page }) => {
    await page.goto('/')
    await page.getByText('人机对战').click()
    await expect(page.getByText('白棋（先手）')).toBeVisible()
    await expect(page.getByText('黑棋（后手）')).toBeVisible()
  })
})
