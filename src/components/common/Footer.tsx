import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, ArrowUp } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";

const logoGradientStyle = {
  background: "linear-gradient(135deg, #ff3366 0%, #ff0844 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const headingGradientStyle = {
  background: "linear-gradient(135deg, #ffffff 0%, #e6e9f0 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-synergy-dark pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-synergy-red/20 to-synergy-red/10 blur-lg" />
                <img 
                  src="/src/assets/logo-white.png" 
                  alt="Synergy Logo" 
                  className="h-10 w-auto mr-2 relative z-10 transform transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
            </div>
            <p className="text-synergy-light/80 mb-6">
              Your Brand Catalyst. We transform ordinary campaigns into
              extraordinary experiences that captivate audiences and elevate
              your brand.
            </p>
            <div className="flex space-x-4">
              {[
                {
                  icon: FaInstagram,
                  href: "https://www.instagram.com/synergy_ooh?igsh=eDJvc3czeDhrdGpw",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/company/synergyjaipur/",
                },
                {
                  icon: FaFacebook,
                  href: "https://www.facebook.com/share/1XZHSWQDDX/",
                },
                { icon: FaTwitter, href: "https://x.com/synergy_ooh?s=09" },
                {
                  icon: () => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  ),
                  href: "https://youtube.com/@synergyooh?si=_PVrssgikCRE9yNd",
                },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  className="relative group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-synergy-red to-red-600 rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-synergy-dark/50 p-2 rounded-full text-white z-10">
                    <social.icon className="h-5 w-5" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3
              className="font-heading font-bold text-xl mb-6"
              style={headingGradientStyle}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { text: "Home", path: "/" },
                { text: "About Us", path: "/about" },
                { text: "Services", path: "/services" },
                { text: "Blog", path: "/blog" },
                { text: "Contact", path: "/contact" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-synergy-light/80 hover:text-transparent hover:bg-gradient-to-r hover:from-synergy-red hover:to-red-600 hover:bg-clip-text transition-all duration-300"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="font-heading font-bold text-xl mb-6"
              style={headingGradientStyle}
            >
              Services
            </h3>
            <ul className="space-y-3">
              {[
                "Billboard Advertising",
                "Event Management",
                "Branding",
                "Promotions",
                "Digital Integration",
              ].map((service, index) => (
                <li key={index}>
                  <Link
                    to="/services"
                    className="text-synergy-light/80 hover:text-transparent hover:bg-gradient-to-r hover:from-synergy-red hover:to-red-600 hover:bg-clip-text transition-all duration-300"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-synergy-light/60 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Synergy. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {[
              { text: "Privacy Policy", path: "/privacy" },
              { text: "Terms of Service", path: "/terms" },
              { text: "Sitemap", path: "/sitemap" },
            ].map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="text-synergy-light/60 hover:text-transparent hover:bg-gradient-to-r hover:from-synergy-red hover:to-red-600 hover:bg-clip-text text-sm transition-all duration-300"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 relative group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Scroll to top"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-synergy-red to-red-600 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative bg-synergy-dark/10 p-3 rounded-full text-white z-10">
          <ArrowUp className="h-5 w-5" />
        </div>
      </motion.button>
    </footer>
  );
};

export default Footer;
