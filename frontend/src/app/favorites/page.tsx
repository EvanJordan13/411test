"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, BarChart2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import PlayerNoteCard from "@/components/ui/PlayerNoteCard";
import Button from "@/components/ui/Button";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useAuth } from "@/lib/context/AuthContext";
import { Position } from "@/types";

const summaryStatOptions: Record<
  string,
  { label: string; backendValue: string }[]
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

  // Local state only for controlling the dropdown selections
  const [selectedPosition, setSelectedPosition] = useState<Position | "ALL">(
    "QB"
  );
  const [selectedStat, setSelectedStat] = useState<string>(
    summaryStatOptions["QB"]?.[0]?.backendValue || ""
  );

  useEffect(() => {
    if (auth.isAuthenticated && selectedPosition !== "ALL" && selectedStat) {
      fetchFavoriteSummary(selectedPosition, selectedStat);
    }
  }, [
    auth.isAuthenticated,
    selectedPosition,
    selectedStat,
    fetchFavoriteSummary,
  ]);

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPos = e.target.value as Position | "ALL";
    setSelectedPosition(newPos);
    // Immediately set the first valid stat for the new position
    //his prevents triggering the useEffect fetch with an invalid combo
    if (newPos !== "ALL" && summaryStatOptions[newPos]) {
      setSelectedStat(summaryStatOptions[newPos][0]?.backendValue || "");
    } else {
      setSelectedStat("");
    }
  };

  const handleStatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStat(e.target.value);
  };

  const handleSaveNote = (playerId: string, note: string) => {
    updateNote(playerId, note);
  };

  const handleRemoveFromFavorites = (playerId: string) => {
    removeFavorite(playerId);
  };

  const currentStatOptions =
    selectedPosition !== "ALL" ? summaryStatOptions[selectedPosition] : [];

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
                  value={selectedPosition}
                  onChange={handlePositionChange}
                  className="p-2 rounded-lg border text-sm"
                >
                  <option value="QB">QB</option>
                  <option value="RB">RB</option>
                  <option value="WR">WR</option>
                  <option value="TE">TE</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="summary-stat"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Stat
                </label>
                <select
                  id="summary-stat"
                  value={selectedStat}
                  onChange={handleStatChange}
                  className="p-2 rounded-lg border text-sm"
                  disabled={
                    selectedPosition === "ALL" ||
                    !currentStatOptions ||
                    currentStatOptions.length === 0
                  }
                >
                  {currentStatOptions?.map((opt) => (
                    <option key={opt.backendValue} value={opt.backendValue}>
                      {opt.label}
                    </option>
                  ))}
                  {(!currentStatOptions || currentStatOptions.length === 0) && (
                    <option value="">N/A</option>
                  )}
                </select>
              </div>
            </div>

            {/* Summary Display*/}
            <div className="mt-4 min-h-[80px]">
              {" "}
              {summaryLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Loading summary...
                </div>
              ) : summaryError ||
                !favoriteSummary ||
                favoriteSummary.length === 0 ? (
                // Display N/A grid if error or no data returned from backend
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 opacity-60">
                  {["High", "Mid", "Low"].map((tier) => (
                    <div
                      key={tier}
                      className="bg-gray-100 p-4 rounded-lg text-center border border-dashed border-gray-300"
                    >
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                        {tier} Tier
                      </div>
                      <div className="text-3xl font-bold text-gray-400">
                        N/A
                      </div>
                      <div className="text-sm text-gray-500">Players</div>
                    </div>
                  ))}
                </div>
              ) : (
                // Display actual summary data only if loading is false, no error, and data exists
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {favoriteSummary.map((item, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 p-4 rounded-lg text-center"
                    >
                      <div className="text-xs font-medium text-blue-700 uppercase mb-1">
                        {item.tier} Tier
                      </div>
                      <div className="text-3xl font-bold text-blue-900">
                        {item.count}
                      </div>
                      <div className="text-sm text-blue-700">Players</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Favorite Players List */}
        {favorites.length === 0 && !favoritesLoading ? (
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
