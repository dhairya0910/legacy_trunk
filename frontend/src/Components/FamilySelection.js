import React, { useState } from "react";
import { Plus, Key, Sparkles } from "lucide-react";
import config from "../config";
import { useNavigate } from "react-router-dom";

export default function FamilySelection() {
  // State management for dialogs, loading, and form inputs
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [family_id, setfamily_id] = useState("");
  const [family_name, setFamily_name] = useState("");
  const [family_username, setfamily_username] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const navigator = useNavigate();

  // Generate a unique 8-character family key
  const generatefamily_id = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 8; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 3) key += "-";
    }
    return key;
  };

  // Open create dialog with a pre-generated key
  const handleCreateDialogOpen = () => {
    setGeneratedKey(generatefamily_id());
    setShowCreateDialog(true);
  };

  // Handle Join Family form submission → POST /api/family/join
  const handleJoinFamily = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${config.BACKEND_URL}/join-family/send-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ family_id, family_username }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setShowJoinDialog(false);
        setfamily_id("");
        setfamily_username("");
        alert(` ${data.message || "Unable to join family"}`);

      } else {
        alert(` ${data.message || "Unable to join family"}`);
      }
    } catch {
      alert(" Network or server error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Create Family form submission → POST /api/family/create
  const handleCreateFamily = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${config.BACKEND_URL}/create-family`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          family_name,
          family_username,
          family_id: generatedKey,
        }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        alert(`Family "${data.family_name || family_name}" created!`);
        setShowCreateDialog(false);
        setFamily_name("");
        setfamily_username("");
      } else {
        alert(`${data.message || "Unable to create family"}`);
      }
      navigator(`${data.route}`); // Redirect to the specified route
    } catch {
      alert("Network or server error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-400 to-purple-500 flex items-center justify-center p-4 text-gray-900">
      <div className="w-full max-w-4xl">
        {/* Header section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Welcome</h1>
          <p className="text-lg text-gray-200">
            Join your family or create a new one to get started.
          </p>
        </div>

        {/* Action cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Join Family Card */}
          <div
            onClick={() => setShowJoinDialog(true)}
            className="cursor-pointer bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Join a Family
            </h2>
            <p className="text-gray-700 mb-6">
              Already have a family key? Join your family now and connect with
              your loved ones.
            </p>
            <div className="flex items-center text-blue-600 font-semibold gap-2">
              Enter Family Key →
            </div>
          </div>

          {/* Create Family Card */}
          <div
            onClick={handleCreateDialogOpen}
            className="cursor-pointer bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Create a Family
            </h2>
            <p className="text-gray-700 mb-6">
              Start a new family and become the leader. Invite others to join
              your circle.
            </p>
            <div className="flex items-center text-purple-600 font-semibold gap-2">
              Get Started →
            </div>
          </div>
        </div>

        {/* Join Dialog Modal */}
        {showJoinDialog && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-600">
                <Key className="w-6 h-6" /> Join Family
              </h2>
              <form onSubmit={handleJoinFamily} className="space-y-4">
                <input
                  className="w-full border rounded-lg p-3"
                  placeholder="Enter Family Key"
                  value={family_id}
                  onChange={(e) => setfamily_id(e.target.value)}
                  
                />
                <div className="or w-full text-center p-4 text-gray-600 font-bold">OR</div>
                <input
                  className="w-full border rounded-lg p-3"
                  placeholder="Enter admin account"
                  value={family_username}
                  onChange={(e) => setfamily_username(e.target.value)}
                  
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  {isSubmitting ? "Please wait..." : "Join"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJoinDialog(false)}
                  className="w-full border py-3 rounded-lg mt-2"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Create Dialog Modal */}
        {showCreateDialog && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-600">
                <Sparkles className="w-6 h-6" /> Create Family
              </h2>
              <form onSubmit={handleCreateFamily} className="space-y-4">
                <input
                  className="w-full border rounded-lg p-3"
                  placeholder="Family Name"
                  value={family_name}
                  onChange={(e) => setFamily_name(e.target.value)}
                  required
                />
                <input
                  className="w-full border rounded-lg p-3"
                  placeholder="Family family_username"
                  value={family_username}
                  onChange={(e) => setfamily_username(e.target.value)}
                  required
                />
                <div className="flex items-center justify-between border rounded-lg p-3 bg-purple-50">
                  <span className="font-mono text-purple-700 font-bold">
                    {generatedKey}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGeneratedKey(generatefamily_id())}
                    className="text-purple-600 font-semibold"
                  >
                    Refresh
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
                >
                  {isSubmitting ? "Creating..." : "Create Family"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateDialog(false)}
                  className="w-full border py-3 rounded-lg mt-2"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
