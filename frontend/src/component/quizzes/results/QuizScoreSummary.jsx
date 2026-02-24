import React from "react";
import { CircleCheckBig, CircleX, Target, Trophy } from "lucide-react";

const getFeedbackText = (score) => {
  if (score >= 85) return "Excellent work!";
  if (score >= 70) return "Great job!";
  if (score >= 50) return "Not bad!";
  return "Keep practicing!";
};

const QuizScoreSummary = ({ score = 0, total = 0, correct = 0, incorrect = 0 }) => {
  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl sm:rounded-3xl bg-emerald-100 text-emerald-600 shadow-[0_10px_26px_rgba(16,185,129,0.24)]">
          <Trophy className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>

        <p className="text-sm sm:text-base font-semibold uppercase tracking-[0.08em] text-slate-600">Your Score</p>
        <p className="mt-2 text-5xl sm:text-7xl font-bold text-amber-500">{score}%</p>
        <p className="mt-2 text-xl sm:text-3xl font-semibold text-slate-800">{getFeedbackText(score)}</p>

        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl border border-slate-300 bg-slate-50 px-4 sm:px-5 py-2 text-sm sm:text-base font-semibold text-slate-700">
            <Target className="h-5 w-5" />
            {total} Total
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl border border-emerald-200 bg-emerald-50 px-4 sm:px-5 py-2 text-sm sm:text-base font-semibold text-emerald-700">
            <CircleCheckBig className="h-5 w-5" />
            {correct} Correct
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl border border-rose-200 bg-rose-50 px-4 sm:px-5 py-2 text-sm sm:text-base font-semibold text-rose-700">
            <CircleX className="h-5 w-5" />
            {incorrect} Incorrect
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizScoreSummary;
