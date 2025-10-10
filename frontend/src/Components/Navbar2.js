import React, { useState, useEffect } from "react";
import { User, LogOut, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
export default function Navbar2() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigator = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  //load dummy data
  const loadUser = async () => {
    try {
      const dummyUser = {
        full_name: "John Doe",
        email: "johndoe@example.com",
        avatar_url: "https://i.pravatar.cc/150?img=3", // random avatar
      };
      setUser(dummyUser);
    } catch (error) {
      console.log("Failed to load user");
    }
  };
  const viewStories = ()=>{
    navigator("/user/view-stories")

  }
  const viewPosts = ()=>{
    navigator("/posts")

  }
  const inviteMember = ()=>{
    navigator("/invite")

  }
  const viewRequests = ()=>{
    navigator("/requests")

  }

  const handleLogout = async () => {
    const res = await fetch("http://localhost:3128/logout", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (res.ok) {
          console.log(data);
          navigator('/')
        }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-emerald-50/90 via-green-50/90 to-teal-50/90 border-b border-emerald-100/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Ghraondha
            </h1>
          </motion.div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-white/50 transition-all duration-200"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-md">
                  <UserCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-emerald-50 to-green-50">
                    <p className="font-semibold text-gray-800">
                      {user?.full_name || "Guest"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user?.email || ""}
                    </p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 block">View Profile</span><br />
                 
                    </button>
                    <button
                        onClick={viewStories}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 block">Your Stories</span><br />
                 
                    </button>
                    <button
                        onClick={viewPosts}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 block">Your Posts</span><br />
                 
                    </button>
                    <button
                        onClick={viewRequests}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 block">View Family Requests</span><br />
                 
                    </button>
                    <button
                        onClick={inviteMember}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 block">Invite a member</span><br />
                 
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 transition-colors duration-200 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
