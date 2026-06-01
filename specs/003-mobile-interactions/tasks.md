# Tasks — Mobile Interactions

**Feature ID**: 003 | **Risk level**: Medium | **Phase**: tasks
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Sequence

```
useLongPress → useDoubleTap → integrate Cell → ControlBar mode swap → CSS mobile → test devices
```

---

## Task 1: useLongPress hook

| Field | Value |
|-------|-------|
| **File** | `src/hooks/useLongPress.ts` |
| **Risk** | **High** |
| **Depends on** | spec 002 (Cell component exists) |

- Hook nhận callback + options (delay=400ms, moveThreshold=10px)
- State machine: IDLE → PRESS_WAITING → TRIGGERED/CANCELLED
- `useRef` cho timer, startPos, triggered flag
- `onTouchEnd`: nếu triggered → `e.preventDefault()` chặn ghost tap
- `onTouchMove`: cancel nếu di chuyển > threshold
- Cleanup timer on unmount

**DoD**: Long press 400ms trên mobile → callback fires. Move > 10px → cancel. Tap nhanh → không fire.

---

## Task 2: useDoubleTap hook

| Field | Value |
|-------|-------|
| **File** | `src/hooks/useDoubleTap.ts` |
| **Risk** | Medium |
| **Depends on** | Task 1 (độc lập thực tế) |

- Hook nhận callback + interval (default 300ms)
- Theo dõi lastTapTime bằng useRef
- 2 tap trong 300ms → callback
- Timeout 300ms → reset (single tap)

**DoD**: Double tap nhanh → callback fires 1 lần. 2 tap chậm (>300ms) → không fire.

---

## Task 3: Tích hợp hooks vào Cell

| Field | Value |
|-------|-------|
| **File** | `src/components/Cell.tsx` |
| **Risk** | **High** |
| **Depends on** | Task 1, Task 2, spec 002 Cell |

- Thêm `useLongPress` → toggle flag (cả 2 mode)
- Thêm `useDoubleTap` → chord
- Xử lý `onClick`: single tap chord trên revealed number
- Xử lý `onContextMenu`: desktop right-click flag
- Chặn click khi `e.defaultPrevented` (long press đã fire)

**DoD**: Tất cả gesture hoạt động đúng: tap reveal, tap chord, long press flag, right-click flag. Không ghost tap sau long press.

---

## Task 4: Mode switch trong ControlBar

| Field | Value |
|-------|-------|
| **File** | `src/components/ControlBar.tsx` |
| **Risk** | Low |
| **Depends on** | spec 002 ControlBar |

- 2 nút Reveal / Flag, active state rõ ràng
- dispatch SET_CONTROL_MODE
- Lưu mode vào localStorage (spec 004 sẽ implement)

**DoD**: Chuyển mode → UI update → tap behavior thay đổi (reveal vs flag).

---

## Task 5: Haptic feedback

| Field | Value |
|-------|-------|
| **File** | `src/hooks/useLongPress.ts` (thêm) |
| **Risk** | Low |
| **Depends on** | Task 1 |

- Gọi `navigator.vibrate?.(20)` trong long press callback
- Wrap trong try-catch (iOS có thể không hỗ trợ)

**DoD**: Rung nhẹ khi long press flag/unflag trên Android.

---

## Task 6: CSS mobile hoàn thiện

| Field | Value |
|-------|-------|
| **File** | `src/styles/global.css`, `Board.module.css`, `Cell.module.css`, `ControlBar.module.css` |
| **Risk** | Low |
| **Depends on** | Task 3, 4 |

- `touch-action: manipulation` trên Board + Cell
- `user-select: none` trên Board
- `-webkit-touch-callout: none` trên Cell
- `-webkit-tap-highlight-color: transparent`
- ControlBar `position: sticky; bottom: 0; padding-bottom: env(safe-area-inset-bottom)`
- `<meta name="viewport">` trong `index.html` — `user-scalable=no` để chặn double-tap zoom

**DoD**: Không bị zoom, không bị select text, không bị callout trên iOS.

---

## Task 7: Test trên thiết bị thật

| Field | Value |
|-------|-------|
| **Risk** | Medium |
| **Depends on** | Task 1–6 |

- Mobile Safari (iOS): test tap, long press, double tap, mode switch
- Chrome Android: test haptic, long press
- Desktop Chrome: test right-click, double-click chord
- Desktop Firefox/Edge: test cơ bản

**DoD**: Không có bug gesture trên các thiết bị test.

---

## Definition of Done

- [ ] useLongPress hook: long press → flag, move cancel, ghost tap blocked
- [ ] useDoubleTap hook: double tap → chord
- [ ] Cell tích hợp cả 2 hook + single tap chord
- [ ] Mode switch hoạt động (Reveal ↔ Flag)
- [ ] Haptic feedback trên Android
- [ ] CSS chặn zoom, select, callout
- [ ] Test pass trên ít nhất 1 iOS device + 1 Android device
