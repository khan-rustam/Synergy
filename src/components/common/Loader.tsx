import React from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  width?: string;
  height?: string;
  fullScreen?: boolean;
  color?: string;
  showText?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  width = "50px", 
  height = "50px", 
  fullScreen = false,
  color = "#ff3366", // Default to synergy-red
  showText = true
}) => {
  const containerClass = fullScreen 
    ? "fixed top-0 left-0 w-screen h-screen bg-white/80 backdrop-blur-sm z-50" 
    : "relative";

  // Create a perfect circular animation
  const circleVariants = {
    initial: {
      rotate: 0,
    },
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  // Create a pulsing effect for the inner circle
  const pulseVariants = {
    initial: {
      scale: 0.8,
      opacity: 0.3,
    },
    animate: {
      scale: [0.8, 1, 0.8],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  const parsedSize = parseInt(width.replace('px', ''));
  const borderWidth = Math.max(3, Math.floor(parsedSize / 12)); // Responsive border width

  return (
    <div className={`flex justify-center items-center ${containerClass}`}>
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative" style={{ width, height }}>
          {/* Static background circle */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{ 
              border: `${borderWidth}px solid rgba(243, 244, 246, 0.5)`,
              width: "100%",
              height: "100%"
            }}
          />
          
          {/* Pulsing inner circle */}
          <motion.div
            className="absolute"
            style={{
              width: `calc(100% - ${borderWidth * 4}px)`,
              height: `calc(100% - ${borderWidth * 4}px)`,
              top: `${borderWidth * 2}px`,
              left: `${borderWidth * 2}px`,
              backgroundColor: color,
              borderRadius: "50%",
              opacity: 0.3
            }}
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
          
          {/* Spinning outer circle */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ 
              border: `${borderWidth}px solid ${color}`,
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              width: "100%",
              height: "100%"
            }}
            variants={circleVariants}
            initial="initial"
            animate="animate"
          />
        </div>
        {showText && <span className="mt-3 text-sm text-gray-600">Loading...</span>}
      </motion.div>
    </div>
  );
};

export default Loader;
