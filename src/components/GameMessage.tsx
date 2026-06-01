import type { GameStatus } from "../game";
import styles from "./GameMessage.module.css";

type Props = {
  status: GameStatus;
};

const MESSAGES: Record<GameStatus, string> = {
  idle: "Sẵn sàng — Chạm để bắt đầu",
  playing: "Đang chơi",
  won: "🎉 Bạn đã thắng!",
  lost: "💣 Game Over",
};

export function GameMessage({ status }: Props) {
  return (
    <div className={styles.msg} role="status" aria-live="assertive">
      {MESSAGES[status]}
    </div>
  );
}
