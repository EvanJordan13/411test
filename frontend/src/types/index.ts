export interface Player {
  id: string; // Changed from number to string to match backend playerID
  name: string;
  team: string;
  position: Position; // Use Position type
  stats: Record<string, number>;
  mlScore: number;
  trend: "up" | "down" | "stable";
  lastUpdated?: string; // Keep optional
  note?: string; // Keep optional
  recentNews?: NewsItem[]; // Keep optional
  // Add backend fields exposed by adapter
  playerAge?: number;
  numSeasons?: number;
  numGames?: number;
}

export interface NewsItem {
  id: number | string; // Allow string id if needed (e.g., random for mock)
  title: string;
  date: string;
  source: string;
  content?: string; // Keep optional
}

export interface User {
  // Keep simple for now, aligned with current AuthContext/backend
  username: string;
  favorites: Player[]; // Backend returns full player objects for favorites
  // id: string;
  // email: string;
  // name?: string;
  // favorites: string[]; // Backend returns player IDs
  // notes: Record<string, string>; // Backend doesn't handle notes
}

export interface AuthState {
  user: User | null; // Simplified User type for now
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type Position = "QB" | "RB" | "WR" | "TE"; // Keep only supported positions for now
// | "K" | "DEF";

// For search and filtering
export interface FilterOptions {
  position?: Position | "all";
  team?: string | "all"; // Team code (e.g., "KC") or 'all'
  searchQuery?: string;
  sortBy?: string; // Field name for sorting
  sortDir?: "ASC" | "DESC"; // Sort direction
}

// Add Team type based on backend model
export interface Team {
  id: number;
  name: string;
  code: string; // Added by adapter
  strength: number;
  // Top players are optional as they are only included in getTeamById
  topQB?: Player;
  topRB?: Player;
  topWR?: Player;
  topTE?: Player;
}

// Add Favorite Summary type
export interface FavoriteSummaryData {
  tier: string;
  count: number;
}
