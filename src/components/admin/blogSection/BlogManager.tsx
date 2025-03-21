import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, AlertCircle, RefreshCw } from "lucide-react";
import BlogForm from "./BlogForm";
import { toast } from "react-toastify";
import { apiEndpoint } from "../config/api";
import { useSelector } from "react-redux";
import { BiLoaderCircle } from "react-icons/bi";
import { format } from "date-fns";
import DeleteModal from "../../common/DeleteModal";

interface Blog {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
}

const BlogManager: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [activeTab, setActiveTab] = useState("list");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchBlogs = async (isRetry = false) => {
    if (isRetry) {
      setIsRetrying(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await fetch(`${apiEndpoint.blog}/s`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blogData = await response.json();
      setBlogs(Array.isArray(blogData.data) ? blogData.data : []);
    } catch (err) {
      const errorMessage = "Failed to fetch blogs. Please try again later.";
      setError(errorMessage);
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchBlogs(false);
  }, []);

  const deleteImageFromCloudinary = async (imageUrl: string) => {
    try {
      if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
        console.warn("Not a valid Cloudinary URL:", imageUrl);
        return;
      }

      // Extract the public ID from the Cloudinary URL
      // Format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/public-id.jpg
      const urlParts = imageUrl.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];
      
      if (!publicId) {
        throw new Error("Could not extract public_id from Cloudinary URL");
      }
      
      console.log(`Attempting to delete Cloudinary image: ${publicId}`);

      const response = await fetch(`${apiEndpoint.deleteImage}/${publicId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary deletion error:", data);
        throw new Error(
          data.error || data.message || "Failed to delete image from Cloudinary"
        );
      }
      
      console.log("Successfully deleted image from Cloudinary");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error deleting image from Cloudinary:", errorMessage);
      toast.error(`Failed to delete image from Cloudinary: ${errorMessage}`);
    }
  };

  const handleDeleteBlog = async () => {
    if (!user?.token || !blogToDelete) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    setIsDeleting(true);
    try {
      // First, try to delete from Cloudinary
      try {
        await deleteImageFromCloudinary(blogToDelete.imageUrl);
      } catch (cloudinaryError) {
        console.warn("Cloudinary deletion warning:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }

      // Then delete from database
      const response = await fetch(
        `${apiEndpoint.blog}/delete/${blogToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete blog from database");
      }

      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
      toast.success("Blog deleted successfully!");
      setShowDeleteModal(false);
      setBlogToDelete(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete blog";
      setError(errorMessage);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to delete blog. Please try again.</span>
        </div>
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (blog: Blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleRetry = () => {
    fetchBlogs(true);
  };

  if (loading && !isRetrying) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6 border-b">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 animate-pulse w-16 h-7 rounded-full"></div>
            <div className="flex space-x-4">
              <div className="w-24 h-8 bg-gray-100 animate-pulse rounded"></div>
              <div className="w-32 h-8 bg-gray-100 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-100 animate-pulse"></div>
              <div className="px-5 pt-5">
                <div className="w-3/4 h-6 bg-gray-100 animate-pulse rounded mb-3"></div>
                <div className="w-full h-16 bg-gray-100 animate-pulse rounded mb-3"></div>
                <div className="w-32 h-4 bg-gray-100 animate-pulse rounded"></div>
              </div>
              <div className="px-6 py-3 flex justify-end">
                <div className="w-20 h-8 bg-gray-100 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white rounded-xl shadow-lg"
      >
        <div className="bg-red-50 rounded-full p-6 mb-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          Unable to Load Blogs
        </h3>
        <p className="text-gray-600 text-center mb-8 max-w-md">
          {error}
        </p>
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="flex items-center px-6 py-3 bg-synergy-red text-white rounded-lg font-medium 
                   hover:bg-synergy-red/90 transition-colors duration-200 disabled:opacity-50"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </>
          )}
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteBlog}
        isDeleting={isDeleting}
        itemName={blogToDelete?.title || ""}
        itemType="Blog"
        title="Delete Blog"
      />

      <div className="flex justify-between items-center mb-6 border-b">
        <div className="flex items-center gap-4">
          <div className="bg-synergy-red/10 text-synergy-red px-3 py-1 rounded-full text-sm font-medium">
            {blogs.length} {blogs.length === 1 ? "Blog" : "Blogs"}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("list")}
              className={`py-2 px-4 -mb-px ${
                activeTab === "list"
                  ? "border-b-2 border-synergy-red text-synergy-red font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Blog List
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`py-2 px-4 -mb-px ${
                activeTab === "form"
                  ? "border-b-2 border-synergy-red text-synergy-red font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Create New Blog
            </button>
          </div>
        </div>
      </div>

      {activeTab === "list" ? (
        blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Blogs Found
            </h3>
            <p className="text-gray-500 mb-6">
              There are no blogs to display at the moment.
            </p>
            <button
              onClick={() => setActiveTab("form")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-synergy-red hover:bg-synergy-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-synergy-red"
            >
              Create New Blog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="cursor-pointer group">
                  <div className="relative h-48">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pt-5">
                  <h3 className="text-xl font-semibold mb-3">{blog.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <span>
                      {format(new Date(blog.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-3 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteClick(blog)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete blog"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <BiLoaderCircle className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <BlogForm
          onSubmit={async (data) => {
            try {
              const response = await fetch(`${apiEndpoint.blog}/new`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(data),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create blog");
              }
              setActiveTab("list");
              await fetchBlogs();
            } catch (error) {
              console.error("Error creating blog:", error);
              toast.error("Failed to create blog. Please try again.");
              throw error;
            }
          }}
          onCancel={() => setActiveTab("list")}
        />
      )}
    </div>
  );
};

export default BlogManager; 