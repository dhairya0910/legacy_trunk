import React from 'react'
import { motion } from 'framer-motion'

function ViewProfileAfterLogin() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6">

        Profile picture
        <div className="flex justify-center">
          <img
            src="https://i.pravatar.cc/150?img=3"
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-indigo-500"
          />
        </div>

        User name and title
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Alex Johnson</h2>
          <p className="text-sm text-gray-500">UI/UX Designer</p>
        </div>

        About section
        <div className="text-gray-700 text-center text-sm">
          Passionate about creating intuitive and beautiful user experiences. Lover of minimal design, coffee, and code.
        </div>

        Buttons
        <div className="flex space-x-4 justify-center">
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition">
            Follow
          </button>
          <button className="border border-indigo-500 text-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-50 transition">
            Message
          </button>
        </div>

      </div>
    </motion.div>
  )
}

export default ViewProfileAfterLogin
