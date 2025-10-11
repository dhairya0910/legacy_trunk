import React from "react";
import { Pencil, Trash2, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import config from "../../config";

export default function Dashboard({ post, index, onEdit }) {
  const [showDialog, setShowDialog] = React.useState(false);
  const isLeft = index % 2 === 0;

  // Delete post function
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/delete/post/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Post deleted successfully");
        window.location.reload();
      }
    } catch (error) {
      alert("Failed to delete the post");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`flex ${isLeft ? "justify-start" : "justify-end"} mb-12`}
    >
      <div className="w-full md:w-5/12 relative">
        {/* Timeline Dot */}
        <div
          className={`absolute top-6 ${
            isLeft ? "-right-6" : "-left-6"
          } w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-4 border-white shadow-lg`}
        />

        {/* Post Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative bg-white/80 border border-gray-100 rounded-xl overflow-hidden backdrop-blur-sm hover:shadow-lg transition-all"
        >
          {/* Gradient Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-purple-50/40 opacity-0 hover:opacity-100 transition-opacity" />

          {/* Header Section */}
          <div className="relative p-5 border-b border-gray-100 flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {post.text}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(post.createdAt), "MMM dd, yyyy • hh:mm a")}
                </span>
              </div>
            </div>

            {/* Edit and Delete Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(post)}
                className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 transition"
                title="Edit Post"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDialog(true)}
                className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition"
                title="Delete Post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Post Description */}
          <div className="p-5">
            <p className="text-gray-700 leading-relaxed break-words">
              {post.description}
            </p>

            {/* Media Link */}
            {post?.media?.[0]?.url && (
              <a
                href={post.media[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-all"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">
                  View Attachment
                </span>
              </a>
            )}
          </div>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Post?
              </h3>
              <p className="text-sm text-gray-600">
                This action cannot be undone. This will permanently delete your
                post.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDialog(false)}
                  className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
