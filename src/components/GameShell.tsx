import { useMinesweeper } from "../hooks/useMinesweeper";
import { StatusBar } from "./StatusBar";
import { DifficultySelector } from "./DifficultySelector";
import { Board } from "./Board";
import { ControlBar } from "./ControlBar";
import { GameMessage } from "./GameMessage";
import styles from "./GameShell.module.css";

export function GameShell() {
  const game = useMinesweeper();

  return (
    <div className={styles.shell}>
      <h1 className={styles.title}>Minesweeper</h1>
      <StatusBar
        mineCount={game.mineCount}
        flagsPlaced={game.flagsPlaced}
        elapsedSeconds={game.elapsedSeconds}
        status={game.status}
        onReset={() => game.newGame(game.difficulty)}
      />
      <DifficultySelector
        current={game.difficulty}
        onSelect={game.newGame}
      />
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
