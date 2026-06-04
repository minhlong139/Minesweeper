import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseReady } from "../firebase/config";
import { STORAGE_KEYS } from "../game";
import type { DifficultyLevel } from "../game/types";
import styles from "./BestTimes.module.css";

interface BestTimesProps {
  userId: string | null;
  difficulty: DifficultyLevel;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function BestTimes({ userId, difficulty }: BestTimesProps) {
  const [best, setBest] = useState<number | null>(null);

  // Cloud best time (logged in)
  useEffect(() => {
    if (!userId || !isFirebaseReady) return;
    const ref = doc(db, "users", userId, "bestTimes", difficulty);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setBest(snap.data().time);
        } else {
          setBest(null);
        }
      },
      () => {
        /* offline — noop */
      }
    );
    return unsub;
  }, [userId, difficulty]);

  // Local best time (guest mode)
  const localBest = readLocalBest(difficulty);

  const display = userId ? best : localBest;

  return (
    <span className={styles.container}>
      Best:{" "}
      <span className={styles.time}>
        {display !== null ? formatTime(display) : "--"}
      </span>
    </span>
  );
}

function readLocalBest(diff: DifficultyLevel): number | null {
  try {
    const key = STORAGE_KEYS.bestTime(diff);
    const v = localStorage.getItem(key);
    return v ? parseInt(v, 10) : null;
  } catch {
    return null;
  }
}
