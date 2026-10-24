export type ItemType = "lost" | "found";

export interface Item {
  id: number;
  title: string;
  description?: string;
  location: string;
  type: ItemType;
  reportedBy: string;
  reportedAt: string;
  isClaimed: boolean;
}

export interface Claim {
  id: number;
  itemId: number;
  claimerName: string;
  status: "pending" | "verified" | "completed";
  requestedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "staff";
}
