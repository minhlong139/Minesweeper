import type { Cell } from "./types";
import { DIRECTIONS } from "./constants";

export function createEmptyBoard(rows: number, cols: number): Cell[][] {
  const board: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        hasMine: false,
        adjacentMines: 0,
        isRevealed: false,
        isFlagged: false,
        isExploded: false,
        isIncorrectFlag: false,
      });
    }
    board.push(row);
  }
  return board;
}

export function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

export function getNeighbors(
  board: Cell[][],
  row: number,
  col: number
): Cell[] {
  const rows = board.length;
  const cols = board[0].length;
  const result: Cell[] = [];
  for (const [dr, dc] of DIRECTIONS) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      result.push(board[nr][nc]);
    }
  }
  return result;
}

export function countFlaggedNeighbors(
  board: Cell[][],
  row: number,
  col: number
): number {
  return getNeighbors(board, row, col).filter((c) => c.isFlagged).length;
}

export function placeMines(
  board: Cell[][],
  mineCount: number,
  safeRow: number,
  safeCol: number
): Cell[][] {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = cloneBoard(board);

  // Collect all valid positions (exclude safe cell + its neighbors)
  const safeZone = new Set<string>();
  safeZone.add(`${safeRow},${safeCol}`);
  for (const [dr, dc] of DIRECTIONS) {
    const nr = safeRow + dr;
    const nc = safeCol + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      safeZone.add(`${nr},${nc}`);
    }
  }

  const validPositions: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safeZone.has(`${r},${c}`)) {
        validPositions.push([r, c]);
      }
    }
  }

  // Fisher-Yates shuffle to pick random positions
  const count = Math.min(mineCount, validPositions.length);
  for (let i = validPositions.length - 1; i > 0 && validPositions.length - i <= count; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [validPositions[i], validPositions[j]] = [validPositions[j], validPositions[i]];
  }

  // Place mines (last `count` positions after partial shuffle)
  for (let k = 0; k < count; k++) {
    const [r, c] = validPositions[validPositions.length - 1 - k];
    newBoard[r][c].hasMine = true;
  }

  return newBoard;
}

export function calculateAdjacentMines(board: Cell[][]): Cell[][] {
  const newBoard = cloneBoard(board);
  for (const row of newBoard) {
    for (const cell of row) {
      if (!cell.hasMine) {
        cell.adjacentMines = getNeighbors(newBoard, cell.row, cell.col).filter(
          (c) => c.hasMine
        ).length;
      }
    }
  }
  return newBoard;
}
