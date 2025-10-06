import React, { useState, useEffect } from "react";
import { Upload, Loader2, X, FileText } from "lucide-react";

/**
 * Mock file upload function (simulates uploading delay)
 */
const mockUploadFile = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ file_url: URL.createObjectURL(file) }); // simulate uploaded file URL
    }, 1500);
  });
};

export default function PostDialog({ open, onOpenChange, post, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
    timestamp: new Date().toISOString().slice(0, 16),
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        description: post.description || "",
        file_url: post.file_url || "",
        timestamp: post.timestamp
          ? new Date(post.timestamp).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      });
      if (post.file_url) {
        setFileName(post.file_url.split("/").pop());
      }
    } else {
      setFormData({
        title: "",
        description: "",
        file_url: "",
        timestamp: new Date().toISOString().slice(0, 16),
      });
      setFileName("");
    }
  }, [post, open]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await mockUploadFile(file);
      setFormData((prev) => ({ ...prev, file_url }));
      setFileName(file.name);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onOpenChange(false);
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file_url: "" }));
    setFileName("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      {/* Main Dialog */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative text-black">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {post ? "Edit Post" : "Create New Post"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-900"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter post title"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-900"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Share your thoughts..."
              rows={4}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 resize-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            />
          </div>

          {/* Timestamp */}
          <div className="space-y-1">
            <label
              htmlFor="timestamp"
              className="text-sm font-medium text-gray-900"
            >
              Timestamp
            </label>
            <input
              id="timestamp"
              type="datetime-local"
              value={formData.timestamp}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  timestamp: e.target.value,
                }))
              }
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Attachment
            </label>

            {!formData.file_url ? (
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                      <span className="text-sm text-gray-700">
                        Uploading...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Click to upload file
                      </span>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-gray-800 truncate max-w-xs">
                    {fileName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-gray-600 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                  Saving...
                </>
              ) : post ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
