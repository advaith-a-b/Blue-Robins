export function calculateStudentRating(baseRating: number, lateCount: number): number {
  // Each late submission reduces rating by 0.2, min rating of 1.0, max 5.0
  const calculated = baseRating - lateCount * 0.2;
  return Math.max(1.0, Math.min(5.0, Math.round(calculated * 10) / 10));
}
