# Spec — Game Features (Timer, Counter, Difficulty, Persistence, Accessibility)

**Feature ID**: 004 | **Risk level**: Low | **Phase**: specify
**PO/BO**: Tech Lead | **Trạng thái**: ☐ Draft ☐ Approved

## 1. Bối cảnh & vấn đề nghiệp vụ

Game Minesweeper cần các tính năng phụ trợ: timer đếm thời gian, mine counter hiển thị số mìn còn lại, difficulty presets, lưu best time vào localStorage, và accessibility cơ bản.

## 2. Mục tiêu

Hoàn thiện trải nghiệm người dùng với các tính năng phụ trợ, đảm bảo game accessible và có persistence nhẹ.

## 3. User Story

- As a player, I want to see how long I've been playing and how many mines remain so that I can track my progress.
- As a player, I want my best times saved so that I can try to beat them.
- As a player using a screen reader, I want the board to be navigable so that I can understand the game state.

## 4. Acceptance Criteria

### Timer
```
□ AC1: Timer bắt đầu khi ô đầu tiên được reveal (từ idle → playing)
□ AC2: Cắm cờ trước first reveal KHÔNG khởi động timer
□ AC3: Timer hiển thị elapsed seconds, format 3 chữ số: 000 → 999
□ AC4: Timer dừng khi thắng hoặc thua
□ AC5: Timer reset về 000 khi bắt đầu game mới
□ AC6: Nếu elapsed > 999s, hiển thị giữ ở 999 (classic behavior)
```

### Mine Counter
```
□ AC7: Hiển thị mineCount - flagsPlaced
□ AC8: **Chặn over-flagging**: toggleFlag() từ chối nếu flagsPlaced >= mineCount (trừ khi đang gỡ cờ)
□ AC9: Khi đạt giới hạn cờ, hiển thị feedback nhẹ (rung nhẹ hoặc flash đỏ) nếu người dùng cố flag thêm
```

### Difficulty Presets
```
□ AC10: Beginner:  9×9,  10 mines
□ AC11: Intermediate: 16×16, 40 mines
□ AC12: Expert:    16×30, 99 mines (board dọc cho mobile)
□ AC13: Khi chuyển difficulty → reset game ngay lập tức
□ AC14: Difficulty hiện tại được hiển thị rõ (active state)
```

### Persistence (localStorage)
```
□ AC15: Lưu best time cho từng difficulty: minesweeper.bestTime.{beginner|intermediate|expert}
□ AC16: Lưu difficulty được chọn gần nhất: minesweeper.settings.difficulty
□ AC17: Lưu control mode được chọn gần nhất: minesweeper.settings.controlMode
□ AC18: Hiển thị best time cạnh difficulty selector (nhỏ, optional)
□ AC19: KHÔNG lưu personal data — chỉ game settings + best times
```

### Accessibility
```
□ AC20: Board có role="grid", mỗi row có role="row", mỗi cell có role="gridcell"
□ AC21: Mỗi cell có aria-label mô tả trạng thái: "Row 3, Column 5, hidden" / "Row 3, Column 5, 2 neighboring mines" / "Row 3, Column 5, flagged"
□ AC22: Color contrast đạt WCAG AA — số trên nền phải dễ đọc
□ AC23: Không chỉ dựa vào màu sắc để truyền đạt thông tin — dùng kèm icon/text
```

### Performance
```
□ AC24: Flood reveal xử lý Expert board (480 cells) < 100ms
□ AC25: Không full-board re-render không cần thiết — chỉ update cell thay đổi
□ AC26: Initial load < 200KB (không framework nặng)
```

## 5. Non-goals (ngoài phạm vi)

- Online leaderboard — không có backend
- Keyboard navigation đầy đủ — optional
- Analytics — optional

## 6. Timer Implementation

```typescript
// Trong useMinesweeper hook
useEffect(() => {
  if (gameState.status !== "playing") return;
  const interval = setInterval(() => {
    setElapsed(prev => Math.min(prev + 1, 999));
  }, 1000);
  return () => clearInterval(interval);
}, [gameState.status]);
```

- Timer bắt đầu khi `status` chuyển từ `idle` → `playing` (first reveal)
- Timer dừng khi `status` chuyển sang `won` hoặc `lost`
- Hiển thị: `String(elapsed).padStart(3, '0')`

## 7. Mine Counter Logic

```typescript
const remainingMines = gameState.mineCount - gameState.flagsPlaced;
// Không cho phép < 0 vì chặn over-flagging trong toggleFlag()
```

Hiển thị: `String(remainingMines).padStart(3, '0')`

## 8. Difficulty Presets

```typescript
const DIFFICULTIES = {
  beginner:     { rows: 9,  cols: 9,  mines: 10 },
  intermediate:  { rows: 16, cols: 16, mines: 40 },
  expert:       { rows: 16, cols: 30, mines: 99 },
};
```

## 9. localStorage Schema

```typescript
// Keys
const STORAGE_KEYS = {
  bestTime: (diff: string) => `minesweeper.bestTime.${diff}`,
  settings: {
    difficulty: 'minesweeper.settings.difficulty',
    controlMode: 'minesweeper.settings.controlMode',
  }
};

// Save best time
function saveBestTime(difficulty: string, time: number) {
  const prev = localStorage.getItem(STORAGE_KEYS.bestTime(difficulty));
  if (!prev || time < Number(prev)) {
    localStorage.setItem(STORAGE_KEYS.bestTime(difficulty), String(time));
  }
}
```

## 10. Accessibility Checklist

| Element | ARIA | Ghi chú |
|---------|------|---------|
| Board | `role="grid" aria-label="Minesweeper board"` | |
| Row | `role="row"` | Mỗi hàng của grid |
| Cell | `role="gridcell" aria-label="Row X, Column Y, {state}"` | state: hidden/flagged/revealed-N |
| StatusBar | `aria-live="polite"` | Cập nhật timer, mine count |
| GameMessage | `aria-live="assertive"` | Thông báo thắng/thua |
| Buttons | `<button>` native | Đã có sẵn keyboard support |

## 11. Color Contrast

| Màu số | Hex | Contrast ratio (nền trắng) |
|--------|-----|---------------------------|
| 1 Blue | #0000FF | 8.59:1 ✅ |
| 2 Green | #008000 | 5.14:1 ✅ (AA) |
| 3 Red | #FF0000 | 4.00:1 ⚠️ → dùng #CC0000 |
| 4 Dark blue | #000080 | 13.62:1 ✅ |
| 5 Brown | #800000 | 9.75:1 ✅ |
| 6 Teal | #008080 | 4.97:1 ⚠️ → dùng #006666 |
| 7 Black | #000000 | 21:1 ✅ |
| 8 Gray | #808080 | 3.94:1 ❌ → dùng #666666 |

**Quyết định**: Điều chỉnh màu 3, 6, 8 để đạt WCAG AA (contrast ≥ 4.5:1).

## 12. Phụ thuộc & rủi ro

- Phụ thuộc: Game engine (spec 001) — cần `gameState.status`, `flagsPlaced`, `mineCount`
- Rủi ro: localStorage không khả dụng (private browsing) → fallback: game vẫn chạy bình thường, chỉ không lưu
- Rủi ro: ARIA label không chính xác khi state thay đổi → test với screen reader (VoiceOver)

## 13. Đề xuất risk level

AI đề xuất: **Low** — Tính năng phụ trợ, không ảnh hưởng core game, dễ test → **Tech Lead chốt**.
