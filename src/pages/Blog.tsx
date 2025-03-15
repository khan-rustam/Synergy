import React, { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { format } from "date-fns";
import { apiEndpoint } from '../components/admin/config/api';

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

interface BlogPostProps {
  blog: Blog;
}

const BlogPost: React.FC<BlogPostProps> = ({ blog }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
    >
      <Link to={`/blog/${blog._id}`} className="block">
        <div className="relative overflow-hidden h-60">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-synergy-red text-white text-xs font-semibold px-3 py-1 rounded-full">
            {blog.tags && blog.tags.length > 0 ? blog.tags[0] : 'Blog'}
          </div>
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <span>{format(new Date(blog.createdAt), "dd MMM yyyy")}</span>
          <span className="mx-2">•</span>
          <span>By {blog.author}</span>
        </div>
        <Link to={`/blog/${blog._id}`}>
          <h3 className="text-xl font-heading font-bold text-synergy-dark mb-3 hover:text-synergy-red transition-colors truncate">
            {blog.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{stripHtmlAndTruncate(blog.content)}</p>
        <Link
          to={`/blog/${blog._id}`}
          className="inline-flex items-center text-synergy-red font-semibold hover:text-synergy-dark transition-colors"
        >
          Read More
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
  }, []);

  // Fetch blogs on component mount
  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  return (
    <div className="pt-14">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Blog and insights"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-synergy-dark/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">Blog & Insights</h1>
          <div className="w-20 h-1 bg-synergy-red mx-auto mb-2"></div>
          <p className="text-lg text-white">
            Stay updated with the latest trends, strategies, and insights in out-of-home advertising and brand experiences.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-synergy-light/50">
        <div className="container mx-auto px-4">
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

          {/* Blog Grid */}
          {blogs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogPost
                  key={blog._id}
                  blog={blog}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;