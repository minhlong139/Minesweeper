import { useRef, useCallback, memo } from "react";
import type { Cell as CellType, GameStatus, ControlMode } from "../game";
import styles from "./Cell.module.css";

type Props = {
  cell: CellType;
  status: GameStatus;
  controlMode: ControlMode;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
};

function getAriaLabel(cell: CellType): string {
  const pos = `Row ${cell.row + 1}, Column ${cell.col + 1}`;
  if (cell.isExploded) return `${pos}, exploded mine`;
  if (cell.isIncorrectFlag) return `${pos}, incorrect flag`;
  if (cell.isFlagged) return `${pos}, flagged`;
  if (cell.isRevealed && cell.hasMine) return `${pos}, mine`;
  if (cell.isRevealed && cell.adjacentMines > 0)
    return `${pos}, ${cell.adjacentMines} neighboring mines`;
  if (cell.isRevealed) return `${pos}, empty`;
  return `${pos}, hidden`;
}

export const Cell = memo(function Cell({
  cell,
  status,
  controlMode,
  onReveal,
  onFlag,
  onChord,
}: Props) {
  // Long press tracking
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  // Double tap tracking
  const lastTapTime = useRef(0);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (status === "won" || status === "lost") return;
      if (longPressTriggered.current) {
        longPressTriggered.current = false;
        return;
      }
      e.preventDefault();

      // Chord: single tap on revealed numbered cell (both modes)
      if (cell.isRevealed && cell.adjacentMines > 0) {
        onChord(cell.row, cell.col);
        return;
      }

      // Reveal mode
      if (controlMode === "reveal") {
        if (!cell.isFlagged && !cell.isRevealed) {
          onReveal(cell.row, cell.col);
        }
      } else {
        // Flag mode
        if (!cell.isRevealed) {
          onFlag(cell.row, cell.col);
        }
      }
    },
    [status, controlMode, cell, onReveal, onFlag, onChord]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (status === "won" || status === "lost") return;
      if (!cell.isRevealed) {
        onFlag(cell.row, cell.col);
      }
    },
    [status, cell, onFlag]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (status === "won" || status === "lost") return;
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      longPressTriggered.current = false;

      longPressTimer.current = setTimeout(() => {
        longPressTriggered.current = true;
        if (!cell.isRevealed) {
          onFlag(cell.row, cell.col);
          try {
            navigator.vibrate?.(20);
          } catch { /* noop */ }
        }
      }, 400);
    },
    [status, cell, onFlag]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartPos.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartPos.current.x;
      const dy = touch.clientY - touchStartPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 10) {
        clearLongPress();
      }
    },
    [clearLongPress]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      clearLongPress();
      if (longPressTriggered.current) {
        e.preventDefault();
        longPressTriggered.current = false;
        return;
      }

      // Double tap detection
      const now = Date.now();
      if (now - lastTapTime.current < 300) {
        // Double tap → chord on revealed number
        lastTapTime.current = 0;
        if (status !== "won" && status !== "lost" && cell.isRevealed && cell.adjacentMines > 0) {
          e.preventDefault();
          onChord(cell.row, cell.col);
          return;
        }
      }
      lastTapTime.current = now;
    },
    [clearLongPress, status, cell, onChord]
  );

  const handleTouchCancel = useCallback(() => {
    clearLongPress();
    longPressTriggered.current = false;
  }, [clearLongPress]);

  // Visual state
  let className = styles.cell;
  let content: React.ReactNode = null;

  if (cell.isExploded) {
    className += ` ${styles.exploded}`;
    content = "💣";
  } else if (cell.isIncorrectFlag) {
    className += ` ${styles.revealed}`;
    content = "❌";
  } else if (cell.isFlagged) {
    className += ` ${styles.hidden}`;
    content = "🚩";
  } else if (!cell.isRevealed) {
    className += ` ${styles.hidden}`;
  } else if (cell.hasMine) {
    className += ` ${styles.revealed}`;
    content = "💣";
  } else if (cell.adjacentMines > 0) {
    className += ` ${styles.revealed} ${styles[`n${cell.adjacentMines}`]}`;
    content = cell.adjacentMines;
  } else {
    className += ` ${styles.revealed}`;
  }

  return (
    <button
      className={className}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      role="gridcell"
      aria-label={getAriaLabel(cell)}
    >
      {content}
    </button>
  );
});
