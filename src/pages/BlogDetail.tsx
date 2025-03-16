import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { apiEndpoint } from '../components/admin/config/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import ScrollReveal from '../components/common/ScrollReveal';
import LazyImage from '../components/common/LazyImage';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Define blog interface
interface Blog {
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

// Particle component for background animation
const Particles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
      const particleCount = Math.floor(window.innerWidth / 20); // Responsive particle count
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 5 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 0.2 - 0.1;
        const speedY = Math.random() * 0.2 - 0.1;
        const color = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
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
      className="absolute inset-0 pointer-events-none opacity-30"
    />
  );
};

/**
 * Related Blog Card Component
 */
const RelatedBlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
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
      className="bg-white rounded-lg shadow-md overflow-hidden h-full"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Link to={`/blog/${blog._id}`} className="block h-full">
        <div className="h-40 overflow-hidden">
          <LazyImage
            src={blog.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
            alt={blog.title}
            className="w-full h-full"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2">
            <span className="text-xs text-gray-500">{formatDate(blog.createdAt || blog.created_at || blog.date || '')}</span>
          </div>
          <h3 className="text-lg font-bold text-synergy-dark mb-2 line-clamp-2">{blog.title}</h3>
          <span className="text-synergy-red text-sm font-medium">Read article →</span>
        </div>
      </Link>
    </motion.div>
  );
};

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = Math.min(window.scrollY / totalHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch blog details by ID
  const getBlogById = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await fetch(`${apiEndpoint.blog}/get-by-id/${id}`, { signal });

      if (!res.ok) {
        throw new Error(`Failed to fetch blog: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setBlog(data.data);
      fetchAllBlogs(data.data._id);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching blog:", error);
        setError(`Failed to load blog: ${error.message || "Unknown error"}`);
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
  }, [id, fetchAllBlogs]);

  // Fetch all blogs for related posts
  const fetchAllBlogs = useCallback(async (currentBlogId: string) => {
    setBlogsLoading(true);

    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await fetch(`${apiEndpoint.blog}/get-all`, { signal });

      if (!res.ok) {
        throw new Error(`Failed to fetch blogs: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const response = data.data;

      // Filter out current blog and limit to 3 related posts
      const filteredBlogs = Array.isArray(response)
        ? response
          .filter((blog: Blog) => blog._id !== currentBlogId)
          .sort(() => 0.5 - Math.random()) // Shuffle array
          .slice(0, 3) // Get first 3 items
        : [];

      setAllBlogs(filteredBlogs);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching related blogs:", error);
      }
    } finally {
      if (!signal.aborted) {
        setBlogsLoading(false);
      }
    }

    // Return the cleanup function directly
    return () => {
      abortController.abort();
    };
  }, []);

  // Initialize animations
  useEffect(() => {
    if (blog && contentRef.current) {
      // Clean up any existing GSAP animations
      const animations: gsap.core.Tween[] = [];
      
      // Animate content elements
      const contentElements = contentRef.current.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, img');
      
      contentElements.forEach((element, index) => {
        const animation = gsap.fromTo(
          element,
          { 
            opacity: 0,
            y: 20 
          },
          { 
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
        
        animations.push(animation);
      });
      
      // Clean up animations on unmount
      return () => {
        animations.forEach(animation => {
          if (animation.scrollTrigger) {
            animation.scrollTrigger.kill();
          }
          animation.kill();
        });
      };
    }
  }, [blog]);

  // Fetch blog on component mount
  useEffect(() => {
    // Don't directly return the result of getBlogById (which is a Promise)
    // Instead, call it and return its cleanup function
    const cleanup = getBlogById();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Return the cleanup function
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [getBlogById, id]);

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Date unavailable";
    
    try {
      const date = new Date(dateString);
      return format(date, "MMMM dd, yyyy");
    } catch (error) {
      return "Date unavailable";
    }
  };

  return (
    <PageTransition>
      {/* Progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-synergy-red z-50 transition-all duration-100"
        style={{ width: `${scrollProgress * 100}%` }}
      />
      
      {/* Main content */}
      <div ref={containerRef} className="relative">
        {/* Background particles */}
        <Particles />
        
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="space-y-8 w-full max-w-4xl px-4">
              {/* Skeleton loader for blog post */}
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/4 mb-12"></div>
                <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="min-h-screen flex items-center justify-center">
            <ScrollReveal className="text-center py-12" variant="fadeIn">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-red-600 mb-3">Error Loading Blog</h3>
                <p className="text-gray-700">{error}</p>
                <div className="mt-6 space-x-4">
                  <button 
                    onClick={() => getBlogById()} 
                    className="bg-synergy-red hover:bg-red-600 text-white py-2 px-6 rounded-full font-medium transition duration-300"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => navigate('/blog')} 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-full font-medium transition duration-300"
                  >
                    Back to Blogs
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        ) : blog ? (
          <div className="pt-14">
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0">
                <LazyImage
                  src={blog.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}
                  alt={blog.title}
                  className="w-full h-full"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-synergy-dark/70"></div>
              </div>
              <ScrollReveal className="container mx-auto px-4 relative z-10 text-center max-w-4xl" variant="fadeUp">
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {blog.tags && blog.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 text-xs font-medium bg-synergy-red/90 text-white rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">{blog.title}</h1>
                <div className="flex items-center justify-center text-white/80 text-sm md:text-base">
                  <span>By {blog.author || 'Synergy Team'}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(blog.createdAt || blog.created_at || blog.date)}</span>
                </div>
              </ScrollReveal>
            </section>
            
            {/* Blog Content */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                  <ScrollReveal className="prose prose-lg max-w-none" variant="fadeUp">
                    <div 
                      ref={contentRef}
                      className="blog-content"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  </ScrollReveal>
                  
                  {/* Share buttons */}
                  <ScrollReveal className="mt-12 border-t border-gray-200 pt-8" variant="fadeUp" delay={0.2}>
                    <div className="flex flex-wrap items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-synergy-dark mb-4">Share this article</h4>
                        <div className="flex space-x-4">
                          <motion.a 
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                          </motion.a>
                          <motion.a 
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </motion.a>
                          <motion.a 
                            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </motion.a>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => navigate('/blog')}
                        className="mt-4 md:mt-0 flex items-center text-synergy-dark hover:text-synergy-red transition-colors"
                        whileHover={{ x: -5 }}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to all blogs
                      </motion.button>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>
            
            {/* Related Posts */}
            {allBlogs.length > 0 && (
              <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                  <ScrollReveal className="text-center max-w-3xl mx-auto mb-12" variant="fadeUp">
                    <h2 className="text-3xl font-heading font-bold text-synergy-dark mb-6">Related Articles</h2>
                    <div className="w-20 h-1 bg-synergy-red mx-auto"></div>
                  </ScrollReveal>
                  
                  {blogsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                          <div className="h-40 bg-gray-200 animate-pulse"></div>
                          <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {allBlogs.map((relatedBlog, index) => (
                        <ScrollReveal key={relatedBlog._id} variant="fadeUp" delay={index * 0.1} className="h-full">
                          <RelatedBlogCard blog={relatedBlog} />
                        </ScrollReveal>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
            
            {/* CTA Section */}
            <section className="py-16 bg-synergy-dark">
              <div className="container mx-auto px-4">
                <ScrollReveal className="text-center max-w-3xl mx-auto" variant="fadeUp">
                  <h2 className="text-3xl font-heading font-bold text-white mb-6">Ready to Transform Your Brand?</h2>
                  <p className="text-white/80 mb-8">
                    Let's create extraordinary advertising experiences together. Contact us today to get started.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-synergy-red hover:bg-red-600 text-white py-3 px-8 rounded-full font-medium transition duration-300"
                    onClick={() => navigate('/contact')}
                  >
                    Get in Touch
                  </motion.button>
                </ScrollReveal>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </PageTransition>
  );
};

export default BlogDetail;
