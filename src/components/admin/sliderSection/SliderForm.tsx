import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { cloudinaryConfig } from "../config/cloudinary";

interface SliderFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
}

const SliderForm: React.FC<SliderFormProps> = ({ isOpen, onClose, onSubmit }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedImage) {
            toast.error(
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Please select an image</span>
                </div>
            );
            return;
        }

        setIsSubmitting(true);
        try {
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
            const uploadPreset = cloudinaryConfig.uploadPreset;

            if (!cloudinaryUrl || !uploadPreset) {
                throw new Error('Cloudinary configuration is missing');
            }

            const imageFormData = new FormData();
            imageFormData.append('file', selectedImage);
            imageFormData.append('upload_preset', uploadPreset);

            const imageResponse = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: imageFormData
            });

            if (!imageResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const imageData = await imageResponse.json();
            const imageUrl = imageData.secure_url;

            const formData = new FormData();
            formData.append('imageUrl', imageUrl);
            await onSubmit(formData);
            handleClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Failed to create slide. Please try again.</span>
                </div>
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedImage(null);
        setImagePreview('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl p-6 w-full max-w-md relative"
            >
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
                <h3 className="text-xl font-semibold mb-4">Add New Slide</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Slide Image
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                                ${imagePreview ? 'border-synergy-red' : 'border-gray-300 hover:border-gray-400'}`}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mx-auto h-48 object-cover rounded-lg"
                                />
                            ) : (
                                <div className="text-gray-500">
                                    Click to upload image
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-synergy-red text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedImage || isSubmitting}
                    >
                        {isSubmitting ? 'Adding Slide...' : 'Add Slide'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default SliderForm;