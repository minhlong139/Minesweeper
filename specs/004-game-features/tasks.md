# Tasks — Game Features

**Feature ID**: 004 | **Risk level**: Low | **Phase**: tasks
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Sequence

```
useLocalStorage → save best time → save settings → load on startup → ARIA labels → color contrast → polish
```

---

## Task 1: useLocalStorage hook

| Field | Value |
|-------|-------|
| **File** | `src/hooks/useLocalStorage.ts` |
| **Risk** | Low |
| **Depends on** | — |

- Generic hook `useLocalStorage<T>(key, initialValue)`
- Đọc từ localStorage khi mount
- Ghi vào localStorage khi setValue
- try-catch cho trường hợp localStorage không khả dụng

**DoD**: Hook hoạt động, giá trị persist qua refresh.

---

## Task 2: Save best time on win

| Field | Value |
|-------|-------|
| **File** | `src/hooks/useMinesweeper.ts` (sửa) |
| **Risk** | Low |
| **Depends on** | Task 1 |

- Trong reducer, khi action dẫn đến `status: "won"` → gọi `saveBestTime(difficulty, elapsedSeconds)`
- Dùng localStorage trực tiếp (không cần hook vì không cần reactive)
- Format key: `minesweeper.bestTime.{beginner|intermediate|expert}`

**DoD**: Thắng game → best time được lưu. Lần sau thắng nhanh hơn → update. Chậm hơn → giữ nguyên.

---

## Task 3: Save & load settings

| Field | Value |
|-------|-------|
| **File** | `src/hooks/useMinesweeper.ts` (sửa) |
| **Risk** | Low |
| **Depends on** | — |

- Khi đổi difficulty → `localStorage.setItem("minesweeper.settings.difficulty", diff)`
- Khi đổi controlMode → `localStorage.setItem("minesweeper.settings.controlMode", mode)`
- Khi khởi tạo state → đọc settings từ localStorage làm default

**DoD**: Refresh trang → game trở về difficulty + mode đã chọn trước đó.

---

## Task 4: Hiển thị best time

| Field | Value |
|-------|-------|
| **File** | `src/components/DifficultySelector.tsx` (sửa) |
| **Risk** | Low |
| **Depends on** | Task 2 |

- Đọc best time từ localStorage khi render (dùng `useLocalStorage`)
- Hiển thị dòng nhỏ: `(best: 045)` hoặc `(best: --)` nếu chưa có
- Format giống timer: 3 chữ số

**DoD**: Best time hiển thị dưới mỗi difficulty button.

---

## Task 5: ARIA labels cho Cell

| Field | Value |
|-------|-------|
| **File** | `src/components/Cell.tsx` (sửa) |
| **Risk** | Low |
| **Depends on** | spec 002 Cell |

- Thêm `aria-label` dynamic dựa trên cell state
- 7 trường hợp: hidden, flagged, revealed-empty, revealed-number, mine, exploded, incorrect-flag

**DoD**: Screen reader đọc đúng trạng thái từng cell.

---

## Task 6: ARIA cho Board + StatusBar

| Field | Value |
|-------|-------|
| **File** | `src/components/Board.tsx`, `StatusBar.tsx` |
| **Risk** | Low |
| **Depends on** | — |

- Board: `role="grid"`, `aria-label="Minesweeper board"`
- Row: `role="row"` (thêm `<div role="row">` bọc mỗi hàng)
- StatusBar: `aria-live="polite"` cho counter, `aria-live="assertive"` cho status

**DoD**: Board structure đúng ARIA grid pattern.

---

## Task 7: Color contrast fix

| Field | Value |
|-------|-------|
| **File** | `src/styles/global.css` |
| **Risk** | Low |
| **Depends on** | — |

- Sửa màu số 3: `#FF0000` → `#CC0000`
- Sửa màu số 6: `#008080` → `#006666`
- Sửa màu số 8: `#808080` → `#666666`
- Verify contrast bằng Chrome DevTools hoặc `https://webaim.org/resources/contrastchecker/`

**DoD**: Tất cả màu số đạt WCAG AA (contrast ≥ 4.5:1).

---

## Task 8: Over-flagging feedback

| Field | Value |
|-------|-------|
| **File** | `src/components/Cell.tsx`, `Cell.module.css` |
| **Risk** | Low |
| **Depends on** | spec 001 engine (toggleFlag returns `changed: false`) |

- Khi toggleFlag trả về `changed: false` → thêm class `cell-shake` trong 200ms
- CSS animation rung nhẹ

**DoD**: Cố flag vượt limit → cell rung nhẹ, không crash.

---

## Definition of Done

- [ ] useLocalStorage hook hoạt động
- [ ] Best time lưu & hiển thị cho 3 difficulty
- [ ] Settings (difficulty, mode) persist qua refresh
- [ ] ARIA labels đầy đủ trên Board, Cell, StatusBar
- [ ] Màu số đạt WCAG AA
- [ ] Over-flagging feedback hoạt động
- [ ] `npm run build` thành công
