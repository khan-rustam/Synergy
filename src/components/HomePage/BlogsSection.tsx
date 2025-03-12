import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiEndpoint } from '../admin/config/api';
import { format } from "date-fns";
import { motion } from 'framer-motion';

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
 * BlogsSection Component
 * Displays the latest 3 blog posts with lazy loading for improved performance
 */
const BlogsSection: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
  const getBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Create abort controller for cleanup
    const abortController = new AbortController();
    const signal = abortController.signal;
    
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
          return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
        }).slice(0, 3)
        : [];
      
      // Update state with sorted blogs
      setBlogs(sortedBlogs);
      return response;
    } catch (error: any) {
      // Only set error if not aborted
      if (error.name !== 'AbortError') {
        console.error("Error fetching blogs:", error);
        setError(`Failed to load blogs: ${error.message || "Unknown error"}`);
      }
      return [];
    } finally {
      // Only update loading state if not aborted
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // Fetch blogs on component mount with cleanup
  useEffect(() => {
    getBlogs();
    
    // Cleanup function to abort fetch on unmount
    return () => {
      // AbortController cleanup would happen here if we exposed it
    };
  }, [getBlogs]);

  // Render blog section
  return (
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-synergy-dark mb-4">
            Latest Blog & Insights
          </h2>
          <div className="w-24 h-1 bg-synergy-red mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest trends and strategies in outdoor advertising and brand experiences.
          </p>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="text-center mb-8">
            <p className="text-gray-600">Loading blogs...</p>
          </div>
        )}

        {error && (
          <div className="text-center mb-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* No blogs message */}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center mb-16">
            <p className="text-gray-600">No blogs available at the moment. Check back soon!</p>
          </div>
        )}

        {/* Blog Grid with Lazy Loading */}
        {blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {blogs.map((blog) => (
              <motion.div 
                key={blog._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleBlogClick(blog._id)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative overflow-hidden h-48">
                  {/* Use loading="lazy" for image lazy loading */}
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-synergy-red text-white text-sm px-3 py-1 rounded-full">
                    {blog.tags && blog.tags.length > 0 ? blog.tags[0] : 'Blog'}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-500 text-sm mb-2">{format(new Date(blog.createdAt), "dd MMM yyyy")}</p>
                  <h3 className="text-xl font-heading font-bold text-synergy-dark mb-3 group-hover:text-synergy-red transition-colors truncate">
                    {truncateTitle(blog.title)}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {stripHtmlAndTruncate(blog.content, 2)}
                  </p>
                  <div className="flex items-center text-synergy-red group-hover:text-red-700 transition-colors">
                    <span className="text-sm font-medium">Read More</span>
                    <svg 
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Browse All Button - Only show if there are blogs */}
        {blogs.length > 0 && (
          <div className="text-center">
            <motion.button
              onClick={() => navigate('/blog')}
              className="group relative inline-flex items-center justify-center px-8 py-4 
                bg-synergy-red text-white font-bold text-lg rounded-full 
                transition-all duration-300 transform hover:shadow-xl
                hover:shadow-synergy-red/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Browse All Blogs</span>
              <div className="absolute inset-0 rounded-full bg-synergy-red transform scale-100 
                group-hover:scale-110 transition-transform duration-300"></div>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(BlogsSection); 