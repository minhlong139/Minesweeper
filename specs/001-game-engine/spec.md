# Spec — Game Engine (Core Logic)

**Feature ID**: 001 | **Risk level**: Medium | **Phase**: specify
**PO/BO**: Tech Lead | **Trạng thái**: ☐ Draft ☐ Approved

## 1. Bối cảnh & vấn đề nghiệp vụ

Game Minesweeper cần một engine xử lý toàn bộ luật chơi, tách biệt hoàn toàn khỏi UI. Engine phải thuần JavaScript, không phụ thuộc DOM hay framework.

## 2. Mục tiêu

Xây dựng core game engine với đầy đủ luật Minesweeper: tạo bàn cờ, đặt mìn, mở ô, flood reveal, cắm cờ, chord, kiểm tra thắng/thua. Engine có thể test độc lập không cần UI.

## 3. User Story

- As a developer, I want a pure game engine module so that I can unit-test game logic independently from the UI.
- As a player, I want Minesweeper rules to work correctly so that the game feels fair and predictable.

## 4. Acceptance Criteria

```
□ AC1: Tạo bàn cờ rỗng với rows × cols bất kỳ, tất cả cell ở trạng thái hidden
□ AC2: First click luôn an toàn — không bao giờ trúng mìn, ưu tiên mở ra vùng trống
□ AC3: Mìn được đặt ngẫu nhiên sau first click, không đặt vào ô đầu tiên và 8 ô xung quanh
□ AC4: Mỗi ô hiển thị đúng số mìn trong 8 ô lân cận (0-8)
□ AC5: Flood reveal: ô zero tự động mở lan sang các ô zero liên thông + ô số ở biên
□ AC6: Cắm cờ / gỡ cờ hoạt động đúng: chỉ flag được ô hidden, không flag ô revealed
□ AC7: Ô đã cắm cờ không bị mở bởi thao tác reveal thông thường
□ AC8: Chord: double-click vào ô số đã mở → nếu số cờ xung quanh = số trên ô → mở các ô còn lại
□ AC9: Chord sai (cờ cắm sai vị trí) → thua ngay lập tức
□ AC10: Thắng khi tất cả ô không mìn đã được mở
□ AC11: Thua khi mở trúng mìn → hiển thị tất cả mìn + đánh dấu cờ sai
□ AC12: Game state machine: idle → playing → won/lost — không tương tác được board sau khi kết thúc
□ AC13: Khi thắng → tự động cắm cờ tất cả ô có mìn (auto-flag)
```

## 5. Non-goals (ngoài phạm vi)

- UI rendering, CSS, animation — thuộc spec 002
- Mobile touch handling, long press — thuộc spec 003
- Timer, mine counter, localStorage — thuộc spec 004

## 6. Data Model

```typescript
type GameStatus = "idle" | "playing" | "won" | "lost";

type Cell = {
  row: number;
  col: number;
  hasMine: boolean;
  adjacentMines: number;    // 0-8
  isRevealed: boolean;
  isFlagged: boolean;
  isExploded: boolean;       // ô mìn bị click trúng
  isIncorrectFlag: boolean;  // cờ cắm sai (hiển thị khi thua)
};

type GameState = {
  rows: number;
  cols: number;
  mineCount: number;
  board: Cell[][];
  status: GameStatus;
  firstMoveDone: boolean;
  flagsPlaced: number;
  revealedSafeCells: number;
  totalSafeCells: number;    // rows * cols - mineCount
};
```

## 7. Core Functions

### 7.1 createEmptyBoard
```
createEmptyBoard(rows: number, cols: number): Cell[][]
```
Tạo board toàn cell hidden, chưa có mìn.

### 7.2 placeMines
```
placeMines(board: Cell[][], mineCount: number, safeRow: number, safeCol: number): Cell[][]
```
Đặt `mineCount` mìn ngẫu nhiên. KHÔNG đặt vào (safeRow, safeCol) và 8 ô xung quanh nếu đủ không gian.

