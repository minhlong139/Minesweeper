import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "./config";
import type { DifficultyLevel, GameStatus } from "../game/types";

export interface GameResultDoc {
  userId: string;
  difficulty: DifficultyLevel;
  status: GameStatus;
  time: number;
  rows: number;
  cols: number;
  mines: number;
  playedAt: Timestamp;
}

export interface BestTimeEntry {
  difficulty: DifficultyLevel;
  time: number;
  playedAt: Timestamp;
}

export async function saveGameResult(
  userId: string,
  result: Omit<GameResultDoc, "userId" | "playedAt">
): Promise<void> {
  const doc: GameResultDoc = {
    userId,
    ...result,
    playedAt: Timestamp.now(),
  };
  await addDoc(collection(db, "gameResults"), doc);

  // Update best time if won and it's a new record
  if (result.status === "won") {
    await updateBestTime(userId, result.difficulty, result.time);
  }
}

async function updateBestTime(
  userId: string,
  difficulty: DifficultyLevel,
  time: number
): Promise<void> {
  const bestTimeRef = doc(db, "users", userId, "bestTimes", difficulty);
  const snap = await getDoc(bestTimeRef);
  if (!snap.exists() || snap.data().time > time) {
    await setDoc(bestTimeRef, {
      time,
      playedAt: Timestamp.now(),
    });
  }
}

export async function getUserHistory(
  userId: string,
  maxResults = 50
): Promise<(GameResultDoc & { id: string })[]> {
  const q = query(
    collection(db, "gameResults"),
    where("userId", "==", userId),
    orderBy("playedAt", "desc"),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map(convertDoc);
}

function convertDoc(
  d: QueryDocumentSnapshot<DocumentData>
): GameResultDoc & { id: string } {
  return { ...d.data(), id: d.id } as GameResultDoc & { id: string };
}

export async function getBestTimes(
  userId: string
): Promise<BestTimeEntry[]> {
  const difficulties: DifficultyLevel[] = ["beginner", "intermediate", "expert"];
  const results: BestTimeEntry[] = [];

  for (const diff of difficulties) {
    const snap = await getDoc(doc(db, "users", userId, "bestTimes", diff));
    if (snap.exists()) {
      const data = snap.data();
      results.push({
        difficulty: diff,
        time: data.time,
        playedAt: data.playedAt,
      });
    }
  }

  return results;
}
