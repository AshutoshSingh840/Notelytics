import React, { useEffect, useMemo, useState } from "react";
import Button from "../common/Button.jsx";
import Spinner from "../common/Spinner.jsx";
import { getQuizById, submitQuizAnswers } from "../../services/quizService.js";
import toast from "react-hot-toast";

const QuizAttemptModal = ({ quizId, open, onClose, onSubmitted }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = useMemo(
    () => quiz?.questions?.[currentIndex] || null,
    [quiz, currentIndex]
  );

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!open || !quizId) return;

      try {
        setLoading(true);
        const response = await getQuizById(quizId);
        const quizData = response?.data || null;
        setQuiz(quizData);
      } catch (error) {
        toast.error(error?.details?.error || error?.message || "Failed to load quiz.");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [open, quizId, onClose]);

  useEffect(() => {
    if (!open) {
      setQuiz(null);
      setAnswers({});
      setCurrentIndex(0);
      setLoading(false);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const totalQuestions = quiz?.questions?.length || 0;

  const handleSubmit = async () => {
    if (!quizId || totalQuestions === 0) return;

    const payload = Object.entries(answers).map(([questionIndex, selectedAnswer]) => ({
      questionIndex: Number(questionIndex),
      selectedAnswer,
    }));

    if (payload.length === 0) {
      toast.error("Please answer at least one question.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await submitQuizAnswers(quizId, payload);
      toast.success(`Quiz submitted. Score: ${response?.data?.score ?? 0}%`);
      onSubmitted();
      onClose();
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
      <div className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.24)]">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !quiz ? (
          <p className="py-8 text-center text-slate-500">Quiz not found.</p>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-slate-900">{quiz.title}</h3>
              <p className="mt-1 text-sm text-slate-500">
                Question {currentIndex + 1} of {totalQuestions}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-lg font-medium text-slate-900">{currentQuestion?.question}</p>

              <div className="mt-4 space-y-2">
                {(currentQuestion?.options || []).map((option) => {
                  const isSelected = answers[currentIndex] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentIndex]: option,
                        }))
                      }
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-700">
                Answered {Object.keys(answers).length} / {totalQuestions}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                  }
                  disabled={currentIndex >= totalQuestions - 1}
                >
                  Next
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizAttemptModal;
