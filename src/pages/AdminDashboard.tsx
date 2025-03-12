import React, { useState, lazy, Suspense, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/admin/Sidebar';

// Lazy load admin components for better performance
const Overview = lazy(() => import('../components/admin/Overview'));
const BlogManager = lazy(() => import('../components/admin/blogSection/BlogManager'));
const SliderManager = lazy(() => import('../components/admin/sliderSection/SliderManager'));
const TestimonialsManager = lazy(() => import('../components/admin/testimonialSection/TestimonialsManager'));
const ClientLogoManager = lazy(() => import('../components/admin/clientLogoSection/ClientLogoManager'));
const ContactList = lazy(() => import('../components/admin/ContactFormSection/ContactList'));

// TypeScript types for dashboard tabs
type DashboardTab = 
  | 'overview' 
  | 'blogs' 
  | 'slider' 
  | 'testimonials' 
  | 'client-logos' 
  | 'contact forms';

/**
 * Loading component for tab content
 */
const TabLoader = () => (
  <div className="flex items-center justify-center h-64">
    <motion.div
      animate={{
        rotate: 360,
        borderColor: ['#E63946', '#457B9D', '#1D3557', '#E63946']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
      className="h-12 w-12 rounded-full border-t-4 border-synergy-red"
      aria-label="Loading tab content"
    />
  </div>
);

/**
 * Error fallback component for tab content
 */
const TabErrorFallback = () => (
  <div className="p-8 bg-red-50 rounded-lg text-center" role="alert">
    <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load content</h3>
    <p className="text-red-600">There was an error loading this content. Please try again.</p>
    <button 
      onClick={() => window.location.reload()} 
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Reload
    </button>
  </div>
);

/**
 * AdminDashboard Component
 * 
 * Central dashboard for managing website content including blogs, events,
 * testimonials, client logos, and contact form submissions.
 */
const AdminDashboard: React.FC = () => {
  // State for active tab and mobile sidebar
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  /**
   * Renders the appropriate content based on the active tab
   */
  const renderTabContent = useCallback(() => {
    try {
      // Error boundary would be better here in a production app
      switch (activeTab) {
        case 'overview':
          return (
            <Suspense fallback={<TabLoader />}>
              <Overview />
            </Suspense>
          );
        case 'blogs':
          return (
            <Suspense fallback={<TabLoader />}>
              <BlogManager />
            </Suspense>
          );
        case 'slider':
          return (
            <Suspense fallback={<TabLoader />}>
              <SliderManager />
            </Suspense>
          );
        case 'testimonials':
          return (
            <Suspense fallback={<TabLoader />}>
              <TestimonialsManager />
            </Suspense>
          );
        case 'client-logos':
          return (
            <Suspense fallback={<TabLoader />}>
              <ClientLogoManager />
            </Suspense>
          );
        case 'contact forms':
          return (
            <Suspense fallback={<TabLoader />}>
              <ContactList />
            </Suspense>
          );
        default:
          return (
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-800">Select a section from the sidebar</h3>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return <TabErrorFallback />;
    }
  }, [activeTab]);

  /**
   * Returns the formatted page title based on the active tab
   */
  const pageTitle = useMemo(() => {
    switch (activeTab) {
      case 'client-logos':
        return 'Client Logos';
      case 'contact forms':
        return 'Contact Forms';
      default:
        return activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    }
  }, [activeTab]);

  // Toggle mobile sidebar
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  // Handle tab change with correct types
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as DashboardTab);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {pageTitle}
            </h1>
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-synergy-red"
              onClick={toggleMobileSidebar}
              aria-label="Open sidebar"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>
        
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Page content */}
              <div className="py-4">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default React.memo(AdminDashboard);
