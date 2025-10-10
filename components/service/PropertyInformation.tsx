// components/service/PropertyInformation.tsx
// Property Information card on a split background (top: #F4F1EC, bottom: #1F2937)

import LabeledInput from "@/components/ui/LabeledInput";

export default function PropertyInformation() {
  return (
    <section className="relative mt-12">
      {/* Split background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="h-1/2 w-full bg-[#F4F1EC]" />
        <div className="h-1/2 w-full bg-[#1F2937]" />
      </div>

      <div className="px-4 mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left card: Property Information */}
          <div className="p-6 bg-white border shadow-sm rounded-2xl md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Property Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in your preferred date, time, and location
            </p>

            <div className="grid gap-4 mt-6 md:grid-cols-2">
              <LabeledInput label="Square Footage">
                <input
                  placeholder="e.g., 1200"
                  className="w-full px-3 border rounded-lg outline-none h-11 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-200"
                />
              </LabeledInput>

              <LabeledInput label="Entry Method">
                <select className="w-full px-3 bg-white border rounded-lg outline-none appearance-none h-11 focus:ring-2 focus:ring-amber-200">
                  <option value="" disabled selected>
                    How will cleaner enter?
                  </option>
                  <option>Doorman</option>
                  <option>Lockbox</option>
                  <option>Key under mat</option>
                  <option>Meet at door</option>
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

          {/* Right column reserved for the Photo Uploads card (coming next) */}
          <div />
        </div>
      </div>
    </section>
  );
}
