import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { apiEndpoint } from '../components/admin/config/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      opacity: number;
    }[] = [];
    
    const createParticles = () => {
      const particleCount = Math.min(window.innerWidth / 10, 100);
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 5 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 0.5 - 0.25;
        const speedY = Math.random() * 0.5 - 0.25;
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Theme colors - red shades
        const colors = ['rgba(239, 68, 68, 0.7)', 'rgba(220, 38, 38, 0.7)', 'rgba(185, 28, 28, 0.7)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesArray.push({
          x,
          y,
          size,
          speedX,
          speedY,
          color,
          opacity
        });
      }
    };
    
    createParticles();
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.7', p.opacity.toString());
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
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none opacity-20 z-0"
    />
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
  }, [id]);

  // Fetch all blogs except current one
  const fetchAllBlogs = async (currentBlogId: string) => {
    setBlogsLoading(true);
    try {
      const res = await fetch(`${apiEndpoint.blog}/get-all`);

      if (!res.ok) {
        throw new Error('Failed to fetch blogs');
      }

      const data = await res.json();

      if (data && data.data) {
        // Filter out the current blog and get only the latest blog
        const otherBlogs = data.data
          .filter((blog: Blog) => blog._id !== currentBlogId)
          .sort((a: Blog, b: Blog) => {
            const dateA = a.createdAt || a.created_at || a.date || '';
            const dateB = b.createdAt || b.created_at || b.date || '';
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          })
          .slice(0, 1);

        setAllBlogs(otherBlogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setBlogsLoading(false);
    }
  };

  // Fetch blog on component mount
  useEffect(() => {
    getBlogById();
  }, [getBlogById]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-white">
        <Particles />
        <div className="container mx-auto px-4 py-8 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-gray-100 rounded-full w-3/4 mb-6 animate-pulse"></div>
            <div className="flex space-x-4 mb-8">
              <div className="h-4 bg-gray-100 rounded-full w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded-full w-20 animate-pulse"></div>
            </div>
            <div className="aspect-video bg-gray-100 rounded-xl mb-8 animate-pulse"></div>
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded-full w-full"></div>
              <div className="h-4 bg-gray-100 rounded-full w-full"></div>
              <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded-full w-full"></div>
              <div className="h-4 bg-gray-100 rounded-full w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blog) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-white">
        <Particles />
        <div className="container mx-auto px-4 py-8 sm:py-20 text-center">
          <div className="max-w-lg mx-auto backdrop-blur-sm bg-white/70 p-8 rounded-2xl shadow-lg border border-gray-100">
            <svg
              className="w-24 h-24 mx-auto mb-6 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-800 mb-4">
              {error || "Blog not found"}
            </h1>
            <p className="text-gray-600 mb-8">
              We couldn't find the blog post you're looking for. It might have been removed or doesn't exist.
            </p>
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Back to Blogs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-white/95 relative">
      <Particles />
      
      {/* Progress bar */}
      <div
        className="h-1 bg-red-600 fixed top-0 left-0 z-50"
        style={{
          width: `${scrollProgress * 100}%`,
        }}
      />

      <div className="container mx-auto px-4 pt-24 pb-16 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors text-sm font-medium group backdrop-blur-sm bg-white/30 px-4 py-2 rounded-full shadow-sm"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all articles
            </Link>
          </div>

          {/* Blog Header */}
          <div className="mb-8 backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-gray-100">
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-4">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center flex-wrap text-gray-600 text-sm sm:text-base space-x-4">
              <span>
                {blog.createdAt ?
                  format(new Date(blog.createdAt), "MMMM dd, yyyy") :
                  "Date unavailable"}
              </span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-10 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <article className="prose prose-lg max-w-none mb-12 backdrop-blur-sm bg-white/90 p-8 rounded-2xl shadow-lg border border-gray-100">
            <div
              dangerouslySetInnerHTML={{ __html: blog.content }}
              className="text-gray-700"
            />
          </article>

          {/* Social Sharing */}
          <div className="py-6 border-t border-b border-gray-200 mb-12 backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Share this article</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="p-2 rounded-full bg-white hover:bg-red-400 hover:text-white transition-colors shadow-md hover:shadow-lg"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button
                  onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`, '_blank')}
                  className="p-2 rounded-full bg-white hover:bg-red-700 hover:text-white transition-colors shadow-md hover:shadow-lg"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="p-2 rounded-full bg-white hover:bg-red-600 hover:text-white transition-colors shadow-md hover:shadow-lg"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Latest Article Section */}
          <div className="pt-8 border-t border-gray-200 backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-indigo-600">Latest Article</span>
              <span className="absolute left-0 bottom-0 w-16 h-1 bg-red-600"></span>
            </h3>
            
            {blogsLoading ? (
              <div className="rounded-xl overflow-hidden bg-white shadow animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                </div>
              </div>
            ) : allBlogs.length > 0 ? (
              <div 
                onClick={() => navigate(`/blog/${allBlogs[0]._id}`)}
                className="rounded-xl overflow-hidden bg-white shadow-lg cursor-pointer group hover:shadow-xl transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="aspect-[4/3] md:aspect-auto relative overflow-hidden">
                    <img 
                      src={allBlogs[0].imageUrl} 
                      alt={allBlogs[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {allBlogs[0].tags && allBlogs[0].tags.length > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white text-xs px-2.5 py-1 rounded-full">
                          {allBlogs[0].tags[0]}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-red-600 transition-colors">
                        {allBlogs[0].title}
                      </h4>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {allBlogs[0].content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {allBlogs[0].createdAt 
                          ? format(new Date(allBlogs[0].createdAt), "MMM dd, yyyy") 
                          : "Date unavailable"}
                      </span>
                      <span className="text-red-600 text-sm font-medium inline-flex items-center">
                        Read more
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
                <p className="text-gray-600">No other articles found</p>
                <button
                  onClick={() => navigate('/blog')}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Browse all articles
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
