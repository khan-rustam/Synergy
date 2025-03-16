import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import Loader from '../components/common/Loader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Gradient styles
const headingGradientStyle = {
  background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

const accentGradientStyle = {
  background: 'linear-gradient(135deg, #ff3366 0%, #ff0844 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

// Lazy-loaded components
const HeroSection = lazy(() => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '/components/HomePage/HeroSection';
  document.head.appendChild(link);
  return import('../components/HomePage/HeroSection');
});

const ServicesSection = lazy(() => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '/components/HomePage/ServicesSection';
  document.head.appendChild(link);
  return import('../components/HomePage/ServicesSection');
});

const BlogsSection = lazy(() => import('../components/HomePage/BlogsSection'));
const ClientsSection = lazy(() => import('../components/HomePage/ClientsSection'));
const TestimonialsSection = lazy(() => import('../components/HomePage/TestimonialsSection'));
const InstagramFeedSection = lazy(() => import('../components/HomePage/InstagramFeedSection'));

// Preload all components
const preloadAllComponents = () => {
  if (typeof window !== 'undefined') {
    import('../components/HomePage/HeroSection');
    import('../components/HomePage/ServicesSection');
    import('../components/HomePage/BlogsSection');
    import('../components/HomePage/ClientsSection');
    import('../components/HomePage/TestimonialsSection');
    import('../components/HomePage/InstagramFeedSection');
  }
};

// Initialize preloading
preloadAllComponents();

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const fadeInUpVariant = {
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

// Section loader component
const SectionLoader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <Loader 
          width="50px" 
          height="50px" 
          color="#ff3366"
          showText={false}
        />
        <motion.p 
          className="text-synergy-dark text-sm mt-3"
          style={accentGradientStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
};

// Section wrapper with animations
const AnimatedSection: React.FC<{
  id: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className = "" }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  
  return (
    <section 
      id={id} 
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="w-full h-full"
      >
        {children}
      </motion.div>
      
      {/* Section divider */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
    </section>
  );
};

const Home: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: mainRef });
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // Use Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    // GSAP animations
    const sections = gsap.utils.toArray('section[id]');
    sections.forEach((section: any) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          section.classList.add('active-section');
        },
        onLeaveBack: () => {
          section.classList.remove('active-section');
        }
      });
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={mainRef} className="relative">
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-synergy-red to-red-600 z-50 origin-left"
        style={{ scaleX: progressBarWidth }}
      />
      
      <section id="hero">
        <Suspense fallback={<SectionLoader message="Loading hero..." />}>
          <motion.div
            key="hero-section"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <HeroSection />
          </motion.div>
        </Suspense>
      </section>

      <AnimatedSection id="services">
        <Suspense fallback={<SectionLoader message="Loading services..." />}>
          <ServicesSection />
        </Suspense>
      </AnimatedSection>

      <AnimatedSection id="blogs">
        <Suspense fallback={<SectionLoader message="Loading blogs..." />}>
          <BlogsSection />
        </Suspense>
      </AnimatedSection>

      <AnimatedSection id="clients">
        <Suspense fallback={<SectionLoader />}>
          <ClientsSection />
        </Suspense>
      </AnimatedSection>

      <AnimatedSection id="testimonials">
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense>
      </AnimatedSection>

      <AnimatedSection id="instagram">
        <Suspense fallback={<SectionLoader />}>
          <InstagramFeedSection />
        </Suspense>
      </AnimatedSection>
      
      {/* Back to top button */}
      <AnimatePresence>
        {scrollYProgress.get() > 0.2 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 bg-synergy-red text-white p-3 rounded-full shadow-lg"
            aria-label="Back to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;