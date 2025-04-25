"use client";

import { Star, StarOff, TrendingUp, TrendingDown } from "lucide-react";
import type { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
  favorites: string[];
  onToggleFavorite: (player: Player) => void;
  showStats?: boolean;
  showNews?: boolean;
  className?: string;
}

export default function PlayerCard({
  player,
  favorites,
  onToggleFavorite,
  showStats = true,
  showNews = false,
  className = "",
}: PlayerCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {player.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="badge badge-blue">{player.team}</span>
              <span className="badge badge-gray">{player.position}</span>
            </div>
          </div>
          <button
            onClick={() => onToggleFavorite(player)}
            className={`p-2 rounded-full transition-colors ${
              favorites.includes(player.id)
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
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
              {player.mlScore}
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
        {showStats && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(player.stats)
              .slice(0, 4)
              .map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">{key}</div>
                  <div className="text-lg font-bold">{value}</div>
                </div>
              ))}
          </div>
        )}

        {/* news */}
        {showNews && player.recentNews && player.recentNews.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 mb-2">Recent News</h4>
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
