import { motion } from "framer-motion";
import { Info, ChevronDown } from "lucide-react";
import guideData from "@/data/frc-guide-data.json";

interface LocationStepProps {
  province: string | null;
  district: string | null;
  city: string | null;
  onProvinceChange: (val: string) => void;
  onDistrictChange: (val: string) => void;
  onCityChange: (val: string) => void;
}

const LocationStep = ({
  province,
  district,
  city,
  onProvinceChange,
  onDistrictChange,
  onCityChange,
}: LocationStepProps) => {
  const locData = guideData.wizard.location;
  const selectedProvince = locData.provinces.find((p) => p.name === province);
  const districts = selectedProvince?.districts || [];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Title */}
      <h2 className="text-[1.75rem] font-extrabold text-[hsl(220_20%_10%)] mb-2 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
        {locData.title}
      </h2>

      {/* Description */}
      <p className="text-[0.95rem] text-[hsl(215_16%_47%)] mb-8">
        {locData.description}
      </p>

      <div className="flex flex-col gap-6 max-w-135">
        {/* Country */}
        <div>
          <label className="block text-sm font-semibold text-[hsl(220_20%_20%)] mb-1.5">
            Country
          </label>

          <input
            type="text"
            readOnly
            value={locData.country}
            className="w-full px-4 py-3 text-[0.9rem] border border-[hsl(214_32%_91%)] rounded-[10px] bg-[hsl(210_20%_98%)] text-[hsl(215_16%_47%)] cursor-default outline-none"
          />

          <p className="text-[0.78rem] text-[hsl(168_80%_30%)] mt-1.5">
            {locData.country_note}
          </p>
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-semibold text-[hsl(220_20%_20%)] mb-1.5">
            Province / Territory{" "}
            <span className="text-[hsl(0_84%_60%)]">*</span>
          </label>

          <div className="relative">
            <select
              value={province || ""}
              onChange={(e) => {
                onProvinceChange(e.target.value);
                onDistrictChange("");
                onCityChange("");
              }}
              className="w-full px-4 py-3 text-[0.9rem] border border-[hsl(214_32%_91%)] rounded-[10px] bg-white text-[hsl(220_20%_10%)] appearance-none cursor-pointer outline-none"
            >
              <option value="">Select Province</option>
              {locData.provinces.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[hsl(215_16%_57%)] pointer-events-none" />
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-semibold text-[hsl(220_20%_20%)] mb-1.5">
            District <span className="text-[hsl(0_84%_60%)]">*</span>
          </label>

          <div className="relative">
            <select
              value={district || ""}
              onChange={(e) => {
                onDistrictChange(e.target.value);
                onCityChange("");
              }}
              disabled={!province}
              className={`w-full px-4 py-3 text-[0.9rem] border border-[hsl(214_32%_91%)] rounded-[10px] bg-white text-[hsl(220_20%_10%)] appearance-none cursor-pointer outline-none ${
                !province ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <option value="">
                {province ? "Select District" : "Select Province First"}
              </option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[hsl(215_16%_57%)] pointer-events-none" />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-[hsl(220_20%_20%)] mb-1.5">
            City / Area <span className="text-[hsl(0_84%_60%)]">*</span>
          </label>

          <input
            type="text"
            placeholder={
              district ? "Enter your city or area" : "Select District First"
            }
            value={city || ""}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={!district}
            className={`w-full px-4 py-3 text-[0.9rem] border border-[hsl(214_32%_91%)] rounded-[10px] bg-white text-[hsl(220_20%_10%)] outline-none ${
              !district ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Info Note */}
        <div className="p-4 rounded-[12px] bg-[hsl(168_60%_96%)] border border-[hsl(168_50%_88%)] flex gap-3 items-start">
          <Info className="w-4.5 h-4.5 text-[hsl(168_80%_30%)] shrink-0 mt-0.5" />
          <p className="text-[0.83rem] leading-[1.6] text-[hsl(168_60%_20%)]">
            {locData.location_note}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationStep;
