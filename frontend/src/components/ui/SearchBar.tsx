"use client";

import { ReactNode, useState, useRef, FocusEvent } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.relatedTarget as Node | null)
    ) {
      setIsFocused(false);
      if (onBlur) onBlur();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full relative ${className}`}
      onBlur={handleBlur}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit(e);
        }}
      >
        <div className="relative shadow">
          <input
            type="text"
            placeholder={placeholder}
            className="w-full p-4 pr-12 rounded-xl border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500" // Adjusted focus style
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="submit"
              className="p-2 text-gray-400 hover:text-gray-600"
              onMouseDown={(e) => e.preventDefault()}
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </form>

      {/* Dropdown area */}
      {isFocused && children && (
        <div className="absolute w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {children}
        </div>
      )}
    </div>
  );
}
