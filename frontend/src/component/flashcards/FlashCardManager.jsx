import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import toast from "react-hot-toast";
import FlashCard from "./FlashCard.jsx";
import FlashcardSetCard from "./FlashcardSetCard.jsx";
import FlashcardDeleteModal from "./FlashcardDeleteModal.jsx";
import aiService from "../../services/aiService.js";
import {
  deleteFlashcardSetById,
  getFlashcardsByDocumentId,
  reviewFlashcardById,
  toggleFlashcardStarById,
} from "../../services/flashcardService.js";
import Spinner from "../common/Spinner.jsx";

const FlashCardManager = ({ documentId }) => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeSet, setActiveSet] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [starLoading, setStarLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const currentCard = useMemo(
    () => activeSet?.cards?.[currentIndex] || null,
    [activeSet, currentIndex]
  );

  const fetchSets = async () => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    try {
      const response = await getFlashcardsByDocumentId(documentId);
      const fetchedSets = Array.isArray(response?.data) ? response.data : [];
      setSets(fetchedSets);
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Unable to fetch flashcards.");
      setSets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, [documentId]);

  const updateSetInState = (updatedSet) => {
    if (!updatedSet?._id) return;
    setSets((prev) => prev.map((s) => (s._id === updatedSet._id ? updatedSet : s)));
    setActiveSet((prev) => (prev?._id === updatedSet._id ? updatedSet : prev));
  };

  const handleGenerateSet = async () => {
    if (!documentId) return;

    try {
      setGenerating(true);
      const response = await aiService.generateFlashcards({
        documentId,
        count: 10,
      });

      const newSet = response?.data;
      if (!newSet?._id) {
        toast.error("Invalid flashcard generation response.");
        return;
      }

      setSets((prev) => [newSet, ...prev]);
      setActiveSet(newSet);
      setCurrentIndex(0);
      setIsFlipped(false);
      toast.success("Flashcard set generated.");
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenSet = (setItem) => {
    setActiveSet(setItem);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleBackToSets = () => {
    setActiveSet(null);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleFlip = async () => {
    if (!currentCard) return;

    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    // Count review only when revealing answer side.
    if (!isFlipped) {
      try {
        setReviewLoading(true);
        const response = await reviewFlashcardById(currentCard._id);
        updateSetInState(response?.data);
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

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (!activeSet?.cards?.length) return;
    setCurrentIndex((prev) => Math.min(activeSet.cards.length - 1, prev + 1));
    setIsFlipped(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?._id) return;

    try {
      setDeleting(true);
      await deleteFlashcardSetById(deleteTarget._id);

      setSets((prev) => prev.filter((setItem) => setItem._id !== deleteTarget._id));
      if (activeSet?._id === deleteTarget._id) {
        handleBackToSets();
      }
      setDeleteTarget(null);
      toast.success("Flashcard set deleted.");
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-14">
        <Spinner />
      </div>
    );
  }

  if (!activeSet) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900">Your Flashcard Sets</h3>
            <p className="mt-1 text-slate-500">
              {sets.length} {sets.length === 1 ? "set" : "sets"} available
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateSet}
            disabled={generating}
            className="inline-flex h-12 sm:h-14 items-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 sm:px-7 text-sm sm:text-base font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.3)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-65"
          >
            <Plus className="h-5 w-5" />
            {generating ? "Generating..." : "Generate New Set"}
          </button>
        </div>

        {sets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-lg text-slate-600">No flashcard sets yet for this document.</p>
            <p className="mt-2 text-sm text-slate-500">Generate your first set to start studying.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {sets.map((setItem) => (
              <FlashcardSetCard
                key={setItem._id}
                setItem={setItem}
                onOpen={handleOpenSet}
                onDelete={(item) => setDeleteTarget(item)}
              />
            ))}
          </div>
        )}

        <FlashcardDeleteModal
          open={Boolean(deleteTarget)}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
      <button
        type="button"
        onClick={handleBackToSets}
        className="mb-6 inline-flex items-center gap-2 text-sm sm:text-base font-medium text-slate-700 transition hover:text-emerald-600"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Sets
      </button>

      <FlashCard
        card={currentCard}
        flipped={isFlipped}
        onFlip={handleFlip}
        onToggleStar={handleToggleStar}
        starLoading={starLoading}
      />

      <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0 || reviewLoading}
          className="inline-flex h-11 sm:h-12 items-center gap-2 rounded-xl sm:rounded-2xl bg-slate-100 px-4 sm:px-6 text-sm sm:text-base font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        <div className="inline-flex h-11 sm:h-12 items-center rounded-xl sm:rounded-2xl border border-slate-300 px-4 sm:px-6 text-sm sm:text-base font-semibold text-slate-700">
          {currentIndex + 1} / {activeSet.cards?.length || 0}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={
            !activeSet.cards?.length ||
            currentIndex >= activeSet.cards.length - 1 ||
            reviewLoading
          }
          className="inline-flex h-11 sm:h-12 items-center gap-2 rounded-xl sm:rounded-2xl bg-slate-100 px-4 sm:px-6 text-sm sm:text-base font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <FlashcardDeleteModal
        open={Boolean(deleteTarget)}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default FlashCardManager;
