import React from 'react';

export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          background: linear-gradient(135deg, #1F2937 0%, #4C1D95 100%);
          color: white;
          padding: 4rem 5% 2rem;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .footer-logo-icon {
          font-size: 2.5rem;
        }

        .footer-logo-text {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FFFFFF 0%, #FDE68A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-tagline {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          line-height: 1.6;
        }

        .footer-column h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #FDE68A;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .footer-link:hover {
          color: #FDE68A;
          padding-left: 5px;
        }

        .social-icons {
          display: flex;
          gap: 1rem;
        }

        .social-icon {
          width: 45px;
          height: 45px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          background: linear-gradient(135deg, #9333EA, #EC4899);
          transform: translateY(-5px);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }

        @media (max-width: 968px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              {/* <span className="footer-logo-icon">🌳</span> */}
              <span className="footer-logo-text">Gharondha</span>
            </div>
            <p className="footer-tagline">
              Preserving family legacies, one story at a time. Connect generations, cherish memories, and build your family's digital heritage.
            </p>
            <div className="social-icons">
              <div className="social-icon">📘</div>
              <div className="social-icon">🐦</div>
              <div className="social-icon">📷</div>
              <div className="social-icon">💼</div>
            </div>
          </div>

          <div className="footer-column">
            <h3>Features</h3>
            <ul className="footer-links">
              <li><a className="footer-link">Story Recording</a></li>
              <li><a className="footer-link">Timeline Creation</a></li>
              <li><a className="footer-link">Family Circles</a></li>
              <li><a className="footer-link">AI Matching</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Company</h3>
            <ul className="footer-links">
              <li><a className="footer-link">About Us</a></li>
              <li><a className="footer-link">Our Story</a></li>
              <li><a className="footer-link">Careers</a></li>
              <li><a className="footer-link">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <ul className="footer-links">
              <li><a className="footer-link">Help Center</a></li>
              <li><a className="footer-link">Privacy Policy</a></li>
              <li><a className="footer-link">Terms of Service</a></li>
              <li><a className="footer-link">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Gharondha. All rights reserved. Built with 💖 for families worldwide.</p>
        </div>
      </footer>
    </>
  );
}