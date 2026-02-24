import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../component/common/Spinner.jsx";
import FlashCard from "../../component/flashcards/FlashCard.jsx";
import {
  getFlashcardsByDocumentId,
  reviewFlashcardById,
  toggleFlashcardStarById,
} from "../../services/flashcardService.js";

const FlashCardPage = () => {
  const { id: documentId } = useParams();
  const [searchParams] = useSearchParams();
  const [sets, setSets] = useState([]);
  const [activeSetId, setActiveSetId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [starLoading, setStarLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const activeSet = useMemo(
    () => sets.find((setItem) => setItem._id === activeSetId) || sets[0] || null,
    [sets, activeSetId]
  );
  const currentCard = activeSet?.cards?.[currentIndex] || null;

  const updateSetInState = (updatedSet) => {
    if (!updatedSet?._id) return;
    setSets((prev) => prev.map((setItem) => (setItem._id === updatedSet._id ? updatedSet : setItem)));
  };

  useEffect(() => {
    const fetchSets = async () => {
      if (!documentId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getFlashcardsByDocumentId(documentId);
        const fetchedSets = Array.isArray(response?.data) ? response.data : [];
        setSets(fetchedSets);

        const querySetId = searchParams.get("setId");
        if (querySetId && fetchedSets.some((item) => item._id === querySetId)) {
          setActiveSetId(querySetId);
        } else {
          setActiveSetId(fetchedSets[0]?._id || "");
        }
      } catch (error) {
        toast.error(error?.details?.error || error?.message || "Failed to fetch flashcards.");
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, [documentId, searchParams]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [activeSetId]);

  const handleFlip = async () => {
    if (!currentCard) return;

    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    if (!isFlipped) {
      try {
        setReviewLoading(true);
        const response = await reviewFlashcardById(currentCard._id);
        updateSetInState(response?.data);
        toast.success("Flashcard reviewed!");
      } catch (error) {
        toast.error(error?.details?.error || error?.message || "Failed to update review.");
      } finally {
        setReviewLoading(false);
      }
    }
  };

  const handleToggleStar = async () => {
    if (!currentCard) return;

    try {
      setStarLoading(true);
      const response = await toggleFlashcardStarById(currentCard._id);
      updateSetInState(response?.data);
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to update star.");
    } finally {
      setStarLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!activeSet || !activeSet.cards?.length) {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        <Link
          to={`/documents/${documentId}`}
          className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-slate-700 transition hover:text-emerald-600"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Document
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          No flashcards found for this document.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 p-4 sm:p-6">
      <Link
        to={`/documents/${documentId}`}
        className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-slate-700 transition hover:text-emerald-600"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Document
      </Link>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Flashcards</h1>

      {sets.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {sets.map((setItem, idx) => (
            <button
              key={setItem._id}
              type="button"
              onClick={() => setActiveSetId(setItem._id)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                setItem._id === activeSet._id
                  ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Set {idx + 1}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-4xl">
        <FlashCard
          card={currentCard}
          flipped={isFlipped}
          onFlip={handleFlip}
          onToggleStar={handleToggleStar}
          starLoading={starLoading}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            setCurrentIndex((prev) => Math.max(0, prev - 1));
            setIsFlipped(false);
          }}
          disabled={currentIndex === 0 || reviewLoading}
          className="inline-flex h-11 sm:h-12 items-center gap-2 rounded-xl sm:rounded-2xl bg-slate-100 px-4 sm:px-6 text-sm sm:text-base font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        <div className="inline-flex h-11 sm:h-12 items-center rounded-xl sm:rounded-2xl border border-slate-300 px-4 sm:px-6 text-sm sm:text-base font-semibold text-slate-700">
          {currentIndex + 1} / {activeSet.cards.length}
        </div>

        <button
          type="button"
          onClick={() => {
            setCurrentIndex((prev) => Math.min(activeSet.cards.length - 1, prev + 1));
            setIsFlipped(false);
          }}
          disabled={currentIndex >= activeSet.cards.length - 1 || reviewLoading}
          className="inline-flex h-11 sm:h-12 items-center gap-2 rounded-xl sm:rounded-2xl bg-slate-100 px-4 sm:px-6 text-sm sm:text-base font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FlashCardPage;
