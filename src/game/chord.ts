import type { RevealResult } from "./types";
import { cloneBoard, countFlaggedNeighbors, getNeighbors } from "./board";

export function isChordSafe(
  board: ReturnType<typeof cloneBoard>,
  row: number,
  col: number
): boolean {
  const cell = board[row][col];
  if (!cell.isRevealed || cell.adjacentMines === 0) return false;
  return countFlaggedNeighbors(board, row, col) === cell.adjacentMines;
}

export function chordReveal(
  board: ReturnType<typeof cloneBoard>,
  row: number,
  col: number
): RevealResult {
  const newBoard = cloneBoard(board);
  const cell = newBoard[row][col];

  // Only on revealed numbered cells
  if (!cell.isRevealed || cell.adjacentMines === 0) {
    return { board: newBoard, hitMine: false, revealedCount: 0 };
  }

  const flaggedCount = countFlaggedNeighbors(newBoard, row, col);

  // Not enough flags — do nothing
  if (flaggedCount !== cell.adjacentMines) {
    return { board: newBoard, hitMine: false, revealedCount: 0 };
  }

  // Reveal all non-flagged, non-revealed neighbors
  const neighbors = getNeighbors(newBoard, row, col);
  let revealedCount = 0;

  for (const neighbor of neighbors) {
    if (neighbor.isFlagged || neighbor.isRevealed) continue;

    neighbor.isRevealed = true;
    revealedCount++;

    if (neighbor.hasMine) {
      neighbor.isExploded = true;
      // Continue revealing all (show all hits) — game over
    }
  }

  const hitMine = neighbors.some((n) => n.hasMine && !n.isFlagged && n.isRevealed);

  return { board: newBoard, hitMine, revealedCount };
}
