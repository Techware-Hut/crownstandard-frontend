"use client";

import { useEffect, useRef, useState } from "react";
import { providerApi } from "@/lib/providerApi";

interface Coordinates {
  lat: number;
  lng: number;
}

const PROVIDER_LOCATION_STORAGE_KEY = "provider_location";

export default function GpsTrackingSection() {
  const [isTracking, setIsTracking] = useState(false);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const hasSavedForCurrentSessionRef = useRef(false);

  const saveCoordinatesToProfile = async (nextCoords: Coordinates) => {
    setSaving(true);
    try {
      const currentProfile = await providerApi.getProfileDetails();

      await providerApi.updateProfileDetails({
        ...currentProfile,
        address: {
          ...(currentProfile?.address ?? {}),
          location: {
            type: "Point",
            coordinates: [nextCoords.lng, nextCoords.lat],
          },
        },
      });
    } catch (saveError) {
      console.error("Failed to save provider location", saveError);
      setError("Unable to save GPS location right now.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(PROVIDER_LOCATION_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as Coordinates;
      if (typeof parsed.lat === "number" && typeof parsed.lng === "number") {
        setCoords(parsed);
      }
    } catch (parseError) {
      console.error("Failed to parse stored provider location", parseError);
    }
  }, []);

  useEffect(() => {
    if (!isTracking) {
      hasSavedForCurrentSessionRef.current = false;
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported on this device.");
      setIsTracking(false);
      return;
    }

    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCoords(nextCoords);
        localStorage.setItem(PROVIDER_LOCATION_STORAGE_KEY, JSON.stringify(nextCoords));

        if (!hasSavedForCurrentSessionRef.current) {
          hasSavedForCurrentSessionRef.current = true;
          void saveCoordinatesToProfile(nextCoords);
        }
      },
      () => {
        setError("Location permission is required to enable tracking.");
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isTracking]);

  const toggleTracking = () => {
    setError(null);
    setIsTracking((prev) => !prev);
  };

  return (
    <div className="mt-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">GPS Tracking</h2>
      </div>

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

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
        {saving && <p className="mt-3 text-xs text-gray-500">Saving GPS coordinates...</p>}

        {isTracking ? (
          <>
            <p className="mt-3 text-xs text-gray-500">
              Tracking is active. Your location is being updated in real time.
            </p>

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
