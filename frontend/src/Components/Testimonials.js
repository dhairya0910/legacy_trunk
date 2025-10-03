
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Daughter & Family Historian',
      image: '👩',
      quote: 'Gharondha helped me capture my grandmother\'s stories before it was too late. Now my children will know their roots.',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Grandfather & Storyteller',
      image: '👴',
      quote: 'I can finally share my life experiences with my grandchildren, even though we live in different countries.',
      rating: 5
    },
    {
      name: 'Anita Patel',
      role: 'Mother & Memory Keeper',
      image: '👩‍👧',
      quote: 'The timeline feature is incredible! I\'ve organized 40 years of family photos and everyone can contribute.',
      rating: 5
    }
  ];

  useEffect(() => {
    const currentSection = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]); // Added testimonials.length to dependency array

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <style>{`
        .testimonials-section {
          padding: 8rem 5%;
          background: linear-gradient(180deg, #F9FAFB 0%, #EDE9FE 100%);
          position: relative;
        }

        .testimonials-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .testimonials-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .carousel-container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
        }

        .testimonial-card {
          background: white;
          border-radius: 30px;
          padding: 4rem 3rem;
          box-shadow: 0 30px 60px rgba(147, 51, 234, 0.1);
          text-align: center;
          position: relative;
        }

        .testimonial-image {
          font-size: 5rem;
          margin-bottom: 2rem;
          display: inline-block;
          background: linear-gradient(135deg, #DDD6FE 0%, #FBCFE8 100%);
          border-radius: 50%;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
        }

        .testimonial-quote {
          font-size: 1.3rem;
          color: #374151;
          line-height: 1.8;
          margin-bottom: 2rem;
          font-style: italic;
        }

        .testimonial-author {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 0.5rem;
        }

        .testimonial-role {
          color: #9333EA;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .rating {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.5rem;
        }

        .star {
          color: #F59E0B;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 3rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #D1D5DB;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: linear-gradient(135deg, #9333EA, #EC4899);
          width: 40px;
          border-radius: 10px;
        }

        @media (max-width: 768px) {
          .testimonials-title {
            font-size: 2.2rem;
          }

          .testimonial-card {
            padding: 3rem 2rem;
          }

          .testimonial-quote {
            font-size: 1.1rem;
          }
        }
      `}</style>

      <section id="testimonials" className="testimonials-section" ref={sectionRef}>
        <div className="testimonials-header">
          <motion.h2 
            className="testimonials-title"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            What Families Say
          </motion.h2>
        </div>

        <div className="carousel-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="testimonial-card"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="testimonial-image">
                {testimonials[currentIndex].image}
              </div>
              <p className="testimonial-quote">"{testimonials[currentIndex].quote}"</p>
              <h3 className="testimonial-author">{testimonials[currentIndex].name}</h3>
              <p className="testimonial-role">{testimonials[currentIndex].role}</p>
              <div className="rating">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="carousel-dots">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
