import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Search,
  Clock,
  Phone,
  MapIcon,
  Star,
} from "lucide-react";
import guideData from "@/data/frc-guide-data.json";

interface OfficeFinderStepProps {
  province: string | null;
  district: string | null;
}

const OfficeFinderStep = ({ province, district }: OfficeFinderStepProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const allOffices = guideData.wizard.offices;

  const filteredOffices = allOffices.filter((o) => {
    const matchesLocation =
      (!province || o.province === province) &&
      (!district || o.district === district);

    const matchesSearch =
      !searchQuery ||
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLocation && matchesSearch;
  });

  const displayOffices =
    filteredOffices.length > 0 ? filteredOffices : allOffices;

  const locationLabel =
    [district, province].filter(Boolean).join(", ") || "Pakistan";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Title */}
      <h2 className="text-[1.75rem] font-extrabold text-[hsl(220_20%_10%)] mb-2 font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
        Find Your NADRA Office
      </h2>

      <p className="text-[0.95rem] text-[hsl(215_16%_47%)] mb-6">
        Based on your location: {locationLabel}
      </p>

      {/* Warning Box */}
      <div className="p-4 rounded-[12px] bg-[hsl(40_100%_97%)] border border-[hsl(40_80%_85%)] flex gap-3 items-start mb-6">
        <AlertTriangle className="w-4.5 h-4.5 text-[hsl(35_80%_45%)] shrink-0 mt-0.5" />

        <div>
          <p className="text-[0.83rem] font-bold text-[hsl(35_80%_35%)] mb-1">
            Important: Verify Before Visiting
          </p>

          <p className="text-[0.83rem] leading-[1.6] text-[hsl(35_50%_30%)]">
            FRCs are processed at authorized NADRA Registration Centers. Verify
            that the office you plan to visit offers FRC services. Office
            listings and contact information may change; always confirm details
            before visiting.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[hsl(215_16%_60%)]" />

        <input
          type="text"
          placeholder="Search by office name, address, or area..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-[0.8rem] pl-11 pr-4 rounded-[12px] border border-[hsl(214_32%_91%)] text-[0.9rem] bg-white text-[hsl(220_20%_10%)] outline-none"
        />
      </div>

      {/* Office Cards */}
      <div className="flex flex-col gap-4">
        {displayOffices.map((office, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-[14px] border border-[hsl(214_32%_91%)] bg-white"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-[1.05rem] font-bold text-[hsl(220_20%_10%)] font-['Plus_Jakarta_Sans','Inter',system-ui,sans-serif]">
                {office.name}
              </h4>

              <span className="p-2.5 rounded-[6px] bg-[hsl(168_60%_95%)] text-[hsl(168_80%_30%)] text-[0.72rem] font-semibold">
                {office.badge}
              </span>
            </div>

            {/* Address */}
            <p className="text-[0.85rem] text-[hsl(215_16%_50%)] mb-3">
              {office.address}
            </p>

            {/* Info Row */}
            <div className="flex flex-wrap gap-6 text-[0.82rem] text-[hsl(215_16%_47%)] mb-3">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {office.hours}
              </span>

              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {office.phone}
              </span>
            </div>

            {/* Tip */}
            <div className="px-4 py-2 rounded-xl bg-[hsl(168_60%_96%)] text-[0.8rem] text-[hsl(168_50%_25%)] mb-4">
              {office.tip}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] border-[1.5px] border-[hsl(168_80%_30%)] text-[hsl(168_80%_30%)] text-[0.85rem] font-semibold bg-transparent cursor-pointer"
              >
                <MapIcon className="w-3.5 h-3.5" />
                View on Map
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-white text-[0.85rem] font-semibold cursor-pointer bg-[linear-gradient(135deg,hsl(168_80%_30%),hsl(168_70%_38%))] shadow-[0_2px_8px_hsl(168_80%_30%/0.3)]"
              >
                <Star className="w-3.5 h-3.5" />
                Save Office
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OfficeFinderStep;