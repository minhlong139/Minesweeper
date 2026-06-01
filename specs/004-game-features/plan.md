# Plan — Game Features (Timer, Counter, Difficulty, Persistence, Accessibility)

**Feature ID**: 004 | **Risk level**: Low | **Phase**: plan
**Tech Lead**: TBD | **Trạng thái**: ☐ Draft ☐ Approved

## 1. Tổng quan

Các tính năng phụ trợ được tích hợp vào useMinesweeper hook và các component hiện có. Không tạo module engine mới — tất cả là UI-level features.

```
src/
├── hooks/
│   ├── useMinesweeper.ts    ← SỬA: thêm timer, best time
│   └── useLocalStorage.ts   ← TẠO MỚI
├── storage/
│   └── localStorage.ts      ← TẠO MỚI: helper functions
└── components/
    ├── StatusBar.tsx          ← SỬA: hiển thị best time
    └── DifficultySelector.tsx ← SỬA: hiển thị best time
```

## 2. Timer Implementation

Timer đã được implement trong spec 002 (useMinesweeper + TICK action). Spec 004 chỉ thêm:

- Timer chỉ bắt đầu khi first reveal (không thay đổi)
- Dừng khi win/lost (không thay đổi)
- Hiển thị format `000` (không thay đổi)

Không có thay đổi nào so với spec 002 cho timer logic.

## 3. Mine Counter

Đã có trong spec 002 StatusBar. Logic `mineCount - flagsPlaced`. Thêm:

- **Chặn over-flagging**: đã implement trong engine `toggleFlag()` (spec 001)
- **Feedback khi cố flag vượt limit**: CSS animation rung nhẹ

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}
.cell-shake { animation: shake 0.2s ease-in-out; }
```

## 4. Difficulty Presets

Đã có trong spec 002 DifficultySelector. Không thay đổi.

## 5. localStorage Persistence

### useLocalStorage hook

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStored(value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage không khả dụng (private browsing) — silent fail
    }
  };

  return [stored, setValue];
}
```

### Keys

```typescript
const STORAGE_KEYS = {
  bestTime: (diff: DifficultyLevel) => `minesweeper.bestTime.${diff}`,
  difficulty: "minesweeper.settings.difficulty",
  controlMode: "minesweeper.settings.controlMode",
};
```

### Best time logic

```typescript
// Trong useMinesweeper, khi status chuyển sang "won":
function saveBestTime(difficulty: DifficultyLevel, time: number) {
  const key = STORAGE_KEYS.bestTime(difficulty);
  const prev = localStorage.getItem(key);
  if (!prev || time < parseInt(prev, 10)) {
    localStorage.setItem(key, String(time));
  }
}
```

### Lưu settings

```typescript
// Difficulty: khi user chọn difficulty → lưu
localStorage.setItem("minesweeper.settings.difficulty", difficulty);

// Control mode: khi user chuyển mode → lưu
localStorage.setItem("minesweeper.settings.controlMode", mode);
```

Khi app load → đọc settings từ localStorage để khởi tạo state mặc định.

## 6. Best Time Display

Thêm dòng nhỏ dưới mỗi difficulty button:

```
Beginner       Intermediate    Expert
  (best: 045)   (best: 123)    (best: --)
```

Hiển thị trong `DifficultySelector.tsx`, dùng `useLocalStorage` để đọc best time.

## 7. Accessibility

### ARIA labels (Cell)

```typescript
function getCellAriaLabel(cell: Cell): string {
  if (cell.isExploded) return `Row ${cell.row+1}, Column ${cell.col+1}, exploded mine`;
  if (cell.isIncorrectFlag) return `Row ${cell.row+1}, Column ${cell.col+1}, incorrect flag`;
  if (cell.isFlagged) return `Row ${cell.row+1}, Column ${cell.col+1}, flagged`;
  if (cell.isRevealed && cell.hasMine) return `Row ${cell.row+1}, Column ${cell.col+1}, mine`;
  if (cell.isRevealed && cell.adjacentMines > 0) 
    return `Row ${cell.row+1}, Column ${cell.col+1}, ${cell.adjacentMines} neighboring mines`;
  if (cell.isRevealed) return `Row ${cell.row+1}, Column ${cell.col+1}, empty`;
  return `Row ${cell.row+1}, Column ${cell.col+1}, hidden`;
}
```

### Board ARIA

- `role="grid" aria-label="Minesweeper board"`
- Mỗi row: `role="row"`
- Mỗi cell: `role="gridcell"`

### StatusBar ARIA

- `aria-live="polite"` cho timer + mine counter
- `aria-live="assertive"` cho game status (thắng/thua)

### Keyboard navigation (basic)

Cell là `<button>` nên có sẵn Tab + Enter. Thêm:
- Arrow keys: không implement (optional, scope ngoài v1)

## 8. Color Contrast WCAG AA

| Số | Màu mới | Contrast ratio |
|----|---------|---------------|
| 3 | `#CC0000` | 5.20:1 ✅ |
| 6 | `#006666` | 5.93:1 ✅ |
| 8 | `#666666` | 5.53:1 ✅ |

Các màu khác đã đạt AA (contrast ≥ 4.5:1 trên nền trắng).

## 9. Constitution Check

| Gate | Status |
|------|--------|
| Không backend | ✅ localStorage là client-side only |
| Không thu thập personal data | ✅ Chỉ lưu best time + settings |
| Accessibility | ✅ ARIA labels, roles, live regions |
| Performance | ✅ localStorage sync, không async |
| Graceful degradation | ✅ localStorage fail → game vẫn chạy |

## 10. Rủi ro & Mitigation

| Rủi ro | Impact | Mitigation |
|--------|--------|------------|
| localStorage quota exceeded | Low | Dữ liệu rất nhỏ (< 1KB) |
| Private browsing block localStorage | Low | try-catch, game vẫn chạy không lưu |
| Screen reader đọc sai state | Medium | Test với VoiceOver / NVDA |
