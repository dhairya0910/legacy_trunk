import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Phone, Video } from "lucide-react";
import { io } from "socket.io-client";
import { useRef } from "react";
import config from "../config";

// Initialize socket connection
const socket = io(`${config.BACKEND_URL}/`);

export default function ChatOverlay({
  yourId,
  initialMsg,
  member,
  isOpen,
  onClose,
}) {
  const [message, setMessage] = useState(""); // Current input message
  const [messages, setMessages] = useState([]); // new messages
  const messagesEndRef = useRef(null);

  //Scroll down when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Clear chat and rejoin on user or member change
    setMessages([]);
    socket.emit("join", yourId);

    // Listen for new incoming messages
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup listener on unmount or dependency change
    return () => {
      socket.off("receive_message");
    };
  }, [yourId, member]);

  // Handle sending message
  const handleSend = () => {
    if (message.trim() === "") return;

    const newMessage = {
      sender: yourId,
      receiver: member.id,
      text: message,
      createdAt: new Date().toISOString(),
    };

    // Emit message to server
    socket.emit("send_message", newMessage);
    //console.log("Sent message:", newMessage);

    // Update local message state
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Chat Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {member?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{member?.name}</h3>
                    {/* Add status here if you implement presence later */}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button> */}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Message Display Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {[...initialMsg, ...messages].map((msg, index) => (
                <motion.div
                  key={msg._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.sender === yourId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                      msg.sender === yourId
                        ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === yourId
                          ? "text-emerald-100"
                          : "text-gray-400"
                      }`}
                    >
                      <span className="float-right">
                        {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Section */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
