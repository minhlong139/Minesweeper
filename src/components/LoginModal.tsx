import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./LoginModal.module.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "login" | "register";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await register(email, password, name || email.split("@")[0]);
      }
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Đã xảy ra lỗi";
      setError(translateError(msg));
    } finally {
      setLoading(false);
    }
  }

  function switchTab(t: Tab) {
    setTab(t);
    setError("");
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={tab === "login" ? "Đăng nhập" : "Đăng ký"}
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Đóng"
        >
          ✕
        </button>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "login" ? styles.activeTab : ""}`}
            onClick={() => switchTab("login")}
          >
            Đăng nhập
          </button>
          <button
            className={`${styles.tab} ${tab === "register" ? styles.activeTab : ""}`}
            onClick={() => switchTab("register")}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {tab === "register" && (
            <input
              className={styles.input}
              type="text"
              placeholder="Tên hiển thị"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          )}
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={
              tab === "login" ? "current-password" : "new-password"
            }
          />

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Đang xử lý..."
              : tab === "login"
                ? "Đăng nhập"
                : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
}

function translateError(msg: string): string {
  const map: Record<string, string> = {
    "invalid-credential": "Email hoặc mật khẩu không đúng",
    "invalid-email": "Email không hợp lệ",
    "user-disabled": "Tài khoản đã bị vô hiệu hóa",
    "user-not-found": "Không tìm thấy tài khoản",
    "wrong-password": "Email hoặc mật khẩu không đúng",
    "email-already-in-use": "Email đã được sử dụng",
    "weak-password": "Mật khẩu quá yếu (tối thiểu 6 ký tự)",
    "too-many-requests": "Quá nhiều yêu cầu. Vui lòng thử lại sau",
    "network-request-failed":
      "Lỗi kết nối mạng. Vui lòng kiểm tra internet",
    "popup-closed-by-user": "Đã hủy đăng nhập",
  };
  for (const [key, value] of Object.entries(map)) {
    if (msg.includes(key)) return value;
  }
  return msg;
}
