import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { apiEndpoint } from "../config/api";
import { cloudinaryConfig } from "../config/cloudinary";
import { toast } from "react-toastify";
import { AlertCircle } from "lucide-react";

import { useSelector } from "react-redux";
import { BiLoaderCircle } from "react-icons/bi";

interface TestimonialFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

interface FormData {
  clientName: string;
  companyName: string;
  rating: number;
  description: string;
  imageFile: File | null;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { user } = useSelector((state: any) => state.auth);
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    companyName: "",
    rating: 5,
    description: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFormData((prev) => ({ ...prev, imageFile: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form data
      if (!formData.clientName.trim()) {
        throw new Error("Client name is required");
      }
      if (!formData.companyName.trim()) {
        throw new Error("Company name is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      if (!formData.imageFile) {
        throw new Error("Please select an image");
      }

      // Get token from Redux store
      if (!user?.token) {
        throw new Error("Authentication required. Please log in again.");
      }

      // Upload image to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
      const uploadPreset = cloudinaryConfig.uploadPreset;

      if (!cloudinaryUrl || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing");
      }

      const imageFormData = new FormData();
      imageFormData.append("file", formData.imageFile);
      imageFormData.append("upload_preset", uploadPreset);

      const cloudinaryResponse = await fetch(cloudinaryUrl, {
        method: "POST",
        body: imageFormData,
      });

      if (!cloudinaryResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const cloudinaryData = await cloudinaryResponse.json();

      // Create testimonial with authentication
      const testimonialResponse = await fetch(
        `${apiEndpoint.testimonial}/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            clientName: formData.clientName.trim(),
            companyName: formData.companyName.trim(),
            rating: Number(formData.rating),
            description: formData.description.trim(),
            imageUrl: cloudinaryData.secure_url,
          }),
        }
      );

      if (!testimonialResponse.ok) {
        const errorData = await testimonialResponse.json();
        throw new Error(errorData.message || "Failed to create testimonial");
      }

      toast.success("Testimonial created successfully!");
      onSubmit();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center">
          <BiLoaderCircle width={"10px"} height={"10px"} />
          <h3 className="text-black font-bold text-xl ml-4">
          {formData.imageFile ? "Uploading Image" : "Creating Testimonial"}
        </h3>
        <p className="text-gray-600 text-sm ml-4">
          {formData.imageFile
            ? "Uploading your image to our secure cloud storage..."
            : "Finalizing your testimonial details..."}
        </p>
        </div>
      )}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow relative p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="py-4 px-3 block w-full rounded-md border-none text-xl font-bold bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200 outline-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="py-4 px-3 block w-full rounded-md border-none bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200 outline-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="1"
                max="5"
                className="py-4 px-3 block w-full rounded-md border-none bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200 outline-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="py-4 px-3 block w-full rounded-md border-none bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200 outline-none resize-none"
                required
                maxLength={500}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Client Image
              </label>
              <div
                {...getRootProps()}
                className={`mt-1 flex justify-center px-6 py-8 border-2 ${
                  isDragActive
                    ? "border-synergy-red bg-synergy-red/5"
                    : "border-gray-300"
                } border-dashed rounded-lg cursor-pointer hover:border-synergy-red hover:bg-synergy-red/5 transition-all duration-200`}
              >
                <div className="space-y-1 text-center">
                  <input {...getInputProps()} disabled={loading} />
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-full"
                    />
                  ) : (
                    <div className="text-gray-600">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-sm text-gray-500">
                        Drag and drop an image, or click to select
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t p-4">
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border rounded"
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <BiLoaderCircle width={"20px"} height={"20px"} />}
              {loading ? "Creating..." : "Create Testimonial"}
            </motion.button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TestimonialForm;
