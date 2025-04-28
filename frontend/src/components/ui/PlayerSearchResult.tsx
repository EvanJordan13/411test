import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Player } from "@/types";

interface PlayerSearchResultProps {
  player: Player;
  onSelect: (player: Player) => void;
}

export default function PlayerSearchResult({
  player,
  onSelect,
}: PlayerSearchResultProps) {
  return (
    <div
      className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
      onClick={() => onSelect(player)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-blue-700">
              {player.position}
            </span>
          </div>
          <Link
            href={`/players/${player.id}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:underline"
          >
            <div className="font-medium text-gray-900">{player.name}</div>
            <div className="text-sm text-gray-500">{player.team}</div>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">ML Score</div>
            <div className="font-bold text-blue-600">{player.mlScore}</div>
          </div>
          <ArrowRight size={18} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
