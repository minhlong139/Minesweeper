import { useReducer, useEffect, useCallback, useRef } from "react";
import type { GameState, DifficultyLevel, ControlMode, Cell } from "../game";
import {
  DIFFICULTIES,
  createEmptyBoard,
  placeMines,
  calculateAdjacentMines,
  revealCell,
  revealAllMines,
  toggleFlag,
  autoFlagMines,
  chordReveal,
  checkWin,
  STORAGE_KEYS,
} from "../game";
import { saveGameResult } from "../firebase/firestore";

// ── State ──────────────────────────────────────────────────────────────────

type UIState = {
  board: Cell[][];
  status: GameState["status"];
  difficulty: DifficultyLevel;
  controlMode: ControlMode;
  flagsPlaced: number;
  mineCount: number;
  revealedSafeCells: number;
  totalSafeCells: number;
  elapsedSeconds: number;
  timerRunning: boolean;
  firstMoveDone: boolean;
};

function loadSetting<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function createInitialState(): UIState {
  const diff = loadSetting<DifficultyLevel>(
    STORAGE_KEYS.difficulty,
    "beginner"
  );
  const mode = loadSetting<ControlMode>(
    STORAGE_KEYS.controlMode,
    "reveal"
  );
  const cfg = DIFFICULTIES[diff];
  const board = createEmptyBoard(cfg.rows, cfg.cols);

  return {
    board,
    status: "idle",
    difficulty: diff,
    controlMode: mode,
    flagsPlaced: 0,
    mineCount: cfg.mines,
    revealedSafeCells: 0,
    totalSafeCells: cfg.rows * cfg.cols - cfg.mines,
    elapsedSeconds: 0,
    timerRunning: false,
    firstMoveDone: false,
  };
}

// ── Reducer ────────────────────────────────────────────────────────────────

type GameAction =
  | { type: "NEW_GAME"; difficulty: DifficultyLevel }
  | { type: "REVEAL"; row: number; col: number }
  | { type: "FLAG"; row: number; col: number }
  | { type: "CHORD"; row: number; col: number }
  | { type: "SET_CONTROL_MODE"; mode: ControlMode }
  | { type: "TICK" };

