export type ReviewRating = "needs-work" | "developing" | "strong" | "excellent";

export interface AIReview {
  summary: string;
  strengths: string[];
  improvements: string[];
  rating: ReviewRating;
}
