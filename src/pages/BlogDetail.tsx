import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { apiEndpoint } from "../components/admin/config/api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import PageTransition from "../components/common/PageTransition";
import ScrollReveal from "../components/common/ScrollReveal";
import LazyImage from "../components/common/LazyImage";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Define blog interface
interface Blog {
  [key: string]: string | string[] | undefined;
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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

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
          alpha,
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
      window.removeEventListener("resize", setCanvasDimensions);
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
            src={
              blog.imageUrl ||
              "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
            alt={blog.title}
            className="w-full h-full"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2">
            <span className="text-xs text-gray-500">
              {formatDate(blog.createdAt || blog.created_at || blog.date || "")}
            </span>
          </div>
          <h3 className="text-lg font-bold text-synergy-dark mb-2 line-clamp-2">
            {blog.title}
          </h3>
          <span className="text-synergy-red text-sm font-medium">
            Read article →
          </span>
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
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = Math.min(window.scrollY / totalHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch all blogs for related posts
  const fetchAllBlogs = useCallback(async (currentBlogId: string) => {
    setBlogsLoading(true);

    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await fetch(`${apiEndpoint.blog}/get-all`, { signal });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch blogs: ${res.status} ${res.statusText}`
        );
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
      if (error.name !== "AbortError") {
        console.error("Error fetching blogs:", error);
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

  // Fetch blog details by ID
  const getBlogById = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await fetch(`${apiEndpoint.blog}/get-by-id/${id}`, {
        signal,
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch blog: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      setBlog(data.data);
      console.log(data.data);
      fetchAllBlogs(data.data._id);
    } catch (error: any) {
      if (error.name !== "AbortError") {
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

  // Initialize animations
  useEffect(() => {
    if (blog && contentRef.current) {
      // Clean up any existing GSAP animations
      const animations: gsap.core.Tween[] = [];

      // Animate content elements
      const contentElements = contentRef.current.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, img"
      );

      contentElements.forEach((element, index) => {
        const animation = gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );

        animations.push(animation);
      });

      // Clean up animations on unmount
      return () => {
        animations.forEach((animation) => {
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
    // Call getBlogById and store the cleanup promise
    const cleanupPromise = getBlogById();

    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Return the cleanup function
    return () => {
      // If cleanupPromise exists and is a Promise
      if (cleanupPromise && typeof cleanupPromise.then === "function") {
        // Add a catch handler to prevent unhandled promise rejection
        cleanupPromise.then(
          (cleanupFn) => {
            // Only call the cleanup function if it exists and is a function
            if (cleanupFn && typeof cleanupFn === "function") {
              cleanupFn();
            }
          },
          // Silently handle any promise rejection
          () => {}
        );
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

  // Add a global style to hide the scrollbar but maintain scroll functionality
  useEffect(() => {
    // Add a style tag to hide scrollbars but maintain scrolling functionality
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      body::-webkit-scrollbar {
        display: none;
      }
      body {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
    `;
    document.head.appendChild(styleElement);

    // Clean up function
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <PageTransition>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-synergy-red z-50 transition-all duration-100"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Main content */}
      <div ref={containerRef} className="relative min-h-screen">
        {/* Background particles */}
        <Particles />

        {loading ? (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="space-y-8 w-full max-w-4xl">
              {/* Skeleton loader for blog post */}
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/4 mb-6"></div>
                <div className="h-64 md:h-96 bg-gray-200 rounded-lg mb-8"></div>
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
          <div className="min-h-screen flex items-center justify-center px-4">
            <ScrollReveal className="text-center py-12 w-full" variant="fadeIn">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-red-600 mb-3">
                  Error Loading Blog
                </h3>
                <p className="text-gray-700">{error}</p>
                <div className="mt-6 space-x-4 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => getBlogById()}
                    className="bg-synergy-red hover:bg-red-600 text-white py-2 px-6 rounded-full font-medium transition duration-300"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => navigate("/blog")}
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
            {/* Content Container */}
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl py-8 md:py-10">
              {/* 1. Breadcrumb */}
              <ScrollReveal
                variant="fadeIn"
                className="mb-6 md:mb-8 overflow-hidden"
              >
                <nav className="flex items-center text-sm overflow-x-auto whitespace-nowrap py-2 scrollbar-hide">
                  <Link
                    to="/"
                    className="text-gray-500 hover:text-synergy-red transition-colors flex-shrink-0"
                  >
                    Home
                  </Link>
                  <svg
                    className="mx-2 w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <Link
                    to="/blog"
                    className="text-gray-500 hover:text-synergy-red transition-colors flex-shrink-0"
                  >
                    Blog
                  </Link>
                  <svg
                    className="mx-2 w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span className="text-synergy-red font-medium truncate">
                    {blog.title}
                  </span>
                </nav>
              </ScrollReveal>

              {/* 2. Title and Tags */}
              <ScrollReveal variant="fadeUp" className="mb-4 md:mb-6">
                <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                  {blog.tags &&
                    blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium bg-synergy-red/10 text-synergy-red rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-synergy-dark mb-4">
                  {blog.title}
                </h1>
              </ScrollReveal>

              {/* 3. Date and Author Info */}
              <ScrollReveal variant="fadeUp" className="mb-6 md:mb-8">
                <div className="flex flex-wrap items-center text-gray-600 border-b border-gray-200 pb-6">
                  <div className="w-10 h-10 rounded-full bg-synergy-red/10 flex items-center justify-center text-synergy-red mr-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="mr-auto">
                    <div className="font-medium text-synergy-dark">
                      {blog.author || "Synergy Team"}
                    </div>
                    <div className="text-sm">
                      {formatDate(
                        blog.createdAt || blog.created_at || blog.date
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <motion.a
                      href={`https://x.com/synergy_ooh?s=09`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </motion.a>
                    <motion.a
                      href={`https://www.facebook.com/share/1XZHSWQDDX/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </motion.a>
                    <motion.a
                      href={`https://www.linkedin.com/company/synergyjaipur/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </ScrollReveal>

              {/* 4. Main Image */}
              <ScrollReveal variant="fadeUp" className="mb-8 md:mb-10">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <LazyImage
                    src={
                      blog.imageUrl ||
                      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    }
                    alt={blog.title}
                    className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px]"
                    objectFit="cover"
                  />
                </div>
              </ScrollReveal>

              {/* 5. Blog Content */}
              <ScrollReveal variant="fadeUp" className="mb-8 md:mb-12">
                <div
                  ref={contentRef}
                  className="prose prose-sm sm:prose md:prose-lg max-w-none blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </ScrollReveal>

              {/* 6. Extra Content - Navigation */}
              <ScrollReveal
                variant="fadeUp"
                className="border-t border-gray-200 pt-6 md:pt-8 mb-8 md:mb-12"
              >
                <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4">
                  <motion.button
                    onClick={() => navigate("/blog")}
                    className="flex items-center text-synergy-dark hover:text-synergy-red transition-colors"
                    whileHover={{ x: -5 }}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to all blogs
                  </motion.button>
                </div>
              </ScrollReveal>
            </div>

            {/* Related Posts */}
            {allBlogs.length > 0 && (
              <section className="py-12 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6">
                  <ScrollReveal
                    className="text-center max-w-3xl mx-auto mb-8 md:mb-12"
                    variant="fadeUp"
                  >
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-synergy-dark mb-4 md:mb-6">
                      Related Articles
                    </h2>
                    <div className="w-16 md:w-20 h-1 bg-synergy-red mx-auto"></div>
                  </ScrollReveal>

                  {blogsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {[...Array(3)].map((_, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg shadow-md overflow-hidden h-full"
                        >
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {allBlogs.map((relatedBlog, index) => (
                        <ScrollReveal
                          key={relatedBlog._id}
                          variant="fadeUp"
                          delay={index * 0.1}
                          className="h-full"
                        >
                          <RelatedBlogCard blog={relatedBlog} />
                        </ScrollReveal>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* CTA Section */}
            <section className="py-12 md:py-16 bg-synergy-dark">
              <div className="container mx-auto px-4 sm:px-6">
                <ScrollReveal
                  className="text-center max-w-3xl mx-auto"
                  variant="fadeUp"
                >
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 md:mb-6">
                    Ready to Transform Your Brand?
                  </h2>
                  <p className="text-white/80 mb-6 md:mb-8 px-4">
                    Let's create extraordinary advertising experiences together.
                    Contact us today to get started.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-synergy-red hover:bg-red-600 text-white py-2 md:py-3 px-6 md:px-8 rounded-full font-medium transition duration-300"
                    onClick={() => navigate("/contact")}
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
