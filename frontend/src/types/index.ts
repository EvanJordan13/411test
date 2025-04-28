export interface Player {
  id: string;
  name: string;
  team: string;
  position: Position;
  stats: Record<string, number>;
  mlScore: number;
  trend: "up" | "down" | "stable";
  lastUpdated?: string;
  note?: string;
  recentNews?: NewsItem[];
  playerAge?: number;
  numSeasons?: number;
  numGames?: number;
}

export interface NewsItem {
  id: number | string;
  title: string;
  date: string;
  source: string;
  content?: string;
}

export interface User {
  username: string;
  favorites: Player[]; // Backend returns full player objects for favorites
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type Position = "QB" | "RB" | "WR" | "TE";

// For search and filtering
export interface FilterOptions {
  position?: Position | "all";
  team?: string | "all";
  searchQuery?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export interface Team {
  id: number;
  name: string;
  code: string;
  strength: number;
  topQB?: Player;
  topRB?: Player;
  topWR?: Player;
  topTE?: Player;
}

export interface FavoriteSummaryData {
  tier: string;
  count: number;
}
