# Tasks — Game Engine

**Feature ID**: 001 | **Risk level**: Medium | **Phase**: tasks
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Sequence

```
types → constants → board → reveal (BFS) → flag → chord → win → barrel → tests
```

---

## Task 1: Scaffold game module

| Field | Value |
|-------|-------|
| **File** | `src/game/types.ts`, `src/game/constants.ts`, `src/game/index.ts` |
| **Risk** | Low |
| **Depends on** | — |

- Tạo thư mục `src/game/`
- Viết tất cả TypeScript types trong `types.ts`
- Viết constants `DIFFICULTIES`, `DIRECTIONS` trong `constants.ts`
- Tạo barrel `index.ts` (re-export tất cả)

**DoD**: Types compile không lỗi, constants đúng giá trị từ spec.

---

## Task 2: Board functions

| Field | Value |
|-------|-------|
| **File** | `src/game/board.ts` |
| **Risk** | Medium |
| **Depends on** | Task 1 |

- `createEmptyBoard(rows, cols)` — tạo board Cell[][]
- `getNeighbors(board, row, col)` — lấy neighbors trong bounds
- `countFlaggedNeighbors(board, row, col)`
- `placeMines(board, mineCount, safeRow, safeCol)` — Fisher-Yates shuffle
- `calculateAdjacentMines(board)`

**DoD**: Tất cả functions có type signature đúng, chạy thử manual với console.log.

---

## Task 3: Reveal functions (BFS flood)

| Field | Value |
|-------|-------|
| **File** | `src/game/reveal.ts` |
| **Risk** | **High** |
| **Depends on** | Task 2 |

- `floodReveal(board, startRow, startCol)` — queue-based BFS
- `revealCell(board, row, col)` — dispatch flood hoặc single reveal
- `revealAllMines(board)` — reveal khi thua

**DoD**: Flood reveal không infinite loop, không bỏ sót cell, không reveal flagged cell.

---

## Task 4: Flag functions

| Field | Value |
|-------|-------|
| **File** | `src/game/flag.ts` |
| **Risk** | Low |
| **Depends on** | Task 2 |

- `toggleFlag(board, row, col, flagsPlaced, mineCount)` — chặn over-flagging
- `autoFlagMines(board)` — flag tất cả mìn khi thắng

**DoD**: Toggle đúng behavior, không flag revealed cell, không vượt mineCount.

---

## Task 5: Chord functions

| Field | Value |
|-------|-------|
| **File** | `src/game/chord.ts` |
| **Risk** | Medium |
| **Depends on** | Task 3, Task 4 |

- `chordReveal(board, row, col)` — reveal neighbors nếu đủ flag
- `isChordSafe(board, row, col)` — helper cho UI highlight

**DoD**: Chord đúng logic, sai flag → hitMine, thiếu flag → không làm gì.

---

## Task 6: Win check

| Field | Value |
|-------|-------|
| **File** | `src/game/win.ts` |
| **Risk** | Low |
| **Depends on** | Task 2 |

- `checkWin(revealedSafeCells, totalSafeCells)` — boolean

**DoD**: Đúng cho mọi board size.

---

## Task 7: Unit tests

| Field | Value |
|-------|-------|
| **File** | `src/game/__tests__/board.test.ts`, `reveal.test.ts`, `flag.test.ts`, `chord.test.ts`, `win.test.ts` |
| **Risk** | Low |
| **Depends on** | Task 1–6 |

Test cases tối thiểu:
- **board.test.ts**: createEmptyBoard size, placeMines count + safe zone, calculateAdjacentMines accuracy
- **reveal.test.ts**: first click safety, flood reveal extent, single reveal, reveal flagged (should block)
- **flag.test.ts**: toggle on/off, cannot flag revealed, over-flagging block, autoFlagMines
- **chord.test.ts**: safe chord, wrong chord → mine, insufficient flags → no-op
- **win.test.ts**: win condition, not-win edge cases

**DoD**: `npx vitest run` — tất cả test pass.

---

## Task 8: Integration sanity check

| Field | Value |
|-------|-------|
| **Risk** | Low |
| **Depends on** | Task 1–7 |

- Tạo script tạm `test-integration.ts`: tạo game mới → first reveal → flood → flag → chord → kiểm tra state nhất quán
- Chạy full flow beginner/intermediate/expert

**DoD**: Full game flow chạy không lỗi, state transition đúng.

---

## Definition of Done (tổng)

- [ ] Tất cả 7 file trong `src/game/` tồn tại và compile
- [ ] 5 file test trong `src/game/__tests__/` pass 100%
- [ ] Engine không import React, DOM, hoặc bất kỳ dependency ngoài
- [ ] Mọi function có type signature rõ ràng
- [ ] Integration sanity check pass cho 3 difficulty
