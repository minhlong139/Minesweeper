# Đặc tả game Dò mìn trên web/mobile

**Phiên bản tài liệu:** 1.0  
**Nền tảng mục tiêu:** Web browser  
**Trải nghiệm ưu tiên:** Mobile portrait  
**Trải nghiệm phụ:** Desktop với bố cục portrait-style  
**Đăng nhập:** Không yêu cầu  
**Backend:** Không yêu cầu  
**Lưu trữ dữ liệu:** Chỉ dùng local browser storage nếu cần  
**Loại game:** Single-player Minesweeper / Dò mìn

---

## 1. Mục tiêu sản phẩm

Xây dựng một web game Dò mìn gọn nhẹ, responsive, chạy hoàn toàn ở frontend. Bất kỳ người dùng nào truy cập đường dẫn đều có thể chơi ngay, không cần đăng nhập.

Game phải được tối ưu cho màn hình mobile theo chiều dọc. Khi chơi trên desktop, giao diện vẫn giữ bố cục dọc giống mobile, không mở rộng thành layout ngang toàn màn hình.

Các ưu tiên chính:

- Tải nhanh
- Dễ chơi
- Đúng luật Minesweeper cổ điển
- Thao tác tốt trên màn hình cảm ứng
- Không cần tài khoản
- Không phụ thuộc server
- Giao diện hiện đại, có cảm hứng từ Minesweeper cổ điển

---

## 2. Người dùng mục tiêu

### 2.1 Người dùng chính

Người chơi phổ thông truy cập game từ trình duyệt trên điện thoại.

### 2.2 Người dùng phụ

Người chơi trên desktop muốn chơi một game Dò mìn cổ điển ngay trên trình duyệt.

### 2.3 Giả định về người dùng

Người dùng mobile có thể không quen thao tác right-click như trên desktop. Vì vậy, phiên bản mobile cần có cơ chế điều khiển rõ ràng, trực quan để mở ô và cắm cờ.

---

## 3. Yêu cầu nền tảng

### 3.1 Thiết bị hỗ trợ

Game phải hỗ trợ:

- Điện thoại ở chế độ portrait
- Tablet ở chế độ portrait
- Desktop browser với game container dạng dọc, căn giữa màn hình

### 3.2 Trình duyệt hỗ trợ

Game nên chạy tốt trên các phiên bản gần đây của:

- Chrome
- Safari
- Edge
- Firefox
- Mobile Safari trên iOS
- Chrome trên Android

### 3.3 Chiều màn hình

Game được thiết kế ưu tiên cho portrait orientation.

Nếu người dùng mở trên mobile ở landscape mode, game vẫn nên hoạt động, nhưng cấu trúc layout vẫn giữ theo chiều dọc.

---

## 4. Kiến trúc kỹ thuật

### 4.1 Loại ứng dụng

Game là một frontend-only web application.

Không cần backend, database, login system, user account, payment system hoặc server-side game logic.

### 4.2 Mô hình triển khai

Game phải có thể deploy như một static web app.

Các nền tảng triển khai phù hợp:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- Static hosting từ bất kỳ web server nào

### 4.3 Tech stack đề xuất

Có thể triển khai theo một trong các hướng sau:

#### Phương án A: Plain Frontend

- HTML
- CSS
- JavaScript hoặc TypeScript

#### Phương án B: Modern Frontend

- React
- TypeScript
- Vite
- CSS Modules, Tailwind CSS hoặc plain CSS

Phương án được khuyến nghị để dễ bảo trì:

- React
- TypeScript
- Vite
- Không dùng backend
- Không dùng external state management library nếu không thật sự cần thiết

### 4.4 External dependencies

Game nên hạn chế dependency.

Các loại dependency được phép dùng:

- UI utility libraries
- Icon libraries
- Lightweight animation libraries

Không nên dùng game engine nặng nếu không có yêu cầu đặc biệt.

---

## 5. Ý tưởng game cốt lõi

Game là một bản clone của Minesweeper cổ điển.

Bàn chơi là một grid gồm các ô. Một số ô chứa mìn. Người chơi mở các ô an toàn và dựa vào các con số gợi ý để suy luận vị trí mìn. Người chơi thắng khi mở hết tất cả các ô không có mìn.

---

## 6. Luật chơi

### 6.1 Bàn chơi

Bàn chơi là một two-dimensional grid.

Mỗi cell có thể ở một trong các trạng thái sau:

- Đang ẩn
- Đã mở
- Đã cắm cờ
- Có mìn
- Mìn bị kích nổ
- Cờ cắm sai

