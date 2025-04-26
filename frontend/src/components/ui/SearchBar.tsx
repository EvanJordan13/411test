"use client";

import { ReactNode, useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  children?: ReactNode;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  children,
  className = "",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    // timeout to allow clicks on dropdown items to register before closing
    setTimeout(() => {
      setIsFocused(false);
      if (onBlur) onBlur();
    }, 200);
  };

  return (
    <div className={`w-full ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit(e);
        }}
      >
        <div
          className={`relative transition-all duration-200 ${
            isFocused ? "shadow-lg transform -translate-y-1" : "shadow"
          }`}
        >
          <input
            type="text"
            placeholder={placeholder}
            className="w-full p-4 pr-12 rounded-xl border-0 focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="submit"
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </form>

      {isFocused && children && (
        <div className="absolute w-full mt-2 bg-white rounded-xl shadow-xl p-4 z-50">
          {children}
        </div>
      )}
    </div>
  );
}
