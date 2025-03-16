import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import SliderForm from "./SliderForm";
import { apiEndpoint } from "../config/api";
import { toast } from "react-toastify";
import DeleteModal from "../../common/DeleteModal";
import { useSelector } from "react-redux";

interface Slide {
  _id: string;
  imageUrl: string;
  id: string;
}

const SliderManager: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchSlides = async () => {
    try {
      setIsRetrying(true);
      const response = await fetch(`${apiEndpoint.slide}/get-all`);
      if (!response.ok) {
        throw new Error("Failed to fetch slides");
      }
      const data = await response.json();
      setSlides(data.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch slides");
      console.error("Error fetching slides:", err);
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchSlides();
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
      // We don't throw here as we still want to delete the slide even if image deletion fails
    }
  };

  const handleDeleteClick = (slide: Slide) => {
    setSlideToDelete(slide);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (slideData: { imageUrl: string }) => {
    try {
      if (!user?.token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch(`${apiEndpoint.slide}/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify(slideData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create slide");
      }

      await fetchSlides();
      toast.success("Slide created successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating slide:", error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error instanceof Error ? error.message : "Failed to create slide"}</span>
        </div>
      );
      throw error;
    }
  };

  const handleDelete = async (slide: { imageUrl: string; _id: string }) => {
    if (!user?.token || !slideToDelete) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    setIsDeleting(true);
    try {
      // Delete slide from database first
      const response = await fetch(`${apiEndpoint.slide}/delete/${slide._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete slide");
      }

      // If event deletion was successful, delete the image from Cloudinary
      await deleteImageFromCloudinary(slide.imageUrl!);

      await fetchSlides();
      toast.success("Slide deleted successfully");
      setShowDeleteModal(false);
      setSlideToDelete(null);
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast.error("Failed to delete slide");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6 border-b">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 animate-pulse w-16 h-7 rounded-full"></div>
            <h3 className="text-xl font-semibold">Manage Slider Images</h3>
          </div>
          <div className="w-32 h-10 bg-gray-100 animate-pulse rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-100 animate-pulse"></div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="w-24 h-6 bg-gray-100 animate-pulse rounded"></div>
                  <div className="w-16 h-6 bg-gray-100 animate-pulse rounded"></div>
                </div>
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
          Unable to Load Slides
        </h3>
        <p className="text-gray-600 text-center mb-8 max-w-md">
          {error}
        </p>
        <button
          onClick={fetchSlides}
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
        onConfirm={() => handleDelete(slideToDelete!)}
        isDeleting={isDeleting}
        itemName={slideToDelete?.id || ""}
        itemType="Slide"
        title="Delete Slide"
      />
      <div className="flex justify-between items-center mb-6 border-b">
        <div className="flex items-center gap-4">
          <div className="bg-synergy-red/10 text-synergy-red px-3 py-1 rounded-full text-sm font-medium">
            {slides.length} {slides.length === 1 ? "Slide" : "Slides"}
          </div>
          <h3 className="text-xl font-semibold">Manage Slider Images</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-synergy-red text-white px-4 py-2 rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Slide
        </motion.button>
      </div>
      {slides.length === 0 ? (
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Slides Found
          </h3>
          <p className="text-gray-500 mb-6">
            There are no slides to display at the moment.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-synergy-red hover:bg-synergy-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-synergy-red"
          >
            Add Your First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div key={slide._id} className="border rounded-lg overflow-hidden">
              <img
                src={slide.imageUrl}
                alt={`Slide ${slide.id}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleDeleteClick(slide)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SliderForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (formData: FormData) => {
          const imageUrl = formData.get("imageUrl") as string;
          await handleSubmit({ imageUrl });
        }}
      />
    </div>
  );
};

export default SliderManager;
