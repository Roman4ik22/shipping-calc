import reviewData from "@/data/carrier-reviews.json";

export interface CarrierReview {
  trustpilot: {
    rating: number;
    reviews: number;
    url: string;
  };
  summary: "good" | "average" | "mixed";
}

const carriers = reviewData.carriers as Record<string, CarrierReview>;

export function getCarrierReview(carrierId: string): CarrierReview | null {
  return carriers[carrierId] ?? null;
}

export function hasReview(carrierId: string): boolean {
  return carrierId in carriers;
}

export function getReviewStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3 && rating - full < 0.8;
  const stars: string[] = [];
  for (let i = 0; i < full; i++) stars.push("★");
  if (half) stars.push("½");
  const empty = 5 - full - (half ? 1 : 0);
  for (let i = 0; i < empty; i++) stars.push("☆");
  return stars.join("");
}

export function getRatingColor(rating: number): string {
  if (rating >= 3.5) return "text-green-400";
  if (rating >= 2.5) return "text-yellow-400";
  if (rating >= 1.5) return "text-orange-400";
  return "text-red-400";
}

export function formatReviewCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}
