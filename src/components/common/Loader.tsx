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
