import React, { useState } from "react";
import { motion } from "framer-motion";
import config from "../config";
import {useNavigate } from "react-router-dom";


export default function Profile() {
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [message, setMessage] = useState("");
  const navigator = useNavigate()

  function calculateAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !dob) {
      setMessage("Please fill out all fields.");
      return;
    }

    const age = calculateAge(dob);

    try {
      const res = await fetch(`${config.BACKEND_URL}/complete-profile`, {
        method: "POST",
        credentials:"include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, age }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error("Failed to send data");
      setMessage("Profile saved successfully!");
      navigator(`${data.route}`)
      setUsername("");
      setDob("");
   
    } catch (error) {
      console.error(error);
      setMessage("Error saving profile.");
    }
  }

  return (
    <div className="text-black min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 border border-gray-100"
      >
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
          Setup Profile
        </h2>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Username</label>
          <input
            type="text"
            value={username}
            name = "username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Date of Birth</label>
          <input
            type="date"
            value={dob}
            name = "age"
            onChange={(e) => setDob(e.target.value)}
            className="border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          className="mt-3 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          Save
        </button>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-gray-700 mt-3"
          >
            {message}
          </motion.p>
        )}
      </motion.form>
    </div>
  );
}
