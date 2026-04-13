"use client";

import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { providerApi } from "@/lib/providerApi";

export interface ServiceFormData {
  title: string;
  description: string;
  categoryId: string;
  basePrice: number;
  priceUnit: string;
  minHours: number;
  includes: string[];
  exclusions: string[];
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
    categoryId: "6936b01212ab9c48fae78a01", // Default cleaning category
    basePrice: 75,
    priceUnit: "per_hour",
    minHours: 2,
    includes: [""],
    exclusions: [""],
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "basePrice" || name === "minHours" ? Number(value) : value });
  };

  const handleArrayChange = (field: 'includes' | 'exclusions', index: number, value: string) => {
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const addArrayItem = (field: 'includes' | 'exclusions') => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeArrayItem = (field: 'includes' | 'exclusions', index: number) => {
    const newArray = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: newArray });
  };

  const handleSubmit = async () => {
    try {

     const data = await providerApi.getProfileDetails();


     if(data.status !== "approved"){
      alert("Your provider profile is not approved yet. Please wait for approval before creating services.");
      return;
     }
    
      setLoading(true);
      
      const serviceData = {
        ...form,
        includes: form.includes.filter(item => item.trim() !== ""),
        exclusions: form.exclusions.filter(item => item.trim() !== ""),
      };

      await providerApi.createService(serviceData);
      onSubmit?.(serviceData);
      onClose();
      
      // Reset form
      setForm({
        title: "",
        description: "",
        categoryId: "6936b01212ab9c48fae78a01",
        basePrice: 75,
        priceUnit: "per_hour",
        minHours: 2,
        includes: [""],
        exclusions: [""],
      });
    } catch (error) {
      console.error("Failed to create service:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-black/50 backdrop-blur-sm" style={{ paddingTop: "5rem" }}>
      <div className="relative w-[90%] max-w-lg bg-white rounded-2xl shadow-xl flex flex-col mt-auto mb-auto">
        <div className="z-10 flex items-center justify-between p-4 sm:p-6 pb-3 bg-white border-b rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900 text-start">Create New Service</h2>
            <p className="text-sm text-gray-500">Fill in the details for your new service.</p>
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
              placeholder="e.g., Professional House Cleaning"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
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

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">What's Included</label>
            {form.includes.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g., Vacuum, Mop, Dust"
                  value={item}
                  onChange={(e) => handleArrayChange('includes', index, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('includes', index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('includes')}
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
                  onChange={(e) => handleArrayChange('exclusions', index, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('exclusions', index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('exclusions')}
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
            {loading ? "Creating..." : "Create Service"}
          </button>
        </div>
      </div>
    </div>
  );
}
