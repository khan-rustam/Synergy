import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { apiEndpoint } from '../admin/config/api';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

interface TestimonialProps {
  clientName: string;
  companyName: string;
  description: string;
  imageUrl: string;
  rating: number;
  index: number;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9,
    rotateY: -5
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  },
  hover: {
    y: -10,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0, y: 20 },
  visible: { 
    scale: 1, 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      delay: 0.1
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 0 20px rgba(255, 51, 102, 0.3)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: 0.2
    }
  }
};

const quoteVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: 0.1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.1
    }
  }
};

const starVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.2 + (i * 0.05),
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }),
  hover: {
    scale: 1.2,
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 0.5
    }
  }
};

// Testimonial skeleton component for loading state
const TestimonialSkeleton: React.FC<{ index: number }> = ({ index }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 md:p-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.3, 
          delay: index * 0.1 
        }
      }}
    >
      {/* Large quote mark in background */}
      <div className="absolute -top-2 -left-2 text-9xl text-gray-100 pointer-events-none font-serif opacity-10">
        "
      </div>
      
      <div className="relative z-10">
        {/* Client image and info skeleton */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-200 animate-pulse"></div>
          
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-1 animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-100 rounded mb-1 animate-pulse"></div>
            <div className="flex mt-1 space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Testimonial text skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonial: React.FC<TestimonialProps> = ({ clientName, companyName, description, imageUrl, rating, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  
  // Generate star rating display with animation
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <motion.span
          key={i}
          variants={starVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          whileHover="hover"
          custom={i}
          className={`text-xl ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
        >
          ★
        </motion.span>
      );
    }
    return stars;
  };

  return (
    <motion.div
      ref={cardRef}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8 relative overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
    >
      {/* Large quote mark in background */}
      <motion.div 
        className="absolute -top-2 -left-2 text-9xl text-gray-100 pointer-events-none font-serif"
        variants={quoteVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        "
      </motion.div>
      
      <div className="relative z-10">
        {/* Client image and info */}
        <div className="flex items-center mb-6">
          <motion.div 
            className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-synergy-red/20"
            variants={imageVariants}
            whileHover="hover"
          >
            <img 
              src={imageUrl || 'https://via.placeholder.com/150'} 
              alt={clientName} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
          
          <motion.div variants={textVariants}>
            <h4 className="text-lg font-bold text-synergy-dark">{clientName}</h4>
            <p className="text-gray-600 text-sm">{companyName}</p>
            <div className="flex mt-1">
              {renderStars()}
            </div>
          </motion.div>
        </div>
        
        {/* Testimonial text */}
        <motion.p 
          className="text-gray-700 italic relative z-10"
          variants={textVariants}
        >
          "{description}"
        </motion.p>
      </div>
    </motion.div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const controllerRef = useRef<AbortController | null>(null);

  const fetchTestimonials = async () => {
    // Create a new AbortController for this request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    
    try {
      const response = await fetch(`${apiEndpoint.testimonial}/get-all`, {
        signal: controllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      
      const data = await response.json();
      setTestimonials(data.data);
    } catch (err) {
      // Don't set error state if the request was aborted
      if ((err as Error).name !== 'AbortError') {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials. Please try again later.');
      }
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    
    // Cleanup function to abort any in-flight requests
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  // Animation variants for section elements
  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "6rem",
      transition: { 
        duration: 0.8,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const backgroundBlobVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 0.3, 
      scale: 1,
      transition: { 
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  // Render skeleton loaders for initial load
  const renderSkeletons = () => {
    return [0, 1, 2].map((index) => (
      <SwiperSlide key={`skeleton-${index}`} className="pb-12">
        <TestimonialSkeleton index={index} />
      </SwiperSlide>
    ));
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gray-50 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-synergy-red/5 rounded-full blur-3xl"
        variants={backgroundBlobVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-80 h-80 bg-synergy-red/5 rounded-full blur-3xl"
        variants={backgroundBlobVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ delay: 0.3 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-heading font-bold text-synergy-dark mb-4"
            variants={headingVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            Client Testimonials
          </motion.h2>
          
          <motion.div 
            className="h-1 bg-synergy-red mx-auto mb-6"
            variants={lineVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          ></motion.div>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Hear what our clients have to say about their experience working with us.
          </motion.p>
        </div>

        {/* Loading state - only show spinner on subsequent loads, not initial load */}
        <AnimatePresence>
          {loading && !isInitialLoad && (
            <motion.div 
              className="flex justify-center items-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 border-4 border-synergy-red/30 border-t-synergy-red rounded-full animate-spin"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p>{error}</p>
              <button 
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchTestimonials();
                }} 
                className="mt-2 text-synergy-red font-medium hover:underline"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonials Swiper - show skeletons during initial load */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="overflow-visible"
        >
          <Swiper
            modules={[Pagination, Autoplay, EffectCoverflow]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="testimonial-swiper py-10"
          >
            {/* Show skeletons during initial load */}
            {isInitialLoad && renderSkeletons()}
            
            {/* Show actual testimonials once loaded */}
            {!isInitialLoad && !error && testimonials.length > 0 && 
              testimonials.map((testimonial, index) => (
                <SwiperSlide key={index} className="pb-12">
                  <Testimonial 
                    clientName={testimonial.clientName}
                    companyName={testimonial.companyName}
                    description={testimonial.description}
                    imageUrl={testimonial.imageUrl}
                    rating={testimonial.rating}
                    index={index}
                  />
                </SwiperSlide>
              ))
            }
          </Swiper>
        </motion.div>

        {/* No testimonials state */}
        {!loading && !error && !isInitialLoad && testimonials.length === 0 && (
          <motion.div 
            className="text-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-600">No testimonials available at the moment.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;