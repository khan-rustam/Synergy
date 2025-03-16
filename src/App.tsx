import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScrollToTop from './components/utils/ScrollToTop';
import Login from './components/common/Login';
import Register from './components/common/Register';
import NotFound from './components/common/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Loader from './components/common/Loader';

// Layout components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Lazy load pages with prefetching
const Home = lazy(() => import(/* webpackPrefetch: true */ './pages/Home'));
const About = lazy(() => import(/* webpackPrefetch: true */ './pages/About'));
const Services = lazy(() => import(/* webpackPrefetch: true */ './pages/Services'));
const Blog = lazy(() => import(/* webpackPrefetch: true */ './pages/Blog'));
const Contact = lazy(() => import(/* webpackPrefetch: true */ './pages/Contact'));
const BlogDetail = lazy(() => import(/* webpackPrefetch: true */ './pages/BlogDetail'));

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const cleanup = new Set<() => void>();

    // Wait for DOM to be ready
    const initializeAnimations = () => {
      // Initialize smooth scrolling
      const links = document.querySelectorAll('a[href^="#"]');
      
      const handleScroll = (targetElement: Element) => {
        gsap.to(window, {
          duration: 1,
          scrollTo: {
            y: targetElement,
            offsetY: 80
          },
          ease: 'power3.inOut'
        });
      };
      
      links.forEach(link => {
        const clickHandler = (e: Event) => {
          e.preventDefault();
          
          const targetId = link.getAttribute('href');
          if (!targetId || targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => handleScroll(targetElement), 150);
          }
        };

        link.addEventListener('click', clickHandler);
        cleanup.add(() => link.removeEventListener('click', clickHandler));
      });

      // Optimized animations with batching and existence checks
      const animateOnScroll = (selector: string, animation: object) => {
        const items = document.querySelectorAll(selector);
        if (!items.length) return;

        const batch = gsap.utils.toArray(items);
        gsap.set(batch, { opacity: 0, y: 50 });
        
        batch.forEach((item) => {
          if (!item) return;

          const tween = gsap.fromTo(
            item as gsap.TweenTarget,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: item as Element,
                start: 'top 80%',
                toggleActions: 'play none none none',
                once: true
              },
              ...animation
            }
          );

          cleanup.add(() => {
            tween.kill();
            ScrollTrigger.getAll().forEach(st => st.kill());
          });
        });
      };

      // Initialize animations with a slight delay to ensure DOM is ready
      setTimeout(() => {
        animateOnScroll('section > .container > h2', { delay: 0.2 });
        animateOnScroll('.animate-on-scroll', {});
      }, 100);
    };

    // Initialize after a short delay to ensure React has mounted components
    const initTimeout = setTimeout(initializeAnimations, 100);
    cleanup.add(() => clearTimeout(initTimeout));

    // Cleanup function
    return () => {
      clearTimeout(scrollTimeout);
      cleanup.forEach(fn => fn());
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [location]);

  return (
    <>
      <ScrollToTop />
      <div className="font-body">
        <Navbar />
        <ToastContainer limit={3} />
        <Suspense fallback={<Loader fullScreen={true} showText={true} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {location.pathname !== '/admin-dashboard' && <Footer />}
      </div>
    </>
  );
};

export default App;