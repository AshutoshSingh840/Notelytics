import React from "react";
import { X } from "lucide-react";

const QuizResultsModal = ({ open, loading = false, data, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
      <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.24)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Quiz Results</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Close results"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <p className="py-10 text-center text-slate-500">Loading results...</p>
        ) : !data ? (
          <p className="py-10 text-center text-slate-500">No results available.</p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-sm text-emerald-700">
                Score:{" "}
                <span className="font-semibold">
                  {data?.quiz?.score ?? 0}% ({data?.quiz?.totalQuestions ?? 0} questions)
                </span>
              </p>
            </div>

            {(data?.results || []).map((item) => (
              <div key={item.questionIndex} className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">{item.question}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Your answer: <span className="font-medium">{item.selectedAnswer || "Not answered"}</span>
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Correct answer: <span className="font-medium">{item.correctAnswer}</span>
                </p>
                {item.explanation ? (
                  <p className="mt-2 text-sm text-slate-500">{item.explanation}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResultsModal;
