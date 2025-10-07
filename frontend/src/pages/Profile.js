import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  function validate() {
    const e = {};
    if (!username.trim()) e.username = "Please enter a username.";
    if (!dob) e.dob = "Please select your date of birth.";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      const age = calculateAge(dob);
      setLoading(true);
      try {
        const res = await fetch("/500", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, age }),
        });
        if (!res.ok) throw new Error("Network error");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
      } catch (err) {
        console.error(err);
        alert("Failed to send data to backend.");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="text-black min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-semibold text-center">Setup your profile</h2>

        <div className="flex flex-col gap-4">
          <div className="relative flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Username</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full rounded-xl border p-3 outline-none transition-shadow focus:shadow-lg focus:border-indigo-300 ${errors.username ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="Enter username"
              aria-label="username"
              name="username"
              autoComplete="off"
            />
            <AnimatePresence>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-sm text-red-500 mt-2"
                >
                  {errors.username}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="relative flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              type="date"
              className={`w-full rounded-xl border p-3 outline-none transition-shadow focus:shadow-lg focus:border-indigo-300 ${errors.dob ? 'border-red-400' : 'border-gray-200'}`}
              aria-label="date-of-birth"
              name="dob"
            />
            <AnimatePresence>
              {errors.dob && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-sm text-red-500 mt-2"
                >
                  {errors.dob}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg px-4 py-3 bg-indigo-600 text-white font-medium shadow hover:brightness-105 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-2 p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Setup saved successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}