import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Daughter & Family Historian",
      image: "",
      quote:
        "Gharondha helped me capture my grandmother's stories before it was too late. Now my children will know their roots.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Grandfather & Storyteller",
      image: "",
      quote:
        "I can finally share my life experiences with my grandchildren, even though we live in different countries.",
      rating: 5,
    },
    {
      name: "Anita Patel",
      role: "Mother & Memory Keeper",
      image: "",
      quote:
        "The timeline feature is incredible! I've organized 40 years of family photos and everyone can contribute.",
      rating: 5,
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (section) observer.observe(section);
    return () => section && observer.unobserve(section);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (i) => setCurrentIndex(i);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-24 px-6 bg-gradient-to-b from-gray-50 to-violet-100 relative"
    >
      {/* Title */}
      <div className="text-center mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          What Families Say
        </motion.h2>
      </div>

      {/* Carousel */}
      <div className="max-w-3xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-10 shadow-2xl text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 flex items-center justify-center rounded-full text-6xl bg-gradient-to-r from-purple-200 to-pink-200 mb-6">
                {testimonials[currentIndex].image}
              </div>

              <p className="text-lg text-gray-700 italic mb-6">
                "{testimonials[currentIndex].quote}"
              </p>

              <h3 className="text-xl font-semibold text-gray-900">
                {testimonials[currentIndex].name}
              </h3>
              <p className="text-purple-600 mb-4">
                {testimonials[currentIndex].role}
              </p>

              <div className="flex justify-center gap-1 text-amber-400 text-xl">
                {Array.from({ length: testimonials[currentIndex].rating }).map(
                  (_, i) => (
                    <span key={i}>⭐</span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full cursor-pointer transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 w-10"
                  : "bg-gray-300 w-3"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
