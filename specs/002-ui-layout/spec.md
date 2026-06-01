# Spec — UI Layout & Components

**Feature ID**: 002 | **Risk level**: Medium | **Phase**: specify
**PO/BO**: Tech Lead | **Trạng thái**: ☐ Draft ☐ Approved

## 1. Bối cảnh & vấn đề nghiệp vụ

Game Minesweeper cần giao diện người dùng trực quan, responsive, hoạt động tốt trên cả mobile portrait và desktop. UI phải tách biệt hoàn toàn khỏi game engine.

## 2. Mục tiêu

Xây dựng UI layout với: app shell căn giữa, status bar, difficulty selector, game board (CSS Grid), control bar, game message. Ưu tiên mobile portrait nhưng vẫn đẹp trên desktop với bố cục dọc.

## 3. User Story

- As a mobile player, I want the game to fit my phone screen in portrait mode so that I can play comfortably with one hand.
- As a desktop player, I want the game centered on screen with a vertical layout so that it feels like a focused casual game.

## 4. Acceptance Criteria

```
□ AC1: App shell căn giữa, max-width 480px, min-height 100dvh
□ AC2: Layout dọc gồm: Header → StatusBar → DifficultySelector → Board → ControlBar → GameMessage
□ AC3: Board dùng CSS Grid với `grid-template-columns: repeat(var(--cols), 1fr)`
□ AC4: Cell có aspect-ratio 1/1, kích thước tối thiểu 28px (mobile), lý tưởng 32-40px
□ AC5: Board tự động scale cell theo container — luôn vừa chiều rộng, không scroll ngang
□ AC5b: Expert mode (16×30): cell tự động thu nhỏ (min 28px), toàn bộ board vừa màn hình portrait — KHÔNG scroll dọc
□ AC6: Desktop: game không kéo giãn ngang toàn màn hình — vẫn giữ container dọc ≤ 520px
□ AC7: Mobile: control bar sticky bottom, touch target ≥ 44px
□ AC8: Hỗ trợ safe area: padding-bottom: env(safe-area-inset-bottom)
□ AC9: Hiển thị đúng 6 trạng thái cell: hidden, revealed-empty, revealed-number, flagged, mine, exploded
□ AC10: Màu số theo classic Minesweeper: 1=blue, 2=green, 3=red, 4=darkblue, 5=brown, 6=teal, 7=black, 8=gray
□ AC11: GameMessage hiển thị trạng thái: "Sẵn sàng" / "Đang chơi" / "Bạn đã thắng!" / "Game Over"
□ AC12: Difficulty selector: 3 nút Beginner (9×9, 10 mìn) | Intermediate (16×16, 40 mìn) | Expert (16×30, 99 mìn)
□ AC13: Reset button (smiley face) luôn hiển thị, khởi động lại game cùng difficulty
```

## 5. Non-goals (ngoài phạm vi)

- Mobile touch logic (long press, double tap) — thuộc spec 003
- Timer, mine counter display logic — thuộc spec 004


## 6. Component Tree

```
App
└── GameShell          ← useMinesweeper hook, giữ primary state
    ├── Header         ← "Minesweeper" title
    ├── StatusBar      ← Mine counter + Timer + Game status + Reset button
    ├── DifficultySelector  ← Beginner | Intermediate | Expert buttons
    ├── Board          ← CSS Grid, role="grid"
    │   └── Cell[]     ← Mỗi cell là 1 ô vuông, aspect-ratio 1/1
    ├── ControlBar     ← Reveal mode | Flag mode | Reset (mobile: sticky bottom)
    └── GameMessage    ← Trạng thái hiện tại
```

## 7. Component Specifications

### 7.1 App
- Render GameShell
- Load global CSS

### 7.2 GameShell
- Gọi `useMinesweeper()` hook để lấy toàn bộ state + actions
- Truyền props xuống các component con
- Xử lý difficulty change → reset game

