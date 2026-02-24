import React, { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../component/common/Spinner";
import Button from "../../component/common/Button";
import DocumentCard from "../../component/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // Delete modal state
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // =============================
  // Fetch Documents
  // =============================
  const fetchDocuments = async () => {
    try {
      const response = await documentService.getDocuments();
      setDocuments(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to fetch documents.");
      console.error(error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // =============================
  // Upload Handlers
  // =============================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }

    setUploading(true);

    try {
      await documentService.uploadDocument({
        title: uploadTitle,
        file: uploadFile,
      });

      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      await fetchDocuments();
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // =============================
  // Delete Handlers
  // =============================
  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;

    setDeleting(true);

    try {
      await documentService.deleteDocumentById(selectedDoc._id);

      toast.success(`"${selectedDoc.title}" deleted.`);
      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== selectedDoc._id)
      );
      setSelectedDoc(null);
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  // =============================
  // Render Content
  // =============================
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
          <div className="flex justify-center mb-4">
            <FileText size={40} className="text-gray-300" />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Documents Yet
          </h3>

          <p className="text-gray-500 mb-6">
            Get started by uploading your first PDF document.
          </p>

          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Plus size={18} />
            Upload Document
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  // =============================
  // Component Return
  // =============================
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Documents
          </h1>
          <p className="text-gray-500">
            Manage and organize your learning materials
          </p>
        </div>

        {documents.length > 0 && (
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Plus size={18} />
            Upload Document
          </Button>
        )}
      </div>

      {renderContent()}

      {/* ================= Upload Modal ================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.24)]">
            <h2 className="mb-1 text-xl font-semibold text-slate-900">
              Upload Document
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              Add a PDF and give it a clear title for easy access later.
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operating Systems Notes"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
                  PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:border-emerald-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= Delete Modal ================= */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.24)]">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Delete Document
            </h3>

            <p className="mb-6 text-sm leading-6 text-slate-600">
              Are you sure you want to delete "
              <strong>{selectedDoc.title}</strong>"?
            </p>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <Button
                variant="secondary"
                onClick={() => setSelectedDoc(null)}
              >
                Cancel
              </Button>

              <Button
                variant="outline"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;
