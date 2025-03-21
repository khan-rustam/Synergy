import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, useMotionValue, useTransform } from 'framer-motion';

declare global {
  interface Window {
    instgrm?: any;
  }
}

const InstagramFeedSection: React.FC = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  
  // Animation for floating elements
  const y1 = useMotionValue(0);
  const y2 = useMotionValue(0);
  
  const rotate1 = useTransform(y1, [0, 100], [0, 10]);
  const rotate2 = useTransform(y2, [0, 100], [0, -10]);

  useEffect(() => {
    // Animate floating elements
    const animateFloating = () => {
      const y1Animation = [0, -20, 0];
      const y2Animation = [0, 20, 0];
      
      y1.set(0);
      y2.set(0);
      
      let timeouts: number[] = [];
      
      const animate1 = () => {
        y1.set(y1Animation[0]);
        const timeout1 = window.setTimeout(() => {
          y1.set(y1Animation[1]);
          const timeout2 = window.setTimeout(() => {
            y1.set(y1Animation[2]);
            const timeout3 = window.setTimeout(animate1, 100);
            timeouts.push(timeout3);
          }, 1500);
          timeouts.push(timeout2);
        }, 1500);
        timeouts.push(timeout1);
      };
      
      const animate2 = () => {
        y2.set(y2Animation[0]);
        const timeout1 = window.setTimeout(() => {
          y2.set(y2Animation[1]);
          const timeout2 = window.setTimeout(() => {
            y2.set(y2Animation[2]);
            const timeout3 = window.setTimeout(animate2, 100);
            timeouts.push(timeout3);
          }, 2000);
          timeouts.push(timeout2);
        }, 2000);
        timeouts.push(timeout1);
      };
      
      animate1();
      animate2();
      
      // Return cleanup function
      return () => {
        timeouts.forEach(timeout => window.clearTimeout(timeout));
      };
    };
    
    const cleanupAnimation = animateFloating();
    
    // Trigger animations when section comes into view
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
    
    return () => {
      if (cleanupAnimation) {
        cleanupAnimation();
      }
    };
  }, [controls, isInView, y1, y2]);

  useEffect(() => {
    const loadInstagramEmbed = () => {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = '//www.instagram.com/embed.js';
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
      document.body.appendChild(script);
      
      // Return cleanup function
      return () => {
        // Only remove the script if it exists and was added by this component
        const scripts = document.querySelectorAll('script[src="//www.instagram.com/embed.js"]');
        if (scripts.length > 0) {
          try {
            document.body.removeChild(scripts[scripts.length - 1]);
          } catch (e) {
            console.warn('Error removing Instagram script:', e);
          }
        }
      };
    };

    let cleanup: (() => void) | undefined;
    
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      cleanup = loadInstagramEmbed();
    }
    
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2,
        duration: 0.6
      }
    }
  };

  const embedVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: 0.4,
        duration: 0.8
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.6,
        duration: 0.6
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px -5px rgba(147, 51, 234, 0.5)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 5px 10px -5px rgba(147, 51, 234, 0.5)",
    }
  };

  const decorationVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 0.8,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2,
        duration: 1
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Decorative elements */}
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-10 left-10 w-24 h-24 rounded-full bg-gradient-to-r from-purple-300/20 to-pink-300/20 blur-xl"
        variants={decorationVariants}
        initial="hidden"
        animate={controls}
      />
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-pink-300/20 to-purple-300/20 blur-xl"
        variants={decorationVariants}
        initial="hidden"
        animate={controls}
      />
      <motion.div
        className="absolute -top-10 right-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-lg"
        variants={decorationVariants}
        initial="hidden"
        animate={controls}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center mb-12"
        >
          <motion.h2 
            variants={titleVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-heading"
          >
            Follow Us on Instagram
          </motion.h2>
          
          <motion.div 
            className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={isInView ? { width: "6rem" } : { width: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          
          <motion.p 
            variants={subtitleVariants}
            className="text-gray-600 text-xl max-w-2xl mx-auto"
          >
            Stay connected with our latest updates and stories
          </motion.p>
        </motion.div>

        <motion.div 
          variants={embedVariants}
          whileHover="hover"
          className="max-w-4xl mx-auto"
        >
          {/* Instagram Embed */}
          <div className="instagram-embed-container p-6 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative pb-4">
              
              <iframe
                src="https://www.instagram.com/synergy_ooh/embed"
                className="w-full aspect-[5/6] border-none overflow-hidden rounded-lg"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default InstagramFeedSection;
