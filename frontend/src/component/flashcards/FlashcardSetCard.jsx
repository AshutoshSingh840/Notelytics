import React from "react";
import { BrainCircuit, Trash2 } from "lucide-react";

const FlashcardSetCard = ({ setItem, onOpen, onDelete }) => {
  const createdAt = setItem?.createdAt
    ? new Date(setItem.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown date";

  return (
    <article
      onClick={() => onOpen(setItem)}
      className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_12px_26px_rgba(15,23,42,0.1)]"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <BrainCircuit className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-3xl font-semibold text-slate-900 group-hover:text-emerald-600">
              Flashcard Set
            </h3>
            <p className="mt-1 text-sm uppercase tracking-[0.08em] text-slate-500">
              Created {createdAt}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(setItem);
          }}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
          aria-label="Delete flashcard set"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <span className="inline-flex rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xl font-semibold text-emerald-700">
          {setItem.cards?.length || 0} cards
        </span>
      </div>
    </article>
  );
};

export default FlashcardSetCard;
