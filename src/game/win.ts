export function checkWin(
  revealedSafeCells: number,
  totalSafeCells: number
): boolean {
  return revealedSafeCells >= totalSafeCells;
}
