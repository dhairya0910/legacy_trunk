
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Users } from "lucide-react";
// Removed entity and integration imports for self-contained dummy data

export default function UploadStoryDialog({ isOpen, onClose, onSuccess, familyMembers }) {
  const [formData, setFormData] = useState({
    title: "",
    selectedContacts: []
  });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Removed useEffect for loading family members as they are now passed as a prop

  const handleContactToggle = (memberId) => {
    setFormData(prev => ({
      ...prev,
      selectedContacts: prev.selectedContacts.includes(memberId)
        ? prev.selectedContacts.filter(id => id !== memberId)
        : [...prev.selectedContacts, memberId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate image upload result
      const image_url = file
        ? "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400"
        : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400"; // Dummy URL, required for story

      const selectedNames = familyMembers
        .filter(m => formData.selectedContacts.includes(m.id))
        .map(m => m.name)
        .join(", ");

      const newStory = {
        id: Math.random().toString(36).substring(2, 9), // Generate a dummy ID
        title: formData.title,
        description: `Shared with: ${selectedNames || "Everyone"}`,
        image_url,
        memory_type: "story",
        upload_date: new Date().toISOString()
      };

      // Call onSuccess with the new story object
      onSuccess(newStory);
      handleClose();
    } catch (error) {
      console.error("Error uploading story (simulated):", error);
      // Optionally, add an error state or notification
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      selectedContacts: []
    });
    setFile(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-lime-50 to-emerald-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Upload Story</h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/50 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-6">
                  {/* Upload Photo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-lime-600" />
                      Upload Photo *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-lime-400 transition-all bg-gradient-to-br from-lime-50/50 to-emerald-50/50">
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100 cursor-pointer"
                      />
                      {file && (
                        <div className="mt-4">
                          <p className="text-sm text-lime-600 font-medium">
                            Selected: {file.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Story Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="What's your story about?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Contact Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-lime-600" />
                      Share with Contacts
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Select family members who can see this story
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-xl p-4">
                      {familyMembers.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No family members available.</p>
                      ) : (
                        familyMembers.map((member) => (
                          <label
                            key={member.id}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-lime-50 hover:to-emerald-50 cursor-pointer transition-all group"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedContacts.includes(member.id)}
                              onChange={() => handleContactToggle(member.id)}
                              className="w-5 h-5 text-lime-600 border-gray-300 rounded focus:ring-lime-500 cursor-pointer"
                            />
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold text-sm">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 group-hover:text-lime-600 transition-colors">
                                {member.name}
                              </p>
                              <p className="text-sm text-gray-500">{member.status || "Available"}</p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                    {formData.selectedContacts.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        No contacts selected - story will be visible to everyone
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-lime-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : "Upload Story"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
