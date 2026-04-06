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
  const masteryPercent = Math.round((card.masteryScore || 0) * 100);
  const confidencePercent = Math.round((card.masteryConfidence || 0) * 100);
  const avgResponseSec = card.avgResponseTimeMs
    ? Math.max(1, Math.round(card.avgResponseTimeMs / 1000))
    : 0;
  const isDue = card.nextReviewAt ? new Date(card.nextReviewAt) <= new Date() : true;
  const nextReviewLabel = card.nextReviewAt
    ? new Date(card.nextReviewAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Today";

  return (
    <div
      onClick={onFlip}
      className={`group relative min-h-[360px] sm:min-h-[440px] cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border p-5 sm:p-8 shadow-[0_18px_36px_rgba(15,23,42,0.1)] transition-all duration-300 ${
        flipped
          ? "border-emerald-300 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white"
          : "border-slate-200 bg-white text-slate-900 hover:border-emerald-200"
      }`}
    >
      <div
        className={`pointer-events-none absolute -left-14 -top-14 h-44 w-44 rounded-full blur-3xl ${
          flipped ? "bg-white/20" : "bg-emerald-100/60"
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-20 -right-10 h-48 w-48 rounded-full blur-3xl ${
          flipped ? "bg-cyan-100/25" : "bg-teal-100/55"
        }`}
      />

      <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
          <span
            className={`rounded-lg px-3.5 py-1.5 font-semibold uppercase tracking-[0.06em] ${
              flipped
                ? "bg-white/20 text-white"
                : difficultyClasses[difficulty] || difficultyClasses.medium
            }`}
          >
            {difficulty}
          </span>
          <span
            className={`rounded-lg px-3.5 py-1.5 font-semibold ${
              flipped ? "bg-white/20 text-white" : "bg-teal-100 text-teal-700"
            }`}
          >
            Mastery {masteryPercent}%
          </span>
          <span
            className={`rounded-lg px-3.5 py-1.5 font-semibold ${
              flipped
                ? "bg-white/20 text-white"
                : isDue
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-700"
            }`}
          >
            {isDue ? "Due now" : `Next ${nextReviewLabel}`}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleStar();
        }}
        disabled={starLoading}
        className={`absolute right-5 top-5 sm:right-8 sm:top-8 z-10 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border transition ${
          flipped
            ? "border-white/30 bg-white/15 text-white hover:bg-white/25"
            : "border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200"
        } ${starLoading ? "cursor-not-allowed opacity-70" : ""}`}
        aria-label="Toggle flashcard star"
      >
        <Star
          className="h-5 w-5"
          fill={card.isStarred ? "currentColor" : "none"}
          strokeWidth={2.2}
        />
      </button>

      <div className="flex min-h-[260px] sm:min-h-[320px] items-center justify-center text-center">
        <p className="relative z-10 max-w-3xl text-xl sm:text-3xl font-semibold leading-relaxed">
          {flipped ? card.answer : card.question}
        </p>
      </div>

      <div
        className={`rounded-xl border px-4 py-3 ${
          flipped
            ? "border-white/25 bg-white/10"
            : "border-slate-200 bg-slate-50/85"
        }`}
      >
        <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
          <span className={flipped ? "text-white/80" : "text-slate-600"}>Model confidence</span>
          <span className={flipped ? "font-semibold text-white" : "font-semibold text-slate-800"}>
            {confidencePercent}%
          </span>
        </div>
        <div className={`h-2 overflow-hidden rounded-full ${flipped ? "bg-white/25" : "bg-slate-200"}`}>
          <div
            className={`h-full rounded-full ${flipped ? "bg-white" : "bg-gradient-to-r from-emerald-500 to-teal-500"}`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
        <div className={`mt-2 flex items-center justify-between text-xs ${flipped ? "text-white/80" : "text-slate-600"}`}>
          <span>Reviews: {card.reviewCount || 0}</span>
          <span>{avgResponseSec > 0 ? `Avg response ${avgResponseSec}s` : "No speed data yet"}</span>
        </div>
      </div>

      <div
        className={`mt-3 sm:mt-4 flex items-center justify-center gap-2 text-sm sm:text-base ${
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
