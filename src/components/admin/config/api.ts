const baseUrl = process.env.VITE_API_URL;
// Define your API endpoint
export const apiEndpoint = {
  slide: `${baseUrl}/api/slide`,
  blog: `${baseUrl}/api/blog`,
  testimonial: `${baseUrl}/api/testimonial`,
  client: `${baseUrl}/api/client`,
  contact: `${baseUrl}/api/contact`,
  auth: `${baseUrl}/api/users`,
  cloudinary: `${baseUrl}/api/cloudinary`,
  clientLogo: `${baseUrl}/api/client-logo`,
  user: `${baseUrl}/api/user`,
  deleteImage: `${baseUrl}/api/cloudinary/destroy`,
};
