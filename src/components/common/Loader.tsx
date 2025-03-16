import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  width?: string;
  height?: string;
  fullScreen?: boolean;
  color?: string;
  showText?: boolean;
}

// Particle animation for the loader
const LoaderParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle properties
    const particlesArray: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
    }[] = [];
    
    // Create particles
    const createParticles = () => {
      const particleCount = Math.floor(window.innerWidth / 20); // More particles for loader
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 4 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 0.5 - 0.25;
        const speedY = Math.random() * 0.5 - 0.25;
        
        // Use brand colors with varying opacity
        const colors = [
          'rgba(239, 68, 68, 0.6)', // Red
          'rgba(255, 255, 255, 0.4)', // White
          'rgba(200, 30, 30, 0.5)', // Darker red
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const alpha = Math.random() * 0.6 + 0.2;
        
        particlesArray.push({
          x,
          y,
          size,
          speedX,
          speedY,
          color,
          alpha
        });
      }
    };
    
    createParticles();
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none"
    />
  );
};

const Loader: React.FC<LoaderProps> = ({ 
  width = "150px", 
  height = "150px", 
  fullScreen = false,
  color = "#ef4444", // Default to synergy-red
  showText = true
}) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 flex items-center justify-center w-screen h-screen bg-synergy-dark z-50 overflow-hidden" 
    : "relative flex items-center justify-center w-full h-full min-h-[300px] bg-synergy-dark/90 rounded-lg overflow-hidden";

  // Animation variants
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
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
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
    <div className={containerClass}>
      {/* Particles Animation */}
      {fullScreen && <LoaderParticles />}
      
      {/* Decorative Shapes - Positioned relative to the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-3/4 -translate-y-3/4 w-32 h-32 rounded-full bg-synergy-red/20 blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 translate-x-1/4 translate-y-1/4 w-40 h-40 rounded-full bg-synergy-red/20 blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 translate-x-1/4 -translate-y-1/4 w-24 h-24 rounded-full bg-white/10 blur-lg"></div>
      
      {/* Glossy Circle - Perfectly centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-tr from-synergy-red/10 to-white/5 backdrop-blur-sm border border-white/10"></div>
      
      {/* Main Loader - Centered with flex */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        variants={loaderVariants}
        initial="initial"
        animate={["animate", "pulse"]}
      >
        <div className="relative flex items-center justify-center">
          <motion.svg
            width={width}
            height={height}
            viewBox="0 0 100 100"
            className="text-synergy-red drop-shadow-lg"
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-synergy-red to-red-400 text-3xl font-bold">S</span>
          </motion.div>
        </div>
        
        {showText && (
          <motion.p
            className="text-center text-white/90 mt-6 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Loading Experience
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Loader;
