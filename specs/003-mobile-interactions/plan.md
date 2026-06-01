# Plan — Mobile Interactions

**Feature ID**: 003 | **Risk level**: Medium | **Phase**: plan
**Tech Lead**: TBD | **Trạng thái**: ☐ Draft ☐ Approved

## 1. Tổng quan

Hai custom React hooks xử lý gesture trên mobile, tích hợp vào Cell component. Không thay đổi engine (spec 001), chỉ thay đổi cách gọi engine functions từ UI.

```
src/hooks/
├── useMinesweeper.ts    ← từ spec 002
├── useLongPress.ts      ← TẠO MỚI
└── useDoubleTap.ts      ← TẠO MỚI
```

## 2. useLongPress hook

### Interface

```typescript
type LongPressOptions = {
  delay?: number;        // default: 400ms
  moveThreshold?: number; // default: 10px
  onFinish?: () => void;  // haptic callback
};

function useLongPress(
  callback: () => void,
  options?: LongPressOptions
): {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchCancel: (e: React.TouchEvent) => void;
}
```

### State machine

```
IDLE
  ↓ onTouchStart → start timer (400ms), save startPos
PRESS_WAITING
  ↓ timer fires → callback(), set triggered=true, haptic
  ↓ onTouchMove > 10px → cancel timer → IDLE
  ↓ onTouchEnd (triggered) → reset → IDLE
  ↓ onTouchEnd (!triggered) → cancel timer → IDLE (coi như tap)
  ↓ onTouchCancel → cancel timer → IDLE
```

### Key logic
- Dùng `useRef` cho timer ID, startPos, triggered flag
- `onTouchEnd`: nếu `triggered = true` → `e.preventDefault()` để chặn ghost tap
- `onTouchMove`: tính khoảng cách Euclidean từ startPos, nếu > moveThreshold → clearTimeout

## 3. useDoubleTap hook

### Interface

```typescript
function useDoubleTap(
  callback: () => void,
  interval?: number  // default: 300ms
): {
  onClick: (e: React.MouseEvent | React.TouchEvent) => void;
}
```

### State machine

```
IDLE
  ↓ first tap → save timestamp, set waiting=true
WAITING_FIRST
  ↓ second tap within 300ms → callback(), reset → IDLE
  ↓ 300ms timeout → reset → IDLE (coi như single tap)
```

### Key logic
- Dùng `useRef` cho lastTapTime và timeout ID
- Khi tap thứ 2 trong interval → clearTimeout, gọi callback
- Khi timeout → clear, không gọi gì (single tap sẽ được xử lý bởi onClick của Cell)

## 4. Tích hợp vào Cell component

### Cell event handlers

```typescript
function Cell({ cell, onReveal, onFlag, onChord, controlMode, status }) {
  const longPress = useLongPress(
    () => { if (!cell.isRevealed) onFlag(cell.row, cell.col); },
    { delay: 400, onFinish: () => navigator.vibrate?.(20) }
  );

  const doubleTap = useDoubleTap(
    () => { if (cell.isRevealed && cell.adjacentMines > 0) onChord(cell.row, cell.col); },
    300
  );

  const handleClick = (e) => {
    if (status !== "playing" && status !== "idle") return;
    if (e.defaultPrevented) return;  // bị long press chặn

    // Chord: single tap on revealed number
    if (cell.isRevealed && cell.adjacentMines > 0) {
      onChord(cell.row, cell.col);
      return;
    }

    // Reveal or Flag based on mode
    if (controlMode === "reveal") {
      if (!cell.isFlagged) onReveal(cell.row, cell.col);
    } else {
      if (!cell.isRevealed) onFlag(cell.row, cell.col);
    }

    // Double tap detection (separate from single tap logic)
    doubleTap.onClick(e);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!cell.isRevealed) onFlag(cell.row, cell.col);
  };

  return (
    <button
      className={cellClass}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      {...longPress}
      aria-label={...}
    />
  );
}
```

### Event flow

```
TouchStart → useLongPress.onTouchStart (bắt đầu timer)
TouchMove  → useLongPress.onTouchMove (check threshold)
TouchEnd   → useLongPress.onTouchEnd
           → Nếu longPressTriggered: e.preventDefault() → onClick bị chặn
           → Nếu không: onClick fires → handleClick logic
```

## 5. Mode Switch UI

```typescript
// ControlBar.tsx
<button className={mode === "reveal" ? "active" : ""} 
        onClick={() => onModeChange("reveal")}>
  🔍 Reveal
</button>
<button className={mode === "flag" ? "active" : ""} 
        onClick={() => onModeChange("flag")}>
  🚩 Flag
</button>
```

Mode state lưu trong `useMinesweeper` reducer, không phải state riêng.

## 6. CSS cho mobile

```css
/* Board */
.board {
  touch-action: manipulation;   /* Chặn double-tap zoom */
  user-select: none;            /* Chặn text selection */
  -webkit-touch-callout: none;  /* Chặn iOS callout */
}

/* Cell */
.cell {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* ControlBar sticky */
.control-bar {
  position: sticky;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--color-bg);
}
```

## 7. Desktop support

Desktop không cần long press — dùng right-click để flag (đã có trong Cell). Double click để chord giữ nguyên. Code hook vẫn hoạt động nhưng touch events sẽ không fire trên desktop (chỉ mouse events).

## 8. Constitution Check

| Gate | Status |
|------|--------|
| Tách biệt engine/UI | ✅ Hooks chỉ gọi engine functions, không chứa game logic |
| Mobile-first | ✅ Long press, mode switch, haptic |
| Anti-misclick | ✅ longPressTriggered chặn ghost tap |
| Accessibility | ✅ ARIA label giữ nguyên từ spec 002 |

## 9. Rủi ro & Mitigation

| Rủi ro | Impact | Mitigation |
|--------|--------|------------|
| Long press + scroll conflict | Medium | moveThreshold 10px — nếu user scroll, long press bị hủy |
| Double tap interval quá ngắn | Low | 300ms là standard, test thực tế |
| Safari iOS double-tap zoom vẫn xảy ra | Medium | `touch-action: manipulation` + `<meta name="viewport" content="... user-scalable=no">` |
| Haptic không hỗ trợ | Low | `navigator.vibrate?.()` — silent fail nếu không có |
