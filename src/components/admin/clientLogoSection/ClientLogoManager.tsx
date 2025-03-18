import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { AlertCircle, RefreshCw } from "lucide-react";
import DeleteModal from "../../common/DeleteModal";
import ClientLogoForm from "./ClientLogoForm";
import { apiEndpoint } from "../config/api";

interface ClientLogo {
  id: number;
  imageUrl: string;
  createdAt: string;
}

const ClientLogoManager: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logoToDelete, setLogoToDelete] = useState<ClientLogo | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchLogos = async () => {
    try {
      setIsRetrying(true);
      console.log('Fetching client logos...');
      const response = await fetch(`${apiEndpoint.clientLogo}/get-all`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error("Failed to fetch client logos");
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setLogos(data.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching client logos:", err);
      setError("Failed to fetch client logos");
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchLogos();
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
      // We don't throw here as we still want to delete the client logo even if image deletion fails
    }
  };

  const handleDeleteClick = (logo: ClientLogo) => {
    setLogoToDelete(logo);
    setShowDeleteModal(true);
  };

  const handleDelete = async (logo: ClientLogo) => {
    if (!user?.token || !logoToDelete) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    setIsDeleting(true);
    try {
      // First, try to delete from Cloudinary
      try {
        await deleteImageFromCloudinary(logo.imageUrl);
      } catch (cloudinaryError) {
        console.warn("Cloudinary deletion warning:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
        // This ensures the database stays in sync even if image deletion fails
      }

      // Then delete from database
      const response = await fetch(`${apiEndpoint.clientLogo}/delete/${logo.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete client logo from database");
      }

      await fetchLogos();
      toast.success("Client logo deleted successfully");
      setShowDeleteModal(false);
      setLogoToDelete(null);
    } catch (error) {
      console.error("Error deleting client logo:", error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to delete client logo. Please try again.</span>
        </div>
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (logoData: { imageUrl: string }) => {
    try {
      const response = await fetch(`${apiEndpoint.clientLogo}/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          imageUrl: logoData.imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create client logo");
      }

      await fetchLogos();
      setIsModalOpen(false);
      toast.success("Client logo added successfully!");
    } catch (error) {
      console.error("Error creating client logo:", error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error instanceof Error ? error.message : "Failed to create client logo. Please try again."}</span>
        </div>
      );
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6 border-b">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 animate-pulse w-16 h-7 rounded-full"></div>
            <h3 className="text-xl font-semibold">Manage Client Logos</h3>
          </div>
          <div className="w-32 h-10 bg-gray-100 animate-pulse rounded-lg"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden p-4">
              <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-100 animate-pulse"></div>
              <div className="flex justify-end">
                <div className="w-16 h-6 bg-gray-100 animate-pulse rounded"></div>
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
          Unable to Load Client Logos
        </h3>
        <p className="text-gray-600 text-center mb-8 max-w-md">
          {error}
        </p>
        <button
          onClick={fetchLogos}
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
        onConfirm={() => logoToDelete && handleDelete(logoToDelete)}
        isDeleting={isDeleting}
        itemName="Logo"
        itemType="Client Logo"
        title="Delete Client Logo"
      />
      <div className="flex justify-between items-center mb-6 border-b">
        <div className="flex items-center gap-4">
          <div className="bg-synergy-red/10 text-synergy-red px-3 py-1 rounded-full text-sm font-medium">
            {logos.length} {logos.length === 1 ? "Logo" : "Logos"}
          </div>
          <h3 className="text-xl font-semibold">Manage Client Logos</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-synergy-red text-white px-4 py-2 rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Logo
        </motion.button>
      </div>
      {logos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-gray-100 rounded-full p-8 mb-6">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Client Logos Found
          </h3>
          <p className="text-gray-500 text-center mb-6">
            There are no client logos to display at the moment.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-synergy-red text-white rounded-lg font-medium 
                     hover:bg-synergy-red/90 transition-colors duration-200 
                     flex items-center gap-2"
          >
            Add Your First Client Logo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="border rounded-lg overflow-hidden p-4 bg-white hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => handleDeleteClick(logo)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
              <div className="w-full h-24 relative">
                <img
                  src={logo.imageUrl}
                  alt="Client Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ClientLogoForm
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

export default ClientLogoManager; 