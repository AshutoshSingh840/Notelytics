import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CircleCheckBig } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../component/common/Spinner.jsx";
import { getQuizById, submitQuizAnswers } from "../../services/quizService.js";

const QuizAttemptPage = () => {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const documentId = searchParams.get("documentId");
  const totalQuestions = quiz?.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;
  const currentQuestion = useMemo(
    () => quiz?.questions?.[currentIndex] || null,
    [quiz, currentIndex]
  );

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getQuizById(quizId);
        const quizData = response?.data || null;
        setQuiz(quizData);

        if (quizData?.completedAt) {
          toast("This quiz is already completed. Opening results.", { icon: "ℹ️" });
          navigate(`/quizzes/${quizId}/results?documentId=${documentId || ""}`);
        }
      } catch (error) {
        toast.error(error?.details?.error || error?.message || "Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, navigate, documentId]);

  const handleSelectOption = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
  };

  const handleSubmit = async () => {
    if (!quizId) return;

    if (answeredCount === 0) {
      toast.error("Please answer at least one question.");
      return;
    }

    const payload = Object.entries(answers).map(([questionIndex, selectedAnswer]) => ({
      questionIndex: Number(questionIndex),
      selectedAnswer,
    }));

    try {
      setSubmitting(true);
      const response = await submitQuizAnswers(quizId, payload);
      toast.success(`Quiz submitted. Score: ${response?.data?.score ?? 0}%`);
      navigate(`/quizzes/${quizId}/results?documentId=${documentId || ""}`);
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Quiz not found.
      </div>
    );
  }

  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const selectedOption = answers[currentIndex];

  return (
    <div className="space-y-5 sm:space-y-6 p-4 sm:p-6">
      <Link
        to={documentId ? `/documents/${documentId}` : "/documents"}
        className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-slate-700 transition hover:text-emerald-600"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to Document
      </Link>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">{quiz.title}</h1>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-base sm:text-lg font-semibold text-slate-800">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
          <p className="text-base sm:text-lg text-slate-600">{answeredCount} answered</p>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <span className="inline-flex rounded-xl sm:rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm sm:text-base font-semibold text-emerald-700">
          Question {currentIndex + 1}
        </span>

        <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-semibold text-slate-900">{currentQuestion?.question}</h2>

        <div className="mt-5 space-y-3">
          {(currentQuestion?.options || []).map((option) => {
            const isSelected = selectedOption === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`flex w-full items-center justify-between rounded-xl sm:rounded-2xl border px-4 sm:px-5 py-3.5 sm:py-4 text-left text-base sm:text-lg transition ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                    : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span className="inline-flex items-center gap-3">
                  <span
                    className={`h-8 w-8 rounded-full border-2 ${
                      isSelected ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                    }`}
                  />
                  {option}
                </span>

                {isSelected ? <CircleCheckBig className="h-7 w-7 text-emerald-600" /> : null}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="inline-flex h-11 sm:h-12 items-center gap-2 rounded-xl sm:rounded-2xl bg-slate-100 px-4 sm:px-6 text-sm sm:text-base font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const isAnswered = answers[idx] !== undefined;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-10 sm:h-11 min-w-10 sm:min-w-11 rounded-xl px-3 sm:px-4 text-sm sm:text-base font-semibold transition ${
                  isCurrent
                    ? "bg-emerald-500 text-white"
                    : isAnswered
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {currentIndex < totalQuestions - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            className="inline-flex h-11 sm:h-12 items-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 sm:px-7 text-sm sm:text-base font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.3)] transition hover:opacity-95"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex h-11 sm:h-12 items-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 sm:px-7 text-sm sm:text-base font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.3)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizAttemptPage;
