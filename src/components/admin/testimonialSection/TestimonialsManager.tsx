import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AlertCircle, Trash2, RefreshCw } from "lucide-react";
import TestimonialForm from "./TestimonialForm";
import { apiEndpoint } from "../config/api";
import DeleteModal from "../../common/DeleteModal";

interface Testimonial {
  _id: string;
  clientName: string;
  companyName: string;
  rating: number;
  description: string;
  imageUrl: string;
  createdAt: string;
}

const TestimonialsManager: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setIsRetrying(true);
      const response = await fetch(`${apiEndpoint.testimonial}/get-all`);
      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }
      const data = await response.json();
      setTestimonials(data.data);
      setError("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch testimonials";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
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
      // We don't throw here as we still want to delete the testimonial even if image deletion fails
    }
  };

  const handleDelete = async () => {
    if (!user?.token || !selectedTestimonial) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    setIsDeleting(true);
    try {
      // First, delete the testimonial from the database
      const response = await fetch(`${apiEndpoint.testimonial}/delete/${selectedTestimonial._id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete testimonial");
      }

      // If testimonial deletion was successful, delete the image from Cloudinary
      await deleteImageFromCloudinary(selectedTestimonial.imageUrl);

      setTestimonials((prev) => prev.filter((t) => t._id !== selectedTestimonial._id));
      toast.success("Testimonial deleted successfully!");
      setShowDeleteModal(false);
      setSelectedTestimonial(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete testimonial";
      setError(errorMessage);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowDeleteModal(true);
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <TestimonialForm
          onSubmit={() => {
            setShowForm(false);
            fetchTestimonials();
          }}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6 border-b">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 animate-pulse w-16 h-7 rounded-full"></div>
            <div className="w-48 h-8 bg-gray-100 animate-pulse rounded"></div>
          </div>
          <div className="w-40 h-10 bg-gray-100 animate-pulse rounded-lg"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Client", "Company", "Rating", "Date", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 animate-pulse rounded-full"></div>
                      <div className="ml-4 w-24 h-5 bg-gray-100 animate-pulse rounded"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-32 h-5 bg-gray-100 animate-pulse rounded"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-20 h-5 bg-gray-100 animate-pulse rounded"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24 h-5 bg-gray-100 animate-pulse rounded"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="w-16 h-5 bg-gray-100 animate-pulse rounded ml-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          Unable to Load Testimonials
        </h3>
        <p className="text-gray-600 text-center mb-8 max-w-md">
          {error}
        </p>
        <button
          onClick={fetchTestimonials}
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
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemName={selectedTestimonial?.clientName || ""}
        itemType="Testimonial"
        title="Delete Testimonial"
      />

      <div className="flex justify-between items-center mb-6 border-b">
        <div className="flex items-center gap-4">
          <div className="bg-synergy-red/10 text-synergy-red px-3 py-1 rounded-full text-sm font-medium">
            {testimonials.length} {testimonials.length === 1 ? "Testimonial" : "Testimonials"}
          </div>
          <h3 className="text-xl font-semibold">Manage Testimonials</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-synergy-red text-white px-4 py-2 rounded-lg"
          onClick={() => setShowForm(true)}
        >
          Add New Testimonial
        </motion.button>
      </div>

      {testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-gray-100 rounded-full p-8 mb-6">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Testimonials Found
          </h3>
          <p className="text-gray-500 text-center mb-6">
            There are no testimonials to display at the moment.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-synergy-red text-white rounded-lg font-medium 
                     hover:bg-synergy-red/90 transition-colors duration-200 
                     flex items-center gap-2"
          >
            Add Your First Testimonial
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {testimonials.map((testimonial) => (
                <tr key={testimonial._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={testimonial.imageUrl}
                        alt={testimonial.clientName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {testimonial.clientName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testimonial.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {"⭐".repeat(testimonial.rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteClick(testimonial)}
                      className="text-red-600 hover:text-red-900 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
