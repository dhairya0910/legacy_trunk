import React, { useState, useEffect } from "react";
import { Plus, Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import PostDialog from "../Components/YourPost/PostDialog";
import Dashboard from "../Components/YourPost/Dashboard";

export default function YourPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);


  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    // simulate network delay
    setTimeout(() => {
      const storedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
      // sort by timestamp (descending)
      const sorted = storedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setPosts(sorted);
      setLoading(false);
    }, 600);
  };

  const handleSave = async (formData) => {
    const stored = JSON.parse(localStorage.getItem("posts") || "[]");

    if (editingPost) {
      const updated = stored.map((p) =>
        p.id === editingPost.id ? { ...p, ...formData } : p
      );
      localStorage.setItem("posts", JSON.stringify(updated));
    } else {
      const newPost = { id: Date.now().toString(), ...formData };
      localStorage.setItem("posts", JSON.stringify([...stored, newPost]));
    }

    setEditingPost(null);
    loadPosts();
  };

  const handleDelete = async (id) => {
    const stored = JSON.parse(localStorage.getItem("posts") || "[]");
    const updated = stored.filter((p) => p.id !== id);
    localStorage.setItem("posts", JSON.stringify(updated));
    loadPosts();
  };

  const openCreateDialog = () => {
    setEditingPost(null);
    setDialogOpen(true);
  };

  const openEditDialog = (post) => {
    setEditingPost(post);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-indigo-600" />
                Timeline
              </h1>
              <p className="text-gray-600 mt-2">
                Your journey, one post at a time
              </p>
            </div>
            <button
              onClick={openCreateDialog}
              className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Post
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-6xl mx-auto px-6 py-12 relative">
        {/* Vertical line in center */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-indigo-200 transform -translate-x-1/2 z-[-1]" />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <Sparkles className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Start Your Timeline
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first post to begin your journey
            </p>
            <button
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              Create First Post
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {posts.map((post, index) => (
              <Dashboard
                key={post.id}
                post={post}
                index={index}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Dialog */}
      <PostDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        post={editingPost}
        onSave={handleSave}
      />
    </div>
  );
}
