import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import ScrollReveal from '../components/common/ScrollReveal';
import LazyImage from '../components/common/LazyImage';
import { Users, History, Target, Award, Zap, Heart, Shield } from 'lucide-react';

// Gradient styles
const headingGradientStyle = {
  background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
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

const About: React.FC = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Sarah Williams',
      position: 'Client Relations',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Sarah ensures our clients receive exceptional service and support throughout their journey with us.'
    },
    {
      name: 'Michael Johnson',
      position: 'Marketing Strategist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Michael specializes in developing data-driven marketing strategies that deliver results.'
    },
    {
      name: 'Jane Smith',
      position: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Jane brings creative excellence and innovation to every project we undertake.'
    },
    {
      name: 'John Doe',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'With over 15 years of experience in advertising, John leads our team with vision and expertise.'
    }
  ];

  // Company pillars data
  const companyPillars = [
    {
      title: "Excellence",
      description: "We strive for excellence in every campaign, delivering results that exceed expectations.",
      icon: <Award className="w-8 h-8 text-synergy-red" />
    },
    {
      title: "Innovation",
      description: "We embrace new technologies and creative approaches to keep our clients ahead of the curve.",
      icon: <Zap className="w-8 h-8 text-synergy-red" />
    },
    {
      title: "Integrity",
      description: "We build relationships based on trust, transparency, and ethical business practices.",
      icon: <Shield className="w-8 h-8 text-synergy-red" />
    },
    {
      title: "Passion",
      description: "We're passionate about advertising and dedicated to helping our clients succeed.",
      icon: <Heart className="w-8 h-8 text-synergy-red" />
    }
  ];

  // Timeline data
  const timeline = [
    {
      year: '2010',
      title: 'Company Founded',
      description: 'Synergy OOH Media was established with a vision to transform outdoor advertising.'
    },
    {
      year: '2015',
      title: 'National Expansion',
      description: 'We expanded our operations nationwide, serving clients across multiple regions.'
    },
    {
      year: '2018',
      title: 'Digital Integration',
      description: 'Introduced innovative digital solutions to complement our traditional advertising services.'
    },
    {
      year: '2023',
      title: 'Global Recognition',
      description: 'Received international awards for our creative campaigns and industry leadership.'
    }
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <LazyImage
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="About Us"
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
                <Users className="text-white h-8 w-8" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-synergy-red to-red-400">Story</span>
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
              Discover the team behind Synergy, our journey, values, and the passion that drives us to create exceptional advertising experiences.
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

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal variant="fadeRight" delay={0.2}>
              <LazyImage
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our mission"
                className="rounded-lg shadow-xl h-[500px]"
              />
            </ScrollReveal>
            
            <ScrollReveal variant="fadeLeft" delay={0.4}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6" style={headingGradientStyle}>Our Story</h2>
              <div className="w-20 h-1 bg-synergy-red mb-8"></div>
              <p className="text-gray-700 mb-6 text-lg">
                Founded in 2010, Synergy OOH Media has been at the forefront of outdoor advertising innovation. We started with a simple mission: to create impactful outdoor campaigns that connect brands with their audiences in meaningful ways.
              </p>
              <p className="text-gray-700 mb-6 text-lg">
                Over the years, we've evolved from a small local agency to a comprehensive media solutions provider, helping businesses of all sizes maximize their visibility and engagement through strategic outdoor advertising.
              </p>
              <p className="text-gray-700 text-lg">
                Today, we combine traditional outdoor media expertise with cutting-edge digital technology to deliver campaigns that stand out in an increasingly competitive landscape.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16" variant="fadeUp">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6" style={headingGradientStyle}>Our Mission & Values</h2>
            <div className="w-20 h-1 bg-synergy-red mx-auto mb-8"></div>
            <p className="text-gray-700 text-lg">
              We're driven by a commitment to excellence, innovation, and client success. Our values guide everything we do.
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal className="bg-white p-8 rounded-lg shadow-lg" variant="fadeUp" delay={0.2}>
              <div className="w-16 h-16 bg-synergy-red/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-synergy-red" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Vision</h3>
              <p className="text-gray-700">
                To be the leading innovator in outdoor advertising, setting new standards for creativity and effectiveness.
              </p>
            </ScrollReveal>
            
            <ScrollReveal className="bg-white p-8 rounded-lg shadow-lg" variant="fadeUp" delay={0.4}>
              <div className="w-16 h-16 bg-synergy-red/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-synergy-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-700">
                We constantly explore new technologies and approaches to keep our clients ahead of the curve.
              </p>
            </ScrollReveal>
            
            <ScrollReveal className="bg-white p-8 rounded-lg shadow-lg" variant="fadeUp" delay={0.6}>
              <div className="w-16 h-16 bg-synergy-red/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-synergy-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Integrity</h3>
              <p className="text-gray-700">
                We build relationships based on trust, transparency, and ethical business practices.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16" variant="fadeUp">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6" style={headingGradientStyle}>Our Journey</h2>
            <div className="w-20 h-1 bg-synergy-red mx-auto mb-8"></div>
            <p className="text-gray-700 text-lg">
              From our humble beginnings to where we are today, our journey has been defined by growth, innovation, and success.
            </p>
          </ScrollReveal>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-synergy-red/20 z-0"></div>
            
            {/* Timeline items */}
            <div className="relative z-10">
              {timeline.map((item, index) => (
                <ScrollReveal 
                  key={index}
                  className={`flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  variant={index % 2 === 0 ? 'fadeRight' : 'fadeLeft'}
                  delay={0.2 * index}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 text-right' : 'md:pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <span className="text-synergy-red font-bold text-xl">{item.year}</span>
                      <h3 className="text-xl font-bold mt-2 mb-3">{item.title}</h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-synergy-red border-4 border-white"></div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16" variant="fadeUp">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6" style={headingGradientStyle}>Our Four Pillars</h2>
            <div className="w-20 h-1 bg-synergy-red mx-auto mb-8"></div>
            <p className="text-gray-700 text-lg">
              The core principles that guide our work and define our approach to advertising.
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyPillars.map((pillar, index) => (
              <ScrollReveal 
                key={index} 
                className="bg-white rounded-lg p-8 shadow-lg text-center"
                variant="fadeUp"
                delay={0.1 * index}
              >
                <div className="w-16 h-16 bg-synergy-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
                <p className="text-gray-700">{pillar.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16" variant="fadeUp">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6" style={headingGradientStyle}>Our Powerhouse Team</h2>
            <div className="w-20 h-1 bg-synergy-red mx-auto mb-8"></div>
            <p className="text-gray-700 text-lg">
              Meet the talented professionals who bring our vision to life and drive our success.
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <ScrollReveal 
                key={index} 
                className="bg-white rounded-lg overflow-hidden shadow-lg"
                variant="fadeUp"
                delay={0.1 * index}
              >
                <LazyImage
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-synergy-red font-medium mb-4">{member.position}</p>
                  <p className="text-gray-700">{member.bio}</p>
                  <div className="flex mt-4 space-x-3">
                    <a href="#" className="text-gray-500 hover:text-synergy-red transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-synergy-red transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-synergy-red transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-synergy-dark text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto" variant="fadeUp">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to Work With Us?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Let's create extraordinary advertising experiences together. Contact us today to get started.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-synergy-red hover:bg-red-600 text-white py-3 px-8 rounded-full font-medium transition duration-300"
              onClick={() => window.location.href = '/contact'}
            >
              Get in Touch
            </motion.button>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default About;