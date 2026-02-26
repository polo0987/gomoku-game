# 五子棋 · Gomoku

Web 版五子棋游戏，支持双人对战和人机对战（AI）。

**[▶ 在线体验](https://your-username.github.io/gomoku-game/)**（部署后替换链接）

## 功能

- **双人对战** — 两名玩家在同一设备轮流落子
- **人机对战** — 与 AI 对战，三档难度（简单 / 中等 / 困难）
- **白棋先行** — 白棋执先手
- **悔棋** — 双人模式撤销一步，人机模式同时撤销玩家和 AI 的棋
- **获胜连线高亮** — 五连子后自动高亮胜利棋子
- **响应式布局** — 支持桌面和移动端

## 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite |
| 样式 | CSS Modules |
| 状态 | React Context + useReducer |
| AI | Minimax + Alpha-Beta 剪枝 |
| 单元测试 | Vitest + React Testing Library |
| E2E 测试 | Playwright |
| 部署 | GitHub Pages |

## AI 实现

AI 使用 Minimax 算法配合 Alpha-Beta 剪枝：

- **简单**：搜索深度 1
- **中等**：搜索深度 2
- **困难**：搜索深度 4

评分系统识别活四、冲四、活三等棋型，候选点限定在已有棋子周围，保证响应速度。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行单元测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行 E2E 测试（需先启动 dev server）
npm run test:e2e

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── game/          # 核心逻辑（纯函数，无框架依赖）
│   ├── board.ts   # 棋盘操作、落子、判赢
│   ├── scoring.ts # 棋型评分
│   ├── ai.ts      # AI 引擎（Minimax）
│   └── types.ts   # 类型定义
├── hooks/         # useGameState（游戏状态管理）
├── components/    # UI 组件
│   ├── Board/
│   ├── Cell/
│   ├── GameInfo/
│   ├── GameControls/
│   ├── ModeSelector/
│   └── WinnerModal/
e2e/               # Playwright E2E 测试
```

## 测试覆盖率

- 整体覆盖率：**92%+**
- 核心逻辑（`src/game/`）：**95%+**
- 组件层：**88%+**

## License

MIT