### 6.2 Cách đặt mìn

Mìn được random sau thao tác mở ô đầu tiên.

Ô đầu tiên được mở không bao giờ được chứa mìn.

Hành vi khuyến nghị:

- First click/tap luôn an toàn.
- Nếu có thể, ô đầu tiên cũng nên mở ra một vùng trống không có mìn lân cận.

### 6.3 Con số gợi ý

Mỗi ô an toàn sau khi mở sẽ hiển thị số lượng mìn nằm trong 8 ô xung quanh.

Các giá trị có thể có:

- Trống / zero
- 1
- 2
- 3
- 4
- 5
- 6
- 7
- 8

### 6.4 Mở rộng vùng trống

Nếu một ô được mở có zero neighboring mines, game phải tự động mở các ô zero liên thông và các ô số nằm ở biên của vùng đó.

Cơ chế này gọi là flood reveal.

### 6.5 Cắm cờ

Người chơi có thể cắm cờ vào ô nghi ngờ có mìn.

Quy tắc cắm cờ:

- Ô đang ẩn có thể được cắm cờ.
- Ô đã cắm cờ có thể được gỡ cờ.
- Ô đã mở không thể cắm cờ.
- Ô đã cắm cờ không được mở bằng thao tác tap/click thông thường.
- Bộ đếm số mìn còn lại giảm khi cắm cờ và tăng khi gỡ cờ.

### 6.6 Thua

Người chơi thua khi mở trúng ô có mìn.

Khi thua:

- Ô mìn bị kích nổ phải được đánh dấu rõ.
- Tất cả mìn phải được hiển thị.
- Các cờ cắm sai phải được đánh dấu.
- Timer dừng.
- Vô hiệu hóa tương tác với bàn chơi, ngoại trừ restart/new game.

### 6.7 Thắng

Người chơi thắng khi tất cả các ô không có mìn đã được mở.

Có thể hỗ trợ thêm điều kiện thắng tùy chọn:

- Game có thể phát hiện thắng khi tất cả mìn được cắm cờ đúng và toàn bộ ô an toàn đã được xử lý hợp lệ.
- Tuy nhiên, điều kiện thắng bắt buộc là mở hết tất cả non-mine cells.

Khi thắng:

- Timer dừng.
- Vô hiệu hóa tương tác với bàn chơi.
- Có thể tự động cắm cờ vào toàn bộ mìn còn lại.
- Hiển thị trạng thái thắng.

---

## 7. Mức độ chơi

Game phải có các preset difficulty levels.

### 7.1 Beginner

- Grid: 9 columns × 9 rows
- Mines: 10

### 7.2 Intermediate

- Grid: 16 columns × 16 rows
- Mines: 40

### 7.3 Expert

- Grid: 16 columns × 30 rows hoặc 30 columns × 16 rows tùy chiến lược hiển thị
- Mines: 99

Đối với mobile portrait, layout khuyến nghị là:

- 16 columns × 30 rows
- Bàn chơi dạng dọc, phù hợp màn hình portrait

Đối với desktop portrait-style layout, nên dùng cùng phiên bản portrait để giữ trải nghiệm nhất quán.

### 7.4 Custom Mode

Custom mode là tùy chọn cho version 1.

Nếu triển khai, người dùng có thể cấu hình:

- Số rows
- Số columns
- Số mines

Quy tắc kiểm tra hợp lệ:

- Rows tối thiểu: 5
- Columns tối thiểu: 5
- Rows tối đa: 40
- Columns tối đa: 30
- Số mines phải nhỏ hơn tổng số cells - 1
- Mine density tối đa khuyến nghị: 35%

---

## 8. Yêu cầu layout

### 8.1 Global layout

Ứng dụng dùng layout xếp dọc:

1. App title hoặc compact header
2. Game status bar
3. Difficulty selector
4. Game board
5. Mobile control bar
6. Help hoặc settings area

### 8.2 Desktop layout

Trên desktop, game không được kéo giãn toàn bộ chiều rộng trang.

Dùng container căn giữa:

- Maximum width: 420px đến 520px
- Width: 100% trừ page padding
- Giữ nguyên vertical layout
- Board căn giữa trong container

Ví dụ desktop behavior:

```text
┌──────────────────────────────┐
│          Dò mìn              │
│ Mìn: 010     Time: 045       │
│ Beginner Intermediate Expert │
│                              │
│           Game Board         │
│                              │
│ Reveal | Flag | Reset        │
└──────────────────────────────┘
```

### 8.3 Mobile layout

