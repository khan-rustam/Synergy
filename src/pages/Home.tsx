import React, { lazy, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loader from '../components/common/Loader';

// Add gradient styles
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

// Implement route-based code splitting with prefetch hints
const HeroSection = lazy(() => {
  // Add prefetch hint for critical component
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '/components/HomePage/HeroSection';
  document.head.appendChild(link);
  return import(/* webpackChunkName: "hero" */ '../components/HomePage/HeroSection');
});

const ServicesSection = lazy(() => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '/components/HomePage/ServicesSection';
  document.head.appendChild(link);
  return import(/* webpackChunkName: "services" */ '../components/HomePage/ServicesSection');
});

// Group related sections into a single chunk for better caching
const BlogsSection = lazy(() => import(/* webpackChunkName: "content" */ '../components/HomePage/BlogsSection'));
const ClientsSection = lazy(() => import(/* webpackChunkName: "content" */ '../components/HomePage/ClientsSection'));
const TestimonialsSection = lazy(() => import(/* webpackChunkName: "social" */ '../components/HomePage/TestimonialsSection'));
const InstagramFeedSection = lazy(() => import(/* webpackChunkName: "social" */ '../components/HomePage/InstagramFeedSection'));

// Preload all components immediately
const preloadAllComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload all components in parallel
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

// Optimized animation variants with minimal delay
const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Optimized loader component with framer-motion animations
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

const Home: React.FC = () => {
  // Use Intersection Observer for better performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Mark section as visible when it enters viewport
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Critical content - Load immediately */}
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

      <section id="services">
        <Suspense fallback={<SectionLoader message="Loading services..." />}>
          <motion.div
            key="services-section"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <ServicesSection />
          </motion.div>
        </Suspense>
      </section>

      {/* Load all remaining sections immediately */}
      <section id="blogs">
        <Suspense fallback={<SectionLoader message="Loading blogs..." />}>
          <motion.div
            key="blogs-section"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <BlogsSection />
          </motion.div>
        </Suspense>
      </section>

      <section id="clients">
        <Suspense fallback={<SectionLoader />}>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <ClientsSection />
          </motion.div>
        </Suspense>
      </section>

      <section id="testimonials">
        <Suspense fallback={<SectionLoader />}>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <TestimonialsSection />
          </motion.div>
        </Suspense>
      </section>

      <section id="instagram">
        <Suspense fallback={<SectionLoader />}>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <InstagramFeedSection />
          </motion.div>
        </Suspense>
      </section>
    </>
  );
};

export default Home;