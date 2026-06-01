export type GameStatus = "idle" | "playing" | "won" | "lost";
export type ControlMode = "reveal" | "flag";

export type Cell = {
  row: number;
  col: number;
  hasMine: boolean;
  adjacentMines: number;
  isRevealed: boolean;
  isFlagged: boolean;
  isExploded: boolean;
  isIncorrectFlag: boolean;
};

export type DifficultyLevel = "beginner" | "intermediate" | "expert";

export type DifficultyConfig = {
  rows: number;
  cols: number;
  mines: number;
};

export type GameState = {
  rows: number;
  cols: number;
  mineCount: number;
  board: Cell[][];
  status: GameStatus;
  firstMoveDone: boolean;
  flagsPlaced: number;
  revealedSafeCells: number;
  totalSafeCells: number;
};

export type RevealResult = {
  board: Cell[][];
  hitMine: boolean;
  revealedCount: number;
};
