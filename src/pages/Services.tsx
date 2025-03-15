import React, { memo, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Keyboard as Billboard, Calendar, Palette, Megaphone, BarChart, Globe, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';

// Service card properties
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  delay: number;
}

// Service card component
const ServiceCard: React.FC<ServiceCardProps> = memo(({ icon, title, description, features, delay }) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.05,
    rootMargin: '100px 0px',
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.4, 
        delay: delay * 0.08,
        ease: "easeOut" 
      }}
      className="bg-white rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
    >
      <div className="w-16 h-16 rounded-full bg-synergy-red/10 flex items-center justify-center mb-6 group-hover:bg-synergy-red transition-colors duration-300">
        <div className="text-synergy-red group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
      </div>

      <h3 className="text-xl font-heading font-bold text-synergy-dark mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-synergy-red mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

const Services: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.01,
    rootMargin: '100px 0px',
  });

  // Services data
  const services = useMemo(() => [
    {
      icon: <Billboard className="h-8 w-8" />,
      title: "Billboard Advertising",
      description: "Dominate the skyline with eye-catching billboard placements in prime locations.",
      features: [
        "Strategic placement analysis",
        "High-visibility locations",
        "Impact measurement",
        "Demographic targeting",
        "Custom design options"
      ],
      delay: 0
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Event Marketing",
      description: "Create memorable brand experiences through strategic event marketing.",
      features: [
        "Custom event planning",
        "Brand activation",
        "Experiential marketing",
        "Post-event analytics",
        "Integrated campaigns"
      ],
      delay: 1
    },
    {
      icon: <Monitor className="h-8 w-8" />,
      title: "Digital Marketing",
      description: "Enhance your OOH campaigns with integrated digital marketing strategies.",
      features: [
        "Search engine optimization (SEO)",
        "Pay-per-click advertising (PPC)",
        "Social media management",
        "Content marketing",
        "Email marketing campaigns",
        "Analytics & performance tracking"
      ],
      delay: 2
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Creative Design",
      description: "Transform your message with cutting-edge design that captures attention.",
      features: [
        "Brand identity development",
        "Visual storytelling",
        "Multi-format design",
        "Interactive elements",
        "Design optimization"
      ],
      delay: 3
    },
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: "Transit Advertising",
      description: "Reach audiences on the move with strategic transit advertising placements.",
      features: [
        "Bus & subway advertising",
        "Taxi top displays",
        "Station domination",
        "Route optimization",
        "Frequency analytics"
      ],
      delay: 4
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Analytics & Reporting",
      description: "Measure performance with advanced analytics to optimize your advertising ROI.",
      features: [
        "Real-time performance data",
        "Audience insights",
        "Competitive analysis",
        "Attribution modeling",
        "ROI optimization"
      ],
      delay: 5
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Street Furniture Advertising",
      description: "Engage audiences at street level with contextually relevant placements.",
      features: [
        "Bus shelter advertising",
        "Urban panel displays",
        "Kiosk placements",
        "Neighborhood targeting",
        "Interactive options"
      ],
      delay: 6
    },
  ], []);

  return (
    <div className="pt-10 min-h-screen bg-synergy-light/50">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=2607&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Services"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-synergy-dark/70"></div>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 relative z-10 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">Our Services</h1>
          <div className="w-20 h-1 bg-synergy-red mx-auto mb-2"></div>
          <p className="text-xl text-white max-w-3xl mx-auto">
            We offer comprehensive out-of-home advertising solutions to elevate your brand and maximize your reach.
          </p>
        </motion.div>
      </section>

      {/* Services Grid Section */}
      <motion.section 
        className="py-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05, margin: "150px 0px" }}
        transition={{ duration: 0.4 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={`service-${index}`}
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
                delay={service.delay}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-synergy-red hover:bg-red-700 transition-colors"
              aria-label="Get a Free Consultation"
            >
              Get a Free Consultation
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default memo(Services);