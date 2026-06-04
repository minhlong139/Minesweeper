import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAddDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockTimestamp = { now: () => ({ seconds: 98765, nanoseconds: 0 }) };

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
}));

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => args,
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  query: (...args: unknown[]) => args,
  where: (...args: unknown[]) => args,
  orderBy: (...args: unknown[]) => args,
  limit: (n: number) => n,
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  doc: (...args: unknown[]) => args,
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  getFirestore: vi.fn(() => ({})),
  Timestamp: mockTimestamp,
}));

vi.mock("../config", () => ({
  auth: {},
  db: {},
  isFirebaseReady: true,
}));

const { saveGameResult, getUserHistory, getBestTimes } = await import(
  "../firestore"
);

describe("Firestore service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveGameResult", () => {
    it("saves game result to Firestore", async () => {
      mockAddDoc.mockResolvedValue({ id: "doc1" });
      mockGetDoc.mockResolvedValue({ exists: () => false });

      await saveGameResult("u1", {
        difficulty: "beginner",
        status: "won",
        time: 42,
        rows: 9,
        cols: 9,
        mines: 10,
      });

      expect(mockAddDoc).toHaveBeenCalled();
      // Should also update best time since won
      expect(mockSetDoc).toHaveBeenCalled();
    });

    it("does not update best time on loss", async () => {
      mockAddDoc.mockResolvedValue({ id: "doc1" });
      mockGetDoc.mockResolvedValue({ exists: () => false });

      await saveGameResult("u1", {
        difficulty: "beginner",
        status: "lost",
        time: 0,
        rows: 9,
        cols: 9,
        mines: 10,
      });

      expect(mockAddDoc).toHaveBeenCalled();
      expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it("does not overwrite better existing best time", async () => {
      mockAddDoc.mockResolvedValue({ id: "doc1" });
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ time: 30 }),
      });

      await saveGameResult("u1", {
        difficulty: "beginner",
        status: "won",
        time: 60,
        rows: 9,
        cols: 9,
        mines: 10,
      });

      expect(mockSetDoc).not.toHaveBeenCalled();
    });
  });

  describe("getUserHistory", () => {
    it("returns parsed results", async () => {
      mockGetDocs.mockResolvedValue({
        docs: [
          {
            id: "d1",
            data: () => ({
              userId: "u1",
              difficulty: "beginner",
              status: "won",
              time: 30,
              rows: 9,
              cols: 9,
              mines: 10,
              playedAt: mockTimestamp.now(),
            }),
          },
        ],
      });

      const results = await getUserHistory("u1");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("d1");
      expect(results[0].difficulty).toBe("beginner");
    });
  });

  describe("getBestTimes", () => {
    it("returns best times for difficulties that exist", async () => {
      mockGetDoc.mockImplementation(
        (...args: unknown[]) => {
          // doc() returns array of path segments; diff is last segment
          const pathSegments = args[0] as string[];
          const diff = pathSegments[pathSegments.length - 1];
          if (diff === "beginner") {
            return Promise.resolve({
              exists: () => true,
              data: () => ({ time: 25, playedAt: mockTimestamp.now() }),
            });
          }
          return Promise.resolve({ exists: () => false });
        }
      );

      const results = await getBestTimes("u1");
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        difficulty: "beginner",
        time: 25,
        playedAt: mockTimestamp.now(),
      });
    });
  });
});