function gameReducer(state: UIState, action: GameAction): UIState {
  switch (action.type) {
    case "NEW_GAME": {
      const cfg = DIFFICULTIES[action.difficulty];
      const board = createEmptyBoard(cfg.rows, cfg.cols);
      try {
        localStorage.setItem(
          STORAGE_KEYS.difficulty,
          JSON.stringify(action.difficulty)
        );
      } catch { /* noop */ }
      return {
        board,
        status: "idle",
        difficulty: action.difficulty,
        controlMode: state.controlMode,
        flagsPlaced: 0,
        mineCount: cfg.mines,
        revealedSafeCells: 0,
        totalSafeCells: cfg.rows * cfg.cols - cfg.mines,
        elapsedSeconds: 0,
        timerRunning: false,
        firstMoveDone: false,
      };
    }

    case "REVEAL": {
      if (state.status === "won" || state.status === "lost") return state;

      let currentBoard = state.board;
      let firstMoveDone = state.firstMoveDone;
      let revealedSafeCells = state.revealedSafeCells;

      // First move: place mines
      if (!firstMoveDone) {
        currentBoard = placeMines(
          currentBoard,
          state.mineCount,
          action.row,
          action.col
        );
        currentBoard = calculateAdjacentMines(currentBoard);
        firstMoveDone = true;
      }

      const result = revealCell(currentBoard, action.row, action.col);

      if (result.hitMine) {
        const revealed = revealAllMines(result.board);
        return {
          ...state,
          board: revealed,
          status: "lost",
          firstMoveDone,
          timerRunning: false,
        };
      }

      revealedSafeCells += result.revealedCount;

      if (checkWin(revealedSafeCells, state.totalSafeCells)) {
        const { board: flagged, flagsPlaced } = autoFlagMines(result.board);
        // Save best time
        try {
          const key = STORAGE_KEYS.bestTime(state.difficulty);
          const prev = localStorage.getItem(key);
          if (!prev || state.elapsedSeconds < parseInt(prev, 10)) {
            localStorage.setItem(key, String(state.elapsedSeconds));
          }
        } catch { /* noop */ }
        return {
          ...state,
          board: flagged,
          status: "won",
          firstMoveDone,
          flagsPlaced,
          revealedSafeCells,
          timerRunning: false,
        };
      }

      return {
        ...state,
        board: result.board,
        status: "playing",
        firstMoveDone,
        revealedSafeCells,
        timerRunning: true,
      };
    }

    case "FLAG": {
      if (state.status !== "playing" && state.status !== "idle") return state;

      const result = toggleFlag(
        state.board,
        action.row,
        action.col,
        state.flagsPlaced,
        state.mineCount
      );

      return {
        ...state,
        board: result.board,
        flagsPlaced: result.flagsPlaced,
      };
    }

    case "CHORD": {
      if (state.status !== "playing") return state;

      const result = chordReveal(state.board, action.row, action.col);

      if (result.hitMine) {
        const revealed = revealAllMines(result.board);
        return {
          ...state,
          board: revealed,
          status: "lost",
          timerRunning: false,
        };
      }

      const newRevealedSafeCells =
        state.revealedSafeCells + result.revealedCount;

      if (checkWin(newRevealedSafeCells, state.totalSafeCells)) {
        const { board: flagged, flagsPlaced } = autoFlagMines(result.board);
        try {
          const key = STORAGE_KEYS.bestTime(state.difficulty);
          const prev = localStorage.getItem(key);
          if (!prev || state.elapsedSeconds < parseInt(prev, 10)) {
            localStorage.setItem(key, String(state.elapsedSeconds));
          }
        } catch { /* noop */ }
        return {
          ...state,
          board: flagged,
          status: "won",
          flagsPlaced,
          revealedSafeCells: newRevealedSafeCells,
          timerRunning: false,
        };
      }

      return {
        ...state,
        board: result.board,
        revealedSafeCells: newRevealedSafeCells,
      };
    }

    case "SET_CONTROL_MODE": {
      try {
        localStorage.setItem(
          STORAGE_KEYS.controlMode,
          JSON.stringify(action.mode)
        );
      } catch { /* noop */ }
      return { ...state, controlMode: action.mode };
    }

    case "TICK": {
      if (!state.timerRunning) return state;
      const next = state.elapsedSeconds + 1;
      return { ...state, elapsedSeconds: next > 999 ? 999 : next };
    }

    default:
      return state;
  }
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useMinesweeper(userId: string | null) {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const prevStatus = useRef(state.status);

  // Timer
  useEffect(() => {
    if (!state.timerRunning) return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.timerRunning]);

  // Save game result when status changes to won/lost
  useEffect(() => {
    if (!userId) return;
    const wasPlaying =
      prevStatus.current === "idle" || prevStatus.current === "playing";
    const isEnded = state.status === "won" || state.status === "lost";
    if (!wasPlaying || !isEnded) {
      prevStatus.current = state.status;
      return;
    }
    prevStatus.current = state.status;

    const cfg = DIFFICULTIES[state.difficulty];
    saveGameResult(userId, {
      difficulty: state.difficulty,
      status: state.status,
      time: state.status === "won" ? state.elapsedSeconds : 0,
      rows: cfg.rows,
      cols: cfg.cols,
      mines: cfg.mines,
    }).catch(() => {
      /* firestore unavailable — game still works offline */
    });
  }, [state.status, userId, state.difficulty, state.elapsedSeconds]);

  const newGame = useCallback((difficulty: DifficultyLevel) => {
    dispatch({ type: "NEW_GAME", difficulty });
  }, []);

  const reveal = useCallback((row: number, col: number) => {
    dispatch({ type: "REVEAL", row, col });
  }, []);

  const flag = useCallback((row: number, col: number) => {
    dispatch({ type: "FLAG", row, col });
  }, []);

  const chord = useCallback((row: number, col: number) => {
    dispatch({ type: "CHORD", row, col });
  }, []);

  const setControlMode = useCallback((mode: ControlMode) => {
    dispatch({ type: "SET_CONTROL_MODE", mode });
  }, []);

  return {
    ...state,
    newGame,
    reveal,
    flag,
    chord,
    setControlMode,
  };
}
