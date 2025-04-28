"use client";

import { Star, StarOff, TrendingUp, TrendingDown, X } from "lucide-react";
import Link from "next/link";
import type { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
  favorites: string[];
  onToggleFavorite: (player: Player) => void;
  showStats?: boolean;
  showNews?: boolean;
  className?: string;
  onRemove?: () => void;
}

export default function PlayerCard({
  player,
  favorites,
  onToggleFavorite,
  showStats = true,
  showNews = false,
  className = "",
  onRemove,
}: PlayerCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden relative ${className}`}
    >
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 z-10"
          aria-label="Remove player"
        >
          <X size={16} />
        </button>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          {/* Player Info */}
          <div className="pr-8">
            {" "}
            <Link href={`/players/${player.id}`} className="hover:underline">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 inline-block">
                {player.name}
              </h3>
            </Link>
            <div className="flex items-center space-x-2 mt-1 flex-wrap">
              <Link
                href={`/teams/${player.team || ""}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:underline"
              >
                {" "}
                <span className="badge badge-blue">{player.team}</span>
              </Link>
              <span className="badge badge-gray">{player.position}</span>
              {player.playerAge && (
                <span className="text-sm text-gray-500 ml-2">
                  Age: {player.playerAge}
                </span>
              )}
            </div>
            {(player.numSeasons !== undefined ||
              player.numGames !== undefined) && (
              <div className="mt-1 text-xs text-gray-500">
                {player.numSeasons !== undefined && (
                  <span>{player.numSeasons} Seasons</span>
                )}
                {player.numSeasons !== undefined &&
                  player.numGames !== undefined && (
                    <span className="mx-1">•</span>
                  )}
                {player.numGames !== undefined && (
                  <span>{player.numGames} Games</span>
                )}
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite(player)}
            className={`p-2 rounded-full transition-colors flex-shrink-0 ${
              favorites.includes(player.id)
                ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
            aria-label={
              favorites.includes(player.id)
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {favorites.includes(player.id) ? (
              <Star size={20} className="fill-current text-yellow-500" />
            ) : (
              <StarOff size={20} />
            )}
          </button>
        </div>

        {/* ML Score */}
        <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-700 mb-1">
              {player.mlScore ?? "N/A"}
            </div>
            <p className="text-blue-600 font-medium">ML Score</p>
          </div>
          <div
            className={`absolute top-4 right-4 ${
              player.trend === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {player.trend === "up" ? (
              <TrendingUp size={20} />
            ) : (
              <TrendingDown size={20} />
            )}
          </div>
        </div>

        {/* Stats */}
        {showStats && Object.keys(player.stats).length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(player.stats)
              .slice(0, 4)
              .map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <div
                    className="text-sm text-gray-600 mb-1 truncate"
                    title={key}
                  >
                    {key}
                  </div>
                  <div className="text-lg font-bold">{value ?? "N/A"}</div>
                </div>
              ))}
          </div>
        )}
        {showStats && Object.keys(player.stats).length === 0 && (
          <div className="text-center text-sm text-gray-500 mb-6">
            No stats available.
          </div>
        )}

        {/* news */}
        {showNews && player.recentNews && player.recentNews.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 mb-2">
              Recent News (Mock)
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 font-medium mb-1">
                {player.recentNews[0].title}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{player.recentNews[0].source}</span>
                <span>{player.recentNews[0].date}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
