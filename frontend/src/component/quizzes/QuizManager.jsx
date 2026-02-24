import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EmptyState from "../common/EmptyState.jsx";
import QuizCard from "./QuizCard.jsx";
import GenerateQuizModal from "./GenerateQuizModal.jsx";
import QuizDeleteModal from "./QuizDeleteModal.jsx";
import Spinner from "../common/Spinner.jsx";
import aiService from "../../services/aiService.js";
import {
  deleteQuizById,
  getQuizzesByDocumentId,
} from "../../services/quizService.js";

const QuizManager = ({ documentId }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchQuizzes = async () => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    try {
      const response = await getQuizzesByDocumentId(documentId);
      setQuizzes(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to fetch quizzes.");
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [documentId]);

  const handleGenerateQuiz = async ({ title, numQuestions }) => {
    try {
      setGenerating(true);
      const response = await aiService.generateQuiz({
        documentId,
        numQuestions,
        ...(title ? { title } : {}),
      });

      const newQuiz = response?.data;
      if (!newQuiz?._id) {
        toast.error("Invalid quiz generation response.");
        return;
      }

      setQuizzes((prev) => [newQuiz, ...prev]);
      setGenerateOpen(false);
      toast.success("Quiz generated successfully.");
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to generate quiz.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!deleteTarget?._id) return;

    try {
      setDeleting(true);
      await deleteQuizById(deleteTarget._id);
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("Quiz deleted.");
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to delete quiz.");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewResults = (quiz) => {
    if (!quiz?._id) return;
    navigate(`/quizzes/${quiz._id}/results?documentId=${documentId}`);
  };

  const handleStartQuiz = (quiz) => {
    if (!quiz?._id) return;
    navigate(`/quizzes/${quiz._id}/attempt?documentId=${documentId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900">Your Quizzes</h3>
          <p className="mt-1 text-slate-500">
            {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"} available
          </p>
        </div>

        <button
          type="button"
          onClick={() => setGenerateOpen(true)}
          className="inline-flex h-11 sm:h-12 items-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 sm:px-6 text-sm sm:text-base font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.3)] transition hover:opacity-95"
        >
          <Plus className="h-5 w-5 text-emerald-100" />
          Generate Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <EmptyState
          title="No Quizzes Yet"
          description="Generate your first quiz from this document to start practicing."
          buttonText="Generate Quiz"
          onActionClick={() => setGenerateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onDelete={setDeleteTarget}
              onStartQuiz={handleStartQuiz}
              onViewResults={handleViewResults}
            />
          ))}
        </div>
      )}

      <GenerateQuizModal
        open={generateOpen}
        loading={generating}
        onClose={() => setGenerateOpen(false)}
        onGenerate={handleGenerateQuiz}
      />

      <QuizDeleteModal
        open={Boolean(deleteTarget)}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteQuiz}
      />
    </div>
  );
};

export default QuizManager;
