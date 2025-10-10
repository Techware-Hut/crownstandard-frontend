"use client";

import { useState } from "react";
import { X } from "lucide-react";

export interface ServiceFormData {
  title: string;
  description: string;
  category: string;
  area: string;
  price: number;
  duration: number;
}

interface CreateServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ServiceFormData) => void;
}

export default function CreateServiceModal({
  open,
  onClose,
  onSubmit,
}: CreateServiceModalProps) {
  const [form, setForm] = useState<ServiceFormData>({
    title: "",
    description: "",
    category: "Regular Cleaning",
    area: "",
    price: 25,
    duration: 2,
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "price" || name === "duration" ? Number(value) : value });
  };

  const handleSubmit = () => {
    onSubmit?.(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-black/50 backdrop-blur-sm"
      style={{ paddingTop: "5rem" }} // ⬅ offset to avoid header overlap (approx 80px)
    >
      {/* Modal Container */}
      <div className="relative w-[90%] max-w-lg bg-white rounded-2xl shadow-xl flex flex-col mt-auto mb-auto">
        {/* Header */}
        <div className="z-10 flex items-center justify-between p-4 sm:p-6 pb-3 bg-white border-b rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900 text-start">Create New Service</h2>
            <p className="text-sm text-gray-500">
              Fill in the details for your new cleaning service.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-5 overflow-y-auto text-left">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Service Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., House Deep Cleaning"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe what's included in your service..."
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option>Regular Cleaning</option>
                <option>Deep Cleaning</option>
                <option>Move-in / Move-out</option>
                <option>Office Cleaning</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Service Area
              </label>
              <input
                type="text"
                name="area"
                placeholder="e.g., Downtown, City Center"
                value={form.area}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Price per Hour (min $25.00)
              </label>
              <input
                type="number"
                name="price"
                min={25}
                value={form.price}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Minimum Duration (hours)
              </label>
              <input
                type="number"
                name="duration"
                min={1}
                value={form.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 bg-white border-t rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium border rounded-full hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium text-white rounded-full bg-[#b9903c] hover:bg-[#111827]"
          >
            Create Service
          </button>
        </div>
      </div>
    </div>
  );
}
