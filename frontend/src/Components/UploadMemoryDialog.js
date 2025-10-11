import React, { useState, useEffect } from "react";
import { Upload, Loader2, X, FileText } from "lucide-react";
import config from "../config"; // ✅ backend base URL

export default function PostDialog({ open, onOpenChange, post, onSave }) {
  const [formData, setFormData] = useState({
    text: "",
    description: "",
    file: "",
    timestamp: new Date().toISOString().slice(0, 16),
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState("");

  // ✅ Prefill form when editing
  useEffect(() => {
    if (post) {
      setFormData({
        text: post.text || "",
        description: post.description || "",
        file: post.file || "",
        timestamp: post.timestamp
          ? new Date(post.timestamp).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      });
      if (post.file) setFileName(post.file.split("/").pop());
    } else {
      setFormData({
        text: "",
        description: "",
        file: "",
        timestamp: new Date().toISOString().slice(0, 16),
      });
      setFileName("");
    }
  }, [post, open]);

  /**
   * ✅ Upload file to backend (/add-media)
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileForm = new FormData();
      fileForm.append("files", file);

      const res = await fetch(`${config.BACKEND_URL}/add-media`, {
        method: "POST",
        body: fileForm,
        credentials: "include",
      });

      const result = await res.json();
      if (res.ok && result.media) {
        setFormData((prev) => ({ ...prev, file: result.media }));
        setFileName(file.name);
      } else {
        console.error("Upload failed:", result);
        alert("Failed to upload file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error while uploading file");
    } finally {
      setUploading(false);
    }
  };

  /**
   * ✅ Send post modifications to backend
   */
  const sendModifiedPost = async (modifiedData) => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/add-modified-media`, {
        method: "POST",
        body: JSON.stringify({ modifiedData }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Modified Successfully!!");
        console.log("Saved successfully", data);
      }
    } catch (error) {
      console.error("User verification failed:", error.message);
    }
  };

  /**
   * ✅ Submit handler
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await sendModifiedPost(formData);
    await onSave(formData);
    setSaving(false);
    onOpenChange(false);
  };

  // ✅ Remove uploaded file
  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: "" }));
    setFileName("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
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
          {/* Text Field */}
          <div>
            <label className="text-sm font-medium text-gray-900">Text</label>
            <input
              type="text"
              value={formData.text}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, text: e.target.value }))
              }
              placeholder="Enter post text"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-900">
              Description
            </label>
            <textarea
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            />
          </div>

          {/* Timestamp */}
          <div>
            <label className="text-sm font-medium text-gray-900">
              Timestamp
            </label>
            <input
              type="datetime-local"
              value={formData.timestamp}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  timestamp: e.target.value,
                }))
              }
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            />
          </div>

          {/* ✅ File Upload */}
          <div>
            <label className="text-sm font-medium text-gray-900">
              Attachment
            </label>

            {!formData.file ? (
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
