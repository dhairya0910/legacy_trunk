
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CTABanner() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Capture the current value of sectionRef.current to avoid issues with closure
    // and potential null values during cleanup if the component unmounts.
    const currentSection = sectionRef.current; 

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (currentSection) { // Use the captured value for observation
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) { // Use the captured value for unobservation
        observer.unobserve(currentSection);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <>
      <style>{`
        .cta-section {
          padding: 8rem 5%;
          background: linear-gradient(135deg, #9333EA 0%, #EC4899 50%, #F59E0B 100%);
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 70%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cta-content {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .cta-title {
          font-size: 3.5rem;
          font-weight: 900;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .cta-subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-cta-primary {
          padding: 1.5rem 4rem;
          background: white;
          color: #9333EA;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
          }
        }

        .btn-cta-primary:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        }

        .btn-cta-secondary {
          padding: 1.5rem 4rem;
          background: transparent;
          color: white;
          border: 3px solid white;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cta-secondary:hover {
          background: white;
          color: #9333EA;
          transform: translateY(-5px);
        }

        @media (max-width: 768px) {
          .cta-title {
            font-size: 2.2rem;
          }

          .cta-subtitle {
            font-size: 1.1rem;
          }

          .btn-cta-primary, .btn-cta-secondary {
            padding: 1.2rem 2.5rem;
            font-size: 1rem;
          }
        }
      `}</style>

      <section id="contact" className="cta-section" ref={sectionRef}>
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="cta-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Start Building Your Family Legacy Today!
          </motion.h2>
          <motion.p 
            className="cta-subtitle"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join thousands of families preserving their stories for generations to come
          </motion.p>
          <motion.div 
            className="cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="btn-cta-primary">Join Now</button>
            <button className="btn-cta-secondary">Learn More</button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
