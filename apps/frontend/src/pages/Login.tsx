import { useState } from "react";
import { apiClient } from "../api/client";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //State to handle and display error message 
    const [error, setError] = useState('');

    //State to lock the form during network request 
    const [isLoading, setIsLoading] = useState(false);

    //Async Function to handle the form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); //Stops browser from refreshing 
        setError(''); //Clear any previous errors 

        // Input validation
        // Email validation via Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return; // Stop execution
        }
        // Password validation
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setIsLoading(true);

        try {
            //making the post request to the backend /auth/login endpoint
            const response = await apiClient.post('/auth/login', { email, password });

            //destructuring to extract the access token from the response object

            const { access_token } = response.data;

            //store the token in the browser's local storage
            localStorage.setItem('access_token', access_token);
            console.log("Login successful!");

            // Navigate to dashboard
            navigate("/dashboard");

        } catch (err) {
            if (err instanceof AxiosError) {
                const backendMessage = err.response?.data?.message;
                setError(backendMessage || 'Invalid email or password. Please try again.');
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] grid grid-cols-1 md:grid-cols-12 bg-white text-zinc-900 font-sans">
            {/* Left Column - Branding (visible on md and up) */}
            <div className="hidden md:flex md:col-span-5 bg-zinc-50 border-r border-zinc-100 flex-col justify-between p-12 lg:p-16">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold tracking-tight text-emerald-800">ECE101</span>
                </div>

                <div className="space-y-6 my-auto">
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
                        Refined tools for childhood educators.
                    </h1>
                    <p className="text-zinc-600 text-lg leading-relaxed max-w-[40ch]">
                        Streamline daily documentation, plan classroom activities, and search curriculum guidelines in one place.
                    </p>
                </div>

                <div className="text-xs text-zinc-400">
                    © {new Date().getFullYear()} ECE101. All rights reserved.
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="col-span-12 md:col-span-7 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-white">
                <div className="mx-auto w-full max-w-md">
                    {/* Mobile-only header logo */}
                    <div className="md:hidden mb-8">
                        <span className="text-lg font-extrabold tracking-tight text-emerald-800">ECE101</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                            Sign in
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500">
                            Enter your credentials to access your assistant.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Redesigned error banner */}
                        {error && (
                            <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 text-sm text-red-600 flex items-start gap-2.5">
                                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-800">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 sm:text-sm transition-all disabled:opacity-50"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-800">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 sm:text-sm transition-all disabled:opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}