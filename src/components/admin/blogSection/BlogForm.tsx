import React, { useState } from "react";
import Select from "react-select";
import { Image, AlertCircle } from "lucide-react";
import { cloudinaryConfig } from "../config/cloudinary";
import { toast } from "react-toastify";
import { BiLoaderCircle } from "react-icons/bi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface BlogFormData {
  title: string;
  content: string;
  tags?: string[];
  imageUrl?: string;
  status: 'draft' | 'published';
}

interface BlogFormProps {
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
}

const BLOG_CATEGORIES = [
  { value: "OOH advertisement", label: "OOH advertisement" },
  { value: "Digital Marketing", label: "Digital Marketing" },
  { value: "Event management", label: "Event management" },
  { value: "Outdoor advertisement", label: "Outdoor advertisement" },
];

const customStyles = `
.ql-toolbar {
  border: none !important;
  background-color: rgb(249 250 251) !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 0.5rem !important;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ql-toolbar button {
  padding: 0.5rem !important;
  height: 32px !important;
  width: 32px !important;
  border-radius: 0.5rem;
}

.ql-toolbar button svg {
  width: 20px !important;
  height: 20px !important;
}

.ql-toolbar .ql-picker {
  height: 32px !important;
}

.ql-toolbar .ql-picker-label {
  padding: 0.5rem !important;
  border-radius: 0.5rem;
}

.ql-toolbar button:hover {
  background-color: rgb(229 231 235) !important;
}

.ql-formats {
  display: flex !important;
  gap: 0.25rem;
  align-items: center;
}

.ql-container {
  border: none !important;
  font-size: 1.125rem !important;
}

.ql-editor {
  padding: 1rem !important;
  min-height: 300px !important;
}

@media (min-width: 768px) {
  .ql-editor {
    min-height: 400px !important;
  }
}
`;

const BlogForm: React.FC<BlogFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    tags: [],
    status: 'draft'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Title is required</span>
        </div>
      );
      return;
    }

    if (!formData.content.trim()) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Content is required</span>
        </div>
      );
      return;
    }

    if (!imageFile) {
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
      let imageUrl;

      // Only upload new image if one was selected
      if (imageFile) {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
        const uploadPreset = cloudinaryConfig.uploadPreset;

        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageFormData.append("upload_preset", uploadPreset);

        const response = await fetch(cloudinaryUrl, {
          method: "POST",
          body: imageFormData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const imageData = await response.json();
        imageUrl = imageData.secure_url;
      }

      // Prepare blog data
      const blogData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        imageUrl: imageUrl,
        tags: formData.tags || [],
        status: formData.status
      };

      await onSubmit(blogData);
      toast.success("Blog created successfully!");
      onCancel();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to create blog. Please try again.</span>
        </div>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow relative p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex flex-col gap-4 px-4 py-3">
            <div className="flex items-center gap-2">
              <Select
                isMulti
                options={BLOG_CATEGORIES}
                value={BLOG_CATEGORIES.filter((tag) =>
                  formData.tags?.includes(tag.value)
                )}
                onChange={(selectedOptions) => {
                  setFormData({
                    ...formData,
                    tags: selectedOptions.map((option) => option.value),
                  });
                }}
                className="w-full md:w-96"
                placeholder="Select categories..."
                isDisabled={isSubmitting}
              />
            </div>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="flex-1 text-xl md:text-2xl font-bold border-0 focus:ring-0 focus:outline-none"
            />
            <ReactQuill
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Write your blog content here..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "blockquote", "code-block"],
                  [{ align: [] }],
                  ["clean"],
                ],
              }}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => document.getElementById("imageUpload")?.click()}
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border hover:bg-gray-50"
                disabled={isSubmitting}
              >
                <Image className="h-4 w-4" />
                <span>{imageFile ? "Change Image" : "Add Image"}</span>
              </button>
              {imageFile && (
                <span className="text-sm text-green-600">✓ Image selected</span>
              )}
            </div>
          </div>
          {previewUrl && (
            <div className="mb-4 text-center">
              <img
                src={previewUrl}
                alt="Blog preview"
                className="w-full max-w-lg mx-auto rounded"
              />
            </div>
          )}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-4">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
              className="border rounded px-3 py-2 text-sm"
              disabled={isSubmitting}
            >
              <option value="draft">Save as Draft</option>
              <option value="published">Publish</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                            disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isSubmitting && <BiLoaderCircle className="h-5 w-5" />}
              {isSubmitting ? "Creating Blog..." : "Create Blog"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogForm; 