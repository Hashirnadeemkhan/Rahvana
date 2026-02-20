"use client";

import { motion } from "framer-motion";
import { Upload, Check } from "lucide-react";
import guideData from "@/data/frc-guide-data.json";

interface ValidationStepProps {
  validationChecks: string[];
  onToggleCheck: (label: string) => void;
  uploadedFile: boolean;
  onUpload: () => void;
}

const ValidationStep = ({
  validationChecks,
  onToggleCheck,
  uploadedFile,
  onUpload,
}: ValidationStepProps) => {
  const { title, description, upload_section, checklist_title, categories } =
    guideData.wizard.validation;

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);

  const checkedCount = validationChecks.length;

  const criticalTotal = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.critical).length,
    0,
  );

  const criticalChecked = categories.reduce(
    (acc, cat) =>
      acc +
      cat.items.filter(
        (item) => item.critical && validationChecks.includes(item.label),
      ).length,
    0,
  );

  const criticalRemaining = criticalTotal - criticalChecked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-sans"
    >
      {/* Title */}
      <h2 className="text-[1.75rem] font-extrabold text-slate-900 mb-2">
        {title}
      </h2>

      <p className="text-sm text-slate-500 mb-8">{description}</p>

      {/* Upload Section */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {upload_section.title}
        </h3>

        <div className="p-8 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center gap-3 text-center">
          <Upload
            className={`w-8 h-8 ${
              uploadedFile ? "text-emerald-700" : "text-slate-400"
            }`}
          />

          <p className="text-sm text-slate-500">{upload_section.description}</p>

          <p className="text-xs text-slate-400">
            Accepted formats: {upload_section.formats}
          </p>

          <motion.button
            whileHover={{ scale: uploadedFile ? 1 : 1.03 }}
            whileTap={{ scale: uploadedFile ? 1 : 0.97 }}
            onClick={!uploadedFile ? onUpload : undefined}
            disabled={uploadedFile}
            className={`px-6 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition
              ${
                uploadedFile
                  ? "bg-emerald-700 cursor-default opacity-90"
                  : "bg-linear-to-r from-emerald-700 to-emerald-600 hover:shadow-lg"
              }
            `}
          >
            {uploadedFile ? "✓ Uploaded" : "Upload to Vault"}
          </motion.button>
        </div>
      </div>

      {/* Checklist Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900">
          {checklist_title} ({checkedCount}/{totalItems})
        </h3>

        {criticalRemaining > 0 && (
          <span className="px-3 py-1 rounded-md bg-red-100 text-red-600 text-xs font-semibold">
            {criticalRemaining} Critical Issues
          </span>
        )}
      </div>

      {/* Categories */}
      {categories.map((category, ci) => (
        <div key={ci} className="mb-6">
          {/* Category Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-700" />
            <h4 className="text-sm font-bold text-slate-800">
              {category.name}
            </h4>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-2 pl-4">
            {category.items.map((item, ii) => {
              const isChecked = validationChecks.includes(item.label);

              return (
                <motion.div
                  key={item.label}
                  whileHover={{ x: 2 }}
                  onClick={() => onToggleCheck(item.label)}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onToggleCheck(item.label);
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition
                    ${isChecked ? "bg-emerald-50" : "hover:bg-slate-50"}
                  `}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition
                      ${
                        isChecked
                          ? "bg-emerald-700 border-emerald-700"
                          : "border-slate-300 bg-white"
                      }
                    `}
                  >
                    {isChecked && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm flex-1 transition
                      ${
                        isChecked
                          ? "text-slate-400 line-through"
                          : "text-slate-800"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {/* Critical Badge */}
                  {item.critical && (
                    <span
                      className={`text-xs font-semibold
                        ${isChecked ? "text-emerald-700" : "text-red-600"}
                      `}
                    >
                      {isChecked ? "✓" : "(Critical)"}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default ValidationStep;
