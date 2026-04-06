

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../component/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { BASE_URL } from "../../utils/aiPath.js";
import PageHeader from '../../component/common/PageHeader';
import Tabs from '../../component/common/Tabs';
import ChatInterface from "../../component/chat/ChatInterface";
import AIActions from "../../component/ai/AIActions.jsx";
import FlashCardManager from "../../component/flashcards/FlashCardManager.jsx";
import QuizManager from "../../component/quizzes/QuizManager.jsx";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

const DocumentDetailPage = () => {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch document details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  // Helper to generate full PDF URL
  const getPdfUrl = () => {
    const rawFilePath = document?.data?.filePath;
    if (!rawFilePath) return null;

    const filePath = String(rawFilePath).trim();
    if (!filePath) return null;

    const joinBaseWithPath = (base, path) => {
      const normalizedBase = String(base || "").replace(/\/+$/, "");
      const normalizedPath = String(path || "").replace(/^\/+/, "");
      if (!normalizedBase || !normalizedPath) return null;
      return `${normalizedBase}/${normalizedPath}`;
    };

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      try {
        const storedUrl = new URL(filePath);
        const configuredApiUrl = new URL(BASE_URL);

        // Backward compatibility: old records may store localhost links.
        // If API base differs, point to the active API host while keeping path.
        if (
          LOCAL_HOSTS.has(storedUrl.hostname) &&
          configuredApiUrl.origin !== storedUrl.origin
        ) {
          return `${configuredApiUrl.origin}${storedUrl.pathname}${storedUrl.search}${storedUrl.hash}`;
        }
      } catch (_) {
        return filePath;
      }

      return filePath;
    }

    return joinBaseWithPath(BASE_URL, filePath);
  };

  /* ---------------------- TAB RENDER FUNCTIONS ---------------------- */

  const renderContent = () => {
    const pdfUrl = getPdfUrl();

    if (!pdfUrl) {
      return (
        <div className="text-center py-10 text-gray-500">
          PDF not available.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Viewer Header */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">
            Document Viewer
          </span>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-emerald-600 hover:underline"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>

        {/* PDF Iframe */}
        <div className="border rounded-lg overflow-hidden h-[75vh] bg-white">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className="w-full h-full"
            frameBorder="0"
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return (
    <ChatInterface />
    );
  };

  const renderAIActions = () => {
    return (
      <AIActions documentId={id} />
    );
  };

  const renderFlashcardsTab = () => {
    return (
      <FlashCardManager documentId={id} />
    );
  };

  const renderQuizzesTab = () => {
    return (
      <QuizManager documentId={id} />
    );
  };

  /* ---------------------- LOADING + ERROR ---------------------- */

  if (loading) return <Spinner />;

  if (!document) {
    return (
      <div className="text-center p-8">
        Document not found.
      </div>
    );
  }

  /* ---------------------- TABS CONFIG ---------------------- */

  const tabs = [
    { name: "Content", render: renderContent },
    { name: "Chat", render: renderChat },
    { name: "AI Actions", render: renderAIActions },
    { name: "Flashcards", render: renderFlashcardsTab },
    { name: "Quizzes", render: renderQuizzesTab },
  ];

  const activeTabContent =
    tabs.find((tab) => tab.name === activeTab)?.render();

  /* ---------------------- MAIN RETURN ---------------------- */

  return (
    <div className="p-6 space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {document.data?.title}
        </h1>
      </div>

      {/* Tabs */}
      <div className="border-b flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === tab.name
                ? "border-b-2 border-emerald-500 text-emerald-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>{activeTabContent}</div>
    </div>
  );
};

export default DocumentDetailPage;
