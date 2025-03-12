import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const logoGradientStyle = {
  background: 'linear-gradient(135deg, #ff3366 0%, #ff0844 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

const headingGradientStyle = {
  background: 'linear-gradient(135deg, #ffffff 0%, #e6e9f0 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get auth state from Redux store
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const isAdmin = user?.isAdmin;

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "about", label: "About Us", path: "/about" },
    { id: "services", label: "Services", path: "/services" },
    { id: "blog", label: "Blog", path: "/blog" },
    { id: "contact", label: "Contact", path: "/contact" },
  ];

  // Updated navbar background and positioning classes with improved contrast
  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full
    backdrop-blur-md border-b border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.5)]
    ${scrolled
      ? "bg-synergy-dark/90 shadow-lg py-2"
      : isHomePage
        ? "bg-synergy-dark/85 py-4"
        : "bg-synergy-dark/85 py-4"
    }`;

  // Update text color classes for better contrast
  const textColorClasses = "text-white hover:text-synergy-red";
  const logoColorClasses = "text-white";

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleClick = () => {
    setIsOpen(false);
    scrollToTop();
  };

  return (
    <motion.nav
      className={navbarClasses}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: scrolled
          ? "0 8px 32px 0 rgba(31, 38, 135, 0.5), 0 4px 8px rgba(0, 0, 0, 0.2)"
          : "0 8px 32px 0 rgba(31, 38, 135, 0.5)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Empty div for mobile layout balance */}
          <div className="w-6 md:hidden"></div>

          {/* Logo - Centered on mobile */}
          <Link
            to="/"
            className="flex items-center group absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none"
            onClick={scrollToTop}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-synergy-red/20 to-synergy-red/10 blur-lg" />
              <Megaphone className="h-8 w-8 md:h-8 md:w-8 text-synergy-red bg-gradient-to-r from-synergy-red to-red-600 bg-clip-text mr-2 transform transition-transform duration-300 group-hover:scale-110 relative z-10" />
            </motion.div>
            <span
              className="font-heading font-bold text-2xl md:text-xl transition-colors duration-300"
              style={logoGradientStyle}
            >
              Synergy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="relative group"
                onClick={scrollToTop}
              >
                <span
                  className={`transition-all duration-300 font-medium 
                  ${isActive(item.path) ? "text-transparent bg-gradient-to-r from-synergy-red to-red-600 bg-clip-text" : "text-white hover:text-transparent hover:bg-gradient-to-r hover:from-synergy-red hover:to-red-600 hover:bg-clip-text"}`}
                >
                  {item.label}
                </span>
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-synergy-red to-red-600 transition-all duration-300 
                  group-hover:w-full ${isActive(item.path) ? "w-full" : ""}`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {isAdmin ? (
                    <Link
                      to="/admin-dashboard"
                      className="bg-synergy-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full 
                        transition-all duration-300 hover:shadow-lg hover:shadow-synergy-red/20"
                      onClick={scrollToTop}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/contact"
                      className="bg-synergy-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full 
                        transition-all duration-300 hover:shadow-lg hover:shadow-synergy-red/20"
                      onClick={scrollToTop}
                    >
                      Get Started
                    </Link>
                  )}
                </motion.div>
                <button
                  onClick={handleLogout}
                  className="text-synergy-red hover:text-red-700 font-medium transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="relative group overflow-hidden bg-gradient-to-r from-synergy-red to-red-600 hover:from-red-600 hover:to-synergy-red text-white font-bold py-2 px-6 rounded-full 
                    transition-all duration-300 hover:shadow-lg hover:shadow-synergy-red/20"
                  onClick={scrollToTop}
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-synergy-red to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button - Right */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={`${textColorClasses} focus:outline-none`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed top-[calc(100% - 1px)] left-0 right-0 max-h-[calc(100vh-4rem)] overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="bg-synergy-dark/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-4 border-t border-white/20 shadow-lg"
            >
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                {navItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={item.path}
                      className={`block transition-colors duration-300 font-medium py-3 relative group text-center
                        ${isActive(item.path)
                          ? "text-synergy-red"
                          : "text-white hover:text-synergy-red"
                        }`}
                      onClick={handleClick}
                    >
                      <span className="relative z-10 text-lg">{item.label}</span>
                      {isActive(item.path) && (
                        <motion.span
                          className="absolute inset-0 bg-white/10 rounded-lg"
                          layoutId="activeBackground"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Dashboard/Action Button */}
              {isAuthenticated && (
                <div className="pt-2 flex flex-col items-center space-y-3">
                  {isAdmin && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="w-full"
                    >
                      <Link
                        to="/admin-dashboard"
                        className="block w-full text-center bg-synergy-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg
                          transition-all duration-300 shadow-lg shadow-synergy-red/20"
                        onClick={handleClick}
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="w-full"
                  >
                    <button
                      onClick={handleLogout}
                      className="block w-full text-center bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg
                        transition-all duration-300 border border-white/20"
                    >
                      Logout
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
