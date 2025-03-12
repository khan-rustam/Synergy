import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Carousel from 'react-multi-carousel';
import { useNavigate } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { apiEndpoint } from '../admin/config/api';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Add gradient styles
const titleGradientStyle = {
  background: 'linear-gradient(135deg, #ffffff 0%, #e6e9f0 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
};

const accentGradientStyle = {
  background: 'linear-gradient(135deg, #ff3366 0%, #ff0844 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  filter: 'drop-shadow(0 2px 4px rgba(255, 51, 102, 0.3))'
};

// Animation variants
const letterAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const CustomDot = ({ onClick, active }: { onClick?: () => void; active?: boolean }) => {
  return (
    <button
      className={`h-3 w-12 mx-1.5 rounded-full transition-all duration-300 ease-in-out ${active ? 'bg-white' : 'bg-white/30'}`}
      onClick={onClick}
    />
  );
};

const CustomArrow = ({ direction, onClick }: { direction: 'left' | 'right'; onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      aria-label={`${direction} arrow`}
      className={`absolute ${direction === 'left' ? 'left-4' : 'right-4'} z-10 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300`}
    >
      {direction === 'left' ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
};

// Split text into individual characters for animation
const AnimatedText = ({ text, className, style, delay = 0 }: { text: string, className?: string, style?: React.CSSProperties, delay?: number }) => {
  return (
    <span className={className} style={style}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          custom={index + delay}
          variants={letterAnimation}
          initial="hidden"
          animate="visible"
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

const HeroSection: React.FC = () => {
  const [slides, setSlides] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const getCarouselImages = async () => {
    try {
      const response = await fetch(`${apiEndpoint.slide}/get-all`);
      const data = await response.json();
      const slides = data.data.map((slide: any) => slide.imageUrl);
      return setSlides(slides);
    } catch (error) {
      console.log("Error fetching carousel images:", error);
    }
  };

  useEffect(() => {
    getCarouselImages();
    const text = document.querySelector('.hero-text');

    if (text) {
      // Initial animation
      gsap.fromTo(text.querySelectorAll('.animate-item'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black group">
      {/* Background Carousel */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          transitionDuration={1000}
          removeArrowOnDeviceType={[]}
          customDot={<CustomDot />}
          showDots={true}
          dotListClass="absolute bottom-20 !flex gap-2 z-10"
          containerClass="absolute inset-0 w-full h-full"
          itemClass="h-screen w-full"
          rewind={true}
          rewindWithAnimation={true}
          shouldResetAutoplay
          swipeable={true}
          draggable={true}
          ssr={true}
          customLeftArrow={<CustomArrow direction="left" />}
          customRightArrow={<CustomArrow direction="right" />}
        >
          {slides.map((image, index) => (
            <div key={index} className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={image}
                  alt={`Hero carousel ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover transform scale-105 transition-transform duration-10000 hover:scale-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-[3] relative hero-text">
        <div className="animate-item relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-center leading-tight mb-8 relative"
          >
            <div className="relative z-10">
              <div className="mb-2 overflow-hidden">
                <AnimatedText 
                  text="Your Brand" 
                  className="block tracking-tight" 
                  style={titleGradientStyle}
                />
              </div>
              <div className="overflow-hidden relative">
                <AnimatedText 
                  text="Catalyst" 
                  className="relative tracking-tight" 
                  style={accentGradientStyle}
                  delay={10}
                />
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.5, duration: 1.2, ease: "easeInOut" }}
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-synergy-red to-red-600 rounded-full"
                />
              </div>
            </div>
            
            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute -top-20 -left-20 w-40 h-40 bg-synergy-red/10 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="absolute -bottom-20 -right-20 w-40 h-40 bg-synergy-red/10 rounded-full blur-3xl"
            />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-xl md:text-2xl text-synergy-light opacity-90 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          We transform <span className="text-transparent bg-gradient-to-r from-synergy-red to-red-600 bg-clip-text font-medium">ordinary campaigns</span> into <span className="text-transparent bg-gradient-to-r from-synergy-red to-red-600 bg-clip-text font-medium">extraordinary experiences</span> that captivate audiences and elevate your brand.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 51, 102, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/services')}
            className="relative group overflow-hidden bg-gradient-to-r from-synergy-red to-red-600 hover:from-red-600 hover:to-synergy-red text-white py-3 px-8 rounded-full font-medium transition duration-300 transform flex items-center justify-center"
          >
            <span className="relative z-10">Our Services</span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-synergy-red to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: "#ff3366" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/contact')}
            className="border-2 border-white hover:border-synergy-red text-white hover:text-transparent hover:bg-gradient-to-r hover:from-synergy-red hover:to-red-600 hover:bg-clip-text py-3 px-8 rounded-full font-medium transition duration-300"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-synergy-red/30"
            initial={{
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0
            }}
            animate={{
              y: [null, "-100%"],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0.5]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;