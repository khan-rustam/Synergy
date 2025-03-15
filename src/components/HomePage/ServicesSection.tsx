import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Megaphone, Calendar, Palette, BarChart3 } from 'lucide-react';
import { scaleReveal, rotateIn3D, clipPathReveal } from '../utils/gsapAnimations';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, category, delay }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: '200px 0px',
  });

  return (
    <div 
      ref={ref}
      className={`group perspective bg-white rounded-xl shadow-lg transition-all duration-500 
        transform-gpu hover:scale-105 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay * 0.05}s` }}
    >
      <div className="relative preserve-3d group-hover:rotate-y-12 duration-700 w-full h-full p-8">
        {/* Icon Circle */}
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 
          group-hover:bg-synergy-red transform-gpu group-hover:rotate-y-180 transition-all duration-700">
          <div className="text-synergy-red group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
        </div>

        {/* Category Tag */}
        <span className="inline-block px-4 py-1 bg-red-50 text-synergy-red text-sm rounded-full mb-4">
          {category}
        </span>

        {/* Content */}
        <h3 className="text-2xl font-heading font-bold text-synergy-dark mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
      </div>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    if (sectionRef.current && headingRef.current && cardsRef.current) {
      // Clip path reveal for the heading with earlier trigger
      clipPathReveal(headingRef.current, {
        trigger: sectionRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none'
      });

      // 3D rotation for service cards with earlier trigger
      const cards = Array.from(cardsRef.current.children);
      cards.forEach((card, index) => {
        rotateIn3D(card, {
          trigger: sectionRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none'
        });
      });

      // Scale reveal for images with earlier trigger
      imageRefs.current.forEach((img, index) => {
        if (img) {
          scaleReveal(img, {
            trigger: sectionRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none'
          });
        }
      });
    }
  }, []);

  const featuredServices = [
    {
      icon: <Megaphone className="w-8 h-8" />,
      title: "Billboard Advertising",
      category: "Outdoor",
      description: "Strategic placement of your brand on high-visibility billboards across prime locations.",
      delay: 0
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Event Management",
      category: "Events",
      description: "End-to-end planning and execution of brand events that create memorable experiences.",
      delay: 1
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Brand Identity",
      category: "Branding",
      description: "Comprehensive branding solutions that establish a strong market presence.",
      delay: 2
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Digital Integration",
      category: "Digital",
      description: "Seamless integration of digital elements with traditional OOH advertising.",
      delay: 3
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Added Heading Section */}
        <div className="text-center mb-16">
          <h2 ref={headingRef} className="text-4xl md:text-5xl font-heading font-bold text-synergy-dark mb-4">
            Our Services
          </h2>
          <div className="w-24 h-1 bg-synergy-red mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your brand visibility with our innovative advertising solutions. 
            From billboards to digital integration, we make your brand impossible to ignore.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featuredServices.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              category={service.category}
              delay={service.delay}
            />
          ))}
        </div>

        {/* Centered Explore More Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/services')}
            className="group relative inline-flex items-center justify-center px-8 py-4 
              bg-synergy-red text-white font-bold text-lg rounded-full 
              transition-all duration-300 transform hover:scale-105 hover:shadow-xl
              hover:shadow-synergy-red/20"
          >
            <span className="relative z-10">Explore More Services</span>
            <div className="absolute inset-0 rounded-full bg-synergy-red transform scale-100 
              group-hover:scale-110 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;