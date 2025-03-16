import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from "react-toastify";
import { apiEndpoint } from '../components/admin/config/api';
import { BiLoaderCircle } from 'react-icons/bi';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import ScrollReveal from '../components/common/ScrollReveal';
import LazyImage from '../components/common/LazyImage';

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

// Particle component for header animation
const HeaderParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || 400;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle properties
    const particlesArray: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
    }[] = [];
    
    // Create particles
    const createParticles = () => {
      const particleCount = Math.floor(window.innerWidth / 30); // Responsive particle count
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 0.2 - 0.1;
        const speedY = Math.random() * 0.2 - 0.1;
        
        // Use brand colors with varying opacity
        const colors = [
          'rgba(239, 68, 68, 0.4)', // Red
          'rgba(255, 255, 255, 0.3)', // White
          'rgba(200, 30, 30, 0.3)', // Darker red
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const alpha = Math.random() * 0.5 + 0.1;
        
        particlesArray.push({
          x,
          y,
          size,
          speedX,
          speedY,
          color,
          alpha
        });
      }
    };
    
    createParticles();
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none"
    />
  );
};

/**
 * Contact Page Component
 * Displays a contact form and company information
 */
const Contact: React.FC = () => {
  // State management
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Phone validation (optional field)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${apiEndpoint.contact}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        resetForm();
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <LazyImage
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Contact Us"
            className="w-full h-full"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-synergy-dark/90 via-synergy-dark/80 to-synergy-dark/90"></div>
        </div>
        
        {/* Particles Animation */}
        <div className="absolute inset-0">
          <HeaderParticles />
        </div>
        
        {/* Decorative Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-synergy-red/20 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-synergy-red/20 blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-white/10 blur-lg"></div>
        
        {/* Glossy Circle */}
        <div className="absolute left-1/4 bottom-1/4 w-40 h-40 rounded-full bg-gradient-to-tr from-synergy-red/20 to-white/5 backdrop-blur-sm border border-white/10"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto" variant="fadeUp">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-block mb-4"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <MessageSquare className="text-white h-8 w-8" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-synergy-red to-red-400">Connect</span>
            </motion.h1>
            
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-synergy-red to-red-400 mx-auto mb-6"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 96 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            ></motion.div>
            
            <motion.p 
              className="text-xl text-white/90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              Have a question or project in mind? We're here to help bring your vision to life.
              Reach out and let's start a conversation.
            </motion.p>
          </ScrollReveal>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto">
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <ScrollReveal className="lg:col-span-2 bg-white rounded-xl shadow-xl p-8" variant="fadeRight">
              <h2 className="text-3xl font-heading font-bold text-synergy-dark mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Have a question or want to work with us? Fill out the form below and we'll get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
                
                <FormField
                  label="Phone Number (Optional)"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                
                <div className="relative">
                  <label className="block text-gray-700 font-medium mb-2">
                    Your Message <span className="text-synergy-red">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-synergy-red/50 focus:border-synergy-red outline-none transition-all duration-300 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <SubmitButton isSubmitting={isSubmitting} />
              </form>
            </ScrollReveal>
            
            {/* Contact Info */}
            <div className="space-y-8">
              <ScrollReveal variant="fadeLeft" delay={0.2}>
                <ContactInfoCard />
              </ScrollReveal>
              
              <ScrollReveal variant="fadeLeft" delay={0.4}>
                <BusinessHoursCard />
              </ScrollReveal>
              
              
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <ScrollReveal className="order-2 lg:order-1" variant="fadeRight">
              <div className="rounded-xl overflow-hidden shadow-lg h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.1757538408795!2d75.7885054!3d26.8682361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5bfb5c25f63%3A0xdcc3b5c5e1a8a0c0!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1646569735000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Office Location"
                ></iframe>
              </div>
            </ScrollReveal>
            
            <ScrollReveal className="order-1 lg:order-2" variant="fadeLeft">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-synergy-dark mb-3">Find Our Office</h2>
                <div className="w-16 h-1 bg-synergy-red mb-6"></div>
                <p className="text-gray-600 mb-6">
                  We're conveniently located in the heart of Jaipur's business district, easily accessible by public transportation and with ample parking available.
                </p>
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-synergy-red/10 flex items-center justify-center flex-shrink-0 mr-4">
                    <MapPin className="text-synergy-red" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700">Our Address</h4>
                    <address className="not-italic text-gray-600 mt-1">
                      123 Advertising Avenue,<br />
                      Media District, Jaipur,<br />
                      Rajasthan 302001
                    </address>
                  </div>
                </div>
                <p className="text-gray-600 mt-6">
                  Need directions? Feel free to <a href="tel:+919876543210" className="text-synergy-red font-medium">call us</a> or <a href="mailto:info@synergyooh.com" className="text-synergy-red font-medium">email us</a> for assistance.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-synergy-dark text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto" variant="fadeUp">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Let's Create Something Amazing Together</h2>
            <div className="w-20 h-1 bg-synergy-red mx-auto mb-6"></div>
            <p className="text-lg text-white/90 mb-8">
              Whether you have a specific project in mind or just want to explore possibilities, we're here to help transform your brand with innovative advertising solutions.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-synergy-red hover:bg-red-600 text-white py-3 px-8 rounded-full font-medium transition duration-300"
              onClick={() => window.location.href = '/services'}
            >
              Explore Our Services
            </motion.button>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
};

