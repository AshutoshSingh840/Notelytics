import React from "react";
import MarkdownRenderer from "../common/MarkdownRender.jsx";

const AIResponsePanel = ({ title, content }) => {
  if (!content) return null;

  return (
    <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-emerald-700">{title}</p>
      <div className="text-sm leading-7 text-slate-700">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
};

export default AIResponsePanel;
