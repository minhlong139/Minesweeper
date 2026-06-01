# Plan — Game Engine

**Feature ID**: 001 | **Risk level**: Medium | **Phase**: plan
**Tech Lead**: TBD | **Trạng thái**: ☐ Draft ☐ Approved

## 1. Tổng quan kiến trúc

Game engine là một tập hợp pure TypeScript functions trong `src/game/`. Engine không import React, không dùng DOM API, không có side effects. Mỗi function nhận state cũ → trả state mới.

```
src/game/
├── types.ts          ← Cell, GameState, GameStatus, DifficultyLevel types
├── constants.ts      ← DIFFICULTIES preset, DIRECTIONS (8 neighbors)
├── board.ts          ← createEmptyBoard, placeMines, calculateAdjacentMines
├── reveal.ts         ← revealCell, floodReveal (BFS), revealAllMines
├── flag.ts           ← toggleFlag, autoFlagMines
├── chord.ts          ← chordReveal, isChordSafe, countFlaggedNeighbors
├── win.ts            ← checkWin
└── index.ts          ← barrel export
```

## 2. Module chi tiết

### 2.1 types.ts

```typescript
export type GameStatus = "idle" | "playing" | "won" | "lost";

export type Cell = {
  row: number;
  col: number;
  hasMine: boolean;
  adjacentMines: number;     // 0–8
  isRevealed: boolean;
  isFlagged: boolean;
  isExploded: boolean;
  isIncorrectFlag: boolean;
};

export type GameState = {
  rows: number;
  cols: number;
  mineCount: number;
  board: Cell[][];
  status: GameStatus;
  firstMoveDone: boolean;
  flagsPlaced: number;
  revealedSafeCells: number;
  totalSafeCells: number;
};

export type DifficultyLevel = "beginner" | "intermediate" | "expert";

export type DifficultyConfig = {
  rows: number;
  cols: number;
  mines: number;
};

export type RevealResult = {
  board: Cell[][];
  hitMine: boolean;
  revealedCount: number;
};
```

### 2.2 constants.ts

```typescript
export const DIFFICULTIES: Record<DifficultyLevel, DifficultyConfig> = {
  beginner:     { rows: 9,  cols: 9,  mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert:       { rows: 16, cols: 30, mines: 99 },
};

// 8 hướng xung quanh 1 cell
export const DIRECTIONS: readonly [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],           [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];
```

### 2.3 board.ts

**createEmptyBoard(rows, cols)**
- Tạo mảng 2 chiều `Cell[][]` với mọi cell ở trạng thái default
- `hasMine: false`, `adjacentMines: 0`, `isRevealed: false`, `isFlagged: false`, `isExploded: false`, `isIncorrectFlag: false`
- Gán `row`, `col` cho từng cell

```typescript
export function createEmptyBoard(rows: number, cols: number): Cell[][]
```

**placeMines(board, mineCount, safeRow, safeCol)**
- Tạo danh sách tất cả vị trí hợp lệ (loại trừ safeRow, safeCol và 8 ô xung quanh nếu đủ không gian)
- Dùng **Fisher-Yates shuffle** để chọn ngẫu nhiên `mineCount` vị trí
- Set `hasMine = true` cho các vị trí được chọn
- Trả về board mới (immutable)

```typescript
export function placeMines(
  board: Cell[][], 
  mineCount: number, 
  safeRow: number, 
  safeCol: number
): Cell[][]
```

**calculateAdjacentMines(board)**
- Duyệt tất cả cell. Nếu cell không có mìn → đếm số mìn trong 8 hướng → gán `adjacentMines`
- Trả về board mới

```typescript
export function calculateAdjacentMines(board: Cell[][]): Cell[][]
```

**getNeighbors(board, row, col)**
- Helper: trả về mảng các cell lân cận hợp lệ (trong bounds)
```typescript
export function getNeighbors(board: Cell[][], row: number, col: number): Cell[]
```

