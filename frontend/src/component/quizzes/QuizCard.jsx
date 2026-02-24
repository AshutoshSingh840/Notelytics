import React from "react";
import { BarChart3, Play, Trash2, Trophy } from "lucide-react";

const QuizCard = ({ quiz, onDelete, onStartQuiz, onViewResults }) => {
  const isCompleted = Boolean(quiz?.completedAt);
  const createdAt = quiz?.createdAt
    ? new Date(quiz.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown date";

  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex items-start justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          <Trophy className="h-4 w-4 text-amber-500" />
          Score: {typeof quiz?.score === "number" ? quiz.score : 0}
        </span>

        <button
          type="button"
          onClick={() => onDelete(quiz)}
          className="rounded-lg p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
          aria-label="Delete quiz"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{quiz?.title || "Quiz"}</h3>
      <p className="mt-1 text-sm uppercase tracking-[0.08em] text-slate-500">Created {createdAt}</p>

      <div className="my-4 border-t border-slate-100" />

      <span className="inline-flex rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm sm:text-base font-medium text-slate-700">
        {quiz?.totalQuestions || quiz?.questions?.length || 0} Questions
      </span>

      <div className="mt-5">
        {isCompleted ? (
          <button
            type="button"
            onClick={() => onViewResults(quiz)}
            className="inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-slate-100 text-sm sm:text-base font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            <BarChart3 className="h-5 w-5 text-indigo-500" />
            View Results
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onStartQuiz(quiz)}
            className="inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm sm:text-base font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.3)] transition hover:opacity-95"
          >
            <Play className="h-5 w-5 text-emerald-100" />
            Start Quiz
          </button>
        )}
      </div>
    </article>
  );
};

export default QuizCard;
