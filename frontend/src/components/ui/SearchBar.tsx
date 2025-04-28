"use client";

import { ReactNode, useState, useRef, FocusEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void; // Keep prop if needed externally, but internal logic changes
  children?: ReactNode;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onSubmit,
  onFocus,
  onBlur, // Keep prop, but may not be needed for dropdown control now
  children,
  className = "",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the main container

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  // Modified handleBlur to check relatedTarget
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    // Check if the new focused element is still inside the SearchBar container
    if (
      containerRef.current &&
      !containerRef.current.contains(event.relatedTarget as Node | null)
    ) {
      setIsFocused(false);
      if (onBlur) onBlur(); // Call external onBlur if provided
    }
    // Otherwise, focus remains effectively "inside", so don't close dropdown
  };

  return (
    // Added container div with ref and onBlur handler
    <div
      ref={containerRef}
      className={`w-full relative ${className}`}
      onBlur={handleBlur} // Attach blur handler here
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit(e);
        }}
      >
        <div
          // Removed transition classes from input wrapper, focus state now handled by parent
          className="relative shadow"
        >
          <input
            type="text"
            placeholder={placeholder}
            className="w-full p-4 pr-12 rounded-xl border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500" // Adjusted focus style
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus} // Keep onFocus on input
            // Removed onBlur from input
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="submit"
              className="p-2 text-gray-400 hover:text-gray-600"
              // Prevent button click from blurring the container prematurely if needed
              onMouseDown={(e) => e.preventDefault()}
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </form>

      {/* Dropdown area */}
      {isFocused && children && (
        // Use absolute positioning relative to the containerRef div
        <div className="absolute w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {/* Content (filters, results) goes here */}
          {children}
        </div>
      )}
    </div>
  );
}
