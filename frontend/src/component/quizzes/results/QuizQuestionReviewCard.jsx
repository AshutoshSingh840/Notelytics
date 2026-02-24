import React from "react";
import { BookOpenText, CheckCircle2, XCircle } from "lucide-react";

const QuizQuestionReviewCard = ({ item, index }) => {
  const selectedAnswer = item?.selectedAnswer;
  const correctAnswer = item?.correctAnswer;
  const isCorrect = Boolean(item?.isCorrect);

  return (
    <article className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm sm:text-base font-semibold text-slate-700">
          Question {index + 1}
        </span>

        <div
          className={`rounded-2xl border px-3 py-2 ${
            isCorrect
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {isCorrect ? <CheckCircle2 className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
        </div>
      </div>

      <h4 className="mb-4 text-lg sm:text-xl font-semibold leading-snug text-slate-900">{item?.question}</h4>

      <div className="space-y-3">
        {(item?.options || []).map((option) => {
          const isSelected = selectedAnswer === option;
          const isOptionCorrect = correctAnswer === option;

          let optionClass = "border-slate-300 bg-white text-slate-800";
          let label = "";

          if (isOptionCorrect) {
            optionClass = "border-emerald-300 bg-emerald-100 text-emerald-900";
            label = "Correct";
          } else if (isSelected && !isOptionCorrect) {
            optionClass = "border-rose-300 bg-rose-100 text-rose-900";
            label = "Your answer";
          }

          return (
            <div
              key={option}
              className={`flex items-center justify-between rounded-xl sm:rounded-2xl border px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base ${optionClass}`}
            >
              <span>{option}</span>
              {label ? <span className="rounded-xl border px-3 py-1 text-sm font-semibold">{label}</span> : null}
            </div>
          );
        })}
      </div>

      {item?.explanation ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-700">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
              <BookOpenText className="h-5 w-5" />
            </span>
            <p className="text-lg font-semibold uppercase tracking-[0.08em]">Explanation</p>
          </div>
          <p className="text-sm sm:text-base leading-7 text-slate-700">{item.explanation}</p>
        </div>
      ) : null}
    </article>
  );
};

export default QuizQuestionReviewCard;
