# Spec — Mobile Interactions

**Feature ID**: 003 | **Risk level**: Medium | **Phase**: specify
**PO/BO**: Tech Lead | **Trạng thái**: ☐ Draft ☐ Approved

## 1. Bối cảnh & vấn đề nghiệp vụ

Người chơi mobile không có chuột phải để cắm cờ như desktop. Cần cung cấp cơ chế thao tác thân thiện với cảm ứng: tap để mở ô, long press để cắm cờ, double tap để chord, và mode switch Reveal/Flag.

## 2. Mục tiêu

Xây dựng hệ thống input cho mobile: phân biệt tap vs long press vs double tap, chặn các hành vi không mong muốn (context menu, zoom, text selection), hỗ trợ haptic feedback.

## 3. User Story

- As a mobile player, I want to tap to reveal and long-press to flag so that I can play without a mouse.
- As a mobile player, I want a clear Reveal/Flag mode switch so that I never accidentally reveal a cell I meant to flag.
- As a mobile player, I want double-tap to chord so that I can play efficiently on expert difficulty.

## 4. Acceptance Criteria

```
□ AC1: Tap vào ô hidden trong Reveal mode → reveal cell
□ AC2: Tap vào ô hidden trong Flag mode → toggle flag
□ AC3: Long press (350-500ms) vào ô hidden → toggle flag, BẤT KỂ mode hiện tại
□ AC4: Long press không kích hoạt reveal sau khi thả tay (chặn ghost tap)
□ AC5: Single tap vào ô đã reveal có số → chord reveal (primary)
□ AC5b: Double tap vào ô đã reveal có số → chord reveal (alternative, same action)
□ AC6: Single tap chord không xung đột với reveal (ô đã reveal thì tap = chord, ô hidden thì tap = reveal)
□ AC7: Tap vào ô đã flag trong Reveal mode → KHÔNG mở ô (chống mở nhầm)
□ AC8: Tap vào ô đã flag trong Flag mode → gỡ cờ
□ AC9: Chặn browser context menu khi touch-hold trên board
□ AC10: Chặn text selection khi long press (user-select: none)
□ AC11: Chặn double-tap browser zoom trong khu vực board (touch-action: manipulation)
□ AC12: Haptic feedback khi flag/unflag (navigator.vibrate nếu hỗ trợ)
□ AC13: Reveal/Flag mode buttons luôn visible, active mode được highlight rõ ràng
□ AC14: Sau khi thắng/thua, mọi tương tác với board bị vô hiệu hóa
□ AC15: Long press bị hủy nếu ngón tay di chuyển quá 10px (touch move threshold)
```

## 5. Non-goals (ngoài phạm vi)

- Keyboard support — optional, có thể thêm sau
- Pinch zoom / pan cho board lớn — thuộc v2
## 6. Desktop Input (giữ lại)

| Thao tác | Hành vi |
|----------|---------|
| Left click vào hidden cell | Reveal |
| Right click vào hidden cell | Toggle flag (chặn context menu) |
| Double click vào revealed number | Chord |
| Click reset button | New game |

## 7. Mobile Input Mapping

### 7.1 Reveal Mode (mặc định)

| Thao tác | Target | Hành vi |
|----------|--------|---------|
| Tap | Hidden, chưa flag | Reveal |
| Tap | Hidden, đã flag | **Không làm gì** (chống mở nhầm) |
| Tap | Revealed number (adjacentMines > 0) | **Chord** (primary trigger) |
| Long press | Hidden | Toggle flag |
| Long press | Revealed | Không làm gì |
| Double tap | Revealed number | Chord (alternative, same behavior) |

### 7.2 Flag Mode

| Thao tác | Target | Hành vi |
|----------|--------|---------|
| Tap | Hidden | Toggle flag |
| Tap | Hidden, đã flag | Gỡ cờ |
| Tap | Revealed number (adjacentMines > 0) | **Chord** |
| Long press | Hidden | Toggle flag (tương tự tap) |
| Double tap | Revealed number | Chord (alternative) |

## 8. Hook Specifications

### 8.1 useLongPress

```typescript
useLongPress(callback: () => void, delay?: number): {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
}
```

- Delay mặc định: **400ms**
- Nếu touch move > 10px → hủy long press
- Khi long press kích hoạt → set flag `longPressTriggered = true` để chặn tap event sau đó
- Haptic: `navigator.vibrate?.(20)` khi long press thành công

### 8.2 useDoubleTap

```typescript
useDoubleTap(callback: () => void, interval?: number): {
  onClick: (e: MouseEvent | TouchEvent) => void;
}
```

- Interval mặc định: **300ms** giữa 2 lần tap
- Nếu tap lần 2 trong khoảng interval → gọi callback
- Nếu quá interval → coi như single tap
- Double tap CHỈ hoạt động trên ô revealed number
- Không xung đột với long press (ưu tiên long press nếu đang giữ)

## 9. Interaction Flow (chi tiết)

### 9.1 Tap vào cell

```
1. Nếu game status !== "playing" → return
2. Nếu longPressTriggered → bỏ qua (reset flag)
3. Nếu cell đã reveal và adjacentMines > 0 → chordReveal()  (cả 2 mode)
4. Nếu controlMode === "reveal":
   a. Cell chưa flag, chưa reveal → revealCell()
   b. Cell đã flag → không làm gì
5. Nếu controlMode === "flag":
   a. Cell chưa reveal → toggleFlag()
```

### 9.2 Long press vào cell

```
1. Nếu game status !== "playing" → return
2. Nếu cell chưa reveal → toggleFlag()
3. Set longPressTriggered = true
4. Gọi navigator.vibrate?.(20)
5. Khi touchend → nếu longPressTriggered → preventDefault, reset flag
```

### 9.3 Double tap vào cell

```
1. Nếu game status !== "playing" → return
2. Nếu cell đã reveal và adjacentMines > 0 → chordReveal()
3. Nếu cell chưa reveal hoặc adjacentMines === 0 → không làm gì
```

## 10. CSS Requirements

```css
.game-board {
  user-select: none;           /* Chặn text selection */
  touch-action: manipulation;  /* Chặn double-tap zoom, delay 300ms */
  -webkit-touch-callout: none; /* Chặn iOS callout */
}

.cell {
  touch-action: manipulation;
}
```

## 11. Mode Switch UI

```
┌─────────────────────────────────┐
│  [🔍 Reveal]   [🚩 Flag]   [🔄] │
└─────────────────────────────────┘
```

- Nút active: background đậm, border rõ
- Nút inactive: background nhạt
- Khi chuyển mode: không reset game, chỉ đổi biến `controlMode`

## 12. Phụ thuộc & rủi ro

- Phụ thuộc: Game engine (cell model, revealCell, toggleFlag, chordReveal từ spec 001)
- Rủi ro: Long press + tap conflict → mitigation: `longPressTriggered` flag
- Rủi ro: Double tap bị hiểu nhầm thành 2 single tap → mitigation: delay 300ms trước khi xử lý single tap đầu tiên
- Rủi ro: iOS Safari double-tap zoom → mitigation: `touch-action: manipulation`

## 13. Đề xuất risk level

AI đề xuất: **Medium** — Phức tạp về event handling, conflict giữa các gesture, cần test kỹ trên thiết bị thật → **Tech Lead chốt**.
