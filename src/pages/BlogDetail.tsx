import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { apiEndpoint } from '../components/admin/config/api';
import { useInView } from 'react-intersection-observer';
import SocialShareButtons from '../components/common/SocialShareButtons';

// Define blog interface for better type safety
interface Blog {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  author: string;
  tags: string[];
  // Add optional fields that might be in the API response
  created_at?: string;
  date?: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  /**
   * Fetches blog details by ID
   * Uses AbortController for cleanup on component unmount
   */
  const getBlogById = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    // Create abort controller for cleanup
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      // Fetch blog with abort signal
      const res = await fetch(`${apiEndpoint.blog}/get-by-id/${id}`, { signal });

      // Handle HTTP errors
      if (!res.ok) {
        throw new Error(`Failed to fetch blog: ${res.status} ${res.statusText}`);
      }

      // Parse response
      const data = await res.json();
      setBlog(data);
    } catch (error: any) {
      // Only set error if not aborted
      if (error.name !== 'AbortError') {
        console.error("Error fetching blog:", error);
        setError(`Failed to load blog: ${error.message || "Unknown error"}`);
      }
    } finally {
      // Only update loading state if not aborted
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [id]);

  // Fetch blog on component mount with cleanup
  useEffect(() => {
    getBlogById();
  }, [getBlogById]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-synergy-light/50">
        <div className="container mx-auto px-4 py-8 sm:py-20">
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-8 sm:h-12 bg-gray-200 rounded w-full sm:w-3/4 mb-4 sm:mb-8"></div>
            <div className="flex items-center justify-center sm:justify-start space-x-4 mb-6 sm:mb-8">
              <div className="h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
            </div>
            <div className="h-64 sm:h-96 bg-gray-200 rounded-xl mb-6 sm:mb-8"></div>
            <div className="space-y-3 sm:space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-synergy-light/50">
        <div className="container mx-auto px-4 py-8 sm:py-20 text-center">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-synergy-dark mb-6">
            {error || "Blog not found"}
          </h1>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-synergy-red text-white rounded-full hover:bg-synergy-dark transition-colors"
          >
            <svg className="w-4 sm:w-5 h-4 sm:h-5 mr-2 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      <SocialShareButtons
        title={blog?.title || 'Blog Post'}
        url={window.location.href}
      />
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-synergy-red hover:text-synergy-dark transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5 mr-2 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Back to Blogs
            </Link>
          </div>

          {/* Blog Header */}
          <div
            ref={ref}
            className={`mb-6 sm:mb-8 text-center sm:text-left transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            {blog.tags && blog.tags.length > 0 && (
              <span className="inline-block bg-synergy-red text-white text-xs sm:text-sm px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4">
                {blog.tags[0]}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-synergy-dark mb-3 sm:mb-4 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center justify-center sm:justify-start text-gray-600 text-sm sm:text-base md:text-lg space-x-3 sm:space-x-4">
              <span>By {blog.author}</span>
              <span>•</span>
              <span>{format(new Date(blog.createdAt), "MMMM dd, yyyy")}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8 sm:mb-12">
            <div className="rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content */}
          <article className="prose prose-sm sm:prose lg:prose-lg max-w-none mb-8 sm:mb-12">
            <div
              dangerouslySetInnerHTML={{ __html: blog.content }}
              className="text-gray-700 leading-relaxed"
            />
          </article>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-8 sm:mb-12 pt-6 sm:pt-8 border-t border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-synergy-dark mb-3 sm:mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-synergy-light px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-synergy-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-synergy-dark mb-3 sm:mb-4 text-center sm:text-left">
              Share this article:
            </h3>
            <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4">
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="p-2 rounded-full bg-synergy-light hover:bg-synergy-red hover:text-white transition-colors"
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button
                onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`, '_blank')}
                className="p-2 rounded-full bg-synergy-light hover:bg-synergy-red hover:text-white transition-colors"
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="p-2 rounded-full bg-synergy-light hover:bg-synergy-red hover:text-white transition-colors"
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
