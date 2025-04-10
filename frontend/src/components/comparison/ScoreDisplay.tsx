import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Player } from "@/types";

interface ScoreDisplayProps {
  player: Player;
  isLeft: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ player, isLeft }) => {
  return (
    <div className="p-6">
      <div className={`inline-block ${isLeft ? "text-right w-full" : ""}`}>
        {/* ML Score */}
        <div className="text-5xl font-bold text-blue-700 mb-1">
          {player.mlScore}
        </div>
        {/* trund*/}
        <div
          className={`flex items-center ${
            isLeft ? "justify-end" : ""
          } space-x-2`}
        >
          <span className="text-sm text-blue-600 font-medium">ML Score</span>
          {player.trend === "up" ? (
            <TrendingUp size={16} className="text-green-500" />
          ) : (
            <TrendingDown size={16} className="text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
