export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string; // e.g. "welcome", "rockstar", "on_a_roll"
  awardedTo: string; // studentId
  awardedBy: string; // mentorId
  awardedByName: string;
  awardedAt: string;
}
