import type { DifficultyLevel } from "../game";
import { DIFFICULTIES, STORAGE_KEYS } from "../game";
import { useState } from "react";
import styles from "./DifficultySelector.module.css";

type Props = {
  current: DifficultyLevel;
  onSelect: (d: DifficultyLevel) => void;
};

const LABELS: Record<DifficultyLevel, string> = {
  beginner: "Dễ",
  intermediate: "Vừa",
  expert: "Khó",
};

function loadBest(diff: DifficultyLevel): number | null {
  try {
    const v = localStorage.getItem(STORAGE_KEYS.bestTime(diff));
    return v ? parseInt(v, 10) : null;
  } catch {
    return null;
  }
}

export function DifficultySelector({ current, onSelect }: Props) {
  // Re-read best time on each render (win triggers re-render)
  const [, _force] = useState(0);

  return (
    <div className={styles.selector}>
      {(Object.keys(DIFFICULTIES) as DifficultyLevel[]).map((d) => {
        const best = loadBest(d);
        return (
          <button
            key={d}
            className={`${styles.btn} ${d === current ? styles.active : ""}`}
            onClick={() => onSelect(d)}
          >
            <span className={styles.label}>{LABELS[d]}</span>
            <span className={styles.best}>
              {best !== null ? `🏆 ${String(best).padStart(3, "0")}` : "--"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
