import React, { useRef, useState, useEffect } from 'react';

interface MagneticElementProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  as?: React.ElementType;
  [key: string]: any;
}

const MagneticElement: React.FC<MagneticElementProps> = ({
  children,
  className = '',
  strength = 30,
  radius = 200,
  as: Component = 'div',
  ...props
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!elementRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = elementRef.current.getBoundingClientRect();
    
    // Calculate center of the element
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from mouse to center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Calculate distance from mouse to center (Pythagorean theorem)
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Only apply the effect if the mouse is within the radius
    if (distance < radius) {
      // Calculate the strength based on the distance (closer = stronger)
      const strengthFactor = 1 - Math.min(distance / radius, 1);
      
      // Apply the magnetic effect
      const x = distanceX * strengthFactor * (strength / 10);
      const y = distanceY * strengthFactor * (strength / 10);
      
      setPosition({ x, y });
    } else {
      // Reset position if mouse is outside radius
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset position with a smooth transition
    setPosition({ x: 0, y: 0 });
  };

  // Reset position when component unmounts or when dependencies change
  useEffect(() => {
    return () => {
      setPosition({ x: 0, y: 0 });
    };
  }, []);

  // Only apply magnetic effect on desktop
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  return (
    <Component
      ref={elementRef}
      className={`magnetic-hover ${className}`}
      onMouseMove={!isMobile ? handleMouseMove : undefined}
      onMouseEnter={!isMobile ? handleMouseEnter : undefined}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      style={{
        transform: isHovered ? `translate3d(${position.x}px, ${position.y}px, 0)` : 'translate3d(0, 0, 0)',
        transition: isHovered ? 'transform 0.2s cubic-bezier(0.2, 1, 0.3, 1)' : 'transform 0.5s cubic-bezier(0.2, 1, 0.3, 1)',
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default MagneticElement; 