Mobile layout phải tối ưu cho thao tác một tay.

Cấu trúc khuyến nghị:

```text
┌──────────────────────────────┐
│ Dò mìn                       │
│ Mìn: 010     Time: 045       │
│ Beginner | Intermediate      │
│                              │
│          Game Board          │
│                              │
├──────────────────────────────┤
│ Reveal      Flag      Reset  │
└──────────────────────────────┘
```

### 8.4 Sticky controls

Trên mobile, control bar phải luôn dễ truy cập.

Khuyến nghị:

- Sticky bottom control bar
- Touch target lớn
- Trạng thái active rõ ràng cho mode hiện tại

### 8.5 Safe area support

Layout phải hỗ trợ mobile safe area.

Dùng CSS environment variables khi phù hợp:

```css
padding-bottom: env(safe-area-inset-bottom);
```

---

## 9. Yêu cầu giao diện bàn chơi

### 9.1 Cell size

Cell phải đủ lớn để thao tác bằng cảm ứng.

Khuyến nghị:

- Mobile minimum cell size: 28px
- Mobile lý tưởng: 32px đến 40px
- Desktop cell size: 28px đến 36px

Board có thể scale theo difficulty.

### 9.2 Board scaling

Với board lớn, dùng một trong các chiến lược sau:

#### Yêu cầu tối thiểu

Fit board width theo container.

#### Nâng cấp khuyến nghị

Cho phép pinch zoom và pan đối với board lớn, đặc biệt ở Expert mode.

Nếu không triển khai pinch zoom, Expert board vẫn phải chơi được thông qua responsive scaling và vertical scrolling.

### 9.3 Trạng thái hiển thị của cell

Mỗi cell phải có trạng thái trực quan khác biệt:

- Hidden
- Hovered hoặc pressed
- Revealed empty
- Revealed number
- Flagged
- Mine revealed
- Exploded mine
- Incorrect flag

### 9.4 Màu số

Màu số nên bám theo quy ước Minesweeper cổ điển nếu có thể:

- 1: blue
- 2: green
- 3: red
- 4: dark blue
- 5: brown/dark red
- 6: cyan/teal
- 7: black
- 8: gray

Có thể điều chỉnh màu để đảm bảo accessibility.

### 9.5 UI hiện đại lấy cảm hứng cổ điển

Game nên gợi nhắc Minesweeper cổ điển nhưng không nên trông quá cũ, trừ khi chủ đích thiết kế là retro.

Style chấp nhận được:

- Clean card container
- Subtle shadows
- Rounded corners
- Clear grid
- Classic numeric color coding
- Optional smiley reset button

---

## 10. Yêu cầu input và interaction

## 10.1 Desktop input

Desktop phải hỗ trợ:

### Mở ô

- Left click vào hidden cell để mở ô.

### Cắm cờ

- Right click vào hidden cell để toggle flag.
- Phải chặn browser context menu trên các game cells.

### Chord / Quick Reveal

Chord là thao tác mở nhanh các ô xung quanh một revealed number khi số lượng flagged neighbors bằng con số trên cell đó.

Desktop chord phải hỗ trợ ít nhất một trong các cách sau:

- Double click vào revealed numbered cell
- Middle click vào revealed numbered cell
- Simultaneous left + right click nếu khả thi

Desktop chord bắt buộc:

- Double click vào revealed numbered cell

### Restart

- Click reset button để bắt đầu game mới với cùng difficulty.

---

## 10.2 Mobile input

Mobile phải hỗ trợ các control thân thiện với màn hình cảm ứng.

### Default mobile control mapping

Mặc định khuyến nghị:

- Tap hidden cell: reveal
- Long press hidden cell: toggle flag
- Double tap revealed number cell: chord / quick reveal
- Tap reset: restart game

### Flag Mode

Mobile phải có explicit mode switching:

- Reveal mode
- Flag mode

Khi Reveal mode đang active:

- Tap hidden unflagged cell để mở ô.
- Tap flagged cell không được mở ô.

Khi Flag mode đang active:

- Tap hidden cell để toggle flag.
- Tap flagged cell để remove flag.

### Active mode indicator

Mode đang active phải được thể hiện rõ ràng.

Ví dụ:

- Highlight active button
- Đổi màu board border
- Hiển thị label: `Mode: Reveal` hoặc `Mode: Flag`

### Long press behavior

Long press phải toggle flag bất kể mode hiện tại.

Thời lượng long press khuyến nghị:

- 350ms đến 500ms

Khi long press được nhận diện:

