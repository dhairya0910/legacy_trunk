import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function StatusViewer() {
  const navigate = useNavigate();
  const dummy = [
    { url: "https://picsum.photos/id/1011/600/800" },
    { url: "https://picsum.photos/id/1012/600/800" },
    { url: "https://picsum.photos/id/1015/600/800" },
  ];
  const [stories, setStories] = useState(dummy)
  // 🔹 Dummy stories

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);



  const fetchStories = async () =>{
      // Simulate upload delay
     const res = await fetch(`http://localhost:3128/user/fetch-stories/`, {
       method: "POST",
       credentials: "include",
       headers: { "Content-Type": "application/json" },
     });
     const data = await res.json();
     setStories(data.stories)
     
  }

  // Start auto progress when story changes
  useEffect(() => {
    startProgress();
    fetchStories();
    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  const startProgress = () => {
    setProgress(0);
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext(); // go to next story automatically
          return 0;
        }
        return prev + 2; // 5s total (100 / 2% = 50 steps × 100ms = 5s)
      });
    }, 100);
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/dashboard"); // after last story, go to another route
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
    <Helmet>
                <title>Stories</title>
                <meta name="description" content="View stories" />
              </Helmet>

    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white">
      {/* Progress bars */}
      <div className="absolute top-2 left-0 right-0 flex gap-1 px-3">
        {stories.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-gray-600 rounded overflow-hidden">
            <div
              className="h-1 bg-white transition-all duration-100 linear"
              style={{
                width:
                  i < currentIndex
                    ? "100%"
                    : i === currentIndex
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Story image */}
      <img
        src={stories[currentIndex].media}
        alt="status"
        className="w-full max-w-md h-[80vh] object-cover rounded-lg"
      />

      {/* Manual controls */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
        >
          Prev
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-green-600 rounded"
        >
          {currentIndex === stories.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
        </>
  );
}
