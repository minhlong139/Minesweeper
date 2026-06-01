# Plan — UI Layout & Components

**Feature ID**: 002 | **Risk level**: Medium | **Phase**: plan
**Tech Lead**: TBD | **Trạng thái**: ☐ Draft ☐ Approved

## 1. Tổng quan kiến trúc

UI được xây dựng bằng React functional components + TypeScript. State tập trung trong custom hook `useMinesweeper`, truyền xuống qua props (không dùng Context/Redux — app nhỏ, props drilling đủ dùng).

```
src/
├── main.tsx                    ← ReactDOM.createRoot, render <App />
├── App.tsx                     ← App shell, load global CSS
├── styles/
│   └── global.css              ← CSS variables, reset, font
├── components/
│   ├── GameShell.tsx           ← Container chính, gọi useMinesweeper
│   ├── StatusBar.tsx           ← Mine counter + Timer + Game status + Reset
│   ├── DifficultySelector.tsx  ← 3 nút difficulty
│   ├── Board.tsx               ← CSS Grid, render Cell[]
│   ├── Cell.tsx                ← 1 ô, 6 visual states
│   ├── ControlBar.tsx          ← Reveal/Flag mode + Reset (mobile sticky)
│   └── GameMessage.tsx         ← Trạng thái text
├── hooks/
│   └── useMinesweeper.ts       ← Primary state hook
└── game/                       ← Import từ spec 001
```

## 2. State Management — useMinesweeper hook

```typescript
function useMinesweeper() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Actions
  const newGame = (difficulty: DifficultyLevel) => { ... };
  const reveal = (row: number, col: number) => { ... };
  const toggleFlag = (row: number, col: number) => { ... };
  const chord = (row: number, col: number) => { ... };
  const setControlMode = (mode: ControlMode) => { ... };
  const tick = () => { ... };  // timer

  return {
    ...state,
    newGame, reveal, toggleFlag, chord, setControlMode, tick,
  };
}
```

**useReducer** được chọn thay vì useState vì state phức tạp, nhiều action, và mỗi action cần update nhiều field cùng lúc.

### GameState (trong hook)

```typescript
type UIState = {
  board: Cell[][];
  status: GameStatus;
  difficulty: DifficultyLevel;
  controlMode: ControlMode;           // "reveal" | "flag"
  flagsPlaced: number;
  mineCount: number;
  revealedSafeCells: number;
  totalSafeCells: number;
  elapsedSeconds: number;
  timerRunning: boolean;
};
```

### Reducer actions

```typescript
type GameAction =
  | { type: "NEW_GAME"; difficulty: DifficultyLevel }
  | { type: "REVEAL"; row: number; col: number }
  | { type: "FLAG"; row: number; col: number }
  | { type: "CHORD"; row: number; col: number }
  | { type: "SET_CONTROL_MODE"; mode: ControlMode }
  | { type: "TICK" };
```

**TICK action**: tăng `elapsedSeconds` lên 1, không vượt quá 999.

## 3. Component Specifications

### 3.1 App.tsx
- Import `global.css`
- Render `<GameShell />`
- Chỉ 1 component, không có logic

### 3.2 GameShell.tsx
- Gọi `useMinesweeper()` hook
- Render layout dọc:
  ```
  <Header />
  <StatusBar />
  <DifficultySelector />
  <Board />
  <ControlBar />
  <GameMessage />
  ```
- Props drilling: truyền state + callbacks xuống từng component

### 3.3 StatusBar.tsx
```
Props: { mineCount, flagsPlaced, elapsedSeconds, status, onReset }
```
- Mine counter: `mineCount - flagsPlaced`, format 3 chữ số
- Timer: `elapsedSeconds`, format 3 chữ số
- Game status icon: 😊 / 😎 / 💀
- Reset button → `onReset()`

### 3.4 DifficultySelector.tsx
```
Props: { currentDifficulty, onSelect }
```
- 3 nút: Beginner | Intermediate | Expert
- Active button: style khác biệt

### 3.5 Board.tsx
```
Props: { board, onReveal, onFlag, onChord, controlMode, status }
```
- CSS Grid: `grid-template-columns: repeat(var(--cols), 1fr)`
- `role="grid"`, `aria-label="Minesweeper board"`
- Context menu prevention: `onContextMenu={e => e.preventDefault()}`
- CSS: `user-select: none; touch-action: manipulation;`

