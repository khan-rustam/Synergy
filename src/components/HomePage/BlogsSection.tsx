import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiEndpoint } from '../admin/config/api';
import { format } from "date-fns";
import { motion, useInView, AnimatePresence } from 'framer-motion';

// Define blog interface for better type safety
interface Blog {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  tags: string[];
  // Add optional fields that might be in the API response
  created_at?: string;
  date?: string;
}

/**
 * BlogCard Component - Displays a single blog post with animations
 */
const BlogCard: React.FC<{
  blog: Blog;
  index: number;
  onClick: (id: string) => void;
  stripHtmlAndTruncate: (html: string, maxLines?: number, charsPerLine?: number) => string;
  truncateTitle: (title: string, maxChars?: number) => string;
}> = ({ blog, index, onClick, stripHtmlAndTruncate, truncateTitle }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });
  
  // Format date with fallbacks
  const blogDate = blog.createdAt || blog.created_at || blog.date || '';
  const formattedDate = blogDate ? format(new Date(blogDate), 'MMM dd, yyyy') : '';
  
  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5, // Faster animation
        delay: index * 0.1, // Reduced delay between items
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const imageVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.6, // Faster animation
        delay: index * 0.1 + 0.1 // Reduced delay
      }
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.5 }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, // Faster animation
        delay: index * 0.1 + 0.2 // Reduced delay
      }
    }
  };
  
  return (
    <motion.div
      ref={cardRef}
      className="bg-white rounded-xl shadow-lg overflow-hidden card-3d"
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ 
        y: -10, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      onClick={() => onClick(blog._id)}
    >
      {/* Image container with overflow hidden for zoom effect */}
      <div className="relative h-48 overflow-hidden">
        <motion.div
          className="w-full h-full"
          variants={imageVariants}
          whileHover="hover"
        >
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>
        
        {/* Date badge */}
        <motion.div 
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-synergy-red text-sm font-medium px-3 py-1 rounded-full"
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
        >
          {formattedDate}
        </motion.div>
      </div>
      
      {/* Content */}
      <motion.div 
        className="p-6"
        variants={contentVariants}
      >
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.tags && blog.tags.slice(0, 2).map((tag, i) => (
            <motion.span 
              key={i} 
              className="text-xs bg-red-50 text-synergy-red px-2 py-1 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.3 + (i * 0.1) }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-heading font-bold text-synergy-dark mb-2">
          {truncateTitle(blog.title)}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 mb-4 text-sm">
          {stripHtmlAndTruncate(blog.content)}
        </p>
        
        {/* Read more link */}
        <motion.div 
          className="text-synergy-red font-medium flex items-center text-sm"
          whileHover={{ x: 5 }}
        >
          <span>Read more</span>
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Skeleton loader for blog cards during loading state
 */
const BlogCardSkeleton: React.FC<{ index: number }> = ({ index }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
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
      {/* Image skeleton */}
      <div className="relative h-48 overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute top-4 right-4 h-6 w-24 bg-white/80 rounded-full animate-pulse" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-6">
        {/* Tags skeleton */}
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-16 bg-red-50 rounded-full animate-pulse" />
          <div className="h-5 w-20 bg-red-50 rounded-full animate-pulse" />
        </div>
        
        {/* Title skeleton */}
        <div className="h-7 bg-gray-200 rounded-md w-5/6 mb-2 animate-pulse" />
        
        {/* Content skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-100 rounded-md w-full animate-pulse" />
          <div className="h-4 bg-gray-100 rounded-md w-5/6 animate-pulse" />
        </div>
        
        {/* Read more skeleton */}
        <div className="h-5 bg-red-50 rounded-md w-24 animate-pulse" />
      </div>
    </motion.div>
  );
};

/**
 * BlogsSection Component
 * Displays the latest 3 blog posts with lazy loading for improved performance
 */
const BlogsSection: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  /**
   * Strips HTML tags from content and truncates to specified number of lines
   * @param html - HTML content to strip and truncate
   * @param maxLines - Maximum number of lines to display (default: 2)
   * @param charsPerLine - Estimated characters per line (default: 80)
   * @returns Stripped and truncated text with ellipsis if needed
   */
  const stripHtmlAndTruncate = useCallback((html: string, maxLines: number = 2, charsPerLine: number = 80) => {
    if (!html) return '';
    
    // Remove HTML tags
    const text = html.replace(/<[^>]*>/g, '');
    
    // Truncate to approximate number of lines
    const maxChars = maxLines * charsPerLine;
    if (text.length <= maxChars) return text;
    
    return text.substring(0, maxChars) + '...';
  }, []);

  /**
   * Truncates title to a single line with specified maximum characters
   * @param title - Title to truncate
   * @param maxChars - Maximum characters to display (default: 50)
   * @returns Truncated title with ellipsis if needed
   */
  const truncateTitle = useCallback((title: string, maxChars: number = 50) => {
    if (!title) return '';
    if (title.length <= maxChars) return title;
    
    return title.substring(0, maxChars) + '...';
  }, []);

  /**
   * Handles navigation to blog detail page
   * @param blogId - ID of the blog to navigate to
   */
  const handleBlogClick = useCallback((blogId: string) => {
    navigate(`/blog/${blogId}`);
  }, [navigate]);

  /**
   * Fetches blogs from API, sorts by creation date, and takes the 3 most recent
   * Uses AbortController for cleanup on component unmount
   */
  const getBlogs = useCallback(() => {
    if (!isInitialLoad) {
      setLoading(true);
    }
    setError(null);
    
    // Create abort controller for cleanup
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    const fetchData = async () => {
      try {
        // Fetch blogs with abort signal
        const res = await fetch(`${apiEndpoint.blog}/get-all`, { signal });
        
        // Handle HTTP errors
        if (!res.ok) {
          throw new Error(`Failed to fetch blogs: ${res.status} ${res.statusText}`);
        }
        
        // Parse response
        const data = await res.json();
        const response = data.data;
        
        // Sort blogs by creation date (newest first) and take only the first 3
        const sortedBlogs = Array.isArray(response)
          ? response.sort((a: Blog, b: Blog) => {
            // Get dates, with fallbacks for different field names
            const dateA = new Date(a.createdAt || a.created_at || a.date || 0);
            const dateB = new Date(b.createdAt || b.created_at || b.date || 0);
            return dateB.getTime() - dateA.getTime();
          }).slice(0, 3)
          : [];
        
        setBlogs(sortedBlogs);
      } catch (err) {
        // Only set error if not aborted
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
          console.error('Error fetching blogs:', err);
        }
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    
    // Start the fetch
    fetchData();
    
    // Return cleanup function to abort fetch on unmount
    return () => {
      abortController.abort();
    };
  }, [isInitialLoad]);

  // Fetch blogs on component mount
  useEffect(() => {
    const cleanup = getBlogs();
    return cleanup;
  }, [getBlogs]);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

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

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        delay: 0.5
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

  // Preload animation - show immediately while data loads
  const renderSkeletons = () => {
    return [0, 1, 2].map((index) => (
      <BlogCardSkeleton key={`skeleton-${index}`} index={index} />
    ));
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div 
        className="absolute -top-20 -right-20 w-64 h-64 bg-red-50 rounded-full opacity-30 blur-3xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 0.3, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-50 rounded-full opacity-20 blur-3xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 0.2, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
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
            Latest Insights
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
            Stay updated with the latest trends and insights in the world of advertising and brand management.
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
                onClick={() => getBlogs()} 
                className="mt-2 text-synergy-red font-medium hover:underline"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blog cards or skeletons */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Show skeletons during initial load */}
          {isInitialLoad && renderSkeletons()}
          
          {/* Show actual blog cards once loaded */}
          {!isInitialLoad && !error && blogs.length > 0 && 
            blogs.map((blog, index) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                index={index}
                onClick={handleBlogClick}
                stripHtmlAndTruncate={stripHtmlAndTruncate}
                truncateTitle={truncateTitle}
              />
            ))
          }
        </motion.div>

        {/* No blogs state */}
        {!loading && !error && !isInitialLoad && blogs.length === 0 && (
          <motion.div 
            className="text-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-600">No blog posts available at the moment.</p>
          </motion.div>
        )}

        {/* View all blogs button */}
        <div className="text-center">
          <motion.button
            onClick={() => navigate('/blog')}
            className="relative inline-flex items-center justify-center px-8 py-4 
              bg-synergy-red text-white font-bold text-lg rounded-full 
              transition-all duration-300 overflow-hidden"
            variants={buttonVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="relative z-10 flex items-center">
              <span>View All Articles</span>
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

export default BlogsSection; 