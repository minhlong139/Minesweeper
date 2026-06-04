import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { isFirebaseReady } from "../firebase/config";
import {
  loginWithEmail,
  registerWithEmail,
  logout,
  onAuthChange,
  type AuthUser,
} from "../firebase/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (email: string, password: string, name: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function noFirebaseError(): never {
  throw new Error("Firebase chưa được cấu hình. Tạo file .env với VITE_FIREBASE_* keys.");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(isFirebaseReady);

  useEffect(() => {
    if (!isFirebaseReady) {
      setLoading(false);
      return;
    }
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!isFirebaseReady) noFirebaseError();
    return loginWithEmail(email, password);
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      if (!isFirebaseReady) noFirebaseError();
      return registerWithEmail(email, password, name);
    },
    []
  );

  const signOut = useCallback(async () => {
    if (!isFirebaseReady) return;
    await logout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
