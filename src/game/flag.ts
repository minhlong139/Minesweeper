import type { Cell } from "./types";
import { cloneBoard } from "./board";

export function toggleFlag(
  board: Cell[][],
  row: number,
  col: number,
  currentFlagsPlaced: number,
  mineCount: number
): { board: Cell[][]; flagsPlaced: number; changed: boolean } {
  const newBoard = cloneBoard(board);
  const cell = newBoard[row][col];

  if (cell.isRevealed) {
    return { board: newBoard, flagsPlaced: currentFlagsPlaced, changed: false };
  }

  if (cell.isFlagged) {
    // Unflag
    cell.isFlagged = false;
    return { board: newBoard, flagsPlaced: currentFlagsPlaced - 1, changed: true };
  }

  // Flag — block over-flagging
  if (currentFlagsPlaced >= mineCount) {
    return { board: newBoard, flagsPlaced: currentFlagsPlaced, changed: false };
  }

  cell.isFlagged = true;
  return { board: newBoard, flagsPlaced: currentFlagsPlaced + 1, changed: true };
}

export function autoFlagMines(
  board: Cell[][]
): { board: Cell[][]; flagsPlaced: number } {
  const newBoard = cloneBoard(board);
  let flagsPlaced = 0;

  for (const row of newBoard) {
    for (const cell of row) {
      if (cell.hasMine) {
        cell.isFlagged = true;
        flagsPlaced++;
      }
    }
  }

  return { board: newBoard, flagsPlaced };
}
