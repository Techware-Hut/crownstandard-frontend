"use client";

import { useEffect, useState } from "react";
import { X, Plus, Minus, Pencil } from "lucide-react";
import { providerApi, ProviderService, UpdateServiceData } from "@/lib/providerApi";

interface EditServiceModalProps {
  open: boolean;
  service: ProviderService | null;
  onClose: () => void;
  onSubmit?: () => void;
}

type ServiceFormState = {
  title: string;
  description: string;
  basePrice: number;
  priceUnit: string;
  minHours: number;
  includes: string[];
  exclusions: string[];
  isActive: boolean;
};

const getInitialForm = (service: ProviderService | null): ServiceFormState => ({
  title: service?.title ?? "",
  description: service?.description ?? "",
  basePrice: service?.basePrice ?? 0,
  priceUnit: service?.priceUnit ?? "per_hour",
  minHours: service?.minHours ?? 1,
  includes: service?.includes?.length ? service.includes : [""],
  exclusions: service?.exclusions?.length ? service.exclusions : [""],
  isActive: service?.isActive ?? true,
});

export default function EditServiceModal({ open, service, onClose, onSubmit }: EditServiceModalProps) {
  const [form, setForm] = useState<ServiceFormState>(() => getInitialForm(service));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(getInitialForm(service));
  }, [service, open]);

  if (!open || !service) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
      return;
    }

    setForm({
      ...form,
      [name]: name === "basePrice" || name === "minHours" ? Number(value) : value,
    });
  };

  const handleArrayChange = (field: "includes" | "exclusions", index: number, value: string) => {
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const addArrayItem = (field: "includes" | "exclusions") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeArrayItem = (field: "includes" | "exclusions", index: number) => {
    const newArray = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: newArray.length ? newArray : [""] });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload: UpdateServiceData = {
        title: form.title,
        description: form.description,
        basePrice: form.basePrice,
        priceUnit: form.priceUnit,
        minHours: form.minHours,
        includes: form.includes.filter((item) => item.trim() !== ""),
        exclusions: form.exclusions.filter((item) => item.trim() !== ""),
        isActive: form.isActive,
      };

      await providerApi.updateService(service._id, payload);
      onSubmit?.();
      onClose();
    } catch (error) {
      console.error("Failed to update service:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-black/50 backdrop-blur-sm" style={{ paddingTop: "5rem" }}>
      <div className="relative w-[92%] max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col mt-auto mb-auto">
        <div className="z-10 flex items-center justify-between p-4 sm:p-6 pb-3 bg-white border-b rounded-t-2xl">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Pencil className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 text-start">Edit Service</h2>
              <p className="text-sm text-gray-500">Update details for {service.title}.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-5 overflow-y-auto text-left">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Service Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="basePrice"
                min={25}
                value={form.basePrice}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Price Unit</label>
              <select
                name="priceUnit"
                value={form.priceUnit}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="per_hour">Per Hour</option>
                <option value="per_service">Per Service</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Minimum Hours</label>
              <input
                type="number"
                name="minHours"
                min={1}
                value={form.minHours}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Service status</p>
              <p className="text-xs text-gray-500">Toggle to pause or resume bookings for this service.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="sr-only"
              />
              <span className={`w-11 h-6 rounded-full transition ${form.isActive ? "bg-amber-500" : "bg-gray-300"}`} />
              <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition ${form.isActive ? "translate-x-5" : "translate-x-0"}`} />
            </label>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">What's Included</label>
            {form.includes.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g., Vacuum, Mop, Dust"
                  value={item}
                  onChange={(e) => handleArrayChange("includes", index, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("includes", index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("includes")}
              className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Exclusions</label>
            {form.exclusions.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g., Windows, Carpet cleaning"
                  value={item}
                  onChange={(e) => handleArrayChange("exclusions", index, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("exclusions", index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("exclusions")}
              className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 bg-white border-t rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium border rounded-full hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white rounded-full bg-[#b9903c] hover:bg-[#111827] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
