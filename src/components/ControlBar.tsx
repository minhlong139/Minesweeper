import type { ControlMode } from "../game";
import styles from "./ControlBar.module.css";

type Props = {
  mode: ControlMode;
  onModeChange: (m: ControlMode) => void;
  onReset: () => void;
};

export function ControlBar({ mode, onModeChange, onReset }: Props) {
  return (
    <div className={styles.bar}>
      <button
        className={`${styles.btn} ${mode === "reveal" ? styles.active : ""}`}
        onClick={() => onModeChange("reveal")}
        aria-pressed={mode === "reveal"}
      >
        🔍 Mở
      </button>
      <button
        className={`${styles.btn} ${mode === "flag" ? styles.active : ""}`}
        onClick={() => onModeChange("flag")}
        aria-pressed={mode === "flag"}
      >
        🚩 Cờ
      </button>
      <button className={styles.btn} onClick={onReset}>
        🔄 Mới
      </button>
    </div>
  );
}
