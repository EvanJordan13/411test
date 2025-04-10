"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import PlayerNoteCard from "@/components/ui/PlayerNoteCard";
import Button from "@/components/ui/Button";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useAuth } from "@/lib/context/AuthContext";

export default function FavoritesPage() {
  const auth = useAuth();

  const { favorites, loading, error, updateNote, removeFavorite } =
    useFavorites({});

  const handleSaveNote = (playerId: string, note: string) => {
    updateNote(playerId, note);
  };

  const handleRemoveFromFavorites = (playerId: string) => {
    removeFavorite(playerId);
  };

  if (loading) {
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
            Manage your favorite players and personal notes
          </p>
          {error && <p className="text-red-500 mt-2">Error: {error}</p>}
        </div>

        {favorites.length === 0 ? (
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
