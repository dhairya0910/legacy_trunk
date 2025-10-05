import React from "react";
import { Pencil, Trash2, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Dashboard({ post, index, onEdit, onDelete }) {
  const isLeft = index % 2 === 0;
  const [showDialog, setShowDialog] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex ${isLeft ? "justify-start" : "justify-end"} mb-12`}
    >
      <div className="w-full md:w-5/12 relative">
        {/* Timeline dot */}
        <div
          className={`absolute top-6 ${
            isLeft ? "-right-6" : "-left-6"
          } w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full border-4 border-white shadow-lg z-10`}
        />

        <div className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Header */}
          <div className="relative p-4 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(post.timestamp), "MMM dd, yyyy • hh:mm a")}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(post)}
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDialog(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <p className="text-gray-700 leading-relaxed">
              {post.description}
            </p>

            {post.file_url && (
              <a
                href={post.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg hover:border-indigo-200 transition-all group"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700 group-hover:text-indigo-800">
                  View Attachment
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full space-y-4">
              <h3 className="text-lg font-semibold">Delete Post?</h3>
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
                  onClick={() => {
                    onDelete(post.id);
                    setShowDialog(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
