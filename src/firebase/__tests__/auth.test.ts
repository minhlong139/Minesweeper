import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreateUser = vi.fn();
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockSetDoc = vi.fn();
const mockTimestamp = { now: () => ({ seconds: 123, nanoseconds: 0 }) };

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) =>
    mockCreateUser(...args),
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
  signOut: () => mockSignOut(),
  onAuthStateChanged: vi.fn(() => vi.fn()),
  getAuth: vi.fn(() => ({})),
}));

vi.mock("firebase/firestore", () => ({
  doc: (...args: unknown[]) => args,
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  getFirestore: vi.fn(() => ({})),
  Timestamp: mockTimestamp,
}));

vi.mock("../config", () => ({
  auth: {},
  db: {},
  isFirebaseReady: true,
}));

const {
  registerWithEmail,
  loginWithEmail,
  logout,
} = await import("../auth");

describe("Auth service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerWithEmail", () => {
    it("creates user and stores profile in Firestore", async () => {
      mockCreateUser.mockResolvedValue({
        user: { uid: "u1", email: "a@b.com", displayName: null },
      });

      await registerWithEmail("a@b.com", "123456", "Tester");

      expect(mockCreateUser).toHaveBeenCalledWith(
        expect.anything(),
        "a@b.com",
        "123456"
      );
      expect(mockSetDoc).toHaveBeenCalled();
    });
  });

  describe("loginWithEmail", () => {
    it("signs in and returns user", async () => {
      mockSignIn.mockResolvedValue({
        user: { uid: "u1", email: "a@b.com", displayName: "T" },
      });

      const user = await loginWithEmail("a@b.com", "123456");

      expect(user.uid).toBe("u1");
      expect(user.email).toBe("a@b.com");
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("calls signOut", async () => {
      mockSignOut.mockResolvedValue(undefined);
      await logout();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
