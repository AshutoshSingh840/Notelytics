import React from "react";
import { RefreshCw, Star } from "lucide-react";

const difficultyClasses = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-slate-100 text-slate-700",
  hard: "bg-rose-100 text-rose-700",
};

const FlashCard = ({
  card,
  flipped,
  onFlip,
  onToggleStar,
  starLoading = false,
}) => {
  if (!card) return null;

  const difficulty = (card.difficulty || "medium").toLowerCase();

  return (
    <div
      onClick={onFlip}
      className={`group relative min-h-[340px] sm:min-h-[420px] cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border p-5 sm:p-8 shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-all duration-300 ${
        flipped
          ? "border-emerald-300 bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
          : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
        <span
          className={`rounded-lg px-4 py-2 text-sm font-semibold uppercase tracking-[0.06em] ${
            flipped
              ? "bg-white/20 text-white"
              : difficultyClasses[difficulty] || difficultyClasses.medium
          }`}
        >
          {difficulty}
        </span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleStar();
        }}
        disabled={starLoading}
        className={`absolute right-5 top-5 sm:right-8 sm:top-8 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl border transition ${
          flipped
            ? "border-white/30 bg-white/15 text-white hover:bg-white/25"
            : "border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200"
        } ${starLoading ? "cursor-not-allowed opacity-70" : ""}`}
        aria-label="Toggle flashcard star"
      >
        <Star
          className="h-6 w-6"
          fill={card.isStarred ? "currentColor" : "none"}
          strokeWidth={2.2}
        />
      </button>

      <div className="flex min-h-[250px] sm:min-h-[330px] items-center justify-center text-center">
        <p className="max-w-3xl text-xl sm:text-2xl font-semibold leading-relaxed">
          {flipped ? card.answer : card.question}
        </p>
      </div>

      <div
        className={`mt-4 sm:mt-5 flex items-center justify-center gap-2 text-sm sm:text-base ${
          flipped ? "text-white/90" : "text-slate-500"
        }`}
      >
        <RefreshCw className="h-5 w-5" />
        <span>{flipped ? "Click to see question" : "Click to reveal answer"}</span>
      </div>
    </div>
  );
};

export default FlashCard;
