import React from "react";
import Link from "next/link"; // Import Link
import { Star, StarOff } from "lucide-react";
import { Player } from "@/types";

interface PlayerHeaderProps {
  player: Player;
  isLeft: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  player,
  isLeft,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className={`p-6 ${isLeft ? "text-right" : ""}`}>
      <div
        className={`flex items-center ${isLeft ? "justify-end" : ""} space-x-3`}
      >
        {isLeft ? (
          <>
            {/* left player */}
            <div className="text-right">
              {/* Wrap name in Link */}
              <Link href={`/player/${player.id}`} className="hover:underline">
                <h2 className="text-xl font-bold text-gray-900 inline-block">
                  {player.name}
                </h2>
              </Link>
              <div className="flex items-center justify-end space-x-2 mt-1">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {player.team}
                </span>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {player.position}
                </span>
              </div>
            </div>
            {/* left favorite3 */}
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full transition-colors duration-150 ${
                isFavorite
                  ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
              aria-label={
                isFavorite
                  ? `Remove ${player.name} from favorites`
                  : `Add ${player.name} to favorites`
              }
            >
              {isFavorite ? (
                <Star size={20} className="fill-current" />
              ) : (
                <StarOff size={20} />
              )}
            </button>
          </>
        ) : (
          <>
            {/* right favorite*/}
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full transition-colors duration-150 ${
                isFavorite
                  ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
              aria-label={
                isFavorite
                  ? `Remove ${player.name} from favorites`
                  : `Add ${player.name} to favorites`
              }
            >
              {isFavorite ? (
                <Star size={20} className="fill-current" />
              ) : (
                <StarOff size={20} />
              )}
            </button>
            {/* right player */}
            <div>
              {/* Wrap name in Link */}
              <Link href={`/player/${player.id}`} className="hover:underline">
                <h2 className="text-xl font-bold text-gray-900 inline-block">
                  {player.name}
                </h2>
              </Link>
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {player.team}
                </span>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {player.position}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerHeader;
