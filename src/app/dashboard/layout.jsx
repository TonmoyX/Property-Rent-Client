'use client';
import React, { useState } from 'react';
import { Button, Spinner } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Get active session data
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    // 1. Sidebar Navigation Arrays mapped per user role
    const ownerMenu = [
        { label: 'Overview', href: '/dashboard', icon: '📊' },
        { label: 'Add Properties', href: '/dashboard/add-properties', icon: '➕' },
        { label: 'My Properties', href: '/dashboard/my-properties', icon: '🏢' },
        { label: 'Bookings', href: '/dashboard/bookings', icon: '📅' },
        { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
    ];

    const tenantMenu = [
        { label: 'Overview', href: '/dashboard', icon: '📊' },
        { label: 'My Rent History', href: '/dashboard/rent-history', icon: '🔑' },
        { label: 'Saved Properties', href: '/dashboard/saved', icon: '❤️' },
        { label: 'My Bookings', href: '/dashboard/my-bookings', icon: '📅' },
        { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
    ];

    // 2. Loading State: Prevents unrendered "undefined" string crashes during fetch
    if (isPending) {
        return (
            <div className="fixed inset-0 z-50 bg-gray-50 flex items-center justify-center">
                <Spinner color="orange" size="lg" label="Loading Workspace..." fontStyle="bold" />
            </div>
        );
    }

    // 3. Fallback Context: If no user is logged in, show an unauthorized screen or redirect
    if (!user) {
        return (
            <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-sm text-gray-500 mb-4">Please log in to view your account options dashboard.</p>
                <Button as={Link} href="/authentication/login" className="bg-orange-500 text-white font-bold rounded-xl">
                    Go to Login
                </Button>
            </div>
        );
    }

    // Choose the menu structure based on the logged-in user's role
    const currentMenu = user.role === 'owner' ? ownerMenu : tenantMenu;

    return (
        <div className="fixed inset-0 z-50 min-h-screen max-h-screen w-screen bg-gray-50 flex flex-col md:flex-row antialiased select-none overflow-hidden">

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-full p-5 justify-between shadow-sm flex-shrink-0">
                <div className="space-y-6">
                    <div className="space-y-4 px-1">
                        <div>
                            <h2 className="text-xl bg-gradient-to-r from-[#ef8e38] to-[#108dc7] bg-clip-text text-transparent font-bold tracking-tight">
                                PropRent
                                <span className="text-sm font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-md ml-5 align-middle border border-orange-100/50">
                                    {user.role || 'User'}
                                </span>
                            </h2>
                        </div>

                        <Button
                            variant="light"
                            className="w-full font-bold text-xs text-gray-500 hover:text-gray-900 border border-gray-200 bg-white h-9 rounded-xl shadow-sm justify-start px-3 transition-colors"
                        >
                            <Link href='/' >
                                ⬅ Back to Home
                            </Link>
                        </Button>
                    </div>

                    {/* Dynamic Navigation Links based on active Role */}
                    <nav className="space-y-1">
                        {currentMenu.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} className="block relative group">
                                    <div
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                                                ? 'text-orange-600'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        {item.label}

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute inset-0 bg-orange-50/60 rounded-xl -z-10 border border-orange-100"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="border-t border-gray-100 pt-4 px-3 text-xs font-semibold text-gray-400">
                    © 2026 PropRent Hub
                </div>
            </aside>

            {/* --- MAIN ACTION VIEW PANEL --- */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

                {/* --- MOBILE COMPACT TOP APP BAR ONLY --- */}
                <header className="bg-white border-b border-gray-100 h-14 min-h-[3.5rem] px-6 flex items-center justify-between md:hidden z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                            aria-label="Toggle Menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span className="text-sm font-black text-gray-900">
                            PropRent <span className="capitalize text-xs text-orange-500 font-bold">({user.role})</span>
                        </span>
                    </div>

                    <Button
                        as={Link}
                        href="/"
                        variant="light"
                        className="font-bold text-xs text-gray-500 border border-gray-200 h-8 rounded-lg px-2.5"
                    >
                        ⬅ Home
                    </Button>
                </header>

                {/* --- MAIN RENDERING LAYOUT VIEWS --- */}
                <main className="p-6 md:p-8 flex-1 overflow-y-auto max-w-8xl w-full mx-auto custom-scrollbar">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="pb-12"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>

            {/* --- RESPONSIVE MOBILE OVERLAY DRAWER --- */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                        />

                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                            className="fixed top-0 bottom-0 left-0 w-72 bg-white z-50 p-6 flex flex-col justify-between shadow-2xl md:hidden"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-black text-gray-900 capitalize">{user.role} Studio</h2>
                                    <button
                                        onClick={() => setIsMobileOpen(false)}
                                        className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-500"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <nav className="space-y-1">
                                    {currentMenu.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${isActive ? 'bg-orange-50 border border-orange-100 text-orange-600' : 'text-gray-500'
                                                    }`}
                                            >
                                                <span>{item.icon}</span>
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="text-xs font-bold text-gray-400 border-t border-gray-100 pt-4 capitalize">
                                {user.role} Identity Workspace
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}