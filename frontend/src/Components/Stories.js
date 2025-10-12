import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import config from "../config";

export default function StatusViewer() {
  const navigate = useNavigate();
  const { who } = useParams(); // gets value from /user/:id

  const [stories, setStories] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef(null);
  const videoRef = useRef(null); // Ref for the video element

  const fetchStories = async () => {
    const res = await fetch(`${config.BACKEND_URL}/${who}/fetch-stories/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.stories.length) setStories(data.stories);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Effect to handle story changes and start the appropriate timer
  useEffect(() => {
    // Clear any existing interval when the story changes
    clearInterval(intervalRef.current);
    setProgress(0);
    
    const currentStory = stories[currentIndex];

    // For images, start a 5-second timer immediately.
    // For videos, the timer is started by the `handleMetadata` function.
    if (stories && currentStory?.mediaType !== "video") {
      startProgress(5000); // Default 5 seconds for images
    }

    return () => clearInterval(intervalRef.current);
  }, [currentIndex, stories]); 

  // This function now accepts a duration in milliseconds
  const startProgress = (duration) => {
    setProgress(0);
    clearInterval(intervalRef.current);

    const increment = 100 / (duration / 100); // Calculate progress increment

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext(); // go to next story automatically
          return 0;
        }
        return prev + increment;
      });
    }, 100);
  };

  // Called when video metadata is loaded
  const handleMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration * 1000; // duration in ms
      startProgress(videoDuration);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/dashboard");
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

      {stories && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white">
          {/* Progress bars */}
          <div className="absolute top-2 left-0 right-0 flex gap-1 px-3 z-10">
            {stories.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 bg-gray-600 rounded overflow-hidden"
              >
                <div
                  className="h-1 bg-white"
                  style={{
                    transition: i === currentIndex ? "width 100ms linear" : "none",
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
          
          <div className="absolute top-8 left-4 z-10 text-white font-semibold">
             {stories[currentIndex].title}
          </div>

          {/* Conditional rendering for Image or Video */}
          <div className="w-full max-w-md h-[80vh] flex items-center justify-center">
             {stories[currentIndex]?.mediaType === "video" ? (
              <video
                ref={videoRef}
                src={stories[currentIndex]?.media}
                className="w-full h-full object-contain rounded-lg"
                autoPlay
                muted
                playsInline
                onLoadedMetadata={handleMetadata} // Start timer on load
              />
            ) : (
              <img
                src={stories[currentIndex]?.media}
                alt="status"
                className="w-full h-full object-contain rounded-lg"
              />
            )}
          </div>
         

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
      )}
      {!stories && (
        <p>
          <b className="text-center block text-black">
            Not uploaded any story!!
          </b>
        </p>
      )}
    </>
  );
}