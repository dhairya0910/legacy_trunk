import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <>
      <style>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 50%, #FEF3C7 100%);
          overflow: hidden;
          padding: 0 5%;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #9333EA 0%, #EC4899 50%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.4rem;
          color: #6B7280;
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 1.2rem 3rem;
          background: linear-gradient(135deg, #544364ff 0%, #EC4899 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(147, 51, 234, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 50px rgba(236, 72, 153, 0.4);
        }

        .btn-secondary {
          padding: 1.2rem 3rem;
          background: transparent;
          color: #9333EA;
          border: 2px solid #9333EA;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-secondary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .btn-secondary:hover::before {
          left: 100%;
        }

        .btn-secondary:hover {
          border-color: #EC4899;
          color: #EC4899;
          transform: translateY(-5px);
        }

        .floating-illustration {
          position: absolute;
          bottom: 10%;
          right: 5%;
          font-size: 15rem;
          opacity: 0.15;
          z-index: 1;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .btn-primary, .btn-secondary {
            padding: 1rem 2rem;
            font-size: 1rem;
          }

          .floating-illustration {
            font-size: 8rem;
            bottom: 5%;
            right: -5%;
          }
        }
      `}</style>

      <section id="hero" className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Preserve Your Family Legacy with Gharondha
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            A digital trunk to safeguard stories, heirlooms, and timelines for generations.
          </motion.p>

          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Watch Demo</button>
          </motion.div>
        </motion.div>

        {/* Optional floating icon */}
        {/* <div className="floating-illustration">🌳</div> */}
      </section>
    </>
  );
}
