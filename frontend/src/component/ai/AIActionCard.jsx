import React from "react";

const AIActionCard = ({
  icon,
  title,
  description,
  children,
  actionLabel,
  onAction,
  loading = false,
  disabled = false,
  showHeaderAction = true,
}) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
            {icon}
          </div>
          <h3 className="text-3xl font-semibold text-slate-900">{title}</h3>
        </div>

        {showHeaderAction && (
          <button
            type="button"
            onClick={onAction}
            disabled={loading || disabled}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.3)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Working..." : actionLabel}
          </button>
        )}
      </div>

      <p className="mb-4 text-xl leading-8 text-slate-600">{description}</p>
      {children}
    </section>
  );
};

export default AIActionCard;