/**
 * Form Field Component
 * Renders a form input field with label
 */
const FormField: React.FC<{
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  required?: boolean;
}> = ({ label, ...props }) => (
  <div className="relative">
    <label className="block text-gray-700 font-medium mb-2">
      {label} {props.required && <span className="text-synergy-red">*</span>}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-synergy-red/50 focus:border-synergy-red outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  </div>
);

/**
 * Submit Button Component
 * Renders a submit button with loading state
 */
const SubmitButton: React.FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => (
  <motion.button
    type="submit"
    disabled={isSubmitting}
    className="bg-synergy-red hover:bg-red-600 text-white py-3 px-8 rounded-full font-medium transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
    whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
  >
    {isSubmitting ? (
      <>
        <BiLoaderCircle className="animate-spin mr-2" size={20} />
        Sending...
      </>
    ) : (
      <>
        <Send className="mr-2 h-5 w-5" />
        Send Message
      </>
    )}
  </motion.button>
);

/**
 * Contact Info Card Component
 * Displays company contact information
 */
const ContactInfoCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-8">
    <h3 className="text-xl font-bold mb-6">Contact Information</h3>
    <div className="space-y-6">
      <ContactItem
        icon={<Phone className="text-synergy-red" />}
        title="Phone"
        content={
          <div>
            <a href="tel:+919876543210" className="hover:text-synergy-red transition-colors">
              +91 98765 43210
            </a>
            <br />
            <a href="tel:+919876543211" className="hover:text-synergy-red transition-colors">
              +91 98765 43211
            </a>
          </div>
        }
      />
      <ContactItem
        icon={<Mail className="text-synergy-red" />}
        title="Email"
        content={
          <a href="mailto:info@synergyooh.com" className="hover:text-synergy-red transition-colors">
            info@synergyooh.com
          </a>
        }
      />
      <ContactItem
        icon={<MapPin className="text-synergy-red" />}
        title="Address"
        content={
          <address className="not-italic">
            123 Advertising Avenue,<br />
            Media District, Jaipur,<br />
            Rajasthan 302001
          </address>
        }
      />
    </div>
  </div>
);

/**
 * Contact Item Component
 * Displays a single contact information item
 */
const ContactItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}> = ({ icon, title, content }) => (
  <div className="flex">
    <div className="w-10 h-10 rounded-full bg-synergy-red/10 flex items-center justify-center flex-shrink-0 mr-4">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-gray-700">{title}</h4>
      <div className="text-gray-600 mt-1">{content}</div>
    </div>
  </div>
);

/**
 * Business Hours Card Component
 * Displays company business hours
 */
const BusinessHoursCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-8">
    <h3 className="text-xl font-bold mb-6">Business Hours</h3>
    <div className="space-y-3">
      <BusinessHourItem day="Monday - Friday" hours="9:00 AM - 6:00 PM" />
      <BusinessHourItem day="Saturday" hours="10:00 AM - 4:00 PM" />
      <BusinessHourItem day="Sunday" hours="Closed" />
    </div>
  </div>
);

/**
 * Business Hour Item Component
 * Displays a single business hour item
 */
const BusinessHourItem: React.FC<{ day: string; hours: string }> = ({ day, hours }) => (
  <div className="flex justify-between">
    <span className="font-medium text-gray-700">{day}</span>
    <span className="text-gray-600">{hours}</span>
  </div>
);

export default Contact;