export type UserRole = "employee" | "manager";

export type Mood = "Happy" | "Excited" | "Neutral" | "Anxious" | "Sad";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CheckIn {
  id: string;
  userId: string;
  userName: string;
  mood: Mood;
  rating: number;
  note?: string;
  createdAt: string; // ISO 8601 date string
}

export interface PaginatedCheckIns {
  data: CheckIn[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
