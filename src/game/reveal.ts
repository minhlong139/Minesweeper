import type { Cell, RevealResult } from "./types";
import { cloneBoard, getNeighbors } from "./board";
import { DIRECTIONS } from "./constants";

/** Queue-based BFS flood reveal — tránh stack overflow với board lớn */
export function floodReveal(
  board: Cell[][],
  startRow: number,
  startCol: number
): { board: Cell[][]; revealedCount: number } {
  const newBoard = cloneBoard(board);
  const rows = newBoard.length;
  const cols = newBoard[0].length;

  const queue: [number, number][] = [[startRow, startCol]];
  const visited = new Set<string>();
  visited.add(`${startRow},${startCol}`);
  let revealedCount = 0;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const cell = newBoard[r][c];

    if (cell.isFlagged || cell.isRevealed) continue;

    cell.isRevealed = true;
    revealedCount++;

    if (cell.adjacentMines === 0) {
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;
        if (
          nr >= 0 && nr < rows &&
          nc >= 0 && nc < cols &&
          !visited.has(key)
        ) {
          const neighbor = newBoard[nr][nc];
          if (!neighbor.isRevealed && !neighbor.isFlagged) {
            queue.push([nr, nc]);
            visited.add(key);
          }
        }
      }
    }
  }

  return { board: newBoard, revealedCount };
}

export function revealCell(
  board: Cell[][],
  row: number,
  col: number
): RevealResult {
  const newBoard = cloneBoard(board);
  const cell = newBoard[row][col];

  // Already revealed or flagged — no-op
  if (cell.isRevealed || cell.isFlagged) {
    return { board: newBoard, hitMine: false, revealedCount: 0 };
  }

  // Hit mine
  if (cell.hasMine) {
    cell.isExploded = true;
    cell.isRevealed = true;
    return { board: newBoard, hitMine: true, revealedCount: 0 };
  }

  // Reveal empty or number
  if (cell.adjacentMines === 0) {
    const result = floodReveal(newBoard, row, col);
    return { board: result.board, hitMine: false, revealedCount: result.revealedCount };
  }

  cell.isRevealed = true;
  return { board: newBoard, hitMine: false, revealedCount: 1 };
}

export function revealAllMines(board: Cell[][]): Cell[][] {
  const newBoard = cloneBoard(board);
  for (const row of newBoard) {
    for (const cell of row) {
      if (cell.hasMine && !cell.isFlagged) {
        cell.isRevealed = true;
      }
      if (cell.isFlagged && !cell.hasMine) {
        cell.isIncorrectFlag = true;
      }
    }
  }
  return newBoard;
}
