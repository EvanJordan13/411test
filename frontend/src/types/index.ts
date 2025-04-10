export interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  stats: Record<string, number>;
  mlScore: number;
  trend: "up" | "down" | "stable";
  lastUpdated?: string;
  note?: string;
  recentNews?: News[];
}

export interface News {
  id: number;
  title: string;
  date: string;
  source: string;
  content?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  favorites: number[];
  notes: Record<number, string>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type Position = "QB" | "RB" | "WR" | "TE" | "K" | "DEF";

// For search and filtering
export interface FilterOptions {
  position?: Position | "all";
  team?: string | "all";
  searchQuery?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  source: string;
}
