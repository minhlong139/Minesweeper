import type { GameStatus } from "../game";
import styles from "./StatusBar.module.css";

type Props = {
  mineCount: number;
  flagsPlaced: number;
  elapsedSeconds: number;
  status: GameStatus;
  onReset: () => void;
};

function statusEmoji(status: GameStatus): string {
  switch (status) {
    case "idle": return "🙂";
    case "playing": return "🙂";
    case "won": return "😎";
    case "lost": return "💀";
  }
}

export function StatusBar({ mineCount, flagsPlaced, elapsedSeconds, status, onReset }: Props) {
  const remaining = mineCount - flagsPlaced;

  return (
    <div className={styles.bar} role="status" aria-live="polite">
      <span className={styles.counter} aria-label={`${remaining} mines remaining`}>
        {String(remaining).padStart(3, "0")}
      </span>
      <button className={styles.reset} onClick={onReset} aria-label="Reset game">
        {statusEmoji(status)}
      </button>
      <span className={styles.timer} aria-label={`${elapsedSeconds} seconds elapsed`}>
        {String(elapsedSeconds).padStart(3, "0")}
      </span>
    </div>
  );
}
