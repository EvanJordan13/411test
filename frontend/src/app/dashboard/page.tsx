"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  StarOff,
  ChevronRight,
  List,
  Heart,
  Newspaper,
  User as UserIcon,
  Users as TeamsIcon,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import SearchBar from "@/components/ui/SearchBar";
import type { Player, Team } from "@/types";
import { usePlayers } from "@/lib/hooks/usePlayers";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { playerAPI, teamAPI } from "@/lib/api/apiClient";
import { adaptTeamData, adaptPlayerData } from "@/lib/adapters/playerAdapter";

// Simple component to display a search result item
const SearchResultItem = ({
  type,
  name,
  description,
  link,
}: {
  type: "player" | "team";
  name: string;
  description: string;
  link: string;
}) => (
  <Link href={link} className="block p-3 hover:bg-gray-100 rounded-md">
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        {type === "player" ? (
          <UserIcon className="h-5 w-5 text-blue-500" />
        ) : (
          <TeamsIcon className="h-5 w-5 text-green-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        <p className="text-sm text-gray-500 truncate">{description}</p>
      </div>
      <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
    </div>
  </Link>
);

export default function DashboardPage() {
  const router = useRouter();

  const {
    players: topPlayersData,
    loading: topPlayersLoading,
    error: topPlayersError,
    fetchPlayers: fetchTopPlayers,
  } = usePlayers({ initialSortBy: "score", initialSortDir: "DESC" });

  const {
    favorites,
    loading: favoritesLoading,
    error: favoritesError,
    toggleFavorite,
    isFavorite,
  } = useFavorites({});

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [playerResults, setPlayerResults] = useState<Player[]>([]);
  const [teamResults, setTeamResults] = useState<Team[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopPlayers(1, "score", "DESC", "", "all", "all");
  }, [fetchTopPlayers]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setPlayerResults([]);
      setTeamResults([]);
      setSearchLoading(false);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    try {
      // Fetch players and teams in parallel
      const [playerData, teamData] = await Promise.all([
        playerAPI.getPlayers(1, undefined, query, undefined, "score", "DESC"),
        teamAPI.getTeams(query, "teamName", "ASC"),
      ]);

      setPlayerResults(playerData.map(adaptPlayerData).slice(0, 3));
      setTeamResults(teamData.map(adaptTeamData).slice(0, 2));
    } catch (err) {
      console.error("Search Error:", err);
      setSearchError(err instanceof Error ? err.message : "Search failed");
      setPlayerResults([]);
      setTeamResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSearchResults(debouncedSearchQuery);
  }, [debouncedSearchQuery, fetchSearchResults]);

  // Slice data for display sections
  const topPlayers = topPlayersData.slice(0, 3);
  const favoritesPreview = favorites.slice(0, 3);

  // Mock recent news
  const recentNews = [
    {
      id: 1,
      title: "Mahomes likely MVP after stellar season finale",
      date: "2025-04-27",
      player: "Patrick Mahomes",
      playerId: "MahomesP00",
    },
    {
      id: 2,
      title: "Josh Allen questionable for practice",
      date: "2025-04-26",
      player: "Josh Allen",
      playerId: "AllenJ01",
    },
    {
      id: 3,
      title: "Kelce confirms return for next season",
      date: "2025-04-25",
      player: "Travis Kelce",
      playerId: "KelceT00",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back to ProCompare</p>
        </div>

        {/* Search Section*/}
        <div className="mb-8 relative">
          <SearchBar
            placeholder="Search players or teams..."
            value={searchQuery}
            onChange={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
          >
            {/* Children for the dropdown */}
            {isSearchFocused && searchQuery.length >= 2 && (
              <div className="p-2 space-y-2">
                {searchLoading && (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    Searching...
                  </div>
                )}
                {searchError && (
                  <div className="p-3 text-center text-red-500 text-sm">
                    Error: {searchError}
                  </div>
                )}
                {!searchLoading &&
                  !searchError &&
                  playerResults.length === 0 &&
                  teamResults.length === 0 && (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      No results found for "{searchQuery}"
                    </div>
                  )}

                {/* Player Results */}
                {playerResults.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase px-3 mb-1">
                      Players
                    </h4>
                    {playerResults.map((player) => (
                      <SearchResultItem
                        key={`player-${player.id}`}
                        type="player"
                        name={player.name}
                        description={`${player.position} - ${player.team}`}
                        link={`/players/${player.id}`}
                      />
                    ))}
                  </div>
                )}

                {/* Team Results */}
                {teamResults.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase px-3 mt-2 mb-1">
                      Teams
                    </h4>
                    {teamResults.map((team) => (
                      <SearchResultItem
                        key={`team-${team.id}`}
                        type="team"
                        name={team.name}
                        description={`Strength: ${team.strength ?? "N/A"}`}
                        link={`/teams/${team.id}`}
                      />
                    ))}
                  </div>
                )}

                {/* Link to full search/compare page? */}
                {!searchLoading &&
                  (playerResults.length > 0 || teamResults.length > 0) && (
                    <div className="border-t pt-2 mt-2 px-3 text-center">
                      <Link
                        href={`/players?q=${encodeURIComponent(searchQuery)}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View all player results...
                      </Link>
                      <span className="mx-2 text-gray-300">|</span>
                      <Link
                        href={`/teams?q=${encodeURIComponent(searchQuery)}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View all team results...
                      </Link>
                    </div>
                  )}
              </div>
            )}
          </SearchBar>
        </div>

        {/* Content Grid*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column fo Top Players Only */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Players Section*/}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <List size={20} className="mr-2 text-indigo-600" /> Top
                  Players (by ML Score)
                </h2>
                <Link
                  href="/players?sortBy=score&sortDir=DESC"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              {topPlayersLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Loading top players...
                </div>
              ) : topPlayersError ? (
                <div className="text-center py-4 text-red-500">
                  Error loading top players: {topPlayersError}
                </div>
              ) : topPlayers.length > 0 ? (
                <div className="space-y-4">
                  {topPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${
                              player.position === "QB"
                                ? "from-red-100 to-red-200"
                                : player.position === "RB"
                                ? "from-green-100 to-green-200"
                                : player.position === "WR"
                                ? "from-purple-100 to-purple-200"
                                : "from-yellow-100 to-yellow-200"
                            }`}
                          >
                            <span
                              className={`text-sm font-semibold ${
                                player.position === "QB"
                                  ? "text-red-700"
                                  : player.position === "RB"
                                  ? "text-green-700"
                                  : player.position === "WR"
                                  ? "text-purple-700"
                                  : "text-yellow-700"
                              }`}
                            >
                              {player.position}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/players/${player.id}`}
                                className="font-medium text-gray-900 hover:text-blue-600 hover:underline"
                              >
                                {player.name}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <span>{player.team}</span>
                              <span>•</span>
                              <span>{player.position}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              ML Score
                            </div>
                            <div className="font-bold text-blue-600">
                              {player.mlScore}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFavorite(player)}
                            className="text-gray-400 hover:text-yellow-500"
                            aria-label={
                              isFavorite(player.id)
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            {isFavorite(player.id) ? (
                              <Star
                                size={20}
                                className="text-yellow-500 fill-current"
                              />
                            ) : (
                              <StarOff size={20} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No top players found.
                </div>
              )}
            </div>
          </div>

          {/* Favorites Preview, News, Quick Access */}
          <div className="space-y-6">
            {/* Favorites Preview Section*/}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Heart size={20} className="mr-2 text-red-600" /> My Favorites
                </h2>
                <Link
                  href="/favorites"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all ({favorites.length})
                </Link>
              </div>
              {favoritesLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Loading favorites...
                </div>
              ) : favoritesError ? (
                <div className="text-center py-4 text-red-500">
                  Error: {favoritesError}
                </div>
              ) : favoritesPreview.length > 0 ? (
                <div className="space-y-3">
                  {favoritesPreview.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                          {player.position}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/players/${player.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600 hover:underline truncate block"
                          >
                            {player.name}
                          </Link>
                          <p className="text-sm text-gray-500 truncate">
                            {player.team} • {player.position}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/players/${player.id}`}
                        className="text-blue-600 hover:text-blue-700 flex-shrink-0 ml-2"
                      >
                        <ChevronRight size={20} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No favorites added yet.
                </div>
              )}
            </div>
            {/* Recent News Section]*/}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Newspaper size={20} className="mr-2 text-green-600" /> Recent
                News (Mock)
              </h2>
              <div className="space-y-4">
                {recentNews.slice(0, 3).map((news) => (
                  <div
                    key={news.id}
                    className="pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <h3 className="font-medium text-gray-900 text-sm leading-snug mb-1">
                      {news.title}
                    </h3>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{news.date}</span>
                      <Link
                        href={`/players/${news.playerId}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {news.player}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Quick Access Section*/}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Quick Access
              </h2>
              <div className="space-y-3">
                <Link
                  href="/players"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-700">
                    Browse Players
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>
                <Link
                  href="/teams"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-700">
                    Browse Teams
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>
                <Link
                  href="/compare"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-700">
                    Player Comparisons
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-700">
                    My Favorites
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
