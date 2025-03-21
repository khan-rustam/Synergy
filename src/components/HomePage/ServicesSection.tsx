import React, {  useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Megaphone, Calendar, Palette, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, category, delay }) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  });

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateY: -5,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateY: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        delay: delay * 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      y: -15,
      boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.15)",
      background: "linear-gradient(to bottom right, #ffffff, #fff5f5)",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -30 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: delay * 0.2 + 0.3 
      }
    },
    hover: { 
      scale: 1.2, 
      rotate: 0,
      y: -5,
      background: "linear-gradient(135deg, #ffe5e5, #ffbcbc)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  const tagVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5, 
        delay: delay * 0.2 + 0.5 
      }
    },
    hover: {
      background: "#ffe5e5",
      x: 3,
      transition: {
        duration: 0.2
      }
    }
  };

  const arrowAnimation = {
    x: 8, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
      repeat: Infinity,
      repeatType: "reverse" as const,
      repeatDelay: 0.2
    }
  };

  return (
    <motion.div 
      ref={ref}
      className="card-3d bg-white rounded-xl shadow-lg overflow-hidden transform-gpu"
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
    >
      <div className="relative w-full h-full p-8">
        {/* Background glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Icon Circle with Animation */}
        <motion.div 
          className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 relative z-10"
          variants={iconVariants}
        >
          <motion.div 
            className="text-synergy-red"
          >
            {icon}
          </motion.div>
        </motion.div>

        {/* Category Tag with Animation */}
        <motion.span 
          className="inline-block px-4 py-1 bg-red-50 text-synergy-red text-sm rounded-full mb-4 relative z-10"
          variants={tagVariants}
        >
          {category}
        </motion.span>

        {/* Content with Animation */}
        <motion.h3 
          className="text-2xl font-heading font-bold text-synergy-dark mb-3 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: delay * 0.2 + 0.6 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 mb-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: delay * 0.2 + 0.7 }}
        >
          {description}
        </motion.p>

        {/* Learn More Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: delay * 0.2 + 0.8 }}
          className="text-synergy-red font-medium flex items-center relative z-10"
          whileHover={{ x: 5 }}
        >
          <span>Learn more</span>
          <motion.svg 
            className="w-4 h-4 ml-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            initial={{ x: 0, opacity: 0.7 }}
            whileHover={arrowAnimation}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ServicesSection: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: sectionInViewRef, inView: sectionInView } = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "6rem",
      transition: { 
        duration: 1,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.8
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(255, 51, 102, 0.4)",
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.95
    }
  };

  const featuredServices = [
    {
      icon: <Megaphone className="w-8 h-8" />,
      title: "Billboard Advertising",
      category: "Outdoor",
      description: "Strategic placement of your brand on high-visibility billboards across prime locations.",
      delay: 0
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Event Management",
      category: "Events",
      description: "End-to-end planning and execution of brand events that create memorable experiences.",
      delay: 1
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Brand Identity",
      category: "Branding",
      description: "Comprehensive branding solutions that establish a strong market presence.",
      delay: 2
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Digital Integration",
      category: "Digital",
      description: "Seamless integration of digital elements with traditional OOH advertising.",
      delay: 3
    }
  ];

  return (
    <section 
      ref={(el) => {
        // @ts-ignore - combining refs
        sectionRef.current = el;
        sectionInViewRef(el);
      }} 
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <motion.div 
        className="absolute -top-20 -right-20 w-64 h-64 bg-red-50 rounded-full opacity-30 blur-3xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={sectionInView ? { opacity: 0.3, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-50 rounded-full opacity-20 blur-3xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={sectionInView ? { opacity: 0.2, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading Section with Animation */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-heading font-bold text-synergy-dark mb-4"
            variants={headingVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
          >
            Our Services
          </motion.h2>
          
          <motion.div 
            className="h-1 bg-synergy-red mx-auto mb-6"
            variants={lineVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
          ></motion.div>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Transform your brand visibility with our innovative advertising solutions. 
            From billboards to digital integration, we make your brand impossible to ignore.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featuredServices.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              category={service.category}
              delay={service.delay}
            />
          ))}
        </div>

        {/* Centered Explore More Button with Animation */}
        <div className="text-center">
          <motion.button
            onClick={() => navigate('/services')}
            className="relative inline-flex items-center justify-center px-8 py-4 
              bg-synergy-red text-white font-bold text-lg rounded-full 
              transition-all duration-300 overflow-hidden"
            variants={buttonVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="relative z-10 flex items-center">
              <span>Explore More Services</span>
              <motion.svg 
                className="w-5 h-5 ml-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-synergy-red to-red-600"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;