### 7.3 StatusBar
- **Mine counter**: hiển thị `mineCount - flagsPlaced` (có thể âm hoặc chặn ở 0)
- **Timer**: hiển thị elapsed seconds, format `000` → `999`
- **Game status**: icon trạng thái (😊 normal / 😎 won / 💀 lost)
- **Reset button**: click → reset game

### 7.4 DifficultySelector
- 3 nút: Beginner, Intermediate, Expert
- Nút đang chọn có style active (highlight)
- Khi đổi difficulty → game tự động reset

### 7.5 Board
- CSS Grid: `display: grid; grid-template-columns: repeat(var(--cols), 1fr);`
- `user-select: none; touch-action: manipulation;`
- `role="grid"` cho accessibility
- Chặn context menu: `onContextMenu={e => e.preventDefault()}`

### 7.6 Cell
- Mỗi cell là 1 `<button>` hoặc `<div>` với aspect-ratio 1/1
- 6 visual states:
  - **Hidden**: nền xám, border nổi 3D (classic look)
  - **Revealed empty**: nền phẳng, không chữ
  - **Revealed number**: nền phẳng, số màu theo classic scheme
  - **Flagged**: icon cờ 🚩 hoặc CSS flag
  - **Mine (thua)**: icon mìn 💣
  - **Exploded**: nền đỏ, mìn bị nổ
- ARIA label: `"Row {r}, Column {c}, {state}"`

### 7.7 ControlBar
- 2 nút mode: **Reveal** (mặc định) | **Flag**
- Mode active được highlight rõ
- Reset button
- Mobile: sticky bottom, đủ cao để thao tác thoải mái

### 7.8 GameMessage
- `idle` → "Sẵn sàng — Chạm để bắt đầu"
- `playing` → "Đang chơi"
- `won` → "🎉 Bạn đã thắng!"
- `lost` → "💣 Game Over"

## 8. Responsive Design

### 8.1 Mobile Portrait (ưu tiên)
```css
.app-shell {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  min-height: 100dvh;
  padding: 8px;
}
```

### 8.2 Desktop
```css
@media (min-width: 768px) {
  .app-shell {
    max-width: 520px;
  }
}
```

### 8.3 Board Cell Size
```css
.cell {
  aspect-ratio: 1 / 1;
  min-width: 0;
  /* Tự động scale theo grid */
}
```

### 8.4 Expert Board (16×30)
Board dọc phù hợp mobile portrait. Cell tự động scale xuống tối thiểu 28px để toàn bộ board vừa màn hình, **không cần scroll**.
- Cell size: `min(36px, calc((100vw - 16px) / cols))`
- Với desktop max-width 520px: cell ≈ 28px cho Expert (520/16 ≈ 32px, thoải mái)

## 9. CSS Style Guidelines

- Không hardcode màu — dùng CSS custom properties
- Font: system font stack (`-apple-system, sans-serif`)
- Cell border: 1px solid, giả lập 3D classic (sáng trên-trái, tối dưới-phải)
- Number colors:
  ```css
  .cell-n1 { color: #0000FF; }  /* blue */
  .cell-n2 { color: #008000; }  /* green */
  .cell-n3 { color: #FF0000; }  /* red */
  .cell-n4 { color: #000080; }  /* dark blue */
  .cell-n5 { color: #800000; }  /* brown */
  .cell-n6 { color: #008080; }  /* teal */
  .cell-n7 { color: #000000; }  /* black */
  .cell-n8 { color: #808080; }  /* gray */
  ```

## 10. Phụ thuộc & rủi ro

- Phụ thuộc: `useMinesweeper` hook (spec 002)
- Rủi ro: Expert board 16×30 quá dài trên mobile → mitigation: cho phép scroll dọc, cell nhỏ nhất 28px

## 11. Đề xuất risk level

AI đề xuất: **Medium** — Nhiều component + responsive nhưng thuần CSS/HTML, không phức tạp về logic → **Tech Lead chốt**.
