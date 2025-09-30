
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentSection = sectionRef.current; // Store current ref value
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
      // Use the stored value for cleanup
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  const steps = [
    { icon: '📤', title: 'Upload Stories', desc: 'Share your memories through text, photos, audio or video' },
    { icon: '🏷️', title: 'Tag & Organize', desc: 'Categorize and connect memories with family members' },
    { icon: '👨‍👩‍👧‍👦', title: 'Share in Circles', desc: 'Create private family groups to share your legacy' },
    { icon: '💎', title: 'Preserve Forever', desc: 'Export to PDF, match generations with AI' }
  ];

  return (
    <>
      <style>{`
        .how-section {
          padding: 8rem 5%;
          background: linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 50%, #F3E8FF 100%);
          position: relative;
          overflow: hidden;
        }

        .how-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
        }

        .how-header {
          text-align: center;
          margin-bottom: 5rem;
          position: relative;
          z-index: 2;
        }

        .how-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .how-subtitle {
          font-size: 1.2rem;
          color: #6B7280;
        }

        .steps-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          position: relative;
          z-index: 2;
        }

        .step-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 2.5rem 2rem;
          text-align: center;
          transition: all 0.4s ease;
          border: 2px solid rgba(255, 255, 255, 0.5);
          position: relative;
        }

        .step-card::before {
          content: '';
          position: absolute;
          top: 50%;
          right: -2rem;
          width: 2rem;
          height: 2px;
          background: linear-gradient(90deg, #8B5CF6, transparent);
        }

        .step-card:last-child::before {
          display: none;
        }

        .step-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 30px 60px rgba(139, 92, 246, 0.2);
          border-color: #C4B5FD;
        }

        .step-number {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8B5CF6, #EC4899);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .step-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .step-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 1rem;
        }

        .step-desc {
          color: #6B7280;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        @media (max-width: 968px) {
          .steps-container {
            grid-template-columns: 1fr;
          }

          .step-card::before {
            display: none;
          }

          .how-title {
            font-size: 2.2rem;
          }
        }
      `}</style>

      <section id="how-it-works" className="how-section" ref={sectionRef}>
        <div className="how-header">
          <motion.h2 
            className="how-title"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="how-subtitle"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Four simple steps to preserve your family's legacy
          </motion.p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="step-card"
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
            >
              <div className="step-number">{index + 1}</div>
              <span className="step-icon">{step.icon}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
