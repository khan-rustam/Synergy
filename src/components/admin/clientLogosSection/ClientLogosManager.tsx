interface ClientLogo {
  id: number;
  imageUrl: string;
  createdAt: string;
}

const handleDelete = async (logo: ClientLogo) => {
  if (!user?.token || !logoToDelete) {
    toast.error("Authentication required. Please log in again.");
    return;
  }

  setIsDeleting(true);
  try {
    // Delete logo from database first
    const response = await fetch(`${apiEndpoint.clientLogo}/delete/${logo.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete logo");
    }

    // If logo deletion was successful, delete the image from Cloudinary
    await deleteImageFromCloudinary(logo.imageUrl);

    await fetchLogos();
    toast.success("Logo deleted successfully");
    setShowDeleteModal(false);
    setLogoToDelete(null);
  } catch (error) {
    console.error("Error deleting logo:", error);
    toast.error("Failed to delete logo");
  } finally {
    setIsDeleting(false);
  }
};

{logos.map((logo) => (
  <div key={logo.id} className="border rounded-lg overflow-hidden">
    <img
      src={logo.imageUrl}
      alt={`Client Logo ${logo.id}`}
      className="w-full h-32 object-contain"
    />
    <div className="p-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => handleDeleteClick(logo)}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
))} 