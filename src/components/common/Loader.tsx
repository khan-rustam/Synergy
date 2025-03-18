import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  width?: string;
  height?: string;
  fullScreen?: boolean;
  color?: string;
  showText?: boolean;
  isLoading?: boolean;
}

// Enhanced particle animation for the loader
const LoaderParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions with device pixel ratio for better quality
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Enhanced particle properties
    const particlesArray: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      pulse: number;
      pulseSpeed: number;
    }[] = [];
    
    // Create enhanced particles
    const createParticles = () => {
      const particleCount = Math.floor(window.innerWidth / 15); // More particles
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 5 + 2;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 1 - 0.5;
        const speedY = Math.random() * 1 - 0.5;
        
        // Enhanced color palette
        const colors = [
          'rgba(239, 68, 68, 0.8)', // Bright red
          'rgba(255, 255, 255, 0.6)', // White
          'rgba(200, 30, 30, 0.7)', // Dark red
          'rgba(255, 100, 100, 0.6)', // Light red
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const alpha = Math.random() * 0.7 + 0.3;
        const pulse = Math.random() * Math.PI;
        const pulseSpeed = 0.02 + Math.random() * 0.02;
        
        particlesArray.push({
          x,
          y,
          size,
          speedX,
          speedY,
          color,
          alpha,
          pulse,
          pulseSpeed
        });
      }
    };
    
    createParticles();
    
    // Enhanced animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        
        // Pulsing effect
        p.pulse += p.pulseSpeed;
        const currentAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.8 + Math.sin(p.pulse) * 0.2), 0, Math.PI * 2);
        ctx.fill();
        
        // Update position with smooth movement
        p.x += p.speedX * (1 + Math.sin(p.pulse) * 0.2);
        p.y += p.speedY * (1 + Math.sin(p.pulse) * 0.2);
        
        // Improved boundary check with smooth transition
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};

const Loader: React.FC<LoaderProps> = ({ 
  width = "150px", 
  height = "150px", 
  fullScreen = false,
  color = "#ef4444",
  showText = true,
  isLoading = true
}) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 flex items-center justify-center w-screen h-screen bg-synergy-dark z-[9999] overflow-hidden" 
    : "relative flex items-center justify-center w-full h-full min-h-[300px] bg-synergy-dark/90 rounded-lg overflow-hidden";

  // Enhanced animation variants
  const loaderVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  const logoPathVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div 
          className={containerClass}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Enhanced Particles Animation */}
          {fullScreen && <LoaderParticles />}
          
          {/* Enhanced Decorative Shapes */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-3/4 -translate-y-3/4 w-40 h-40 rounded-full bg-synergy-red/20 blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 translate-x-1/4 translate-y-1/4 w-48 h-48 rounded-full bg-synergy-red/20 blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Enhanced Glossy Circle */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-synergy-red/10 to-white/5 backdrop-blur-sm border border-white/10"
            animate={{
              boxShadow: [
                "0 0 30px rgba(239, 68, 68, 0.2)",
                "0 0 50px rgba(239, 68, 68, 0.4)",
                "0 0 30px rgba(239, 68, 68, 0.2)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Enhanced Main Loader */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center"
            variants={loaderVariants}
            initial="initial"
            animate={["animate", "pulse"]}
            exit="exit"
          >
            <div className="relative flex items-center justify-center">
              <motion.svg
                width={width}
                height={height}
                viewBox="0 0 100 100"
                className="text-synergy-red drop-shadow-lg filter"
              >
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  variants={logoPathVariants}
                  initial="initial"
                  animate="animate"
                />
                <motion.path
                  d="M30 40 L50 65 L70 40"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={logoPathVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.svg>
              
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-synergy-red to-red-400 text-4xl font-bold"
                  animate={{
                    textShadow: [
                      "0 0 8px rgba(239, 68, 68, 0.4)",
                      "0 0 16px rgba(239, 68, 68, 0.6)",
                      "0 0 8px rgba(239, 68, 68, 0.4)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  S
                </motion.span>
              </motion.div>
            </div>
            
            {showText && (
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <motion.p
                  className="text-white/90 text-lg font-medium"
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Loading....
                </motion.p>
                <motion.div 
                  className="mt-2 flex justify-center space-x-1"
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-synergy-red"
                      animate={{
                        y: ["0%", "-50%", "0%"]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
