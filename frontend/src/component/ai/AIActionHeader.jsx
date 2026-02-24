import React from "react";
import { Sparkles } from "lucide-react";

const AIActionHeader = () => {
  return (
    <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-[0_10px_24px_rgba(16,185,129,0.35)]">
        <Sparkles className="h-7 w-7" />
      </div>

      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">AI Assistant</h2>
        <p className="text-slate-500">Powered by advanced AI</p>
      </div>
    </div>
  );
};

export default AIActionHeader;
