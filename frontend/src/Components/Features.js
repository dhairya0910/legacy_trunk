
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentSection = sectionRef.current; // Capture the current ref value
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (currentSection) { // Use the captured value
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) { // Use the captured value in cleanup
        observer.unobserve(currentSection);
      }
    };
  }, []);

  const basicFeatures = [
    { icon: '⏱️', title: 'Timeline Creation', desc: 'Organize memories chronologically' },
    { icon: '📸', title: 'Photo Tagging', desc: 'Upload and tag family photos' },
    { icon: '🔒', title: 'Private Circles', desc: 'Secure family-only access' },
    { icon: '🔍', title: 'Search', desc: 'Find any memory instantly' },
    { icon: '👥', title: 'Member Roles', desc: 'Family authentication system' },
    { icon: '📖', title: 'Export Stories', desc: 'Generate PDF books' }
  ];

  const advancedFeatures = [
    { icon: '💭', title: 'Memory Prompts', desc: 'Guided storytelling questions' },
    { icon: '🤖', title: 'AI Analysis', desc: 'Auto-tag with intelligent text analysis' },
    { icon: '🔗', title: 'Cross-Gen Matching', desc: 'Connect stories across generations' },
    { icon: '✏️', title: 'Collaborative Editing', desc: 'Family members co-create stories' }
  ];

  return (
    <>
      <style>{`
        .features-section {
          padding: 8rem 5%;
          background: linear-gradient(180deg, #FAFAFA 0%, #F3E8FF 100%);
          position: relative;
        }

        .features-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .features-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .feature-column {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(124, 58, 237, 0.1);
        }

        .column-title {
          font-size: 2rem;
          font-weight: 700;
          color: #7C3AED;
          margin-bottom: 2rem;
          text-align: center;
        }

        .feature-cards {
          display: grid;
          gap: 1.5rem;
        }

        .feature-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(124, 58, 237, 0.15);
          border-color: #DDD6FE;
        }

        .feature-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .feature-content h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 0.5rem;
        }

        .feature-content p {
          color: #6B7280;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        @media (max-width: 968px) {
          .features-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .features-title {
            font-size: 2.2rem;
          }

          .column-title {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <section id="features" className="features-section" ref={sectionRef}>
        <div className="features-header">
          <motion.h2 
            className="features-title"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            Basic & Advanced Features
          </motion.h2>
        </div>

        <div className="features-grid">
          <motion.div 
            className="feature-column"
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="column-title">✅ Basic Features</h3>
            <div className="feature-cards">
              {basicFeatures.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-content">
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="feature-column"
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="column-title">🚀 Advanced Features</h3>
            <div className="feature-cards">
              {advancedFeatures.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-content">
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
