import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from "react-toastify";
import { useInView } from 'react-intersection-observer';
import { apiEndpoint } from '../components/admin/config/api';
import { BiLoaderCircle } from 'react-icons/bi';

// Types
interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Initial form state
const initialFormState: FormData = {
  name: '',
  email: '',
  phone: '',
  message: ''
};

/**
 * Contact Page Component
 * Displays a contact form and company information
 */
const Contact: React.FC = () => {
  // State management
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Intersection observer for animations
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  /**
   * Handles form input changes
   * @param e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Resets form to initial state
   */
  const resetForm = () => setFormData(initialFormState);

  /**
   * Handles form submission
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create loading toast
    const toastId = toast.loading('Sending your message...', {
      position: "top-right",
      autoClose: false
    });

    try {
      const response = await fetch(`${apiEndpoint.contact}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle success case
      if (data.success && data.dbSuccess && data.emailSuccess) {
        toast.update(toastId, {
          render: 'Thank you for your message! We will get back to you soon.',
          type: 'success',
          isLoading: false,
          autoClose: 5000
        });
        resetForm();
        return;
      }

      // Handle partial success cases
      let errorMessage = data.message;
      if (data.dbSuccess && !data.emailSuccess) {
        errorMessage = 'Your message was saved but we could not send a notification. Our team will still receive your message.';
      } else if (!data.dbSuccess) {
        errorMessage = 'Could not save your message. Please try again.';
      }

      toast.update(toastId, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 5000
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.update(toastId, {
        render: 'There was an error sending your message. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Contact us"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-synergy-dark/70"></div>
        </div>
        <div
          ref={ref}
          className={`container mx-auto px-4 relative z-10 text-center transform transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">Contact Us</h1>
          <div className="w-20 h-1 bg-synergy-red mx-auto"></div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-synergy-dark">
        <div className="container mx-auto px-4">
          {/* Introduction Text */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-lg text-synergy-light/90">
              Ready to elevate your brand? Contact us today to discuss how we can help you achieve your marketing goals.
            </p>
          </div>

          {/* Contact Form and Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form Card */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h3 className="text-2xl font-heading font-bold text-synergy-dark mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Fields */}
                <FormField
                  label="Your Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                <FormField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                <FormField
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-synergy-red"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <SubmitButton isSubmitting={isSubmitting} />
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details Card */}
              <ContactInfoCard />

              {/* Business Hours Card */}
              <BusinessHoursCard />
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-16 bg-synergy-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">Our Location</h2>
            <div className="w-20 h-1 bg-synergy-red mx-auto"></div>
          </div>
          <div className="relative w-full h-[450px] rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl">
            {/* 3D effect container */}
            <div className="absolute inset-0 bg-white rounded-xl transform perspective-1000 rotate-x-1 rotate-y-1">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28477.704893558202!2d75.75012303476561!3d26.8490757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5c327c429fb%3A0xb44d8260a266f5cb!2sSynergy!5e0!3m2!1sen!2sin!4v1741372051671!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Synergy Location Map"
                className="rounded-xl"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Reusable Components
const FormField: React.FC<{
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  required?: boolean;
}> = ({ label, ...props }) => (
  <div className="mb-6">
    <label htmlFor={props.name} className="block text-gray-700 font-medium mb-2">{label}</label>
    <input
      id={props.name}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-synergy-red"
      {...props}
    />
  </div>
);

const SubmitButton: React.FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => (
  <button
    type="submit"
    className="w-full bg-synergy-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      <>
        <BiLoaderCircle />
        Sending...
      </>
    ) : (
      <>
        Send Message
        <Send className="ml-2 h-5 w-5" />
      </>
    )}
  </button>
);



const ContactInfoCard: React.FC = () => (
  <div className="bg-synergy-blue/10 rounded-xl p-8">
    <h3 className="text-2xl font-heading font-bold text-white mb-6">Contact Information</h3>
    <div className="space-y-6">
      <ContactItem
        icon={<Mail className="h-6 w-6 text-white" />}
        title="Email Us"
        content={
          <a href="mailto:Info@synergyooh.com" className="text-synergy-light hover:text-synergy-blue transition-colors">
            Info@synergyooh.com
          </a>
        }
      />
      <ContactItem
        icon={<Phone className="h-6 w-6 text-white" />}
        title="Call Us"
        content={
          <a href="tel:+919414072430" className="text-synergy-light hover:text-synergy-blue transition-colors">
            +91 94140-72430
          </a>
        }
      />
      <ContactItem
        icon={<MapPin className="h-6 w-6 text-white" />}
        title="Visit Us"
        content={
          <address className="text-synergy-light not-italic">
            2nd floor, 94/148, Vijay Path<br />
            Mansarovar, Jaipur<br />
            Rajasthan
          </address>
        }
      />
    </div>
  </div>
);

const ContactItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}> = ({ icon, title, content }) => (
  <div className="flex items-start">
    <div className="bg-synergy-red rounded-full p-3 mr-4">
      {icon}
    </div>
    <div>
      <h4 className="text-white font-semibold mb-1">{title}</h4>
      {content}
    </div>
  </div>
);

const BusinessHoursCard: React.FC = () => (
  <div className="bg-synergy-red/10 rounded-xl p-8">
    <h3 className="text-2xl font-heading font-bold text-white mb-6">Business Hours</h3>
    <ul className="space-y-3">
      <BusinessHourItem day="Monday - Friday" hours="9:00 AM - 6:00 PM" />
      <BusinessHourItem day="Saturday" hours="10:00 AM - 4:00 PM" />
      <BusinessHourItem day="Sunday" hours="Closed" />
    </ul>
  </div>
);

const BusinessHourItem: React.FC<{ day: string; hours: string }> = ({ day, hours }) => (
  <li className="flex justify-between text-synergy-light">
    <span>{day}:</span>
    <span>{hours}</span>
  </li>
);

export default Contact;