import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import Features from '../Components/Features';
import HowItWorks from '../Components/HowItWorks';
import About from '../Components/About';
import Testimonials from '../Components/Testimonials';
import CTABanner from '../Components/CTABanner';
import { Helmet } from 'react-helmet';
import Footer from '../Components/Footer';

export default function Homepage() {
  return (
    <>
     <Helmet>
            <title>Gharondha</title>
            <meta name="description" content="Welcome to our website." />
          </Helmet>
          
    <div className="homepage">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .homepage {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-x: hidden;
          background: #FFFFFF;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
      
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <About />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
      </>
  );

}