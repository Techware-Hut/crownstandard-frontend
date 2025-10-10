"use client";

import { useEffect, useState } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

export default function GpsTrackingSection() {
  const [isTracking, setIsTracking] = useState(false);
  const [coords, setCoords] = useState<Coordinates | null>(null);

  // Simulate location updates
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking) {
      // Start mock location updates
      let lat = 40.7128;
      let lng = -74.006; // New York base coords

      interval = setInterval(() => {
        lat += (Math.random() - 0.5) * 0.001;
        lng += (Math.random() - 0.5) * 0.001;
        setCoords({ lat, lng });
      }, 2000);
    } else {
      setCoords(null);
    }

    return () => clearInterval(interval);
  }, [isTracking]);

  const toggleTracking = () => setIsTracking(!isTracking);

  return (
    <div className="mt-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">GPS Tracking</h2>
      </div>

      {/* GPS Tracking Card */}
      <div className="p-10 bg-[#F6F4EF] rounded-xl flex flex-col items-center justify-center text-center">
        <p className="text-base text-gray-600">
          Current Status:{" "}
          <span
            className={`font-semibold ${
              isTracking ? "text-green-600" : "text-gray-700"
            }`}
          >
            {isTracking ? "Online" : "Offline"}
          </span>
        </p>

        <button
          onClick={toggleTracking}
          className={`mt-6 px-8 py-3 text-sm font-medium rounded-full transition-colors ${
            isTracking
              ? "bg-[#111827] text-white hover:bg-[#1f2937]"
              : "bg-[#B28B32] text-white hover:bg-[#9A7629]"
          }`}
        >
          {isTracking ? "Stop GPS Tracking" : "Start GPS Tracking"}
        </button>

        {isTracking ? (
          <>
            <p className="mt-3 text-xs text-gray-500">
              Tracking is active. Your location is being updated in real time.
            </p>

            {/* Mock Map */}
            <div className="relative w-full h-64 max-w-xl mt-6 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="mb-1 font-medium text-gray-800">
                  Live Location Tracking Enabled
                </p>
                {coords ? (
                  <p className="text-sm text-gray-600">
                    Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">Locating...</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="mt-3 text-xs text-gray-500">
            Click the button above to start GPS tracking.
          </p>
        )}
      </div>
    </div>
  );
}