### 3.6 Cell.tsx
```
Props: { cell, onReveal, onFlag, onChord, controlMode, status }
```
- Render dựa trên cell state: hidden / revealed-number / revealed-empty / flagged / mine / exploded
- CSS class mapping:
  ```
  cell-hidden, cell-revealed, cell-n1..cell-n8,
  cell-flagged, cell-mine, cell-exploded, cell-incorrect-flag
  ```
- `React.memo(Cell)` để tránh re-render toàn bộ board khi chỉ 1 cell thay đổi

### 3.7 ControlBar.tsx
```
Props: { controlMode, onModeChange, onReset }
```
- 2 nút mode: Reveal | Flag (active state rõ ràng)
- Reset button
- Mobile: sticky bottom, `position: sticky; bottom: 0;`

### 3.8 GameMessage.tsx
```
Props: { status }
```
- `idle` → "Sẵn sàng — Chạm để bắt đầu"
- `playing` → "Đang chơi"
- `won` → "🎉 Bạn đã thắng!"
- `lost` → "💣 Game Over"

## 4. CSS Strategy

### CSS Modules
Mỗi component có file `.module.css` riêng:
```
Cell.tsx
Cell.module.css
Board.tsx
Board.module.css
...
```

### CSS Variables (global.css)
```css
:root {
  --color-cell-hidden: #c0c0c0;
  --color-cell-revealed: #e0e0e0;
  --color-cell-border-light: #ffffff;
  --color-cell-border-dark: #808080;
  --color-n1: #0000FF;
  --color-n2: #008000;
  --color-n3: #CC0000;   /* Adjusted for WCAG AA */
  --color-n4: #000080;
  --color-n5: #800000;
  --color-n6: #006666;   /* Adjusted for WCAG AA */
  --color-n7: #000000;
  --color-n8: #666666;   /* Adjusted for WCAG AA */
  --color-mine: #000000;
  --color-exploded: #FF0000;
  --color-flag: #FF0000;
  --board-max-width: 480px;
  --cell-min-size: 28px;
  --touch-target: 44px;
}
```

### Cell auto-scale (Expert mode)
```css
.board {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  width: 100%;
  max-width: var(--board-max-width);
}
.cell {
  aspect-ratio: 1 / 1;
  min-width: var(--cell-min-size);
}
```

Cell size = `min(100% / cols, auto)` → tự động scale. Với Expert 16 cols × max-width 480px: mỗi cell ≈ 30px.

## 5. Timer Implementation

```typescript
// Trong GameShell hoặc useMinesweeper
useEffect(() => {
  if (!timerRunning) return;
  const interval = setInterval(() => dispatch({ type: "TICK" }), 1000);
  return () => clearInterval(interval);
}, [timerRunning]);
```

`timerRunning = true` khi first reveal (status chuyển idle → playing).
`timerRunning = false` khi status chuyển sang won/lost.

## 6. Performance Optimizations

- `React.memo(Cell)` — chỉ re-render cell thay đổi
- `useCallback` cho event handlers trong useMinesweeper
- Không dùng `useMemo` cho board vì board clone mỗi lần update → reference luôn thay đổi → cần memo từng Cell dựa trên cell data
- Cell comparison: shallow compare `cell.isRevealed`, `cell.isFlagged`, `cell.isExploded`, `cell.adjacentMines`

## 7. Constitution Check

| Gate | Status |
|------|--------|
| Tách biệt engine/UI | ✅ Components chỉ gọi engine functions, không chứa game logic |
| React + TypeScript | ✅ Strict mode, functional components |
| CSS Modules | ✅ Không hardcode màu, dùng CSS variables |
| Responsive | ✅ CSS Grid + container max-width |
| Accessibility cơ bản | ✅ role="grid", aria-label |
| Vite build | ✅ `npm create vite@latest -- --template react-ts` |

## 8. Rủi ro & Mitigation

| Rủi ro | Impact | Mitigation |
|--------|--------|------------|
| Board re-render tất cả cell khi state thay đổi | Perf | React.memo(Cell) + shallow compare |
| Timer không dừng khi tab background | UX | Dùng `setInterval` (có thể lệch nhưng đơn giản), hoặc `Date.now()` diff nếu cần chính xác |
| Cell quá nhỏ trên mobile nhỏ | UX | min-width 28px, chấp nhận được |
