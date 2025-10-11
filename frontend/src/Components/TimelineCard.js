import { motion } from "framer-motion";
import { Calendar, Image as ImageIcon, FileText, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const typeIcons = {
  photo: ImageIcon,
  video: Video,
  story: FileText,
  document: FileText,
};

const typeGradients = {
  photo: "from-emerald-400 to-green-500",
  video: "from-teal-400 to-emerald-500",
  story: "from-lime-400 to-green-500",
  document: "from-green-400 to-teal-500",
};

export default function TimelineCard({ memory, index, inView }) {
  const navigator = useNavigate();
  const [imgLink, setImgLink] = useState({ url: "" });

  const cardHandle = (post) => {
    navigator(`/view/post/${post._id}`);
  };

  const Icon = typeIcons[memory.memory_type] || ImageIcon;
  const gradient =
    typeGradients[memory.memory_type] || "from-green-400 to-emerald-500";
  const isEven = index % 2 === 0;

  useEffect(() => {
    console.log(memory);
    if (memory?.media?.length > 0) {
      setImgLink(memory.media[0].url);
    }
  }, [memory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex items-center gap-4 ${
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className={`flex-1 ${isEven ? "lg:text-right" : "lg:text-left"}`}
      >
        <div
          onClick={() => {
            cardHandle(memory);
          }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 relative w-[100%] mx-auto"
        >
          <div className="flex items-start gap-4">
            {memory && (
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                <img
                  src={imgLink}
                  alt={memory.text}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex-1 min-w-0 cursor-pointer">
              <h3 className="font-bold text-gray-800 text-lg mb-1 underline font-serif">
                {memory.text}
              </h3>
              <p className="text-gray-600 text-sm mb-3 font-mono">
                {memory.description?.replace(/^(.{100}).*$/, "$1...")}
              </p>

              <div className="flex-col items-center gap-4 text-[.8rem] text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-sm" />
                  {new Date(memory.createdAt).toLocaleString("en-IN", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                {
                  <span className="text-emerald-600 font-medium float-right">
                    by {memory.member_name || "You"}
                  </span>
                }
              </div>

              <div className="flex flex-wrap gap-2 mt-5 break-words">
                {(Array.isArray(memory?.tags)
                  ? memory.tags
                  : typeof memory?.tags === "string"
                  ? memory.tags.split(",").map((tag) => tag.trim())
                  : []
                ).map((tag, index) => (
                  <span
                    key={index}
                    className="font-mono bg-gradient-to-r from-emerald-500 to-green-300 text-white px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
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