- Chặn thao tác tap reveal phát sinh sau đó.
- Cung cấp haptic feedback nếu thiết bị hỗ trợ.
- Cung cấp visual feedback.

Có thể dùng:

```javascript
navigator.vibrate?.(20)
```

nếu browser hỗ trợ.

### Double tap chord

Double tap vào revealed numbered cell để thử chord.

Nếu số flagged neighbors bằng con số trên cell:

- Mở toàn bộ hidden, unflagged neighboring cells.

Nếu số flagged neighbors không bằng con số trên cell:

- Không mở ô.
- Highlight nhanh các neighboring cells hoặc hiển thị feedback nhẹ.

### Chống mở nhầm

Flagged cell tuyệt đối không được mở bằng tap/click thông thường.

Đây là yêu cầu bắt buộc.

---

## 11. Quy tắc Chord / Quick Reveal

Chord chỉ được thực hiện trên revealed numbered cells.

Khi chord được kích hoạt:

1. Đếm số flagged neighboring cells.
2. So sánh với con số trên revealed cell.
3. Nếu flag count bằng con số:
   - Mở toàn bộ hidden unflagged neighboring cells.
   - Nếu có unflagged neighbor chứa mìn, người chơi thua.
4. Nếu flag count không bằng con số:
   - Không thực hiện thao tác phá hủy.
   - Có thể highlight các neighboring cells.

Chord không bao giờ được mở flagged cells.

---

## 12. Game state model

Nên triển khai state model rõ ràng.

### 12.1 Game Status

Các trạng thái game:

```typescript
type GameStatus = "idle" | "playing" | "won" | "lost";
```

### 12.2 Control Mode

```typescript
type ControlMode = "reveal" | "flag";
```

### 12.3 Cell Model

```typescript
type Cell = {
  row: number;
  col: number;
  hasMine: boolean;
  adjacentMines: number;
  isRevealed: boolean;
  isFlagged: boolean;
  isExploded: boolean;
  isIncorrectFlag: boolean;
};
```

### 12.4 Game State

```typescript
type GameState = {
  rows: number;
  cols: number;
  mineCount: number;
  board: Cell[][];
  status: GameStatus;
  controlMode: ControlMode;
  firstMoveDone: boolean;
  flagsPlaced: number;
  revealedSafeCells: number;
  startTime: number | null;
  elapsedSeconds: number;
  difficulty: DifficultyLevel;
};
```

### 12.5 Difficulty Model

```typescript
type DifficultyLevel = "beginner" | "intermediate" | "expert" | "custom";
```

---

## 13. Core game functions

Nên tách game logic khỏi UI rendering.

Các function bắt buộc, ưu tiên pure hoặc mostly pure:

### 13.1 createEmptyBoard

Tạo board chưa có mìn.

```typescript
createEmptyBoard(rows: number, cols: number): Cell[][];
```

### 13.2 placeMines

Đặt mìn sau lần reveal đầu tiên.

```typescript
placeMines(
  board: Cell[][],
  mineCount: number,
  safeRow: number,
  safeCol: number
): Cell[][];
```

Quy tắc:

- Không đặt mìn vào ô đầu tiên được mở.
- Nếu đủ không gian, ưu tiên không đặt mìn vào 8 ô xung quanh ô đầu tiên.

### 13.3 calculateAdjacentMines

Tính số mìn xung quanh cho toàn bộ non-mine cells.

```typescript
calculateAdjacentMines(board: Cell[][]): Cell[][];
```

### 13.4 revealCell

Mở một cell.

```typescript
revealCell(board: Cell[][], row: number, col: number): RevealResult;
```

Phải hỗ trợ:

- Mở numbered cells
- Flood reveal cho zero cells
- Thua khi mở trúng mìn

### 13.5 toggleFlag

Bật/tắt trạng thái flag.

```typescript
toggleFlag(board: Cell[][], row: number, col: number): Cell[][];
```

Quy tắc:

- Không flag revealed cells.
- Không flag nếu game đã won hoặc lost.
- Tùy chọn: không cho đặt số flag vượt quá mine count.

### 13.6 chordReveal

Thực hiện quick reveal quanh numbered cell.

```typescript
chordReveal(board: Cell[][], row: number, col: number): RevealResult;
```

### 13.7 checkWin

Kiểm tra người chơi đã thắng chưa.

```typescript
checkWin(board: Cell[][], mineCount: number): boolean;
```

Điều kiện thắng bắt buộc:

- Tất cả non-mine cells đều đã revealed.

### 13.8 resetGame

Bắt đầu game mới.

