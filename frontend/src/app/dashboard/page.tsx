"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  StarOff,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import type { Player } from "@/types";
// Replace mock data with actual data fetching if possible in the future
// For now, we keep the structure but link the names if IDs are present
import { useFavorites } from "@/lib/hooks/useFavorites"; // Use actual favorites hook

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  // Use the actual favorites hook
  const {
    favorites: favoritePlayers,
    toggleFavorite,
    isFavorite,
  } = useFavorites({});

  // Convert favorite Player objects to Set of IDs for quick lookup
  const favoriteIds = new Set(favoritePlayers.map((p) => p.id));

  // Mock data will need to get real stuff eventually
  // Ensure mock players have string IDs consistent with rest of app
  const trendingPlayers: Player[] = [
    {
      id: "1", // Assuming backend uses string IDs like 'MahomesP00' eventually
      name: "Patrick Mahomes",
      team: "KC",
      position: "QB",
      stats: {
        "Passing Yards": 4839,
        Touchdowns: 41,
        "Completion %": 67.2,
        "QB Rating": 105.3,
      },
      mlScore: 94,
      trend: "up",
    },
    {
      id: "2", // Example ID
      name: "Travis Kelce",
      team: "KC",
      position: "TE",
      stats: {
        Receptions: 93,
        Yards: 984,
        Touchdowns: 5,
        "Yards/Reception": 10.6,
      },
      mlScore: 89,
      trend: "down",
    },
    {
      id: "3", // Example ID
      name: "Josh Allen",
      team: "BUF",
      position: "QB",
      stats: {
        "Passing Yards": 4544,
        Touchdowns: 37,
        "Completion %": 65.8,
        "QB Rating": 101.2,
      },
      mlScore: 92,
      trend: "up",
    },
  ];

  // Mock recent news
  const recentNews = [
    {
      id: 1,
      title:
        "Mahomes leads Chiefs to victory with spectacular 4-TD performance",
      date: "2024-02-16",
      player: "Patrick Mahomes",
      playerId: "1", // Add mock player ID for linking
    },
    {
      id: 2,
      title: "Josh Allen sets franchise record in Bills win over Dolphins",
      date: "2024-02-15",
      player: "Josh Allen",
      playerId: "3", // Add mock player ID for linking
    },
    {
      id: 3,
      title: "Chiefs' Kelce shows signs of decline in recent games",
      date: "2024-02-14",
      player: "Travis Kelce",
      playerId: "2", // Add mock player ID for linking
    },
  ];

  // Use the actual toggleFavorite from the hook
  // const toggleFavorite = (playerId: string) => { ... }; // Remove mock toggle

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/compare?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back to ProCompare</p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch}>
            <div className="relative rounded-lg shadow-sm">
              <input
                type="text"
                placeholder="Search players or start a comparison..." // Updated placeholder
                className="w-full p-4 pr-12 rounded-xl border-0 focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="submit"
                  className="p-2 text-gray-400 hover:text-gray-600"
                  aria-label="Search Players"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* \Trending Players */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Trending Players (Mock Data)
                </h2>
                <Link
                  href="/compare"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                {trendingPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-blue-700">
                            {player.position}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            {/* Wrap name in Link */}
                            <Link
                              href={`/player/${player.id}`}
                              className="font-medium text-gray-900 hover:text-blue-600 hover:underline"
                            >
                              {player.name}
                            </Link>
                            {player.trend === "up" ? (
                              <TrendingUp
                                size={16}
                                className="text-green-500"
                              />
                            ) : (
                              <TrendingDown
                                size={16}
                                className="text-red-500"
                              />
                            )}
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
                          <div className="text-sm text-gray-500">ML Score</div>
                          <div className="font-bold text-blue-600">
                            {player.mlScore}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(player)} // Use actual hook function
                          className="text-gray-400 hover:text-yellow-500"
                          aria-label={
                            isFavorite(player.id)
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          {isFavorite(player.id) ? ( // Use actual hook function
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

              <div className="mt-6">
                <Link
                  href="/compare"
                  className="w-full block text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Compare Players
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent News */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Recent News (Mock Data)
              </h2>
              <div className="space-y-4">
                {recentNews.map((news) => (
                  <div
                    key={news.id}
                    className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">
                      {news.title}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{news.date}</span>
                      {/* Link player name in news */}
                      <Link
                        href={`/player/${news.playerId}`} // Use playerId from mock data
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {news.player}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Quick Access
              </h2>
              <div className="space-y-3">
                <Link
                  href="/favorites"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-700">
                    My Favorites
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>
                {/* Link to Teams Page */}
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
