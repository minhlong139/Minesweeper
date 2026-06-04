import { useMinesweeper } from "../hooks/useMinesweeper";
import { StatusBar } from "./StatusBar";
import { DifficultySelector } from "./DifficultySelector";
import { Board } from "./Board";
import { ControlBar } from "./ControlBar";
import { GameMessage } from "./GameMessage";
import UserMenu from "./UserMenu";
import BestTimes from "./BestTimes";
import styles from "./GameShell.module.css";

interface GameShellProps {
  userId: string | null;
  onOpenLogin: () => void;
  onNavigateHistory: () => void;
}

export function GameShell({
  userId,
  onOpenLogin,
  onNavigateHistory,
}: GameShellProps) {
  const game = useMinesweeper(userId);

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <h1 className={styles.title}>Minesweeper</h1>
        <UserMenu
          onOpenLogin={onOpenLogin}
          onNavigateHistory={onNavigateHistory}
        />
      </div>
      <StatusBar
        mineCount={game.mineCount}
        flagsPlaced={game.flagsPlaced}
        elapsedSeconds={game.elapsedSeconds}
        status={game.status}
        onReset={() => game.newGame(game.difficulty)}
      />
      <div className={styles.diffRow}>
        <DifficultySelector
          current={game.difficulty}
          onSelect={game.newGame}
        />
        <BestTimes userId={userId} difficulty={game.difficulty} />
      </div>
      <Board
        board={game.board}
        status={game.status}
        controlMode={game.controlMode}
        onReveal={game.reveal}
        onFlag={game.flag}
        onChord={game.chord}
      />
      <ControlBar
        mode={game.controlMode}
        onModeChange={game.setControlMode}
        onReset={() => game.newGame(game.difficulty)}
      />
      <GameMessage status={game.status} />
    </div>
  );
}
