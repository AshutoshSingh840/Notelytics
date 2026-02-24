import React, { useState } from "react";
import { BookOpenText, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";
import aiService from "../../services/aiService";
import AIActionHeader from "./AIActionHeader.jsx";
import AIActionCard from "./AIActionCard.jsx";
import AIResponsePanel from "./AIResponsePanel.jsx";

const AIActions = ({ documentId }) => {
  const [summary, setSummary] = useState("");
  const [concept, setConcept] = useState("");
  const [explanation, setExplanation] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);

  const handleGenerateSummary = async () => {
    if (!documentId) {
      toast.error("Missing document ID.");
      return;
    }

    try {
      setSummaryLoading(true);
      const response = await aiService.generateSummary({ documentId });
      const summaryText = response?.data?.summary || "";
      setSummary(summaryText);
      if (!summaryText) toast.error("Summary response was empty.");
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to generate summary.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleExplainConcept = async () => {
    if (!documentId) {
      toast.error("Missing document ID.");
      return;
    }

    if (!concept.trim()) {
      toast.error("Please enter a concept.");
      return;
    }

    try {
      setExplainLoading(true);
      const response = await aiService.explainConcept({
        documentId,
        concept: concept.trim(),
      });
      const explanationText = response?.data?.explanation || "";
      setExplanation(explanationText);
      if (!explanationText) toast.error("Explanation response was empty.");
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to explain concept.");
    } finally {
      setExplainLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <AIActionHeader />

      <div className="space-y-6 p-6">
        <AIActionCard
          icon={<BookOpenText className="h-6 w-6" />}
          title="Generate Summary"
          description="Get a concise summary of the entire document."
          actionLabel="Summarize"
          onAction={handleGenerateSummary}
          loading={summaryLoading}
        >
          <AIResponsePanel title="Summary" content={summary} />
        </AIActionCard>

        <AIActionCard
          icon={<Lightbulb className="h-6 w-6" />}
          title="Explain a Concept"
          description="Enter a topic or concept from the document to get a detailed explanation."
          showHeaderAction={false}
        >
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. 'React Hooks'"
              className="h-14 flex-1 rounded-2xl border border-slate-300 bg-white px-5 text-lg text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <button
              type="button"
              onClick={handleExplainConcept}
              disabled={explainLoading || !concept.trim()}
              className="h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.3)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {explainLoading ? "Working..." : "Explain"}
            </button>
          </div>

          <AIResponsePanel title="Explanation" content={explanation} />
        </AIActionCard>
      </div>
    </div>
  );
};

export default AIActions;