```typescript
resetGame(difficulty: DifficultyLevel): GameState;
```

---

## 14. Yêu cầu Timer

### 14.1 Bắt đầu

Timer bắt đầu khi người chơi thực hiện reveal action đầu tiên.

Việc cắm cờ trước lần reveal đầu tiên không nên khởi động timer, trừ khi implementation có chủ đích khác.

Khuyến nghị:

- Timer chỉ bắt đầu khi ô đầu tiên được reveal.

### 14.2 Dừng

Timer dừng khi:

- Người chơi thắng
- Người chơi thua
- Game được reset

### 14.3 Hiển thị

Timer hiển thị elapsed seconds.

Format:

- `000`
- `045`
- `123`

Nếu elapsed time vượt quá 999 giây, phần hiển thị có thể giữ ở 999 hoặc tiếp tục tăng bình thường.

Khuyến nghị:

- Visual display cap ở 999 để giữ phong cách classic.
- Internal elapsed time vẫn có thể lưu chính xác nếu cần.

---

## 15. Yêu cầu Mine Counter

Mine counter hiển thị:

```text
mineCount - flagsPlaced
```

Giá trị có thể âm nếu người chơi đặt nhiều cờ hơn số mìn, trừ khi game chặn over-flagging.

Khuyến nghị:

- Có thể cho phép số âm theo classic behavior, hoặc chặn over-flagging để thân thiện hơn với người mới.
- Nếu chặn over-flagging, cần có feedback khi người dùng cố flag vượt mine count.

Default khuyến nghị cho mobile-friendly UX:

- Không cho flag count vượt quá mine count.

---

## 16. Hiển thị trạng thái game

UI phải hiển thị rõ trạng thái hiện tại.

Các trạng thái có thể có:

### Idle

Trước lần reveal đầu tiên:

```text
Sẵn sàng
```

### Playing

Trong khi chơi:

```text
Đang chơi
```

### Won

Sau khi thắng:

```text
Bạn đã thắng
```

### Lost

Sau khi thua:

```text
Game over
```

Optional classic smiley states:

- Normal
- Pressed
- Won sunglasses face
- Lost dead face

---

## 17. Yêu cầu Accessibility

### 17.1 Touch target

Interactive controls nên có kích thước tối thiểu:

- 44px × 44px cho control buttons
- Board cells càng lớn càng tốt trong giới hạn layout

### 17.2 Color contrast

Text và numbers phải dễ đọc.

Không được chỉ dựa vào màu sắc cho các trạng thái quan trọng. Cần dùng thêm icons hoặc shapes:

- Flag icon cho flagged cells
- Mine icon cho mines
- Cross mark cho incorrect flags

### 17.3 Keyboard support

Keyboard support trên desktop là optional nhưng được khuyến nghị.

Gợi ý:

- Arrow keys di chuyển focus
- Enter hoặc Space để reveal focused cell
- F để toggle flag
- R để reset game

### 17.4 Screen reader

Cần cung cấp ARIA labels cơ bản cho cells.

Ví dụ:

- Hidden cell
- Flagged cell
- Revealed cell, 2 neighboring mines
- Mine

Toàn bộ board có thể dùng `role="grid"`.

---

## 18. Yêu cầu chống lỗi thao tác

Game phải phòng tránh các lỗi phổ biến:

- Không reveal flagged cells bằng tap/click.
- Không cho tương tác board sau khi thắng/thua.
- Không để mobile long press kích hoạt đồng thời flag và reveal.
- Chặn browser context menu khi right-click cells.
- Tránh text selection khi long press.
- Tránh double tap browser zoom bên trong game board nếu có thể.

CSS khuyến nghị:

```css
.game-board {
  user-select: none;
  touch-action: manipulation;
}
```

Nếu triển khai pan/zoom:

```css
.game-board-viewport {
  touch-action: pan-x pan-y pinch-zoom;
}
```

---

## 19. Yêu cầu responsive design

### 19.1 Container

Dùng app shell căn giữa:

```css
.app-shell {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  min-height: 100dvh;
}
```

### 19.2 Board

Board nên dùng CSS Grid.

Ví dụ:

```css
.board {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
}
```

### 19.3 Dynamic cell sizing

Board phải thích ứng với chiều rộng khả dụng.

Ví dụ strategy:

```css
.cell {
  aspect-ratio: 1 / 1;
  min-width: 0;
}
```

Với board rất lớn, có thể dùng cell nhỏ hơn nhưng vẫn phải giữ khả năng thao tác chấp nhận được.

### 19.4 Portrait-first layout

