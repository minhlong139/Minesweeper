export { auth, db, isFirebaseReady } from "./config";
export {
  loginWithEmail,
  registerWithEmail,
  logout,
  getCurrentUser,
} from "./auth";
export type { AuthUser } from "./auth";
export {
  saveGameResult,
  getUserHistory,
  getBestTimes,
} from "./firestore";
export type { GameResultDoc } from "./firestore";
