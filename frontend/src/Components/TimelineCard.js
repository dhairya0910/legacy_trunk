import React from "react";
import { motion } from "framer-motion";
import { Calendar, Image as ImageIcon, FileText, Video } from "lucide-react";
import { format } from "date-fns";

const typeIcons = {
  photo: ImageIcon,
  video: Video,
  story: FileText,
  document: FileText
};

const typeGradients = {
  photo: "from-emerald-400 to-green-500",
  video: "from-teal-400 to-emerald-500",
  story: "from-lime-400 to-green-500",
  document: "from-green-400 to-teal-500"
};

export default function TimelineCard({ memory, index, inView }) {
  const Icon = typeIcons[memory.memory_type] || ImageIcon;
  const gradient = typeGradients[memory.memory_type] || "from-green-400 to-emerald-500";
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex items-center gap-4 ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className={`flex-1 ${isEven ? "lg:text-right" : "lg:text-left"}`}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-start gap-4">
            {memory.image_url && (
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                <img
                  src={memory.image_url}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 text-lg mb-1">
                {memory.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {memory.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(memory.upload_date || memory.created_date), "MMM d, yyyy")}
                </div>
                {memory.family_member && (
                  <span className="text-emerald-600 font-medium">
                    by {memory.family_member}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} shadow-lg flex items-center justify-center relative z-10`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-emerald-200 to-transparent" />
      </div>

      <div className="flex-1 hidden lg:block" />
    </motion.div>
  );
}