'use client';
import React, { useState } from 'react';
// Import HeroUI v3 layout and form components
import { Card, InputGroup, Button } from "@heroui/react";
import { motion } from "framer-motion";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { authClient } from '@/lib/auth-client';

// Clean, precise SVG Google Icon
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const SignUpPage = () => {
    const router = useRouter();
    const [role, setRole] = useState('tenant'); // 'tenant' or 'owner'
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { data, error } = await authClient.signUp.email({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: role,        
        });

        if (error) {
            console.error("Signup error details:", error);
            return;
        }

        if (data?.user) {
            router.push('/authentication/login');
        }
    };

    const handleGoogleSignUp = () => {
        console.log("Redirecting to Google OAuth Sign Up with role: ", role);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 select-none">
            
            {/* Smooth entry animation frame */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-lg"
            >
                <Card className="p-8 bg-white border border-gray-100 shadow-xl" radius="3xl">
                    <Card.Content className="p-0 flex flex-col gap-6 text-left">

                        {/* Header Title Section */}
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                Create your <span className="bg-gradient-to-r from-[#ef8e38] to-[#108dc7] bg-clip-text text-transparent">PropRent</span> Account
                            </h2>
                            <p className="text-sm font-medium text-gray-400">
                                Join our platform to list properties or find your dream space.
                            </p>
                        </div>

                        {/* Main Registration Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Role Selection Blocks */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    I want to register as a:
                                </label>
                                <div className="grid grid-cols-2 gap-4">

                                    {/* Tenant Card option */}
                                    <div
                                        onClick={() => setRole('tenant')}
                                        className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all duration-200 relative overflow-hidden flex flex-col items-center gap-1.5 ${
                                            role === 'tenant'
                                                ? 'border-orange-500 bg-orange-50/40 shadow-sm'
                                                : 'border-gray-100 bg-white hover:border-gray-200'
                                        }`}
                                    >
                                        <span className="text-2xl">🔑</span>
                                        <h4 className={`text-sm font-bold ${role === 'tenant' ? 'text-orange-600' : 'text-gray-900'}`}>Tenant</h4>
                                        <p className="text-xs text-gray-400 font-medium hidden sm:block">Looking for rental properties</p>
                                    </div>

                                    {/* Property Owner Card option */}
                                    <div
                                        onClick={() => setRole('owner')}
                                        className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all duration-200 relative overflow-hidden flex flex-col items-center gap-1.5 ${
                                            role === 'owner'
                                                ? 'border-orange-500 bg-orange-50/40 shadow-sm'
                                                : 'border-gray-100 bg-white hover:border-gray-200'
                                        }`}
                                    >
                                        <span className="text-2xl">🏢</span>
                                        <h4 className={`text-sm font-bold ${role === 'owner' ? 'text-orange-600' : 'text-gray-900'}`}>Property Owner</h4>
                                        <p className="text-xs text-gray-400 font-medium hidden sm:block">Wanting to list & manage spaces</p>
                                    </div>

                                </div>
                            </div>

                            {/* Full Name Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Full Name
                                </label>
                                <InputGroup className="bg-gray-50 border border-gray-200 h-11 rounded-xl px-3 w-full flex items-center focus-within:border-orange-500 focus-within:bg-white transition-all">
                                    <InputGroup.Input
                                        type="text"
                                        required
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full h-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium placeholder-gray-400"
                                    />
                                </InputGroup>
                            </div>

                            {/* Email Address Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Email Address
                                </label>
                                <InputGroup className="bg-gray-50 border border-gray-200 h-11 rounded-xl px-3 w-full flex items-center focus-within:border-orange-500 focus-within:bg-white transition-all">
                                    <InputGroup.Input
                                        type="email"
                                        required
                                        name="email"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium placeholder-gray-400"
                                    />
                                </InputGroup>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Password
                                </label>
                                <InputGroup className="bg-gray-50 border border-gray-200 h-11 rounded-xl px-3 w-full flex items-center focus-within:border-orange-500 focus-within:bg-white transition-all">
                                    <InputGroup.Input
                                        type="password"
                                        required
                                        name="password"
                                        placeholder="Minimum 8 characters"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full h-full bg-transparent focus:outline-none text-gray-900 text-sm font-medium placeholder-gray-400"
                                    />
                                </InputGroup>
                            </div>

                            {/* Submit Signup Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold h-11 text-sm rounded-xl hover:opacity-95 transition-opacity duration-200 shadow-lg shadow-orange-500/10 active:scale-[0.99] pt-0.5"
                            >
                                Sign Up as a {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Button>
                        </form>

                        {/* Visual Divider Segment */}
                        <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-gray-100"></div>
                            <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or register with Google</span>
                            <div className="flex-grow border-t border-gray-100"></div>
                        </div>

                        {/* Third-Party Authentication: Google */}
                        <Button
                            onClick={handleGoogleSignUp}
                            className="w-full h-11 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-xl transition-colors duration-200 flex items-center justify-center shadow-sm active:scale-[0.99]"
                        >
                            <GoogleIcon />
                            Sign up with Google
                        </Button>

                        {/* Form Footer / Redirect Link */}
                        <div className="text-center pt-1">
                            <p className="text-sm font-semibold text-gray-400">
                                Already have an account?{' '}
                                <Link href="/authentication/login" className="text-orange-500 hover:text-orange-600 transition-colors">
                                    Login
                                </Link>
                            </p>
                        </div>

                    </Card.Content>
                </Card>
            </motion.div>

        </div>
    );
};

export default SignUpPage;