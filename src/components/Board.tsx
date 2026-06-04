import { useMemo } from "react";
import type { Cell as CellType, GameStatus, ControlMode } from "../game";
import { Cell } from "./Cell";
import styles from "./Board.module.css";

type Props = {
  board: CellType[][];
  status: GameStatus;
  controlMode: ControlMode;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
};

const MIN_CELL = 28;
const CELL_BORDER = 3; // 1px + 2px borders per cell
const BOARD_BORDER = 6; // 3px × 2 sides

export function Board({ board, status, controlMode, onReveal, onFlag, onChord }: Props) {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  const cellSize = useMemo(() => {
    // Use fixed pixel size to prevent subpixel rounding with 1fr
    // max-width container: 480px mobile, 520px desktop, minus 16px padding + 6px border
    const maxWidth = Math.min(
      typeof window !== "undefined" ? window.innerWidth - 22 : 458,
      520 - 38
    );
    const fitSize = Math.floor(maxWidth / cols);
    return Math.max(fitSize, MIN_CELL);
  }, [cols]);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.board}
        style={{
          "--cols": cols,
          "--cell-size": `${cellSize}px`,
          width: cols * cellSize + BOARD_BORDER,
        } as React.CSSProperties}
        role="grid"
        aria-label="Minesweeper board"
      >
        {board.flat().map((cell) => (
          <Cell
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            status={status}
            controlMode={controlMode}
            onReveal={onReveal}
            onFlag={onFlag}
            onChord={onChord}
          />
        ))}
      </div>
    </div>
  );
}
