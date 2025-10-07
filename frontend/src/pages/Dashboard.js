
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, BookOpen, Menu } from "lucide-react";

import Navbar2 from "../Components/Navbar2";
import FamilyContactsSidebar from "../Components/FamilyContactsSidebar";
import TimelineCard from "../Components/TimelineCard";
import ChatOverlay from "../Components/ChatOverlay";
import UploadMemoryDialog from "../Components/UploadMemoryDialog";
import UploadStoryDialog from "../Components/UploadStoryDialog";
import { Helmet } from "react-helmet";

const dummyMembers = [
  { id: 1, name: "Grandma Lakshmi", status: "Just returned from morning walk", last_seen: "2 minutes ago" },
  { id: 2, name: "Papa (Rajesh)", status: "At the office", last_seen: "5 minutes ago" },
  { id: 3, name: "Mummy (Priya)", status: "Cooking your favorite biryani!", last_seen: "Just now" },
  { id: 4, name: "Didi (Anjali)", status: "Studying for exams", last_seen: "10 minutes ago" },
  { id: 5, name: "Chachu (Amit)", status: "Playing cricket with kids", last_seen: "15 minutes ago" },
  { id: 6, name: "Bhabhi (Neha)", status: "Planning weekend picnic", last_seen: "20 minutes ago" }
];

const dummyMemories = [
  { id: 1, title: "Diwali Celebration 2024", description: "Our entire family gathered for Diwali puja. The diyas looked beautiful!", upload_date: "2024-11-12T18:30:00Z", image_url: "https://images.unsplash.com/photo-1604608672516-f1b9b1a42d1d?w=400", memory_type: "photo", family_member: "Mummy", created_date: "2024-11-12T18:30:00Z" },
  { id: 2, title: "Grandma's 75th Birthday", description: "A day filled with love, laughter, and lots of sweets. Grandma was so happy!", upload_date: "2024-10-20T14:00:00Z", image_url: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400", memory_type: "photo", family_member: "Papa", created_date: "2024-10-20T14:00:00Z" },
  { id: 3, title: "Summer Vacation in Goa", description: "Beach fun, seafood, and endless memories with the cousins.", upload_date: "2024-06-15T10:00:00Z", image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", memory_type: "photo", family_member: "Didi", created_date: "2024-06-15T10:00:00Z" },
  { id: 4, title: "Recipe: Grandma's Secret Kheer", description: "Finally convinced Grandma to share her famous kheer recipe that everyone loves!", upload_date: "2024-09-08T16:00:00Z", image_url: null, memory_type: "story", family_member: "Bhabhi", created_date: "2024-09-08T16:00:00Z" },
];

export default function Dashboard() {
  const [members, setMembers] = useState(dummyMembers);
  const [memories, setMemories] = useState(dummyMemories);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMemoryDialogOpen, setIsMemoryDialogOpen] = useState(false);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const observerRefs = useRef([]);
  const [user, setUser] = useState(null);








useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(`http://localhost:3128/`, {
          method: "POST",
          credentials: "include", // send cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log("Verification response:", data);

        if (data.ok) {
          // You got your auth token and user details!
          console.log("Auth Token:", data.auth_token);
          setUser(data.user);
        } else {
         
        }
      } catch (error) {
        console.error("Error verifying user:", error);
      }
    };

    verifyUser();
  }, []);









  const handleContactClick = (member) => {
    setSelectedMember(member);
    setIsChatOpen(true);
    setIsSidebarOpen(false);
  };
  
  const handleUploadSuccess = (newMemory) => {
      // For local dummy data, we simulate adding the new memory
      const memoryToAdd = {
          ...newMemory,
          id: Date.now(), // Generate a unique ID
          created_date: new Date().toISOString(), // Set current date
          upload_date: new Date().toISOString(), // Set current date
          family_member: newMemory.family_member || "You" // Use selected member or default to "You"
      };
      setMemories(prevMemories => [memoryToAdd, ...prevMemories]); // Add to the beginning of the list
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, entry.target.dataset.index]));
          }
        });
      },
      { threshold: 0.2 }
    );

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [memories]);

  return (
    <>
     <Helmet>
            <title>Dashboard</title>
            <meta name="description" content="Welcome to the dashboard" />
          </Helmet>

    <div className="bg-gradient-to-tr from-indigo-50 via-pink-10 to-amber-50 min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Navbar2 />

      <div className="flex">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 left-6 z-30 w-14 h-14  bg-gradient-to-tr from-[#544364] to-pink-500 shadow-[0_20px_50px_rgba(236,72,153,0.4)] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        <div className="hidden lg:block lg:w-80 xl:w-96">
          <FamilyContactsSidebar
            members={members}
            onContactClick={handleContactClick}
            isOpen={true}
            onClose={() => {}}
          />
        </div>

        <div className="lg:hidden">
          <FamilyContactsSidebar
            members={members}
            onContactClick={handleContactClick}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <main className="flex-1 min-h-screen p-4 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-[3rem] font-extrabold leading-[2.2] mb-[1.1rem] bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                Family Timeline
              </h1>
              <p className="text-gray-600 text-lg">
                Cherished moments, preserved forever
              </p>
            </motion.div>

            <div className="relative space-y-12 mb-16">
              {memories.map((memory, index) => (
                <div
                  key={memory.id}
                  ref={(el) => (observerRefs.current[index] = el)}
                  data-index={index}
                >
                  <TimelineCard
                    memory={memory}
                    index={index}
                    inView={visibleCards.has(String(index))}
                  />
                </div>
              ))}

              {memories.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-200 to-green-300 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No memories yet
                  </h3>
                  <p className="text-gray-500">
                    Start creating your family timeline by uploading your first memory!
                  </p>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-2 gap-4 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsMemoryDialogOpen(true)}
                className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative z-10 flex flex-col items-center text-white">
                  <div className="w-16 h-16 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">Upload Memory</h3>
                  <p className="text-white/80 text-sm">Share a special moment</p>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsStoryDialogOpen(true)}
                className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-lime-400 via-emerald-500 to-green-600 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative z-10 flex flex-col items-center text-white">
                  <div className="w-16 h-16 mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">Upload Story</h3>
                  <p className="text-white/80 text-sm">Tell a family tale</p>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
              </motion.button>
            </motion.div>

            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-8 text-gray-500 text-sm"
            >
              © {new Date().getFullYear()} made with ❤️ by Team TimeHackers
            </motion.footer>
          </div>
        </main>
      </div>

      <ChatOverlay
        member={selectedMember}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <UploadMemoryDialog
        isOpen={isMemoryDialogOpen}
        onClose={() => setIsMemoryDialogOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      <UploadStoryDialog
        isOpen={isStoryDialogOpen}
        onClose={() => setIsStoryDialogOpen(false)}
        onSuccess={handleUploadSuccess}
        familyMembers={members}
      />
    </div>
        </>

  );
}
