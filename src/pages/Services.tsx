import React, { memo, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Keyboard as Billboard, Calendar, Palette, Megaphone, BarChart, Globe, Monitor, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import ScrollReveal from '../components/common/ScrollReveal';
import LazyImage from '../components/common/LazyImage';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
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

      <Link 
        to="/contact" 
        className="inline-flex items-center text-synergy-red hover:text-synergy-dark transition-colors font-medium"
      >
        Learn More
        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </motion.div>
  );
});

const Services: React.FC = () => {
  // Define services data
  const services = useMemo(() => [
    {
      icon: <Billboard size={24} />,
      title: "Billboard Advertising",
      description: "Maximize visibility with strategic billboard placements in high-traffic locations.",
      features: [
        "Premium locations",
        "High-impact designs",
        "Strategic placement",
        "Demographic targeting"
      ]
    },
    {
      icon: <Calendar size={24} />,
      title: "Event Branding",
      description: "Create memorable brand experiences at events and exhibitions.",
      features: [
        "Custom booth designs",
        "Promotional materials",
        "Interactive displays",
        "Brand ambassadors"
      ]
    },
    {
      icon: <Palette size={24} />,
      title: "Creative Design",
      description: "Eye-catching designs that communicate your brand message effectively.",
      features: [
        "Brand identity",
        "Visual storytelling",
        "Print & digital design",
        "Campaign concepts"
      ]
    },
    {
      icon: <Megaphone size={24} />,
      title: "Transit Advertising",
      description: "Reach audiences on the move with transit and vehicle advertising.",
      features: [
        "Bus & train wraps",
        "Taxi advertising",
        "Station domination",
        "Route optimization"
      ]
    },
    {
      icon: <BarChart size={24} />,
      title: "Analytics & Reporting",
      description: "Measure campaign performance with detailed analytics and insights.",
      features: [
        "Audience metrics",
        "Engagement tracking",
        "ROI analysis",
        "Performance reports"
      ]
    },
    {
      icon: <Globe size={24} />,
      title: "Digital Integration",
      description: "Combine traditional OOH with digital strategies for maximum impact.",
      features: [
        "QR code integration",
        "Social media tie-ins",
        "AR experiences",
        "Cross-channel campaigns"
      ]
    }
  ], []);

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <LazyImage
            src="https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Our Services"
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
                <Briefcase className="text-white h-8 w-8" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-synergy-red to-red-400">Services</span>
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
              Comprehensive advertising solutions tailored to elevate your brand and drive results.
              Discover how we can transform your marketing strategy.
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

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16" variant="fadeUp">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-synergy-dark mb-6">What We Offer</h2>
            <div className="w-20 h-1 bg-synergy-red mx-auto mb-8"></div>
            <p className="text-gray-600">
              We provide a comprehensive range of advertising services designed to maximize your brand's visibility and impact.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
                delay={index}
              />
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default memo(Services);