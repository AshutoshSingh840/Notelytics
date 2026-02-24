import React from "react";
import { FileText, Plus } from "lucide-react";

const EmptyState = ({
  onActionClick,
  title = "No Documents Yet",
  description = "Upload your first document to get started.",
  buttonText = "Upload Document",
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      
      {/* Icon */}
      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-6 shadow-[0_8px_18px_rgba(16,185,129,0.22)]">
        <FileText className="w-8 h-8 text-emerald-600 drop-shadow-[0_2px_2px_rgba(16,185,129,0.2)]" strokeWidth={2} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-500 max-w-md mb-6">
        {description}
      </p>

      {/* Button */}
      {buttonText && onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all duration-200"
        >
          <Plus className="w-4 h-4 text-emerald-100" strokeWidth={2.5} />
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
