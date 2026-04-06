import React, { useEffect, useState } from "react";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../component/common/Spinner.jsx";
import EmptyState from "../../component/common/EmptyState.jsx";
import { getAllFlashcardSets } from "../../services/flashcardService.js";

const formatCreatedAt = (dateString) => {
  if (!dateString) return "Created recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Created just now";
  if (diffHours < 24) return `Created ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `Created ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const FlashCardListPage = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSets = async () => {
      try {
        const response = await getAllFlashcardSets();
        setSets(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        toast.error(error?.details?.error || error?.message || "Failed to fetch flashcard sets.");
        setSets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (sets.length === 0) {
    return (
      <EmptyState
        title="No Flashcard Sets Yet"
        description="Generate flashcards from your documents to start studying."
        buttonText=""
      />
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">All Flashcard Sets</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {sets.map((setItem) => {
          const totalCards = setItem?.cards?.length || 0;
          const reviewedCards = (setItem?.cards || []).filter((card) => (card.reviewCount || 0) > 0).length;
          const progress = totalCards > 0 ? Math.round((reviewedCards / totalCards) * 100) : 0;
          const avgMastery =
            totalCards > 0
              ? Math.round(
                  ((setItem?.cards || []).reduce(
                    (sum, card) => sum + (card.masteryScore || 0),
                    0
                  ) / totalCards) * 100
                )
              : 0;
          const dueCount = (setItem?.cards || []).filter((card) => {
            if (!card.nextReviewAt) return true;
            return new Date(card.nextReviewAt) <= new Date();
          }).length;
          const documentId =
            typeof setItem?.documentId === "object" ? setItem.documentId?._id : setItem?.documentId;
          const title =
            typeof setItem?.documentId === "object" ? setItem.documentId?.title : "Flashcard Set";

          return (
            <article
              key={setItem._id}
              className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-[0_14px_28px_rgba(15,23,42,0.1)]"
            >
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 shadow-sm">
                  <BookOpen className="h-7 w-7 drop-shadow-[0_2px_2px_rgba(16,185,129,0.18)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-lg sm:text-xl font-semibold leading-snug text-slate-900">
                    {title || "Flashcard Set"}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm uppercase tracking-[0.06em] text-slate-500">
                    {formatCreatedAt(setItem.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                <span className="rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 text-center">
                  {totalCards} Cards
                </span>
                <span className="inline-flex items-center justify-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-emerald-700">
                  <TrendingUp className="h-3.5 w-3.5 text-teal-600" />
                  {progress}%
                </span>
                <span className="rounded-xl border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-teal-700 text-center">
                  Mastery {avgMastery}%
                </span>
                <span className="rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-amber-700 text-center">
                  Due {dueCount}
                </span>
              </div>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Progress</span>
                  <span className="font-semibold">{reviewedCards}/{totalCards} reviewed</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/documents/${documentId}/flashcards?setId=${setItem._id}`)
                  }
                  className="inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-sm sm:text-base font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.28)] transition hover:opacity-95"
                >
                  <Sparkles className="h-5 w-5 text-emerald-100" />
                  Study Now
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default FlashCardListPage;
