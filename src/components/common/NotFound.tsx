import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 perspective-1000">
            <h1 className="text-9xl text-red-600 transform rotate-y-20 animate-float">404</h1>
            <p className="text-2xl text-gray-800 mb-4">Oops! Page not found.</p>
            <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
                It seems the page you're looking for doesn't exist. 
                
                Don't worry, you can always go back to the homepage!
            </p>
            <Link to="/" className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-500 transition duration-300">
                Go to Homepage
            </Link>
           
        </div>
    );
};

export default NotFound; 