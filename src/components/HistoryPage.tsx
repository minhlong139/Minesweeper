import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserHistory,
  getBestTimes,
  type BestTimeEntry,
} from "../firebase/firestore";
import type { DifficultyLevel, GameStatus } from "../game/types";
import styles from "./HistoryPage.module.css";

interface HistoryPageProps {
  onBack: () => void;
}

const DIFF_LABELS: Record<DifficultyLevel, string> = {
  beginner: "Dễ",
  intermediate: "Vừa",
  expert: "Khó",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type HistoryEntry = {
  id: string;
  difficulty: DifficultyLevel;
  status: GameStatus;
  time: number;
  rows: number;
  cols: number;
  mines: number;
  playedAt: { toDate: () => Date };
};

export default function HistoryPage({ onBack }: HistoryPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [bestTimes, setBestTimes] = useState<BestTimeEntry[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError("Vui lòng đăng nhập để xem lịch sử");
      setLoading(false);
      return;
    }

    async function fetch() {
      try {
        const [bt, h] = await Promise.all([
          getBestTimes(user!.uid),
          getUserHistory(user!.uid),
        ]);
        setBestTimes(bt);
        setHistory(h as unknown as HistoryEntry[]);
      } catch {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
        <button className={styles.backBtn} onClick={onBack}>
          ← Quay lại chơi
        </button>
      </div>
    );
  }

  const getBest = (diff: DifficultyLevel) =>
    bestTimes.find((b) => b.difficulty === diff)?.time ?? null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Quay lại chơi
        </button>
        <h2 className={styles.title}>Lịch sử chơi</h2>
      </div>

      {/* Best Times Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Kỷ lục tốt nhất</h3>
        <div className={styles.bestGrid}>
          {(["beginner", "intermediate", "expert"] as DifficultyLevel[]).map(
            (diff) => {
              const t = getBest(diff);
              return (
                <div key={diff} className={styles.bestCard}>
                  <span className={styles.bestLabel}>{DIFF_LABELS[diff]}</span>
                  <span className={styles.bestTime}>
                    {t !== null ? formatTime(t) : "--:--"}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Game History Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Lịch sử ván chơi</h3>
        {history.length === 0 ? (
          <p className={styles.empty}>Chưa có lịch sử chơi</p>
        ) : (
          <div className={styles.historyList}>
            {history.map((h) => (
              <div key={h.id} className={styles.historyItem}>
                <span className={styles.historyDate}>
                  {h.playedAt.toDate().toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className={styles.historyDiff}>
                  {DIFF_LABELS[h.difficulty]}
                </span>
                <span
                  className={
                    h.status === "won"
                      ? styles.historyWon
                      : styles.historyLost
                  }
                >
                  {h.status === "won" ? "🏆 Thắng" : "💀 Thua"}
                </span>
                <span className={styles.historyTime}>
                  {h.status === "won" ? formatTime(h.time) : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
