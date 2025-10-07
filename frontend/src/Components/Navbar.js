import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "../assets/styles/navbar.css"
import { motion } from 'framer-motion';
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const nav = document.querySelector(".navbar");
    const hamburger = document.querySelector(".hamburger");
    const navButtons = document.querySelector(".nav-buttons")
    let clicked =false;
    hamburger.addEventListener("click",()=>{
      if(!clicked){

        nav.style.height="250px";
        navButtons.style.display="block";
        clicked = true;
      }
      else{
        
        nav.style.height="70px";
        navButtons.style.display="none";
        clicked = false;
      }
   
    })
    
  }, [])
  

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
      <style></style>

      <motion.nav
      
        className={`navbar ${scrolled ? 'solid' : 'transparent'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="navbar-logo">
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Ghraondha
            </h1>
        </div>
       

        <ul className="nav-links">
          <li className="nav-link" onClick={() => scrollToSection('hero')}>Home</li>
          <li className="nav-link" onClick={() => scrollToSection('features')}>Features</li>
          <li className="nav-link" onClick={() => scrollToSection('about')}>About</li>
          <li className="nav-link" onClick={() => scrollToSection('testimonials')}>Testimonials</li>
          <li className="nav-link" onClick={() => scrollToSection('contact')}>Contact</li>
        </ul>

          <img className='hamburger' src="https://e7.pngegg.com/pngimages/124/176/png-clipart-hamburger-button-computer-icons-menu-minimalist-menu-angle-text.png" alt="" />
        <div className="nav-buttons"> 
           <Link to='/login'><button className="btn-login">Login</button></Link>
          <Link to ="signup"><button className="btn-signup">Sign Up</button></Link>
        </div>
      
      </motion.nav>
    </>
  );
}