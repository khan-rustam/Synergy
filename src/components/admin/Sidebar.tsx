import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaBlog,
  FaImages,
  FaQuoteRight,
  FaSignOutAlt,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaUser
} from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { logout } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const mainTabs = useMemo(() => [
    { id: "overview", label: "Overview", icon: FaHome },
    { id: "blogs", label: "Blogs", icon: FaBlog },
    { id: "slider", label: "Slider", icon: FaImages },
    { id: "testimonials", label: "Testimonials", icon: FaQuoteRight },
    { id: "client-logos", label: "Client Logos", icon: FaImages },
    { id: "contact forms", label: "Contact Forms", icon: FaEnvelope },
  ], []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  }, [setActiveTab, setIsMobileOpen]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Synergy Admin</h2>
            <p className="text-sm text-gray-600 mt-1">Welcome back, Admin</p>
          </div>
          <motion.button
            className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => setIsMobileOpen(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-6 w-6" />
          </motion.button>
        </div>
      </div>

      <nav className="flex-grow mt-6 px-4">
        <div className="space-y-1">
          {mainTabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ x: 5 }}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-synergy-red text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-5 h-5 mr-3" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <motion.button
          whileHover={{ x: 5 }}
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </motion.button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="md:hidden fixed top-2 left-4 z-50 p-2 rounded-lg text-white hover:text-gray-800"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </motion.button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white shadow-lg flex-col pt-16">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-64 bg-white/75 backdrop-blur-xl shadow-lg flex flex-col z-50 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
