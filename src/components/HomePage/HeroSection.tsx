import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Carousel from 'react-multi-carousel';
import { useNavigate } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { apiEndpoint } from '../admin/config/api';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

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
    <motion.button
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className={`h-3 w-12 mx-1.5 rounded-full transition-all duration-300 ease-in-out ${active ? 'bg-white' : 'bg-white/30'}`}
      onClick={onClick}
    />
  );
};

const CustomArrow = ({ direction, onClick }: { direction: 'left' | 'right'; onClick?: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      aria-label={`${direction} arrow`}
      className={`absolute ${direction === 'left' ? 'left-4' : 'right-4'} z-10 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 glow-on-hover`}
      whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      whileTap={{ scale: 0.95 }}
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
    </motion.button>
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

// Enhanced Particle component with more dynamic movement
const Particle = ({ index }: { index: number }) => {
  const size = Math.random() * 4 + 2;
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const duration = 15 + Math.random() * 30;
  const delay = Math.random() * 5;
  
  // More complex path for particles
  const pathPoints = [
    { x: initialX, y: initialY },
    { x: initialX + (Math.random() * 20 - 10), y: initialY - 20 - Math.random() * 20 },
    { x: initialX + (Math.random() * 30 - 15), y: initialY - 40 - Math.random() * 20 },
    { x: initialX + (Math.random() * 20 - 10), y: initialY - 60 - Math.random() * 20 },
    { x: initialX + (Math.random() * 10 - 5), y: initialY - 80 - Math.random() * 20 },
  ];
  
  return (
    <motion.div
      className="absolute rounded-full float-particle"
      style={{
        width: size,
        height: size,
        background: `rgba(255, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 150)}, ${Math.random() * 0.5 + 0.1})`,
        boxShadow: `0 0 ${size * 2}px rgba(255, 51, 102, 0.3)`,
        x: `${initialX}vw`,
        y: `${initialY}vh`,
      }}
      animate={{
        x: pathPoints.map(p => `${p.x}vw`),
        y: pathPoints.map(p => `${p.y}vh`),
        opacity: [0, 0.8, 0.5, 0.2, 0],
        scale: [0, 1, 0.8, 0.5, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1]
      }}
    />
  );
};

const HeroSection: React.FC = () => {
  const [slides, setSlides] = useState<string[]>([]);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax effect values
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
  // Mouse parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 100 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const getCarouselImages = async () => {
    try {
      const controller = new AbortController();
      const signal = controller.signal;
      
      const response = await fetch(`${apiEndpoint.slide}/get-all`, { signal });
      const data = await response.json();
      const slides = data.data.map((slide: any) => slide.imageUrl);
      setSlides(slides);
      
      return controller; // Return controller for cleanup
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.log("Error fetching carousel images:", error);
      }
      return null;
    }
  };

  useEffect(() => {
    let gsapAnimations: gsap.core.Tween[] = [];
    let controller: AbortController | null = null;
    
    const initAnimations = async () => {
      controller = await getCarouselImages() as AbortController | null;
      
      const text = document.querySelector('.hero-text');
      
      if (text) {
        // Initial animation
        const tween = gsap.fromTo(text.querySelectorAll('.animate-item'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power3.out" }
        );
        gsapAnimations.push(tween);
      }
      
      // Scroll animation
      const scrollTween = gsap.to(".parallax-bg", {
        backgroundPosition: `50% ${window.innerHeight / 2}px`,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
      
      if (scrollTween.scrollTrigger) {
        gsapAnimations.push(scrollTween);
      }
    };
    
    initAnimations();
    
    // Cleanup function
    return () => {
      // Kill all GSAP animations
      gsapAnimations.forEach(tween => {
        if (tween && tween.kill) {
          tween.kill();
        }
        
        // Also kill ScrollTrigger instances if they exist
        if (tween.scrollTrigger) {
          tween.scrollTrigger.kill();
        }
      });
      
      // Kill all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => {
        trigger.kill();
      });
      
      // Abort fetch request if it's still in progress
      if (controller) {
        controller.abort();
      }
    };
  }, []);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black group"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {/* Background Carousel with Parallax */}
      <motion.div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ y, scale }}
      >
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
              <motion.div 
                className="absolute inset-0 w-full h-full"
                style={{ 
                  x: mouseXSpring,
                  y: mouseYSpring,
                }}
              >
                <img
                  src={image}
                  alt={`Hero carousel ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover transform scale-105 transition-transform duration-10000 hover:scale-100"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
            </div>
          ))}
        </Carousel>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="container mx-auto px-4 z-[3] relative hero-text"
        style={{ opacity }}
      >
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
              style={{ 
                x: useTransform(mouseXSpring, value => value * -2),
                y: useTransform(mouseYSpring, value => value * -2)
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="absolute -bottom-20 -right-20 w-40 h-40 bg-synergy-red/10 rounded-full blur-3xl"
              style={{ 
                x: useTransform(mouseXSpring, value => value * 2),
                y: useTransform(mouseYSpring, value => value * 2)
              }}
            />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-xl md:text-2xl text-synergy-light opacity-90 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          We transform <span className="text-transparent bg-gradient-to-r from-synergy-red to-red-600 bg-clip-text font-medium gradient-text">ordinary campaigns</span> into <span className="text-transparent bg-gradient-to-r from-synergy-red to-red-600 bg-clip-text font-medium gradient-text">extraordinary experiences</span> that captivate audiences and elevate your brand.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px -5px rgba(255, 51, 102, 0.4)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/services')}
            className="relative group overflow-hidden bg-gradient-to-r from-synergy-red to-red-600 hover:from-red-600 hover:to-synergy-red text-white py-3 px-8 rounded-full font-medium transition duration-300 transform flex items-center justify-center ripple-effect"
          >
            <span className="relative z-10">Our Services</span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-synergy-red to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ 
              scale: 1.05, 
              borderColor: "#ff3366",
              boxShadow: "0 0 15px rgba(255, 51, 102, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/contact')}
            className="relative py-3 px-8 border-2 border-white hover:border-synergy-red text-white bg-transparent hover:bg-white/10 rounded-full font-medium transition duration-300 backdrop-blur-sm flex items-center justify-center"
          >
            <span className="relative z-10">Get in Touch</span>
            <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Enhanced Dynamic Particle Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {[...Array(30)].map((_, i) => (
            <Particle key={i} index={i} />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <motion.p 
          className="text-white/70 text-sm mb-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll Down
        </motion.p>
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-white/70 rounded-full"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;