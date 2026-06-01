import type { DifficultyConfig, DifficultyLevel } from "./types";

export const DIFFICULTIES: Record<DifficultyLevel, DifficultyConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

export const DIRECTIONS: readonly [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export const STORAGE_KEYS = {
  bestTime: (diff: DifficultyLevel) => `minesweeper.bestTime.${diff}`,
  difficulty: "minesweeper.settings.difficulty",
  controlMode: "minesweeper.settings.controlMode",
};
