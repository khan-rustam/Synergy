import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { apiEndpoint } from '../admin/config/api';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestimonialProps {
  clientName: string;
  companyName: string;
  description: string;
  imageUrl: string;
  rating: number;
}

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

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  }
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const starVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  })
};

const Testimonial: React.FC<TestimonialProps> = ({ clientName, companyName, description, imageUrl, rating }) => {
  // Generate star rating display with animation
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <motion.span
          key={i}
          variants={starVariants}
          initial="hidden"
          animate="visible"
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
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col transform-gpu"
    >
      <div className="flex flex-col items-start">
        <div className="flex items-center w-full mb-4">
          <motion.div
            variants={imageVariants}
            className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-synergy-light"
          >
            <motion.img 
              src={imageUrl} 
              alt={clientName} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/150?text=" + clientName.charAt(0);
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          
          <div className="ml-4 flex flex-col">
            <motion.h3 
              variants={textVariants}
              className="font-heading font-bold text-xl text-synergy-dark"
            >
              {clientName}
            </motion.h3>
            <motion.p 
              variants={textVariants}
              className="text-sm text-gray-600 mb-1"
            >
              {companyName}
            </motion.p>
            <div className="flex space-x-1">{renderStars()}</div>
          </div>
        </div>
        
        <motion.div 
          variants={textVariants}
          className="mt-2 mb-4"
        >
          <p className="text-gray-700 text-lg leading-relaxed">{description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiEndpoint.testimonial}/get-all`);
      const res = await response.json();
      const data = res.data;
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      id="testimonials" 
      className="py-20 bg-synergy-light/50 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-heading font-bold text-synergy-dark mb-4"
          >
            Client Testimonials
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-20 h-1 bg-synergy-red mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-gray-600"
          >
            Don't just take our word for it. Here's what our clients have to say about working with Synergy OOH.
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      transition: {
                        repeat: Infinity,
                        duration: 1,
                        ease: "easeInOut"
                      }
                    }}
                    className="w-3 h-3 bg-synergy-red rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      transition: {
                        repeat: Infinity,
                        duration: 1,
                        delay: 0.2,
                        ease: "easeInOut"
                      }
                    }}
                    className="w-3 h-3 bg-synergy-red rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      transition: {
                        repeat: Infinity,
                        duration: 1,
                        delay: 0.4,
                        ease: "easeInOut"
                      }
                    }}
                    className="w-3 h-3 bg-synergy-red rounded-full"
                  />
                </div>
              </motion.div>
            ) : testimonials.length > 0 ? (
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="!pb-14"
              >
                {testimonials.map((testimonial, index) => (
                  <SwiperSlide key={index} className="h-auto">
                    <Testimonial
                      clientName={testimonial.clientName}
                      companyName={testimonial.companyName}
                      description={testimonial.description}
                      imageUrl={testimonial.imageUrl}
                      rating={testimonial.rating}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <p className="text-gray-500">No testimonials available</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;