Không tạo layout desktop ngang rộng.

Desktop vẫn phải trông như một mobile app dạng dọc, căn giữa màn hình.

---

## 20. Yêu cầu Persistence

Không yêu cầu login.

Local persistence là optional:

- Best time theo từng difficulty
- Difficulty được chọn gần nhất
- Control mode được chọn gần nhất

Dùng browser `localStorage`.

Không thu thập personal data.

### 20.1 Local Storage Keys

Key đề xuất:

```text
minesweeper.bestTime.beginner
minesweeper.bestTime.intermediate
minesweeper.bestTime.expert
minesweeper.settings.difficulty
minesweeper.settings.controlMode
```

---

## 21. Yêu cầu Privacy

Game không được yêu cầu:

- Login
- Email
- Phone number
- User profile
- Tracking identity

Analytics là optional.

Nếu thêm analytics, analytics không được là điều kiện để chơi và không được thu thập personal data.

---

## 22. Yêu cầu Performance

Game phải chạy nhanh trên low-end mobile devices.

### 22.1 Load performance

Mục tiêu:

- Initial bundle nhỏ.
- First playable screen tải nhanh trên mobile network.

### 22.2 Runtime performance

Game phải xử lý Expert mode mà không bị chậm rõ rệt.

Tối ưu:

- Tránh full-board re-renders không cần thiết.
- Dùng immutable updates hợp lý.
- Flood reveal nên dùng iterative approach thay vì recursive để tránh call stack issue.

### 22.3 Flood reveal

Flood reveal nên dùng queue-based breadth-first search.

Tránh deep recursive reveal.

---

## 23. Folder structure khuyến nghị

Cho React + TypeScript + Vite:

```text
src/
  main.tsx
  App.tsx
  styles/
    global.css
  components/
    GameShell.tsx
    StatusBar.tsx
    DifficultySelector.tsx
    Board.tsx
    Cell.tsx
    ControlBar.tsx
    GameMessage.tsx
  game/
    types.ts
    constants.ts
    board.ts
    reveal.ts
    flag.ts
    chord.ts
    win.ts
    timer.ts
  hooks/
    useMinesweeper.ts
    useLongPress.ts
    useDoubleTap.ts
  storage/
    localStorage.ts
  tests/
    board.test.ts
    reveal.test.ts
    chord.test.ts
    win.test.ts
```

---

## 24. Yêu cầu component

### 24.1 App

Chịu trách nhiệm:

- App-level layout
- Render game shell
- Load global styles

### 24.2 GameShell

Chịu trách nhiệm:

- Giữ primary game state thông qua hook
- Truyền props xuống child components
- Điều phối reset và difficulty changes

### 24.3 StatusBar

Hiển thị:

- Remaining mine counter
- Timer
- Game status
- Reset button

### 24.4 DifficultySelector

Hiển thị difficulty options:

- Beginner
- Intermediate
- Expert

Optional:

- Custom

Khi đổi difficulty, game hiện tại phải reset.

### 24.5 Board

Chịu trách nhiệm:

- Render CSS grid
- Truyền event handlers xuống cells
- Chặn context menu
- Quản lý board-level accessibility role

### 24.6 Cell

Chịu trách nhiệm:

- Hiển thị visual state
- Xử lý click/tap
- Xử lý right click
- Xử lý long press
- Xử lý double tap trên revealed number cells
- Render ARIA label phù hợp

### 24.7 ControlBar

Chịu trách nhiệm:

- Reveal mode button
- Flag mode button
- Reset button
- Optional help button

Trên mobile, ControlBar nên sticky ở bottom.

### 24.8 GameMessage

Hiển thị:

- Sẵn sàng
- Đang chơi
- Bạn đã thắng
- Game over
- Optional short guidance

---

## 25. Yêu cầu hook

### 25.1 useMinesweeper

Primary game hook.

Chịu trách nhiệm:

- Board state
- Difficulty
- Timer state
- Control mode
- Reveal action
- Flag action
- Chord action
- Reset action
- Win/loss transitions

### 25.2 useLongPress

Nhận diện long press trên touch devices.

Yêu cầu:

- Configurable delay
- Hủy nếu touch move quá xa
- Ngăn accidental click sau long press

### 25.3 useDoubleTap

Nhận diện double tap để chord.

Yêu cầu:

- Configurable interval
- Recommended interval: 250ms đến 350ms
- Không xung đột với normal reveal

---

## 26. Logic interaction chi tiết

### 26.1 Khi tap/click hidden cell

Nếu game status là won hoặc lost:

- Không làm gì.

