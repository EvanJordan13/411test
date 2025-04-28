import Link from "next/link";
import { Star } from "lucide-react";
import type { Player } from "@/types";

interface TopPlayerCardProps {
  player: Player;
  positionLabel: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function TopPlayerCard({
  player,
  positionLabel,
  isFavorite,
  onToggleFavorite,
}: TopPlayerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full flex flex-col">
      {/* Position Header */}
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 text-center uppercase tracking-wide">
          {positionLabel}
        </h4>
      </div>

      <div className="p-4 flex flex-col items-center text-center flex-grow justify-between">
        {/* Player Info */}
        <div>
          <Link href={`/player/${player.id}`} className="hover:underline">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {player.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mb-3">{player.team}</p>
        </div>

        {/* Score and Favorite */}
        <div className="w-full">
          <div className="mb-3">
            <span className="text-xs text-blue-600 font-medium">ML Score</span>
            <p className="text-3xl font-bold text-blue-700">
              {player.mlScore ?? "N/A"}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`w-full flex items-center justify-center p-2 rounded-md transition-colors duration-150 text-sm font-medium ${
              isFavorite
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
            aria-label={
              isFavorite
                ? `Remove ${player.name} from favorites`
                : `Add ${player.name} to favorites`
            }
          >
            {isFavorite ? (
              <Star size={16} className="fill-current mr-1" />
            ) : (
              <Star size={16} className="mr-1" />
            )}
            {isFavorite ? "Favorited" : "Favorite"}
          </button>
        </div>
      </div>
    </div>
  );
}
