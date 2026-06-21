'use client';
import React, { useState } from 'react';
// Import HeroUI v3 layout and form components
import { Card, InputGroup, Button } from "@heroui/react";
import { motion } from "framer-motion";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Added missing router dependency
import { authClient } from '@/lib/auth-client';

// Clean, precise SVG Google Icon
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Pass clean values explicitly from your component state tracker
        const { data, error } = await authClient.signIn.email({
            email: formData.email,
            password: formData.password,
            callbackURL: '/'
        });

        if (error) {
            console.error("Login verification failed:", error);
            // Optional: alert(error.message || "Invalid email or password");
            return;
        }

        if (data) {
            router.push('/');
            router.refresh();
        }
    };

    const handleGoogleLogin = () => {
        console.log("Redirecting to Google OAuth...");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 select-none">
            
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <Card className="p-8 bg-white border border-gray-100 shadow-xl" radius="3xl">
                    <Card.Content className="p-0 flex flex-col gap-6 text-left">
                        
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                Welcome Back to <span className="bg-gradient-to-r from-[#ef8e38] to-[#108dc7] bg-clip-text text-transparent">PropRent</span>
                            </h2>
                            <p className="text-sm font-medium text-gray-400">
                                Sign in to access your dashboard and secure rentals.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* Email Address Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Email Address
                                </label>
                                <InputGroup className="bg-gray-50 border border-gray-200 h-11 rounded-xl px-3 w-full flex items-center focus-within:border-orange-500 focus-within:bg-white transition-all">
                                    <InputGroup.Input 
                                        type="email" 
                                        required
                                        name="email" // Added explicit name property
                                        placeholder="name@company.com" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium placeholder-gray-400"
                                    />
                                </InputGroup>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
                                        Forgot?
                                    </a>
                                </div>
                                <InputGroup className="bg-gray-50 border border-gray-200 h-11 rounded-xl px-3 w-full flex items-center focus-within:border-orange-500 focus-within:bg-white transition-all">
                                    <InputGroup.Input 
                                        type="password" 
                                        required
                                        name="password" // Added explicit name property
                                        placeholder="••••••••" 
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full h-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium placeholder-gray-400"
                                    />
                                </InputGroup>
                            </div>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-100"></div>
                                <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or with email</span>
                                <div className="flex-grow border-t border-gray-100"></div>
                            </div>

                            <Button 
                                type="button" // Specified explicitly as a button type to prevent form submit triggers
                                onClick={handleGoogleLogin}
                                className="w-full h-11 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-xl transition-colors duration-200 flex items-center justify-center shadow-sm active:scale-[0.99]"
                            >
                                <GoogleIcon />
                                Continue with Google
                            </Button>

                            <Button 
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold h-11 text-sm rounded-xl hover:opacity-95 transition-opacity duration-200 shadow-lg shadow-orange-500/10 active:scale-[0.99] pt-0.5"
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className="text-center pt-2">
                            <p className="text-sm font-semibold text-gray-400">
                                Dont have an account?{' '}
                                <Link href="/authentication/signup" className="text-orange-500 hover:text-orange-600 transition-colors">
                                    Create one free
                                </Link >
                            </p>
                        </div>

                    </Card.Content>
                </Card>
            </motion.div>

        </div>
    );
};

export default LoginPage;