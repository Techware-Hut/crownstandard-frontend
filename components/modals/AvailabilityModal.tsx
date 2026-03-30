"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export type AvailabilitySlotInput = {
  days: string[];
  start: string;
  end: string;
};

interface AvailabilityModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (slot: AvailabilitySlotInput) => void;
  initialValue?: AvailabilitySlotInput | null;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AvailabilityModal({
  open,
  onClose,
  onSave,
  initialValue,
}: AvailabilityModalProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([DAYS[0]]);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initialValue) {
      setSelectedDays(
        initialValue.days.length > 0 ? initialValue.days : [DAYS[0]]
      );
      setStart(initialValue.start || "09:00");
      setEnd(initialValue.end || "17:00");
    } else {
      setSelectedDays([DAYS[0]]);
      setStart("09:00");
      setEnd("17:00");
    }
    setError("");
  }, [open, initialValue]);

  if (!open) return null;

  const isEditing = Boolean(initialValue);

  const handleSave = () => {
    if (selectedDays.length === 0) {
      setError("Please select at least one day.");
      return;
    }
    if (!start || !end) {
      setError("Please select both start and end time.");
      return;
    }
    if (end <= start) {
      setError("End time must be later than start time.");
      return;
    }
    onSave({ days: selectedDays, start, end });
    onClose();
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-black/50 backdrop-blur-sm"
      style={{ paddingTop: "5rem" }}
    >
      <div className="relative w-[90%] max-w-md bg-white rounded-2xl shadow-xl flex flex-col mt-auto mb-auto">
        <div className="z-10 flex items-center justify-between p-4 sm:p-6 pb-3 bg-white border-b rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900 text-start">
              {isEditing ? "Edit Availability" : "Add Availability"}
            </h2>
            <p className="text-sm text-gray-500">
              Pick a day and time range for bookings.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 text-left">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Days
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DAYS.map((day) => {
                const checked = selectedDays.includes(day);
                return (
                  <label
                    key={day}
                    className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-md cursor-pointer ${
                      checked
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDay(day)}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-gray-700">{day}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 p-6 bg-white border-t rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium border rounded-full hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white rounded-full bg-[#b9903c] hover:bg-[#111827]"
          >
            {isEditing ? "Update Availability" : "Save Availability"}
          </button>
        </div>
      </div>
    </div>
  );
}
