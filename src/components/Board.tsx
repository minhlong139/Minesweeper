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

export function Board({ board, status, controlMode, onReveal, onFlag, onChord }: Props) {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  return (
    <div
      className={styles.board}
      style={{ "--cols": cols } as React.CSSProperties}
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
  );
}
