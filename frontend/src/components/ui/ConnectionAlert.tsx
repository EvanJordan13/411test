"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const ConnectionAlert = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    // Check if we using mock data
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/proxy/connection-status");
        const data = await response.json();

        if (data.usingMockData) {
          setUsingMockData(true);
          setIsVisible(true);
        } else {
          setUsingMockData(false);
          setIsVisible(false);
        }
      } catch (error) {
        setUsingMockData(true);
        setIsVisible(true);
      }
    };

    checkConnection();

    // periodically check connection
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start">
        <AlertTriangle className="text-yellow-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-medium text-yellow-800">
            Backend Connection Warning
          </div>
          <div className="text-sm text-yellow-700 mt-1">
            {usingMockData
              ? "Unable to connect to the backend server. Using mock data for demonstration purposes."
              : "Intermittent connection issues with the backend. Some features may be limited."}
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-400 hover:text-yellow-500"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ConnectionAlert;
