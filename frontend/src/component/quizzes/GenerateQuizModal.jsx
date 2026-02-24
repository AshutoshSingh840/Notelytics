import React, { useState } from "react";
import Button from "../common/Button.jsx";

const GenerateQuizModal = ({ open, loading = false, onClose, onGenerate }) => {
  const [title, setTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({
      title: title.trim(),
      numQuestions: Number(numQuestions),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.24)]">
        <h3 className="text-xl font-semibold text-slate-900">Generate Quiz</h3>
        <p className="mt-1 text-sm text-slate-500">Create a new quiz from this document.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
              Quiz Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. React JS Study Guide - Quiz"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
              Number of Questions
            </label>
            <input
              type="number"
              min={3}
              max={20}
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateQuizModal;