**countFlaggedNeighbors(board, row, col)**
- Helper: đếm số ô đã flag trong 8 neighbors
```typescript
export function countFlaggedNeighbors(board: Cell[][], row: number, col: number): number
```

### 2.4 reveal.ts

**revealCell(board, row, col)**
- Nếu cell đã revealed hoặc đã flagged → return unchanged
- Nếu cell có mìn → `isExploded = true`, return `hitMine: true`
- Nếu `adjacentMines === 0` → gọi `floodReveal()`
- Nếu `adjacentMines > 0` → chỉ mở cell đó
- Trả về `RevealResult`

```typescript
export function revealCell(
  board: Cell[][], 
  row: number, 
  col: number
): RevealResult
```

**floodReveal(board, startRow, startCol)**
- **Queue-based BFS**:
  1. Khởi tạo queue = [(startRow, startCol)], visited Set
  2. Pop (r, c) từ queue
  3. Nếu cell.adjacentMines > 0 → reveal cell, không thêm neighbors
  4. Nếu cell.adjacentMines === 0 → reveal cell, thêm tất cả neighbors chưa visited, chưa revealed, chưa flagged vào queue
  5. Lặp đến khi queue rỗng
- Trả về board mới + số cell đã reveal

```typescript
export function floodReveal(
  board: Cell[][], 
  startRow: number, 
  startCol: number
): { board: Cell[][]; revealedCount: number }
```

**revealAllMines(board)**
- Khi thua: reveal tất cả cell có `hasMine = true`
- Đánh dấu `isIncorrectFlag = true` cho cell `isFlagged && !hasMine`
- Đánh dấu `isExploded` (đã có từ revealCell lúc thua)

```typescript
export function revealAllMines(board: Cell[][]): Cell[][]
```

### 2.5 flag.ts

**toggleFlag(board, row, col, mineCount)**
- Nếu cell đã revealed → return unchanged
- Nếu đang flag → gỡ flag: `isFlagged = false`, `flagsPlaced--`
- Nếu chưa flag và `flagsPlaced < mineCount` → cắm flag: `isFlagged = true`, `flagsPlaced++`
- Nếu `flagsPlaced >= mineCount` → từ chối (chặn over-flagging)

```typescript
export function toggleFlag(
  board: Cell[][],
  row: number,
  col: number,
  currentFlagsPlaced: number,
  mineCount: number
): { board: Cell[][]; flagsPlaced: number; changed: boolean }
```

**autoFlagMines(board)**
- Khi thắng: duyệt tất cả cell, nếu `hasMine && !isFlagged` → `isFlagged = true`
- Trả về `flagsPlaced = mineCount`

```typescript
export function autoFlagMines(board: Cell[][]): { board: Cell[][]; flagsPlaced: number }
```

### 2.6 chord.ts

**chordReveal(board, row, col)**
- Chỉ hoạt động nếu cell đã revealed và `adjacentMines > 0`
- Gọi `countFlaggedNeighbors(board, row, col)`
- Nếu count === adjacentMines → reveal tất cả non-flagged, non-revealed neighbors
- Nếu bất kỳ neighbor nào có mìn → `hitMine = true`
- Trả về `RevealResult`

```typescript
export function chordReveal(
  board: Cell[][], 
  row: number, 
  col: number
): RevealResult
```

**isChordSafe(board, row, col)**
- Helper cho UI: kiểm tra chord có an toàn không (để highlight)
```typescript
export function isChordSafe(board: Cell[][], row: number, col: number): boolean
```

### 2.7 win.ts

**checkWin(board, totalSafeCells, revealedSafeCells)**
- `revealedSafeCells === totalSafeCells` → thắng
```typescript
export function checkWin(
  revealedSafeCells: number, 
  totalSafeCells: number
): boolean
```

### 2.8 index.ts (barrel)

