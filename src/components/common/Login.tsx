import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../store/authSlice';
import { toast } from 'react-toastify';
import { apiEndpoint } from '../admin/config/api';
import { RootState } from '../../store/store';

enum FormState {
    LOGIN = 'login',
    FORGOT_PASSWORD = 'forgot_password',
    OTP_VERIFICATION = 'otp_verification',
    RESET_PASSWORD = 'reset_password'
}

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [formState, setFormState] = useState<FormState>(FormState.LOGIN);
    const [isLoading, setIsLoading] = useState(false);
    
    // Password visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // Redirect if user is already authenticated
        if (isAuthenticated && user?.isAdmin) {
            navigate('/admin-dashboard');
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${apiEndpoint.user}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Validate response structure
            if (!data || !data.success || !data.data) {
                console.error('Invalid response format:', data);
                throw new Error('Invalid response format from server');
            }

            const userData = data.data;

            // Enhanced validation of user data structure
            if (!userData.email) {
                console.error('Response data:', data);
                throw new Error('Email is missing from user data');
            }

            // Ensure we have the token
            if (!userData.token) {
                throw new Error('Authentication token is missing');
            }

            // Determine admin status and ensure role is set
            const isAdmin = userData.isAdmin || false;

            dispatch(setUser({
                email: userData.email,
                isAdmin,
                token: userData.token
            }));

            toast.success('Successfully logged in!');

            if (isAdmin) {
                navigate('/admin-dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Invalid credentials';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Login error:', error);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${apiEndpoint.user}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            // Check if response is ok before trying to parse JSON
            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed with status: ${response.status}`);
                } else {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
            }

            const data = await response.json();
            toast.success(data.message || 'OTP sent to your email!');
            setFormState(FormState.OTP_VERIFICATION);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Forgot password error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${apiEndpoint.user}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp })
            });

            // Check if response is ok before trying to parse JSON
            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed with status: ${response.status}`);
                } else {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
            }

            const data = await response.json();
            toast.success(data.message || 'OTP verified successfully!');
            setFormState(FormState.RESET_PASSWORD);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('OTP verification error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${apiEndpoint.user}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword, confirmPassword })
            });

            // Check if response is ok before trying to parse JSON
            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed with status: ${response.status}`);
                } else {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
            }

            const data = await response.json();
            toast.success(data.message || 'Password reset successful!');
            setFormState(FormState.LOGIN);
            // Clear all fields
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Password reset error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Password visibility toggle handlers
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    // Form content based on current state
    const renderFormContent = () => {
        switch (formState) {
            case FormState.FORGOT_PASSWORD:
                return (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Reset Your Password</h3>
                            <p className="text-gray-600 text-sm mt-1">We'll send an OTP to your email</p>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-synergy-red/50 focus:border-synergy-red outline-none transition duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-synergy-red text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium shadow-md hover:shadow-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </motion.button>

                        <p className="text-center text-sm text-gray-600 mt-4">
                            <button 
                                type="button" 
                                onClick={() => setFormState(FormState.LOGIN)}
                                className="text-synergy-red hover:text-red-700"
                            >
                                Back to Login
                            </button>
                        </p>
                    </form>
                );
            
            case FormState.OTP_VERIFICATION:
                return (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Verify OTP</h3>
                            <p className="text-gray-600 text-sm mt-1">Enter the OTP sent to your email</p>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                OTP Code
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-synergy-red/50 focus:border-synergy-red outline-none transition duration-200"
                                    placeholder="Enter 6-digit OTP"
                                    required
                                    maxLength={6}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-synergy-red text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium shadow-md hover:shadow-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </motion.button>

                        <p className="text-center text-sm text-gray-600 mt-4">
                            <button 
                                type="button" 
                                onClick={() => setFormState(FormState.FORGOT_PASSWORD)}
                                className="text-synergy-red hover:text-red-700"
                            >
                                Resend OTP
                            </button>
                        </p>
                    </form>
                );
            
            case FormState.RESET_PASSWORD:
                return (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Reset Password</h3>
                            <p className="text-gray-600 text-sm mt-1">Enter your new password</p>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-synergy-red/50 focus:border-synergy-red outline-none transition duration-200"
                                    placeholder="Enter new password"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                                    onClick={toggleNewPasswordVisibility}
                                >
                                    {showNewPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-synergy-red/50 focus:border-synergy-red outline-none transition duration-200"
                                    placeholder="Confirm new password"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-synergy-red text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium shadow-md hover:shadow-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </motion.button>
                    </form>
                );
            
            default: // Login form
                return (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-synergy-red/50 focus:border-synergy-red outline-none transition duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-synergy-red/50 focus:border-synergy-red outline-none transition duration-200"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button 
                                type="button"
                                onClick={() => setFormState(FormState.FORGOT_PASSWORD)}
                                className="text-sm text-synergy-red hover:text-red-700"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-synergy-red text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium shadow-md hover:shadow-lg"
                        >
                            Sign In
                        </motion.button>
                    </form>
                );
        }
    };

    // Form title based on current state
    const getFormTitle = () => {
        switch (formState) {
            case FormState.FORGOT_PASSWORD:
                return "Forgot Password";
            case FormState.OTP_VERIFICATION:
                return "Verify OTP";
            case FormState.RESET_PASSWORD:
                return "Create New Password";
            default:
                return "Welcome Back";
        }
    };

    const getFormSubtitle = () => {
        switch (formState) {
            case FormState.FORGOT_PASSWORD:
                return "Reset your password";
            case FormState.OTP_VERIFICATION:
                return "Enter the code we sent to your email";
            case FormState.RESET_PASSWORD:
                return "Create a new secure password";
            default:
                return "Sign in to continue to Synergy";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{getFormTitle()}</h2>
                    <p className="text-gray-600">{getFormSubtitle()}</p>
                </div>

                {error && (
                    <div className="text-red-600 text-sm mt-2 text-center">
                        {error}
                    </div>
                )}

                {renderFormContent()}

                {formState === FormState.LOGIN && (
                    <p className="text-center mt-6 text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-synergy-red hover:text-red-700 font-medium">
                            Sign up
                        </Link>
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default Login;