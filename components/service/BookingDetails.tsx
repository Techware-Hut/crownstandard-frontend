"use client";

import { useEffect, useMemo, useState } from "react";
import { Tag, UploadCloud, X } from "lucide-react";
import LabeledInput from "@/components/ui/LabeledInput";
import { type NormalizedService, formatMoney, PriceUnit } from "@/types/service";

type PreviewFile = { file: File; url: string };

export default function ServiceBookingForm({ service }: { service: NormalizedService }) {
    // ----- form state -----
    const [entryMethod, setEntryMethod] = useState<string>("");

    // Upload state (kept in parent so you can submit everything together)
    const [commonAreas, setCommonAreas] = useState<PreviewFile[]>([]);
    const [flooring, setFlooring] = useState<PreviewFile[]>([]);
    const [bathrooms, setBathrooms] = useState<PreviewFile[]>([]);
    const [duration, setDuration] = useState<number | 2>(2);

    const inputClass = (isEmpty: boolean) =>
        `w-full rounded-md border px-3 py-2 text-sm outline-none transition 
     ${isEmpty ? "border-gray-300 text-gray-400" : "border-gray-400 text-gray-900"}
     focus:border-[#C5A04B] focus:ring-1 focus:ring-[#C5A04B]`;

    // pricing
    const pricing = service.pricing;
    const minHours = pricing.minHours ?? 2;
    const base = pricing.amount * minHours;

    // ----- helpers -----
    function toPreviewFiles(list: FileList | null): PreviewFile[] {
        if (!list) return [];
        return Array.from(list).map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    }

    function addFiles(setter: React.Dispatch<React.SetStateAction<PreviewFile[]>>, files: FileList | null) {
        if (!files) return;
        setter((prev) => [...prev, ...toPreviewFiles(files)]);
    }

    function removeFile(setter: React.Dispatch<React.SetStateAction<PreviewFile[]>>, index: number) {
        setter((prev) => {
            const next = [...prev];
            const [removed] = next.splice(index, 1);
            // Revoke blob URL to avoid memory leaks
            if (removed?.url) URL.revokeObjectURL(removed.url);
            return next;
        });
    }

    // Revoke all object URLs on unmount
    useEffect(() => {
        return () => {
            [commonAreas, flooring, bathrooms].forEach((arr) =>
                arr.forEach((p) => p.url && URL.revokeObjectURL(p.url))
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Choose whether a file is an image for thumbnail preview
    const isImage = (f: PreviewFile) => f.file.type.startsWith("image/");

    // Simple placeholder class toggle for selects
    const selectClass = (empty: boolean) =>
        [
            "w-full h-11 px-3 bg-white border rounded-lg outline-none appearance-none focus:ring-2 focus:ring-amber-200",
            empty ? "text-gray-400" : "text-gray-900",
        ].join(" ");

    return (
        <>

            {/* ===== Property Information + Photo Uploads on split background ===== */}
            <section className="relative max-w-7xl">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Property Information card */}
                        <div className="p-6 bg-white border shadow-sm rounded-2xl md:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Property Information</h2>
                            <p className="mt-1 text-sm text-gray-500">Fill in your preferred date, time, and location</p>

                            <div className="grid gap-4 mt-6 md:grid-cols-2">
                                <LabeledInput label="Square Footage">
                                    <input
                                        placeholder="e.g., 1200"
                                        className="w-full px-3 border rounded-lg outline-none h-11 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-200"
                                    />
                                </LabeledInput>

                                <LabeledInput label="Entry Method">
                                    <select
                                        value={entryMethod}
                                        onChange={(e) => setEntryMethod(e.target.value)}
                                        className={selectClass(entryMethod === "")}
                                    >
                                        <option value="" disabled>
                                            How will cleaner enter?
                                        </option>
                                        <option value="doorman" className="text-gray-900">
                                            Doorman
                                        </option>
                                        <option value="lockbox" className="text-gray-900">
                                            Lockbox
                                        </option>
                                        <option value="key_under_mat" className="text-gray-900">
                                            Key under mat
                                        </option>
                                        <option value="meet_at_door" className="text-gray-900">
                                            Meet at door
                                        </option>
                                    </select>
                                </LabeledInput>
                            </div>

                            <div className="mt-4">
                                <LabeledInput label="Entry Instructions">
                                    <textarea
                                        rows={3}
                                        placeholder="Please provide detailed instructions for entry (location of key, codes, special instructions, etc.)"
                                        className="w-full px-3 py-2 border rounded-lg outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-amber-200"
                                    />
                                </LabeledInput>
                            </div>

                            <div className="mt-4">
                                <LabeledInput label="Additional Notes">
                                    <textarea
                                        rows={3}
                                        placeholder="Any special requests, areas to focus on, items to avoid, pets, etc."
                                        className="w-full px-3 py-2 border rounded-lg outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-amber-200"
                                    />
                                </LabeledInput>
                            </div>
                        </div>

                        {/* Photo Uploads card (real multiple file inputs) */}
                        <div className="p-6 bg-white border shadow-sm rounded-2xl md:p-8">
                            <div className="grid gap-6">
                                {/* LEFT column categories */}
                                <div>
                                    {/* Common Areas */}
                                    <h3 className="text-lg font-semibold text-gray-900">Common Areas</h3>
                                    <div className="mt-3">
                                        <label className="flex flex-col items-center justify-center w-full p-6 text-center transition border-2 border-dashed rounded-lg cursor-pointer border-amber-300/70 bg-amber-50/40 hover:bg-amber-50">
                                            <UploadCloud className="w-6 h-6 text-amber-600" />
                                            <span className="mt-2 text-sm font-medium text-amber-800">Upload Photos</span>
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => addFiles(setCommonAreas, e.target.files)}
                                            />
                                        </label>

                                        {commonAreas.length > 0 && (
                                            <ul className="grid grid-cols-1 gap-2 mt-3 text-sm text-gray-700">
                                                {commonAreas.map((p, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {isImage(p) ? (
                                                                // thumbnail
                                                                <img
                                                                    src={p.url}
                                                                    alt={p.file.name}
                                                                    className="object-cover w-10 h-10 rounded"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-gray-300 rounded" />
                                                            )}
                                                            <span className="truncate">{p.file.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(setCommonAreas, idx)}
                                                            className="text-gray-500 hover:text-red-500"
                                                            aria-label="Remove file"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Flooring */}
                                    <h3 className="mt-6 text-lg font-semibold text-gray-900">Flooring</h3>
                                    <div className="mt-3">
                                        <label className="flex flex-col items-center justify-center w-full p-6 text-center transition border-2 border-dashed rounded-lg cursor-pointer border-amber-300/70 bg-amber-50/40 hover:bg-amber-50">
                                            <UploadCloud className="w-6 h-6 text-amber-600" />
                                            <span className="mt-2 text-sm font-medium text-amber-800">Upload Photos</span>
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => addFiles(setFlooring, e.target.files)}
                                            />
                                        </label>

                                        {flooring.length > 0 && (
                                            <ul className="grid grid-cols-1 gap-2 mt-3 text-sm text-gray-700">
                                                {flooring.map((p, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {isImage(p) ? (
                                                                <img src={p.url} alt={p.file.name} className="object-cover w-10 h-10 rounded" />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-gray-300 rounded" />
                                                            )}
                                                            <span className="truncate">{p.file.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(setFlooring, idx)}
                                                            className="text-gray-500 hover:text-red-500"
                                                            aria-label="Remove file"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Bathroom(s) */}
                                    <h3 className="mt-6 text-lg font-semibold text-gray-900">Bathroom(s)</h3>
                                    <div className="mt-3">
                                        <label className="flex flex-col items-center justify-center w-full p-6 text-center transition border-2 border-dashed rounded-lg cursor-pointer border-amber-300/70 bg-amber-50/40 hover:bg-amber-50">
                                            <UploadCloud className="w-6 h-6 text-amber-600" />
                                            <span className="mt-2 text-sm font-medium text-amber-800">Upload Photos</span>
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => addFiles(setBathrooms, e.target.files)}
                                            />
                                        </label>

                                        {bathrooms.length > 0 && (
                                            <ul className="grid grid-cols-1 gap-2 mt-3 text-sm text-gray-700">
                                                {bathrooms.map((p, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {isImage(p) ? (
                                                                <img src={p.url} alt={p.file.name} className="object-cover w-10 h-10 rounded" />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-gray-300 rounded" />
                                                            )}
                                                            <span className="truncate">{p.file.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(setBathrooms, idx)}
                                                            className="text-gray-500 hover:text-red-500"
                                                            aria-label="Remove file"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="hidden w-px bg-gray-200 md:block" />

                                {/* RIGHT column reserved (future additional categories or preview) */}
                                <div />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* ===== Booking Details Card ===== */}
            <section className="mt-12">
                <div className="overflow-hidden bg-white border shadow-sm rounded-2xl">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr),minmax(320px,420px)]">
                        {/* LEFT: Booking form */}
                        <div className="p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Booking Details</h2>
                            <p className="mt-1 text-sm text-gray-500">Fill in your preferred date, time, and location</p>

                            {/* Top row: date, time, duration */}
                            <div className="grid gap-4 mt-8 md:grid-cols-3">
                                <LabeledInput label="Preferred Date">
                                    <input
                                        type="date"
                                        className="w-full px-3 border rounded-lg outline-none h-11 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-200"
                                    />
                                </LabeledInput>

                                <LabeledInput label="Preferred Time">
                                    <select
                                        defaultValue=""
                                        className={selectClass(true)}
                                        onChange={(e) => {
                                            // flip placeholder color after selection
                                            e.currentTarget.className = selectClass(e.currentTarget.value === "");
                                        }}
                                    >
                                        <option value="" disabled>
                                            Select time
                                        </option>
                                        {Array.from({ length: 10 }).map((_, i) => {
                                            const hour = 8 + i;
                                            const label = `${String(hour).padStart(2, "0")}:00`;
                                            return (
                                                <option key={label} value={label} className="text-gray-900">
                                                    {label}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </LabeledInput>

                                <LabeledInput label="Duration (hours)">
                                    <input
                                        type="number"
                                        min={1}
                                        max={24}
                                        placeholder="Enter hours"
                                        value={duration}
                                        onChange={(e) => {
                                            const value = e.target.value === "" ? 2 : Number(e.target.value);
                                            setDuration(value);
                                        }}
                                        className={inputClass(duration === 2)}
                                    />
                                </LabeledInput>
                            </div>

                            {/* Address fields */}
                            <div className="grid gap-4 mt-6">
                                <LabeledInput label="Service Address">
                                    <input
                                        placeholder="Street address..."
                                        className="w-full px-3 border rounded-lg outline-none h-11 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-200"
                                    />
                                </LabeledInput>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <LabeledInput label="City">
                                        <input className="w-full px-3 border rounded-lg outline-none h-11 focus:ring-2 focus:ring-amber-200" />
                                    </LabeledInput>
                                    <LabeledInput label="State">
                                        <input className="w-full px-3 border rounded-lg outline-none h-11 focus:ring-2 focus:ring-amber-200" />
                                    </LabeledInput>
                                    <LabeledInput label="Zip Code">
                                        <input className="w-full px-3 border rounded-lg outline-none h-11 focus:ring-2 focus:ring-amber-200" />
                                    </LabeledInput>
                                </div>
                            </div>

                            {/* Special instructions */}
                            <div className="mt-6">
                                <LabeledInput label="Special Instructions (Optional)">
                                    <textarea
                                        rows={3}
                                        placeholder="Any specific requirements or notes..."
                                        className="w-full px-3 py-2 border rounded-lg outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-amber-200"
                                    />
                                </LabeledInput>
                            </div>
                        </div>

                        {/* RIGHT: Discount + summary panel */}
                        <div className="border-t md:border-t-0">
                            <aside className="h-full p-6 md:p-8">
                                <div className="flex items-center gap-2 mb-1">
                                    <Tag className="w-5 h-5 text-amber-700" />
                                    <h3 className="text-2xl font-semibold text-gray-900">Discount Code</h3>
                                </div>
                                <p className="text-sm text-gray-500">Have a discount code? Enter it below to save on your booking</p>

                                <label className="block mt-5 text-sm font-semibold text-gray-800">Enter Code</label>
                                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr,auto]">
                                    <input
                                        placeholder="SAVE10"
                                        className="w-full min-w-0 px-3 border rounded-lg outline-none h-11 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-200"
                                    />
                                    <button
                                        className="w-full px-5 text-sm font-medium text-white bg-gray-300 rounded-lg h-11 sm:w-auto"
                                        disabled
                                    >
                                        Apply
                                    </button>
                                </div>

                                {/* Summary box */}
                                <div className="mt-6 rounded-lg border bg-[#F4F1EC] p-4 text-sm">
                                    <div className="flex items-center justify-between pb-3 border-b">
                                        <span>
                                            Base Price ({duration || minHours}h @ {formatMoney(pricing.amount, pricing.currency)}
                                            {pricing.unit === PriceUnit.PerHour ? "/h" : "/service"}):
                                        </span>
                                        <span>{formatMoney(pricing.amount*duration, pricing.currency)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b">
                                        <span>Subtotal:</span>
                                        <span>{formatMoney(pricing.amount*duration, pricing.currency)}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 text-base font-semibold">
                                        <span>Total Price:</span>
                                        <span>{formatMoney(pricing.amount*duration, pricing.currency)}</span>
                                    </div>
                                </div>

                                <button className="mt-6 w-full rounded-xl bg-[#BE8F2E] px-4 py-3 font-medium text-white shadow-sm transition hover:bg-[#A97F29]">
                                    Create Booking
                                </button>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>


        </>
    );
}
