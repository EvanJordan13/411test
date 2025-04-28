"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link
import { Star, Pencil, Trash, X, Save, AlertCircle } from "lucide-react";
import type { Player } from "@/types";

interface PlayerNoteCardProps {
  player: Player;
  onSaveNote: (playerId: string, note: string) => void;
  onRemoveFromFavorites: (playerId: string) => void;
}

export default function PlayerNoteCard({
  player,
  onSaveNote,
  onRemoveFromFavorites,
}: PlayerNoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(player.note || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    onSaveNote(player.id, noteText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNoteText(player.note || "");
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      {/* header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              {/* Wrap name in Link */}
              <Link href={`/player/${player.id}`} className="hover:underline">
                <h3 className="text-lg font-bold text-gray-900 inline-block">
                  {player.name}
                </h3>
              </Link>
              <Star className="text-yellow-500 flex-shrink-0" size={18} />
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="badge badge-blue">{player.team}</span>
              <span className="badge badge-gray">{player.position}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0 pl-2">
            <div className="text-2xl font-bold text-blue-600">
              {player.mlScore}
            </div>
            <div className="text-sm text-blue-600">ML Score</div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700">
            Personal Notes
          </div>
          {/* Hide last updated if no note and not editing */}
          {(isEditing || player.note) && player.lastUpdated && (
            <div className="text-xs text-gray-500">
              Updated: {player.lastUpdated}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3 flex-grow flex flex-col">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add your notes about this player..."
              className="w-full p-2 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-grow"
              rows={3}
            />
            <div className="flex justify-end space-x-2 flex-shrink-0">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
              >
                <X size={16} className="mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center"
              >
                <Save size={16} className="mr-1" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col justify-between">
            <div className="text-gray-600 text-sm mb-3 overflow-y-auto max-h-24 flex-grow">
              {" "}
              {/* Added scroll */}
              {player.note ? (
                <p className="whitespace-pre-wrap break-words">{player.note}</p>
              ) : (
                <p className="text-gray-400 italic">No notes added yet.</p>
              )}
            </div>
            <div className="flex justify-end space-x-2 pt-2 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
              >
                <Pencil size={16} className="mr-1" />
                Edit Note
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 flex items-center"
              >
                <Trash size={16} className="mr-1" />
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* confirm delete*/}
      {showDeleteConfirm && (
        <div className="p-4 bg-red-50 border-t border-red-100 flex-shrink-0">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium mb-3">
                Remove {player.name} from favorites?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onRemoveFromFavorites(player.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
