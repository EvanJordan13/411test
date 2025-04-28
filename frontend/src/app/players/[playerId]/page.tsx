"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  StarOff,
  TrendingUp,
  TrendingDown,
  Edit,
  Save,
  X,
  MessageSquare,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { usePlayers } from "@/lib/hooks/usePlayers";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { Player, NewsItem } from "@/types"; // Assuming NewsItem is defined correctly

export default function PlayerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const playerId = params.playerId as string; // Get player ID from URL

  const {
    player,
    loading: playerLoading,
    error: playerError,
    fetchPlayerById,
  } = usePlayers({ playerId }); // Use hook configured for fetching a single player

  const {
    favorites,
    toggleFavorite,
    isFavorite,
    updateNote,
    getNote,
    loading: favoritesLoading, // Use favorites loading state if needed
  } = useFavorites({});

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState("");

  // Fetch player data when ID changes
  useEffect(() => {
    if (playerId) {
      fetchPlayerById(playerId);
    }
  }, [playerId, fetchPlayerById]);

  // Load note when player data or favorites state is available
  useEffect(() => {
    if (player) {
      // Assuming getNote correctly gets the note from its internal state/storage
      setNoteText(getNote(player.id));
    }
  }, [player, getNote]); // Rerun if player data changes

  const handleSaveNote = () => {
    if (player) {
      updateNote(player.id, noteText);
      setIsEditingNote(false);
    }
  };

  const handleCancelEditNote = () => {
    if (player) {
      setNoteText(getNote(player.id)); // Reset to original note
    }
    setIsEditingNote(false);
  };

  if (playerLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-100px)]">
          <div className="text-center">
            <div className="text-gray-500 text-lg">
              Loading player details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (playerError || !player) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-100px)]">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <div className="text-red-600 mb-6 font-medium">
              {playerError || "Could not load player details."}
            </div>
            <Button
              onClick={() => router.back()} // Go back to previous page
              variant="primary"
              icon={<ArrowLeft size={20} />}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Player data is available
  const isFav = isFavorite(player.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="inline-flex items-center"
            icon={<ArrowLeft size={16} className="mr-1" />}
          >
            Back
          </Button>
        </div>

        {/* Player Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 truncate">
                {player.name}
              </h1>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                    {player.team}
                  </span>
                  Team
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                    {player.position}
                  </span>
                  Position
                </div>
                {player.playerAge !== undefined && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    Age: {player.playerAge}
                  </div>
                )}
                {player.numSeasons !== undefined && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    Seasons: {player.numSeasons}
                  </div>
                )}
                {player.numGames !== undefined && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    Games: {player.numGames}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 flex md:mt-0 md:ml-4">
              <button
                onClick={() => toggleFavorite(player)}
                className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                  isFav
                    ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
                aria-label={
                  isFav ? "Remove from favorites" : "Add to favorites"
                }
              >
                {isFav ? (
                  <Star size={20} className="fill-current text-yellow-500" />
                ) : (
                  <StarOff size={20} />
                )}
              </button>
            </div>
          </div>
          {/* Score and Trend */}
          <div className="border-t border-gray-200 bg-gradient-to-r from-blue-50 via-gray-50 to-blue-50 p-6 text-center">
            <span className="text-sm text-blue-600 font-medium">ML Score</span>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <span className="text-6xl font-bold text-blue-700">
                {player.mlScore ?? "N/A"}
              </span>
              <div
                className={
                  player.trend === "up" ? "text-green-500" : "text-red-500"
                }
              >
                {player.trend === "up" ? (
                  <TrendingUp size={24} />
                ) : (
                  <TrendingDown size={24} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Stats Overview
              </h2>
              {Object.keys(player.stats).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(player.stats).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <div
                        className="text-sm text-gray-600 mb-1 truncate"
                        title={key}
                      >
                        {key}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {value ?? "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No stats available for this player.
                </p>
              )}
            </div>

            {/* Recent News (Mock) */}
            {player.recentNews && player.recentNews.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Recent News (Mock Data)
                </h2>
                <div className="space-y-4">
                  {player.recentNews.map((news) => (
                    <div
                      key={news.id}
                      className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <h3 className="font-medium text-gray-800 mb-1">
                        {news.title}
                      </h3>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{news.source}</span>
                        <span>{new Date(news.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <MessageSquare size={20} className="mr-2 text-blue-600" />
                  Personal Note
                </h2>
                {!isEditingNote && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditingNote(true)}
                    icon={<Edit size={14} />}
                  >
                    Edit
                  </Button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-3">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add your notes here..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={5}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEditNote}
                      icon={<X size={14} />}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveNote}
                      icon={<Save size={14} />}
                    >
                      Save Note
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-700 text-sm space-y-2">
                  {noteText ? (
                    <p className="whitespace-pre-wrap">{noteText}</p>
                  ) : (
                    <p className="text-gray-400 italic">
                      No note added yet. Click 'Edit' to add one.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
