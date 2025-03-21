import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { format } from "date-fns";
import { apiEndpoint } from '../components/admin/config/api';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import ScrollReveal from '../components/common/ScrollReveal';
import LazyImage from '../components/common/LazyImage';
import { BookOpen } from 'lucide-react';

// Define blog interface
interface Blog {
  [x: string]: string | string[] | undefined;
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  author: string;
  tags: string[];
  created_at?: string;
  date?: string;
}

// Particle component for header animation
const HeaderParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || 400;
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
      const particleCount = Math.floor(window.innerWidth / 30); // Responsive particle count
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 0.2 - 0.1;
        const speedY = Math.random() * 0.2 - 0.1;
        
        // Use brand colors with varying opacity
        const colors = [
          'rgba(239, 68, 68, 0.4)', // Red
          'rgba(255, 255, 255, 0.3)', // White
          'rgba(200, 30, 30, 0.3)', // Darker red
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const alpha = Math.random() * 0.5 + 0.1;
        
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
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none"
    />
  );
};

interface BlogPostProps {
  blog: Blog;
}

const BlogPost: React.FC<BlogPostProps> = ({ blog }) => {
  // Strip HTML tags and truncate content
  const stripHtmlAndTruncate = useCallback((html: string, maxLines: number = 3, charsPerLine: number = 80) => {
    if (!html) return '';

    // Remove HTML tags
    const text = html.replace(/<[^>]*>/g, '');

    // Truncate to approximate number of lines
    const maxChars = maxLines * charsPerLine;
    if (text.length <= maxChars) return text;

    return text.substring(0, maxChars) + '...';
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMMM dd, yyyy");
    } catch (error) {
      return "Date unavailable";
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden h-full"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Link to={`/blog/${blog._id || blog.id}`} className="block h-full">
        <div className="h-48 overflow-hidden">
          <LazyImage
            src={blog.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
            alt={blog.title}
            className="w-full h-full"
            objectFit="cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center mb-3">
            <span className="text-sm text-gray-500">{formatDate(blog.createdAt || blog.created_at || blog.date || '')}</span>
            {blog.tags && blog.tags.length > 0 && (
              <span className="ml-auto px-3 py-1 text-xs font-medium bg-synergy-red/10 text-synergy-red rounded-full">
                {blog.tags[0]}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-synergy-dark mb-3 line-clamp-2">{blog.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {stripHtmlAndTruncate(blog.content)}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm font-medium text-gray-700">By {'Synergy'}</span>
            <span className="text-synergy-red font-medium text-sm">Read more →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all blogs
  const getBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await fetch(`${apiEndpoint.blog}/get-all`, { signal });

      if (!res.ok) {
        throw new Error(`Failed to fetch blogs: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const response = data.data;

      // Sort blogs by creation date (newest first)
      const sortedBlogs = Array.isArray(response)
        ? response.sort((a: Blog, b: Blog) => {
          const dateA = new Date(a.createdAt || a.created_at || a.date || 0);
          const dateB = new Date(b.createdAt || b.created_at || b.date || 0);
          return dateB.getTime() - dateA.getTime();
        })
        : [];

      setBlogs(sortedBlogs);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching blogs:", error);
        setError(`Failed to load blogs: ${error.message || "Unknown error"}`);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }

    // Return the cleanup function directly
    return () => {
      abortController.abort();
    };
  }, []);

  // Fetch blogs on component mount
  useEffect(() => {
    // Don't directly return the result of getBlogs (which is a Promise)
    // Instead, call it and return its cleanup function
    const cleanup = getBlogs();
    
    // Return the cleanup function
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then((cleanupFn: () => void) => {
          if (typeof cleanupFn === 'function') {
            cleanupFn();
          }
        });
      }
    };
  }, [getBlogs]);

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <LazyImage
            src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Blog and insights"
            className="w-full h-full"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-synergy-dark/90 via-synergy-dark/80 to-synergy-dark/90"></div>
        </div>
        
        {/* Particles Animation */}
        <div className="absolute inset-0">
          <HeaderParticles />
        </div>
        
        {/* Decorative Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-synergy-red/20 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-synergy-red/20 blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-white/10 blur-lg"></div>
        
        {/* Glossy Circle */}
        <div className="absolute left-1/4 bottom-1/4 w-40 h-40 rounded-full bg-gradient-to-tr from-synergy-red/20 to-white/5 backdrop-blur-sm border border-white/10"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto" variant="fadeUp">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-block mb-4"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <BookOpen className="text-white h-8 w-8" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Blog & <span className="text-transparent bg-clip-text bg-gradient-to-r from-synergy-red to-red-400">Insights</span>
            </motion.h1>
            
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-synergy-red to-red-400 mx-auto mb-6"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 96 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            ></motion.div>
            
            <motion.p 
              className="text-xl text-white/90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              Discover the latest trends, insights, and strategies in advertising and marketing.
              Stay informed with our expert perspectives.
            </motion.p>
          </ScrollReveal>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto">
            <path 
              fill="#f9fafb" 
              fillOpacity="1" 
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16" variant="fadeUp">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-synergy-dark mb-6">Latest Articles</h2>
            <div className="w-20 h-1 bg-synergy-red mx-auto mb-8"></div>
            <p className="text-gray-600">
              Stay updated with our latest news, industry insights, and expert tips to help your brand stand out.
            </p>
          </ScrollReveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <ScrollReveal className="text-center py-12" variant="fadeIn">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-red-600 mb-3">Error Loading Blogs</h3>
                <p className="text-gray-700">{error}</p>
                <button 
                  onClick={() => getBlogs()} 
                  className="mt-4 bg-synergy-red hover:bg-red-600 text-white py-2 px-6 rounded-full font-medium transition duration-300"
                >
                  Try Again
                </button>
              </div>
            </ScrollReveal>
          ) : blogs.length === 0 ? (
            <ScrollReveal className="text-center py-12" variant="fadeIn">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-blue-600 mb-3">No Articles Yet</h3>
                <p className="text-gray-700">We're working on creating valuable content for you. Check back soon!</p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <ScrollReveal key={blog._id || `blog-${index}`} variant="fadeUp" delay={index * 0.1} className="h-full">
                  <BlogPost blog={blog} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-synergy-dark">
        <div className="container mx-auto px-4">
          <ScrollReveal className="bg-gradient-to-r from-synergy-red to-synergy-red/80 rounded-2xl p-10 md:p-16 max-w-5xl mx-auto" variant="scale">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Subscribe to Our Newsletter</h2>
                <p className="text-white/90 mb-6">
                  Get the latest articles, resources, and insights delivered straight to your inbox.
                </p>
              </div>
              <div>
                <form className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-white outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-white text-synergy-red py-3 px-6 rounded-lg font-medium transition duration-300"
                  >
                    Subscribe Now
                  </motion.button>
                </form>
                <p className="text-white/70 text-sm mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default Blog;