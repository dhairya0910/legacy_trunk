import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.5rem 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.transparent {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .navbar.solid {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.95) 0%, rgba(236, 72, 153, 0.95) 100%);
          backdrop-filter: blur(20px);
          box-shadow: 0 10px 40px rgba(147, 51, 234, 0.2);
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #F59E0B 0%, #FB7185 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          transition: transform 0.3s ease;
        }

        .logo-icon:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .logo-title {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #9333EA 0%, #EC4899 50%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar.solid .logo-title {
          background: linear-gradient(135deg, #FFFFFF 0%, #FDE68A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }

        .nav-link {
          color: #1F2937;
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          position: relative;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .navbar.solid .nav-link {
          color: #FFFFFF;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #F59E0B, #EC4899);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn-login {
          padding: 0.75rem 1.75rem;
          border: 2px solid #9333EA;
          background: transparent;
          color: #9333EA;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .navbar.solid .btn-login {
          border-color: #FFFFFF;
          color: #FFFFFF;
        }

        .btn-login:hover {
          background: linear-gradient(135deg, #9333EA, #EC4899);
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(147, 51, 234, 0.3);
        }

        .btn-signup {
          padding: 0.75rem 1.75rem;
          background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-signup::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }

        .btn-signup:hover::before {
          width: 300px;
          height: 300px;
        }

        .btn-signup:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(236, 72, 153, 0.4);
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          
          .navbar {
            padding: 1rem 3%;
          }

          .logo-title {
            font-size: 1.4rem;
          }
        }
      `}</style>

      <motion.nav 
        className={`navbar ${scrolled ? 'solid' : 'transparent'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="navbar-logo">
          <div className="logo-icon">🌳</div>
          <span className="logo-title">Kutumbakam</span>
        </div>

        <ul className="nav-links">
          <li><a href ="/"className="nav-link" onClick={() => scrollToSection('hero')}>Home</a></li>
          <li><a href ="/"className="nav-link" onClick={() => scrollToSection('features')}>Features</a></li>
          <li><a href ="/"className="nav-link" onClick={() => scrollToSection('about')}>About</a></li>
          <li><a href ="/"className="nav-link" onClick={() => scrollToSection('testimonials')}>Testimonials</a></li>
          <li><a href ="/"className="nav-link" onClick={() => scrollToSection('contact')}>Contact</a></li>
        </ul>

        <div className="nav-buttons">
          <button className="btn-login">Login</button>
          <button className="btn-signup">Sign Up</button>
        </div>
      </motion.nav>
    </>
  );
}