Nếu cell đã flagged:

- Không làm gì trong Reveal mode.
- Remove flag trong Flag mode.

Nếu control mode là Reveal:

- Reveal cell.

Nếu control mode là Flag:

- Toggle flag.

### 26.2 Khi long press hidden cell

Nếu game status là won hoặc lost:

- Không làm gì.

Nếu cell đã revealed:

- Không làm gì.

Ngược lại:

- Toggle flag.
- Kích hoạt haptic feedback nếu có.
- Chặn tap event phát sinh sau đó.

### 26.3 Khi double tap revealed number

Nếu game status là playing:

- Thử chord reveal.

Nếu game status là idle:

- Không làm gì.

### 26.4 Khi right click

Chỉ áp dụng desktop:

- Chặn browser context menu.
- Toggle flag trên hidden cell.

### 26.5 Khi reset

- Reset difficulty hiện tại.
- Clear timer.
- Clear board.
- Set status về idle.
- Giữ selected control mode.

---

## 27. Edge cases

Implementation phải xử lý:

- First tap safe behavior
- First tap ở Flag mode thì cắm cờ, không khởi tạo board nếu timer chỉ bắt đầu khi reveal
- Reveal zero cell ở cạnh và góc board
- Chord ở cạnh và góc board
- Flag count chạm mine count
- Cố gắng flag revealed cell
- Cố gắng reveal flagged cell
- Reset khi đang chơi
- Đổi difficulty khi đang chơi
- Win ở safe reveal cuối cùng
- Thua do chord reveal sai
- Double tap trên hidden cell không được gây reveal hai lần ngoài ý muốn
- Long press không được kích hoạt normal tap reveal sau đó

---

## 28. Định hướng visual design

### 28.1 Overall style

Dùng thiết kế hiện đại, sạch, có gợi nhắc Minesweeper cổ điển.

Khuyến nghị:

- Light background
- Card-style game container
- Rounded corners
- Clear grid
- Strong contrast giữa hidden và revealed cells
- Typography đơn giản
- Compact header

### 28.2 Color guidance

Bảng màu đề xuất:

```text
Background: #F5F5F5
Surface: #FFFFFF
Border: #D0D0D0
Hidden cell: #C8CCD2
Hidden cell pressed: #B5BBC4
Revealed cell: #ECECEC
Text: #1F2937
Danger: #DC2626
Success: #16A34A
Active mode: #2563EB
```

Màu số có thể theo quy ước Minesweeper cổ điển.

### 28.3 Icons

Có thể dùng:

- Text emoji: 🚩, 💣
- SVG icons
- Icon library

Để hiển thị nhất quán, SVG icons được ưu tiên.

---

## 29. Yêu cầu copywriting

Nội dung hiển thị cần ngắn gọn, rõ nghĩa.

Nhãn tiếng Việt khuyến nghị:

- Dò mìn
- Mìn
- Thời gian
- Mở ô
- Cắm cờ
- Chơi lại
- Dễ
- Trung bình
- Khó
- Sẵn sàng
- Đang chơi
- Bạn đã thắng
- Game over

Có thể dùng một số nhãn tiếng Anh nếu là tên mode hoặc thuật ngữ kỹ thuật:

- Reveal
- Flag
- Reset
- Beginner
- Intermediate
- Expert

Trong bản triển khai đầu tiên, nên chọn một ngôn ngữ hiển thị nhất quán. Khuyến nghị dùng tiếng Việt cho UI, giữ thuật ngữ kỹ thuật trong code bằng tiếng Anh.

---

## 30. Yêu cầu testing

### 30.1 Unit tests

Game logic phải có thể test độc lập với UI.

Các khu vực test bắt buộc:

- Board creation
- Mine placement excludes first revealed cell
- Adjacent mine calculation
- Reveal numbered cell
- Flood reveal zero cells
- Flag toggle
- Cannot reveal flagged cell
- Chord reveal success
- Chord reveal failure
- Win condition
- Loss condition

### 30.2 Manual QA

Test trên:

- iPhone Safari
- Android Chrome
- Desktop Chrome
- Desktop Safari hoặc Firefox

### 30.3 Mobile QA cases

Kiểm tra:

- Tap để reveal
- Long press để flag
- Flag mode hoạt động đúng
- Double tap chord hoạt động đúng
- Không accidental reveal sau long press
- Sticky control bar không che board cells
- Expert mode vẫn chơi được
- Reset hoạt động đúng
- Safe area hoạt động đúng trên iPhone

---

## 31. Acceptance Criteria

