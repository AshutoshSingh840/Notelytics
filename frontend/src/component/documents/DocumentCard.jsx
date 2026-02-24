import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100/40 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600 shadow-sm">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-800 transition group-hover:text-emerald-600">
              {document.title}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {formatFileSize(document.fileSize)}
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          aria-label="Delete document"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
        <div className="rounded-lg bg-slate-50 px-2 py-1.5">
          <div className="mb-1 flex items-center gap-1 text-slate-500">
            <BookOpen size={13} />
          </div>
          <span>{document.flashcardCount || 0} Flashcards</span>
        </div>

        <div className="rounded-lg bg-slate-50 px-2 py-1.5">
          <div className="mb-1 flex items-center gap-1 text-slate-500">
            <BrainCircuit size={13} />
          </div>
          <span>{document.quizCount || 0} Quizzes</span>
        </div>

        <div className="rounded-lg bg-slate-50 px-2 py-1.5">
          <div className="mb-1 flex items-center gap-1 text-slate-500">
            <Clock size={13} />
          </div>
          <span>
            {document.uploadDate || document.createdAt
              ? moment(document.uploadDate || document.createdAt).fromNow()
              : "Recently"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
