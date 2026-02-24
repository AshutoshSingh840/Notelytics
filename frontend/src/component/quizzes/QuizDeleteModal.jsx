import React from "react";
import Button from "../common/Button.jsx";

const QuizDeleteModal = ({ open, deleting = false, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.24)]">
        <h3 className="mb-2 text-lg font-semibold text-slate-900">Delete Quiz</h3>
        <p className="mb-6 text-sm leading-6 text-slate-600">
          Are you sure you want to delete this quiz? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="outline" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizDeleteModal;
