import { useAuth } from "../contexts/AuthContext";
import styles from "./UserMenu.module.css";

interface UserMenuProps {
  onOpenLogin: () => void;
  onNavigateHistory: () => void;
}

export default function UserMenu({
  onOpenLogin,
  onNavigateHistory,
}: UserMenuProps) {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <button className={styles.btn} onClick={onOpenLogin}>
        Đăng nhập
      </button>
    );
  }

  return (
    <div className={styles.container}>
      <span className={styles.name} title={user.email ?? ""}>
        {user.displayName ?? user.email?.split("@")[0] ?? "Người chơi"}
      </span>
      <button className={styles.btn} onClick={onNavigateHistory}>
        Lịch sử
      </button>
      <button className={styles.btnSecondary} onClick={signOut}>
        Đăng xuất
      </button>
    </div>
  );
}
