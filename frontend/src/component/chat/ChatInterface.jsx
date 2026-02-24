import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiService";
// import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRender.jsx";

const ChatInterface = () => {
  const { id: documentId } = useParams();
//   const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!documentId) {
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data || []);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  // Auto scroll on new message
  useEffect(() => {
    scrollToBottom();
  }, [history]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !documentId) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chat({
        documentId,
        question: userMessage.content,
      });

      const assistantMessage = {
        role: "assistant",
        content: response?.data?.answer || response?.answer || "No response received.",
        timestamp: new Date(),
        relevantChunks: response?.data?.relevantChunks || response?.relevantChunks || [],
      };

      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Render single message
  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-xl px-4 py-3 rounded-2xl text-sm shadow-sm ${
            isUser
              ? "bg-emerald-600 text-white"
              : "bg-white border border-slate-200 text-slate-800"
          }`}
        >
          {isUser ? (
            msg.content
          ) : (
            <MarkdownRenderer content={msg.content} />
          )}
        </div>
      </div>
    );
  };

  // Initial loading screen
  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-7 h-7 text-emerald-600" />
        </div>
        <Spinner />
        <p className="text-sm text-slate-500 mt-3 font-medium">
          Loading chat history...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-2xl border border-slate-200 shadow-sm">
      
      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-slate-50/50 via-white to-slate-50/30">
        
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-10 h-10 text-slate-400 mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">
              Start a conversation
            </h3>
            <p className="text-sm text-slate-500">
              Ask me anything about the document!
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        <div ref={messagesEndRef} />

        {loading && (
          <div className="flex items-center gap-2 mt-4 text-slate-500">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 p-4 bg-white">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
