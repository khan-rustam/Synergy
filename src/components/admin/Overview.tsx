import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiEndpoint } from './config/api';
import { ClipboardList, Users, Calendar, MessageSquare, Layers, Award, RefreshCw, AlertCircle, X, BookOpen, Image } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

/**
 * Error state interface for tracking API errors
 */
interface ErrorState {
    hasError: boolean;
    message: string;
}

/**
 * Stat card data interface for dashboard metrics
 */
interface StatCard {
    id: string;
    title: string;
    count: number;
    icon: React.ReactNode;
    isLoading: boolean;
    error: ErrorState;
    color: string;
    description: string;
}

/**
 * Overview Component
 * 
 * Dashboard overview page displaying key metrics and statistics
 * for the website content including blogs, events, testimonials, etc.
 */
const Overview: React.FC = () => {
    // Get authentication token from Redux store
    const { user } = useSelector((state: RootState) => state.auth);
    const token = user?.token || '';
    const navigate = useNavigate();

    // Initialize state with loading and no errors
    const initialStatCards: StatCard[] = useMemo(() => [
        {
            id: 'blogs',
            title: 'Blogs',
            count: 0,
            icon: <BookOpen className="h-8 w-8" />,
            isLoading: true,
            error: { hasError: false, message: '' },
            color: 'bg-blue-500',
            description: 'View and manage your blog posts. This shows the total number of published and draft posts.'
        },
        {
            id: 'slider',
            title: 'Slider',
            count: 0,
            icon: <Image className="h-8 w-8" />,
            isLoading: true,
            error: { hasError: false, message: '' },
            color: 'bg-purple-500',
            description: 'Manage your homepage slider content. This includes all active and inactive slider items.'
        },
        {
            id: 'testimonials',
            title: 'Testimonials',
            count: 0,
            icon: <MessageSquare className="h-8 w-8" />,
            isLoading: true,
            error: { hasError: false, message: '' },
            color: 'bg-yellow-500',
            description: 'See what your customers are saying. This shows the total number of testimonials in the system.'
        },
        {
            id: 'clients',
            title: 'Client Logos',
            count: 0,
            icon: <Users className="h-8 w-8" />,
            isLoading: true,
            error: { hasError: false, message: '' },
            color: 'bg-indigo-500',
            description: 'Manage client logos displayed on your website. This includes all active client partnerships.'
        },
        {
            id: 'contacts',
            title: 'Contact Forms',
            count: 0,
            icon: <MessageSquare className="h-8 w-8" />,
            isLoading: true,
            error: { hasError: false, message: '' },
            color: 'bg-red-500',
            description: 'View all submitted contact form entries. This shows the total number of inquiries received.'
        }
    ], []);

    // State for tracking stats data
    const [stats, setStats] = useState<StatCard[]>(initialStatCards);

    // State for tracking global refresh state
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    // Debounce refresh clicks
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Add this helper function at the top level of the component
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // State for selected stat
    const [selectedStat, setSelectedStat] = useState<StatCard | null>(null);

    /**
     * Fetches data with retry logic and delay
     * @param fetchFn - The fetch function to execute
     * @param retries - Number of retries
     * @param baseDelay - Base delay in ms
     */
    const fetchWithRetry = async (
        fetchFn: () => Promise<void>,
        retries = 3,
        baseDelay = 1000
    ) => {
        for (let i = 0; i < retries; i++) {
            try {
                await fetchFn();
                return;
            } catch (error) {
                if (i === retries - 1) throw error;
                // Exponential backoff
                await delay(baseDelay * Math.pow(2, i));
            }
        }
    };

    /**
     * Update a specific stat's data
     * @param id - The stat ID to update
     * @param data - The data to update (partial)
     */
    const updateStat = useCallback((id: string, data: Partial<StatCard>) => {
        setStats(prev =>
            prev.map(stat =>
                stat.id === id ? { ...stat, ...data } : stat
            )
        );
    }, []);

    /**
     * Fetch total slides with error handling
     */
    const fetchTotalSlides = useCallback(async () => {
        try {
            updateStat('slider', { isLoading: true });
            const response = await fetch(`${apiEndpoint.slide}/get-all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch slider count');
            }

            const data = await response.json();
            updateStat('slider', {
                count: Array.isArray(data.data) ? data.data.length : 0,
                isLoading: false,
                error: { hasError: false, message: '' }
            });
        } catch (error) {
            console.error('Error fetching slider count:', error);
            updateStat('slider', {
                isLoading: false,
                error: {
                    hasError: true,
                    message: error instanceof Error ? error.message : 'Failed to fetch slider count'
                }
            });
        }
    }, [updateStat, token]);

    /**
     * Fetch total contact forms with error handling
     */
    const fetchTotalContactForms = useCallback(async () => {
        try {
            updateStat('contacts', { isLoading: true });
            const response = await fetch(`${apiEndpoint.contact}/get-all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch contact forms count');
            }

            const data = await response.json();

            updateStat('contacts', {
                count: Array.isArray(data.data) ? data.data.length : 0,
                isLoading: false,
                error: { hasError: false, message: '' }
            });
        } catch (error) {
            console.error('Error fetching contact forms count:', error);
            updateStat('contacts', {
                isLoading: false,
                error: {
                    hasError: true,
                    message: error instanceof Error ? error.message : 'Failed to fetch contact forms count'
                }
            });
        }
    }, [updateStat, token]);

    /**
     * Fetch total clients with error handling
     */
    const fetchTotalClients = useCallback(async () => {
        try {
            updateStat('clients', { isLoading: true });
            const response = await fetch(`${apiEndpoint.clientLogo}/get-all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch client logos count');
            }

            const data = await response.json();

            updateStat('clients', {
                count: Array.isArray(data.data) ? data.data.length : 0,
                isLoading: false,
                error: { hasError: false, message: '' }
            });
        } catch (error) {
            console.error('Error fetching client logos count:', error);
            updateStat('clients', {
                isLoading: false,
                error: {
                    hasError: true,
                    message: error instanceof Error ? error.message : 'Failed to fetch client logos count'
                }
            });
        }
    }, [updateStat, token]);

    /**
     * Fetch total blogs with error handling
     */
    const fetchTotalBlogs = useCallback(async () => {
        try {
            updateStat('blogs', { isLoading: true });
            const response = await fetch(`${apiEndpoint.blog}/get-all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch blogs count');
            }

            const data = await response.json();
            updateStat('blogs', {
                count: Array.isArray(data.data) ? data.data.length : 0,
                isLoading: false,
                error: { hasError: false, message: '' }
            });
        } catch (error) {
            console.error('Error fetching blogs count:', error);
            updateStat('blogs', {
                isLoading: false,
                error: {
                    hasError: true,
                    message: error instanceof Error ? error.message : 'Failed to fetch blogs count'
                }
            });
        }
    }, [updateStat, token]);

    /**
     * Fetch total testimonials with error handling
     */
    const fetchTotalTestimonials = useCallback(async () => {
        try {
            updateStat('testimonials', { isLoading: true });
            const response = await fetch(`${apiEndpoint.testimonial}/get-all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch testimonials count');
            }

            const data = await response.json();
            updateStat('testimonials', {
                count: Array.isArray(data.data) ? data.data.length : 0,
                isLoading: false,
                error: { hasError: false, message: '' }
            });
        } catch (error) {
            console.error('Error fetching testimonials count:', error);
            updateStat('testimonials', {
                isLoading: false,
                error: {
                    hasError: true,
                    message: error instanceof Error ? error.message : 'Failed to fetch testimonials count'
                }
            });
        }
    }, [updateStat, token]);

    /**
     * Handles manual refresh of all data with debouncing
     * Prevents multiple rapid refresh requests
     */
    const handleManualRefresh = useCallback(async () => {
        if (isRefreshing || refreshTimeoutRef.current) {
            return;
        }

        setIsRefreshing(true);
        setGlobalError(null);

        try {
            // Reset all stats to loading state
            setStats(prev => prev.map(stat => ({
                ...stat,
                isLoading: true,
                error: { hasError: false, message: '' }
            })));

            // Execute each fetch function with a small delay between them
            await fetchWithRetry(fetchTotalBlogs);
            await delay(300);
            
            await fetchWithRetry(fetchTotalSlides);
            await delay(300);
            
            await fetchWithRetry(fetchTotalTestimonials);
            await delay(300);
            
            await fetchWithRetry(fetchTotalClients);
            await delay(300);
            
            await fetchWithRetry(fetchTotalContactForms);
        } catch (error) {
            console.error('Error during manual refresh:', error);
            setGlobalError('Failed to refresh data. Please wait a moment and try again.');
        } finally {
            setIsRefreshing(false);

            // Prevent another refresh for 5 seconds
            refreshTimeoutRef.current = setTimeout(() => {
                refreshTimeoutRef.current = null;
            }, 5000);
        }
    }, [
        isRefreshing,
        fetchTotalBlogs,
        fetchTotalSlides,
        fetchTotalTestimonials,
        fetchTotalClients,
        fetchTotalContactForms
    ]);

    // Fetch all data on component mount
    useEffect(() => {
        const fetchAllData = async () => {
            setIsRefreshing(true);
            setGlobalError(null);
            
            try {
                await Promise.all([
                    fetchTotalBlogs(),
                    fetchTotalSlides(),
                    fetchTotalTestimonials(),
                    fetchTotalClients(),
                    fetchTotalContactForms()
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
                setGlobalError('Failed to load some data. Please wait a moment and try refreshing.');
            } finally {
                setIsRefreshing(false);
            }
        };

        fetchAllData();
        // Add refresh interval (every 5 minutes)
        const intervalId = setInterval(fetchAllData, 300000);
        return () => {
            clearInterval(intervalId);
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, [
        fetchTotalBlogs,
        fetchTotalSlides,
        fetchTotalTestimonials,
        fetchTotalClients,
        fetchTotalContactForms
    ]);

    /**
     * Displays error message when API calls fail
     */
    const ErrorDisplay = ({ message }: { message: string }) => (
        <div className="text-red-500 text-sm mt-2">
            <p>{message}</p>
        </div>
    );

    /**
     * Renders a loading skeleton while data is being fetched
     */
    const LoadingSkeleton = () => (
        <div className="h-12 w-16 bg-gray-200 animate-pulse rounded"></div>
    );

    /**
     * Handle card click to show modal
     */
    const handleCardClick = (stat: StatCard) => {
        setSelectedStat(stat);
    };

    /**
     * Close modal
     */
    const handleCloseModal = () => {
        setSelectedStat(null);
    };

    return (
        <div className="space-y-8">
            {/* Dashboard Header with Refresh Button */}
            <div className="border-b pb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">
                        Welcome to the admin dashboard. View and manage your website content from here.
                    </p>
                </div>
                <button
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isRefreshing
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-synergy-red hover:bg-red-700 text-white'
                        }`}
                    aria-label="Refresh dashboard data"
                >
                    <RefreshCw className={'h-5 w-5 mr-2'} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Global Error Message */}
            {globalError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                        <h3 className="font-medium text-red-800">Error Loading Data</h3>
                        <p className="text-red-600 text-sm mt-1">{globalError}</p>
                        <p className="text-red-600 text-sm mt-1">
                            This may be due to rate limiting (Too Many Requests).
                            Wait a moment and try refreshing again.
                        </p>
                    </div>
                </div>
            )}

            {/* Stats Section */}
            <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Content Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleCardClick(stat)}
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
                                        {stat.isLoading ? (
                                            <LoadingSkeleton />
                                        ) : stat.error.hasError ? (
                                            <ErrorDisplay message={stat.error.message} />
                                        ) : (
                                            <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 text-right">
                                    <span className="text-sm text-synergy-red hover:text-red-700 flex items-center justify-end">
                                        View Details
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedStat && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-full ${selectedStat.color} text-white mr-4`}>
                                        {selectedStat.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{selectedStat.title}</h3>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {selectedStat.isLoading ? (
                                                <LoadingSkeleton />
                                            ) : selectedStat.error.hasError ? (
                                                <ErrorDisplay message={selectedStat.error.message} />
                                            ) : (
                                                selectedStat.count
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="mt-4">
                                <p className="text-gray-600">{selectedStat.description}</p>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default React.memo(Overview);