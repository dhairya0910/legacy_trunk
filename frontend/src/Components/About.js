
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentSection = sectionRef.current; // Capture current ref value
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (currentSection) { // Use captured value
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) { // Use captured value
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        .about-section {
          padding: 8rem 5%;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
          position: relative;
          overflow: hidden;
        }

        .about-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .about-content h2 {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #F59E0B 0%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 2rem;
        }

        .about-story {
          color: #374151;
          font-size: 1.15rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .about-highlight {
          background: rgba(251, 191, 36, 0.2);
          padding: 2rem;
          border-radius: 20px;
          border-left: 4px solid #F59E0B;
          font-style: italic;
          color: #92400E;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        .about-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tree-illustration {
          font-size: 20rem;
          animation: glow 3s ease-in-out infinite;
          filter: drop-shadow(0 0 30px rgba(236, 72, 153, 0.3));
        }

        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 30px rgba(236, 72, 153, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 50px rgba(245, 158, 11, 0.5));
          }
        }

        @media (max-width: 968px) {
          .about-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .about-content h2 {
            font-size: 2.2rem;
          }

          .tree-illustration {
            font-size: 10rem;
          }
        }
      `}</style>

      <section id="about" className="about-section" ref={sectionRef}>
        <div className="about-container">
          <motion.div 
            className="about-content"
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2>Why Kutumbakam?</h2>
            <p className="about-story">
              Imagine a circus family, like the Zanettis, traveling across continents. Each generation carries stories of triumph, struggle, and love. But with time, these precious memories fade.
            </p>
            <p className="about-story">
              Kutumbakam was born from this need - to create a sacred digital space where families can preserve their unique journeys. Whether it's grandma's recipe, grandpa's war stories, or a child's first words, every moment deserves to be remembered.
            </p>
            <div className="about-highlight">
              "Family isn't just about the present. It's about honoring the past and gifting the future with the stories that shaped us."
            </div>
          </motion.div>

          <motion.div 
            className="about-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="tree-illustration">🌳</div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
