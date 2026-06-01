# Tasks — UI Layout & Components

**Feature ID**: 002 | **Risk level**: Medium | **Phase**: tasks
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Sequence

```
scaffold Vite → global CSS → useMinesweeper hook → GameShell → Board+Cell → StatusBar + DifficultySelector + ControlBar + GameMessage → responsive polish
```

---

## Task 1: Scaffold Vite + React + TS

| Field | Value |
|-------|-------|
| **Risk** | Low |
| **Depends on** | — |

- `npm create vite@latest . -- --template react-ts` trong project root
- Cài thêm dependencies: không cần (chỉ React + TypeScript)
- Xóa boilerplate (App.css, assets/react.svg)
- Cấu trúc thư mục theo plan.md

**DoD**: `npm run dev` → hiển thị blank page, không lỗi.

---

## Task 2: Global CSS + CSS Variables

| Field | Value |
|-------|-------|
| **File** | `src/styles/global.css` |
| **Risk** | Low |
| **Depends on** | Task 1 |

- CSS reset cơ bản
- CSS custom properties (màu cell, màu số, kích thước)
- Font: system font stack
- `.app-shell` container
- Mobile safe area

**DoD**: File CSS compile, variables hiển thị đúng trong browser inspector.

---

## Task 3: useMinesweeper hook

| Field | Value |
|-------|-------|
| **File** | `src/hooks/useMinesweeper.ts` |
| **Risk** | **High** |
| **Depends on** | Task 1, spec 001 (engine types) |

- `useReducer` với `GameState` + `GameAction`
- Actions: NEW_GAME, REVEAL, FLAG, CHORD, SET_CONTROL_MODE, TICK
- NEW_GAME: gọi `createEmptyBoard()`, set difficulty
- REVEAL: gọi `revealCell()`, nếu first move → `placeMines()` + `calculateAdjacentMines()`
- FLAG: gọi `toggleFlag()`
- CHORD: gọi `chordReveal()`
- Win/loss detection trong reducer
- Timer: `useEffect` + `setInterval` khi `timerRunning`

**DoD**: Hook hoạt động độc lập, có thể test bằng console.log state.

---

## Task 4: GameShell + App

| Field | Value |
|-------|-------|
| **File** | `src/App.tsx`, `src/components/GameShell.tsx` |
| **Risk** | Low |
| **Depends on** | Task 3 |

- App.tsx: render GameShell
- GameShell.tsx: gọi useMinesweeper(), render layout dọc với placeholder components

**DoD**: Layout dọc hiển thị, có thể thấy state trong React DevTools.

---

## Task 5: Board + Cell components

| Field | Value |
|-------|-------|
| **File** | `src/components/Board.tsx`, `src/components/Cell.tsx` + CSS Modules |
| **Risk** | **High** |
| **Depends on** | Task 3 |

- Board: CSS Grid, render Cell[] từ board prop
- Cell: React.memo, 6 visual states (hidden/revealed/flagged/mine/exploded/incorrect)
- Cell click handler: gọi onReveal hoặc onChord tùy theo cell state
- Cell right-click: gọi onFlag, preventDefault context menu
- Cell CSS: 3D border classic, số màu

**DoD**: Click vào cell → cell reveal, hiển thị số hoặc vùng trống. Right-click → flag.

---

## Task 6: StatusBar + DifficultySelector + ControlBar + GameMessage

| Field | Value |
|-------|-------|
| **Files** | 4 component files + CSS Modules |
| **Risk** | Low |
| **Depends on** | Task 3 |

- StatusBar: mine counter + timer + status icon + reset
- DifficultySelector: 3 nút, active state
- ControlBar: Reveal/Flag mode buttons + reset
- GameMessage: text theo status

**DoD**: Tất cả component render đúng, tương tác được.

---

## Task 7: Responsive + polish

| Field | Value |
|-------|-------|
| **Files** | CSS Modules toàn bộ |
| **Risk** | Low |
| **Depends on** | Task 4–6 |

- Container max-width 480px (mobile) / 520px (desktop)
- Cell auto-scale: board luôn vừa màn hình
- ControlBar sticky bottom trên mobile
- Safe area padding
- Test trên Chrome DevTools mobile view (375px, 414px, 768px)

**DoD**: Game hiển thị đẹp trên cả mobile portrait và desktop.

---

## Task 8: Build & deploy test

| Field | Value |
|-------|-------|
| **Risk** | Low |
| **Depends on** | Task 1–7 |

- `npm run build` → không lỗi
- `npm run preview` → chạy thử production build
- Test trên điện thoại thật (qua local network)

**DoD**: Production build thành công, chạy được trên mobile browser.

---

## Definition of Done

- [ ] 7 components + 1 hook hoàn chỉnh
- [ ] Board tương tác được: reveal, flag, chord
- [ ] Difficulty selector hoạt động (reset game)
- [ ] Timer + mine counter hiển thị đúng
- [ ] Responsive trên mobile portrait và desktop
- [ ] `npm run build` thành công
