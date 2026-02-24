import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../component/common/Spinner.jsx";
import { getQuizResults } from "../../services/quizService.js";
import QuizScoreSummary from "../../component/quizzes/results/QuizScoreSummary.jsx";
import QuizQuestionReviewCard from "../../component/quizzes/results/QuizQuestionReviewCard.jsx";

const QuizResultsPage = () => {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!quizId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getQuizResults(quizId);
        setResultData(response?.data || null);
      } catch (error) {
        toast.error(error?.details?.error || error?.message || "Failed to fetch quiz results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  const quiz = resultData?.quiz || {};
  const results = resultData?.results || [];

  const correctCount = useMemo(
    () => results.filter((item) => item.isCorrect).length,
    [results]
  );
  const totalQuestions = quiz?.totalQuestions || results.length;
  const incorrectCount = Math.max(totalQuestions - correctCount, 0);
  const documentIdFromQuery = searchParams.get("documentId");
  const documentIdFromResult =
    typeof quiz?.document === "object" ? quiz?.document?._id : quiz?.document;
  const backDocumentId = documentIdFromQuery || documentIdFromResult || "";
  const backHref = backDocumentId ? `/documents/${backDocumentId}` : "/documents";
  const documentTitle =
    typeof quiz?.document === "object" ? quiz?.document?.title : "Document";

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Quiz results not found.
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 p-4 sm:p-6">
      <Link
        to={backHref}
        className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-slate-700 transition hover:text-emerald-600"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Document
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          {documentTitle || "Quiz"} - Quiz Results
        </h1>
      </div>

      <QuizScoreSummary
        score={quiz?.score || 0}
        total={totalQuestions}
        correct={correctCount}
        incorrect={incorrectCount}
      />

      <section>
        <div className="mb-4 flex items-center gap-2 text-slate-900">
          <BookOpen className="h-6 w-6" />
          <h2 className="text-xl sm:text-2xl font-semibold">Detailed Review</h2>
        </div>

        <div className="space-y-5">
          {results.map((item, index) => (
            <QuizQuestionReviewCard key={item.questionIndex ?? index} item={item} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default QuizResultsPage;
