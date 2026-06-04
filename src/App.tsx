import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { GameShell } from "./components/GameShell";
import LoginModal from "./components/LoginModal";
import HistoryPage from "./components/HistoryPage";

type View = "game" | "history";

function AppContent() {
  const { user } = useAuth();
  const [view, setView] = useState<View>("game");
  const [showLogin, setShowLogin] = useState(false);

  const userId = user?.uid ?? null;

  const goToHistory = () => {
    if (!userId) {
      setShowLogin(true);
      return;
    }
    setView("history");
  };

  const goToGame = () => setView("game");

  if (view === "history") {
    return (
      <div className="app-shell">
        <HistoryPage onBack={goToGame} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <GameShell
        userId={userId}
        onOpenLogin={() => setShowLogin(true)}
        onNavigateHistory={goToHistory}
      />
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