### 7.3 calculateAdjacentMines
```
calculateAdjacentMines(board: Cell[][]): Cell[][]
```
Duyệt toàn bộ non-mine cells, gán `adjacentMines` = số mìn 8 ô xung quanh.

### 7.4 revealCell
```
revealCell(board: Cell[][], row: number, col: number): { board: Cell[][], hitMine: boolean }
```
- Nếu cell.adjacentMines === 0 → flood reveal (BFS queue-based, KHÔNG recursive)
- Nếu cell.hasMine → hitMine = true, đánh dấu isExploded
- Nếu cell.isFlagged → không làm gì

### 7.5 floodReveal (BFS)
```
floodReveal(board: Cell[][], startRow: number, startCol: number): Cell[][]
```
Queue-based BFS: mở ô zero + lan sang 8 hướng. Khi gặp ô số > 0 → mở ô đó nhưng không lan tiếp.

### 7.6 toggleFlag
```
toggleFlag(board: Cell[][], row: number, col: number): Cell[][]
```
- Chỉ toggle nếu cell chưa revealed và game đang playing
- Không cho phép flagsPlaced > mineCount (chặn over-flagging cho UX tốt hơn)

### 7.7 chordReveal
```
chordReveal(board: Cell[][], row: number, col: number): { board: Cell[][], hitMine: boolean }
```
- Chỉ hoạt động trên ô đã revealed, có adjacentMines > 0
- Đếm số flagged neighbors. Nếu = adjacentMines → reveal tất cả non-flagged neighbors
- Nếu có neighbor chứa mìn → hitMine = true
- **Trigger**: single tap vào ô revealed number (mobile + desktop), hoặc double click (desktop)

### 7.8 checkWin
```
checkWin(board: Cell[][]): boolean
```
`revealedSafeCells === totalSafeCells` — tất cả ô an toàn đã mở.

### 7.9 revealAllMines
```
revealAllMines(board: Cell[][]): Cell[][]
```
Khi thua: hiển thị tất cả mìn, đánh dấu isIncorrectFlag cho cờ cắm sai.

### 7.10 autoFlagMines
```
autoFlagMines(board: Cell[][]): Cell[][]
```
Khi thắng: tự động cắm cờ (isFlagged = true) tất cả ô có mìn chưa được flag. Cập nhật flagsPlaced = mineCount.

### 7.11 isChordSafe
```
isChordSafe(board: Cell[][], row: number, col: number): boolean
```
Kiểm tra ô revealed number: nếu số flagged neighbors === adjacentMines → trả về true (có thể chord an toàn). Dùng cho UI highlight gợi ý chord.

## 8. Game State Machine

```
idle  ──(first reveal)──▶ playing
playing ──(hit mine)────▶ lost  → revealAllMines()
playing ──(all safe open)─▶ won  → autoFlagMines()
lost ──(reset)──────────▶ idle
won  ──(reset)──────────▶ idle
```

Chỉ cho phép reveal/flag/chord khi status === "playing" (ngoại trừ first move từ idle).

## 9. Ràng buộc kỹ thuật

- **Pure functions ưu tiên**: mỗi hàm nhận state cũ, trả state mới (immutable update)
- **Flood reveal dùng BFS queue**, không dùng recursive để tránh stack overflow với board lớn (30×16 = 480 cells)
- **Không dùng external dependencies** — chỉ vanilla JavaScript/TypeScript
- **Unit-testable**: mọi hàm exported, không phụ thuộc DOM/event

## 10. Phụ thuộc & rủi ro

- Phụ thuộc: Không — engine độc lập hoàn toàn
- Rủi ro: Flood reveal sai logic gây loop vô hạn → mitigation: BFS + visited set
- Rủi ro: Random mine placement không đều → mitigation: Fisher-Yates shuffle trên danh sách vị trí hợp lệ

## 11. Đề xuất risk level

AI đề xuất: **Medium** — Logic phức tạp (flood reveal, chord) nhưng dễ test, không ảnh hưởng production data → **Tech Lead chốt**.
