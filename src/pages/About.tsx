import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

// Gradient styles
const headingGradientStyle = {
  background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

const accentGradientStyle = {
  background: 'linear-gradient(135deg, #ff3366 0%, #ff0844 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

const About: React.FC = () => {
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: contentRef, inView: contentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: teamRef, inView: teamInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="pt-14">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Team working together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-synergy-dark/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">About Us</h1>
          <div className="w-20 h-1 bg-synergy-red mx-auto"></div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div
              ref={contentRef}
              className={`transition-all duration-1000 ${contentInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
            >
              <h2 className="text-3xl font-heading font-bold text-synergy-dark mb-6">Our Story</h2>
              <div className="w-20 h-1 bg-synergy-red mb-8"></div>
              <p className="text-gray-700 mb-6">
                Founded in 2006 by Mr. Prashant Kaushal, Synergy Advertisers has established itself as a premier advertising agency in Jaipur, Rajasthan. Over the past 17+ years, we've expanded our expertise across 12+ verticals, building a diverse portfolio of more than 35 prestigious clients including Ambuja, Vodafone, and AU Finance.
              </p>
              <p className="text-gray-700 mb-6">
                Our core strength lies in Out-of-Home (OOH) advertising, where we offer comprehensive solutions through hoardings, unipoles, pole kiosks, bus branding, and mobile vans—ensuring your brand captures attention throughout Rajasthan. We excel in creating memorable event experiences, from corporate conferences and product launches to celebrity management and mall activations.
              </p>
              <p className="text-gray-700">
                At Synergy Advertisers, we're driven by a commitment to authenticity, creativity, and excellence. Our collaborative approach means we work closely with you to understand your vision, developing customized strategies that align with your goals. With our deep understanding of the local market and extensive network, we're your trusted partner in navigating the dynamic landscape of advertising and marketing.
              </p>
            </div>
            <div
              className={`relative transition-all duration-1000 overflow-hidden ${contentInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Synergy OOH team"
                className="w-full rounded-lg shadow-xl relative z-10"
              />
              <div className="absolute -bottom-5 md:-bottom-10 -left-5 md:-left-10 w-20 md:w-40 h-20 md:h-40 bg-synergy-red rounded-lg -z-10"></div>
              <div className="absolute -top-5 md:-top-10 -right-5 md:-right-10 w-20 md:w-40 h-20 md:h-40 bg-synergy-blue rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-synergy-light">
        <div className="container mx-auto px-4">
          <div
            ref={titleRef}
            className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-synergy-dark mb-4">Our Values</h2>
            <div className="w-20 h-1 bg-synergy-red mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              These core principles guide everything we do and define who we are as a company.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-synergy-red/10 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-synergy-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-synergy-dark mb-3">Innovation</h3>
              <p className="text-gray-600">
                We constantly push boundaries and explore new ideas to keep our clients ahead of the curve in an ever-evolving marketing landscape.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-synergy-red/10 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-synergy-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-synergy-dark mb-3">Collaboration</h3>
              <p className="text-gray-600">
                We believe in the power of partnership – working closely with our clients and each other to achieve exceptional results through shared vision and expertise.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-synergy-red/10 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-synergy-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-synergy-dark mb-3">Integrity</h3>
              <p className="text-gray-600">
                We conduct our business with honesty, transparency, and accountability, building trust with our clients and within our team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Leadership Team - Four Pillars */}
          <div 
            ref={teamRef}
            className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${teamInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-heading font-bold mb-4"
              style={headingGradientStyle}
            >
              The Four Pillars of Synergy OOH
            </motion.h2>
            <motion.div
              className="w-20 h-1 mx-auto mb-6"
              style={{
                background: 'linear-gradient(to right, #ff3366, #ff0844)'
              }}
            />
            <p className="text-lg text-gray-600">
              Meet the visionary leaders who established and guide our company's success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                name: "PRASHANT KAUSHAL",
                position: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                bio: "A visionary leader with over 15 years of experience in the advertising industry, driving innovation and excellence in OOH advertising across Rajasthan."
              },
              {
                name: "ARCHANA RAWAT",
                position: "Co-Founder",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                bio: "A strategic thinker with exceptional business acumen who has been instrumental in shaping the company's growth and client relationships since its inception."
              },
              {
                name: "SUNNY DHALIA",
                position: "Chief Technology Officer",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                bio: "A tech innovator who leads our digital transformation initiatives, integrating cutting-edge technology with traditional OOH advertising for maximum impact."
              },
              {
                name: "AMIT TRIVEDI",
                position: "Chief Marketing Officer",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                bio: "A marketing strategist with deep industry knowledge who develops comprehensive campaigns that deliver measurable results for our diverse client portfolio."
              }
            ].map((member, index) => (
              <motion.div 
                key={index} 
                className="group relative overflow-hidden rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-synergy-dark to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 group-hover:translate-y-full transition-transform duration-300">
                  <h3 className="text-xl font-heading font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-synergy-light/90">{member.position}</p>
                </div>
                <div className="absolute inset-0 bg-synergy-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6">
                  <h3 className="text-xl font-heading font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-synergy-light mb-4">{member.position}</p>
                  <p className="text-white/80 text-center text-sm">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Creative Team */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-heading font-bold mb-4"
              style={headingGradientStyle}
            >
              Our Creative Powerhouse
            </motion.h2>
            <motion.div
              className="w-20 h-1 mx-auto mb-6"
              style={{
                background: 'linear-gradient(to right, #ff3366, #ff0844)'
              }}
            />
            <p className="text-lg text-gray-600">
              The talented individuals who bring our vision to life through design, development, and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: "RAHUL SHARMA",
                position: "Lead Designer",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              },
              {
                name: "PRIYA PATEL",
                position: "Frontend Developer",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              },
              {
                name: "VIKRAM SINGH",
                position: "Backend Developer",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              },
              {
                name: "NEHA GUPTA",
                position: "UI/UX Specialist",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              }
            ].map((member, index) => (
              <motion.div 
                key={index} 
                className="group relative overflow-hidden rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-synergy-dark to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-heading font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-synergy-light/90 text-sm">{member.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;