Project được xem là hoàn thành khi đáp ứng toàn bộ tiêu chí dưới đây.

### 31.1 Functional

- Người dùng có thể mở game bằng browser mà không cần login.
- Game chạy hoàn toàn ở frontend.
- Người dùng có thể start new game ngay lập tức.
- Mines được generate sau lần reveal đầu tiên.
- First reveal luôn an toàn.
- Người dùng có thể reveal cells.
- Người dùng có thể flag và unflag cells.
- Number clues chính xác.
- Zero-cell flood reveal hoạt động đúng.
- Win condition hoạt động đúng.
- Loss condition hoạt động đúng.
- Timer bắt đầu và dừng đúng.
- Mine counter cập nhật đúng.
- Reset hoạt động đúng.
- Difficulty selection hoạt động đúng.

### 31.2 Desktop interaction

- Left click reveal.
- Right click flag.
- Browser context menu bị chặn trên board cells.
- Double click trên revealed number thực hiện chord.

### 31.3 Mobile interaction

- Tap reveal trong Reveal mode.
- Tap flag trong Flag mode.
- Long press toggle flag.
- Double tap trên revealed number thực hiện chord.
- Flagged cells không thể bị reveal nhầm.
- Controls dễ truy cập trong portrait mode.

### 31.4 Responsive UI

- Mobile portrait là layout chính.
- Desktop dùng centered vertical layout.
- Board không overflow ngang.
- Controls vẫn dễ dùng trên small screens.
- Expert mode chơi được.

### 31.5 Quality

- Game logic tách khỏi UI.
- Code có tổ chức, dễ đọc.
- Có basic tests cho core logic.
- Không có backend dependency.
- Không có login dependency.
- Không thu thập personal data.

---

## 32. Ngoài phạm vi version 1

Các phần sau không bắt buộc:

- Multiplayer
- Online leaderboard
- User accounts
- Backend database
- Social sharing
- Ads
- In-app purchases
- Skins/themes
- Campaign mode
- Sound effects
- Advanced animations
- Cloud save

---

## 33. Optional enhancements cho các phiên bản sau

Các tính năng có thể bổ sung sau:

- Best time leaderboard dùng localStorage
- Theme switcher: classic / modern / dark mode
- Sound effects
- Haptic feedback setting
- Custom difficulty
- Daily challenge generate bằng date seed
- Share result as text
- Progressive Web App support
- Installable home-screen icon
- Offline support bằng service worker
- No-guess board generation
- Undo cho casual mode
- Chuyển đổi ngôn ngữ tiếng Việt và tiếng Anh

---

## 34. Ghi chú triển khai cho AI Coding Agent

Khi generate code, ưu tiên theo thứ tự sau:

1. Implement pure game logic.
2. Thêm unit tests cho game logic.
3. Xây dựng UI layout.
4. Kết nối desktop controls.
5. Kết nối mobile controls.
6. Thêm responsive styling.
7. Thêm localStorage best time nếu còn thời gian.
8. Hoàn thiện visual states.

Không thêm backend code.

Không thêm login.

Không thêm dependency không cần thiết.

Không dùng server APIs.

Giữ game có thể chơi hoàn toàn trong static hosting environment.

---

## 35. Development milestones khuyến nghị

### Milestone 1: Core Logic

Deliver:

- Board generation
- Mine placement
- Adjacent number calculation
- Reveal
- Flood reveal
- Flag
- Win/loss detection

### Milestone 2: Basic UI

Deliver:

- Game shell
- Status bar
- Board rendering
- Difficulty selector
- Reset button

### Milestone 3: Input Controls

Deliver:

- Desktop click/right-click
- Mobile tap/long press
- Reveal/Flag mode
- Double tap chord

### Milestone 4: Responsive Polish

Deliver:

- Mobile portrait layout
- Desktop centered portrait layout
- Sticky bottom controls
- Safe area support

### Milestone 5: QA and Final Polish

Deliver:

- Unit tests
- Manual device testing
- Visual refinements
- Accessibility labels
- Production-ready static build

---

## 36. Definition of Done

Web game được xem là hoàn tất khi:

- Có thể deploy như static site.
- Bất kỳ ai cũng có thể chơi mà không cần login.
- Hoạt động tốt trên mobile portrait.
- Hoạt động tốt trên desktop với vertical layout.
- Toàn bộ luật Minesweeper bắt buộc đã được implement.
- Mobile interactions trực quan và ổn định.
- Không cần backend.
- Không thu thập personal data.
- Codebase đủ sạch để mở rộng trong tương lai.
