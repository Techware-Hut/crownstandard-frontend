"use client";

import { useEffect, useState } from "react";
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

interface MediaItem {
  url: string;
  type: "image";
}

interface CreateServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ServiceFormData) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

export default function CreateServiceModal({
  open,
  onClose,
  onSubmit,
}: CreateServiceModalProps) {
  const [form, setForm] = useState<ServiceFormData>({
    title: "",
    description: "",
    categoryId: "",
    basePrice: 75,
    priceUnit: "per_hour",
    minHours: 2,
    includes: [""],
    exclusions: [""],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = "Service title is required.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!form.categoryId) {
      newErrors.categoryId = "Please select a category.";
    }

    if (files.length === 0) {
      newErrors.files = "Please upload at least one image.";
    }

    if (!form.basePrice || Number(form.basePrice) < 25) {
      newErrors.basePrice = "Price must be at least 25.";
    }

    if (!form.priceUnit) {
      newErrors.priceUnit = "Please select a price unit.";
    }

    if (!form.minHours || Number(form.minHours) < 1) {
      newErrors.minHours = "Minimum hours must be at least 1.";
    }

    if (
      form.includes.length === 0 ||
      form.includes.some((item) => !item.trim())
    ) {
      newErrors.includes = "Please add at least one included item.";
    }

    if (
      form.exclusions.length === 0 ||
      form.exclusions.some((item) => !item.trim())
    ) {
      newErrors.exclusions = "Please add at least one exclusion.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        setCategories(data?.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, [open]);

  if (!open) return null;

  const uploadImages = async (files: File[]) => {
    const uploadedMedia = await Promise.all(
      files.map(async (file) => {
        const response = await providerApi.getUploadUrl({
          fileName: file.name,
          fileType: file.type,
        });

        const { uploadUrl, fileUrl } = response;

        try {
          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });

        } catch (error) {
          console.error("S3 Upload Error", error);
        }

        return {
          url: fileUrl,
          type: "image" as const,
        };
      })
    );

    return uploadedMedia;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "basePrice" || name === "minHours" ? Number(value) : value });
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleArrayChange = (
    field: "includes" | "exclusions",
    index: number,
    value: string
  ) => {
    setForm((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;

      return {
        ...prev,
        [field]: newArray,
      };
    });

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const addArrayItem = (field: "includes" | "exclusions") => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const removeArrayItem = (field: "includes" | "exclusions", index: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {

      const data: any = await providerApi.getProfileDetails();

      if (data?.provider.approvalStatus !== "approved") {
        alert("Your provider profile is not approved yet. Please wait for approval before creating services.");
        return;
      }

      setLoading(true);

      const uploadedMedia = await uploadImages(files);

      const serviceData = {
        ...form,
        media: uploadedMedia.map((item) => item.url),
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
        categoryId: "",
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
            <label className="block mb-1 text-sm font-medium text-gray-700">Service Title<span className="ml-1 text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Professional House Cleaning"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description<span className="ml-1 text-red-500">*</span></label>
            <textarea
              name="description"
              placeholder="Describe what's included in your service..."
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Category<span className="ml-1 text-red-500">*</span>
            </label>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              disabled={categories.length === 0}
              className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {categories.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                <>
                  <option value="">Select a category</option>
                  {categories.map((category: any) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Service Images<span className="ml-1 text-red-500">*</span>
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(Array.from(e.target.files));
                }
              }}
              className="w-full px-3 py-2 text-sm border rounded-md"
            />
            {errors.files && (
              <p className="mt-1 text-sm text-red-500">{errors.files}</p>
            )}
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden border rounded-lg"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="object-cover w-full h-24"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Price<span className="ml-1 text-red-500">*</span></label>
              <input
                type="number"
                name="basePrice"
                min={25}
                value={form.basePrice}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              {errors.basePrice && (
                <p className="mt-1 text-sm text-red-500">{errors.basePrice}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Price Unit<span className="ml-1 text-red-500">*</span>
              </label>
              <select
                name="priceUnit"
                value={form.priceUnit}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="per_hour">Per Hour</option>
                <option value="per_service">Per Service</option>
              </select>
              {errors.priceUnit && (
                <p className="mt-1 text-sm text-red-500">{errors.priceUnit}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Minimum Hours<span className="ml-1 text-red-500">*</span></label>
              <input
                type="number"
                name="minHours"
                min={1}
                value={form.minHours}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              {errors.minHours && (
                <p className="mt-1 text-sm text-red-500">{errors.minHours}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">What's Included<span className="ml-1 text-red-500">*</span></label>
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
            {errors.includes && (
              <p className="mt-1 text-sm text-red-500">{errors.includes}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Exclusions<span className="ml-1 text-red-500">*</span></label>
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
            {errors.exclusions && (
              <p className="mt-1 text-sm text-red-500">{errors.exclusions}</p>
            )}
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
