"use client";

import { useState, useEffect } from "react";
import { Star, BarChart2, Filter } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import PlayerNoteCard from "@/components/ui/PlayerNoteCard";
import Button from "@/components/ui/Button";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useAuth } from "@/lib/context/AuthContext";
import { Position } from "@/types"; // Assuming Position type is defined

// Mock possible stats for summary dropdown (Replace with actual relevant stats later)
const summaryStatOptions: Record<
  string,
  { label: string; backendValue: string }
> = {
  QB: [
    { label: "Passing Yards", backendValue: "passYds" },
    { label: "Passing TDs", backendValue: "passTDs" },
    { label: "Interceptions", backendValue: "ints" },
    { label: "Completion %", backendValue: "compPct" },
  ],
  RB: [
    { label: "Rushing Yards", backendValue: "rshYds" },
    { label: "Rushing TDs", backendValue: "rshTDs" },
    { label: "Rush Attempts", backendValue: "rshAtt" },
  ],
  WR: [
    { label: "Receiving Yards", backendValue: "recYds" },
    { label: "Receiving TDs", backendValue: "recTDs" },
    { label: "Receptions", backendValue: "rec" },
  ],
  TE: [
    { label: "Receiving Yards", backendValue: "recYds" },
    { label: "Receiving TDs", backendValue: "recTDs" },
    { label: "Receptions", backendValue: "rec" },
  ],
};

export default function FavoritesPage() {
  const auth = useAuth();
  const {
    favorites,
    loading: favoritesLoading,
    error: favoritesError,
    updateNote,
    removeFavorite,
    favoriteSummary,
    summaryLoading,
    summaryError,
    fetchFavoriteSummary,
  } = useFavorites({});

  const [summaryPosition, setSummaryPosition] = useState<Position | "ALL">(
    "QB"
  ); // Default to QB
  const [summaryStat, setSummaryStat] = useState<string>(
    summaryStatOptions["QB"]?.[0]?.backendValue || "passYds"
  ); // Default to first QB stat

  // Fetch summary when position or stat changes
  useEffect(() => {
    if (auth.isAuthenticated && summaryPosition !== "ALL") {
      fetchFavoriteSummary(summaryPosition, summaryStat);
    }
  }, [
    auth.isAuthenticated,
    summaryPosition,
    summaryStat,
    fetchFavoriteSummary,
  ]);

  // Adjust available stats when position changes
  useEffect(() => {
    if (summaryPosition !== "ALL" && summaryStatOptions[summaryPosition]) {
      const availableStats = summaryStatOptions[summaryPosition];
      // If current stat not valid for new position, default to first stat for that position
      if (!availableStats.some((opt) => opt.backendValue === summaryStat)) {
        setSummaryStat(availableStats[0]?.backendValue || "");
      }
    } else {
      // Handle 'ALL' or invalid position if needed, maybe clear stat?
      // setSummaryStat('');
    }
  }, [summaryPosition, summaryStat]);

  const handleSaveNote = (playerId: string, note: string) => {
    updateNote(playerId, note);
  };

  const handleRemoveFromFavorites = (playerId: string) => {
    removeFavorite(playerId);
  };

  const handleSummaryPositionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSummaryPosition(e.target.value as Position | "ALL");
    // Stat selection will auto-adjust via useEffect
  };

  const handleSummaryStatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSummaryStat(e.target.value);
  };

  if (favoritesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
          <div className="text-center">
            <div className="text-gray-500">Loading favorites...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Favorite Players</h1>
          <p className="mt-2 text-gray-600">
            Manage your favorite players and personal notes.
          </p>
          {favoritesError && (
            <p className="text-red-500 mt-2">
              Error loading favorites: {favoritesError}
            </p>
          )}
        </div>

        {/* Favorites Summary Section */}
        {favorites.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart2 size={20} className="mr-2 text-blue-600" />
              Favorites Summary
            </h2>

            {/* Filters for Summary */}
            <div className="flex flex-wrap items-end gap-4 mb-4">
              <div>
                <label
                  htmlFor="summary-pos"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Position
                </label>
                <select
                  id="summary-pos"
                  value={summaryPosition}
                  onChange={handleSummaryPositionChange}
                  className="p-2 rounded-lg border text-sm"
                >
                  {/* <option value="ALL">All</option> */}
                  <option value="QB">QB</option>
                  <option value="RB">RB</option>
                  <option value="WR">WR</option>
                  <option value="TE">TE</option>
                </select>
              </div>
              {summaryPosition !== "ALL" &&
                summaryStatOptions[summaryPosition] && (
                  <div>
                    <label
                      htmlFor="summary-stat"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Stat
                    </label>
                    <select
                      id="summary-stat"
                      value={summaryStat}
                      onChange={handleSummaryStatChange}
                      className="p-2 rounded-lg border text-sm"
                    >
                      {summaryStatOptions[summaryPosition].map((opt) => (
                        <option key={opt.backendValue} value={opt.backendValue}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
            </div>

            {/* Summary Display */}
            {summaryLoading ? (
              <div className="text-center py-4 text-gray-500">
                Loading summary...
              </div>
            ) : summaryError ? (
              <div className="text-center py-4 text-red-500">
                Error loading summary: {summaryError}
              </div>
            ) : favoriteSummary.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {favoriteSummary.map((item, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 p-4 rounded-lg text-center"
                  >
                    <div className="text-xs font-medium text-blue-700 uppercase mb-1">
                      {item.tier}
                    </div>
                    <div className="text-3xl font-bold text-blue-900">
                      {item.count}
                    </div>
                    <div className="text-sm text-blue-700">Players</div>
                  </div>
                ))}
              </div>
            ) : !summaryLoading ? ( // Avoid showing "No summary" while loading
              <div className="text-center py-4 text-gray-500">
                No summary data available for this selection.
              </div>
            ) : null}
          </div>
        )}

        {/* Favorite Players List */}
        {favorites.length === 0 && !favoritesLoading ? ( // Ensure not loading before showing "No favorites"
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Star className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start adding players to your favorites list to keep track of them
              and add personal notes.
            </p>
            <Link href="/compare">
              <Button variant="primary">Browse Players</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((player) => (
              <PlayerNoteCard
                key={player.id}
                player={player}
                onSaveNote={handleSaveNote}
                onRemoveFromFavorites={handleRemoveFromFavorites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