```typescript
export * from "./types";
export * from "./constants";
export * from "./board";
export * from "./reveal";
export * from "./flag";
export * from "./chord";
export * from "./win";
```

## 3. Data Flow

```
User Action (click/tap)
    ↓
useMinesweeper hook (React state)
    ↓ gọi engine function với state hiện tại
Engine function (pure TS)
    ↓ xử lý logic, trả về state mới
useMinesweeper hook
    ↓ setState(newState)
React re-render
    ↓
UI cập nhật
```

**Immutable update pattern:**

```typescript
// Trong revealCell:
const newBoard = board.map(row => row.map(cell => ({ ...cell })));
// ... modify newBoard ...
return { board: newBoard, hitMine, revealedCount };
```

## 4. BFS Flood Reveal — Pseudocode

```
function floodReveal(board, startRow, startCol):
  newBoard = deepClone(board)
  queue = [(startRow, startCol)]
  visited = new Set([`${startRow},${startCol}`])
  revealedCount = 0

  while queue.length > 0:
    (r, c) = queue.shift()
    cell = newBoard[r][c]
    
    if cell.isFlagged or cell.isRevealed: continue
    
    cell.isRevealed = true
    revealedCount++

    if cell.adjacentMines === 0:
      for each (dr, dc) in DIRECTIONS:
        nr = r + dr, nc = c + dc
        if inBounds(nr, nc) and not visited.has(`${nr},${nc}`):
          neighbor = newBoard[nr][nc]
          if not neighbor.isRevealed and not neighbor.isFlagged:
            queue.push((nr, nc))
            visited.add(`${nr},${nc}`)

  return { board: newBoard, revealedCount }
```

## 5. Immutable Update Strategy

Mỗi engine function:
1. Clone board: `board.map(row => row.map(cell => ({ ...cell })))`
2. Modify cloned board
3. Return cloned board

**Performance note**: Expert board (480 cells) clone + modify < 5ms trên V8. Không cần optimization phức tạp như Immer.

## 6. Test Plan

| Test file | Scope | Cases |
|-----------|-------|-------|
| `board.test.ts` | createEmptyBoard, placeMines, calculateAdjacentMines | 10+ cases |
| `reveal.test.ts` | revealCell, floodReveal, revealAllMines | 15+ cases |
| `flag.test.ts` | toggleFlag, autoFlagMines, over-flagging block | 8+ cases |
| `chord.test.ts` | chordReveal, isChordSafe, wrong chord → mine hit | 8+ cases |
| `win.test.ts` | checkWin edge cases | 5+ cases |

**Key edge cases:**
- First click safety (never hits mine, opens empty area)
- Flood reveal on board edge / corner
- Flag then reveal same cell (should not reveal)
- Chord with 0 flagged neighbors (should do nothing)
- Chord with wrong flags (should hit mine)
- Over-flagging prevention
- Auto-flag on win (all mines flagged)
- Reveal after game over (should be rejected)

Sử dụng **Vitest** làm test runner.

## 7. Constitution Check

| Gate | Status |
|------|--------|
| Tách biệt engine/UI | ✅ Engine không import React/DOM |
| Pure functions | ✅ Mọi hàm nhận input → trả output, không side effect |
| TypeScript strict mode | ✅ Tất cả types rõ ràng |
| Unit test coverage | ✅ Mỗi function có test riêng |
| No external dependencies | ✅ Chỉ dùng TypeScript standard library |
| File structure theo spec | ✅ `src/game/` như constitution §4.1 |

## 8. Rủi ro & Mitigation

| Rủi ro | Impact | Mitigation |
|--------|--------|------------|
| BFS infinite loop | High | Visited Set ngăn duplicate |
| Mine placement bias | Medium | Fisher-Yates shuffle đảm bảo phân phối đều |
| Deep clone performance với Expert | Low | 480 cells clone < 5ms, không đáng lo |
| Thiếu edge case test | Medium | Test plan rõ ràng, review từng function |
