import React from "react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      
      {/* Left Section */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-slate-500 text-sm mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Section (Buttons / Actions) */}
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
