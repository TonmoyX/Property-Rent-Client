'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { motion } from 'framer-motion';

const NavLink = ({ href, children }) => {
    const pathname = usePathname();
    const isActive = href === pathname;

    return (
        <Link 
            href={href} 
            className="relative px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-600 transition-colors duration-300 block select-none"
        >
            {/* 1. Liquid Water Drop Glassmorphism Background Element */}
            {isActive && (
                <motion.div
                    layoutId="activeNavIndicator" // Synced ID orchestrates the sliding drop effect
                    className="absolute inset-0 bg-white/25 backdrop-blur-md border border-white/30 rounded-full shadow-sm z-0"
                    transition={{
                        type: "spring",
                        stiffness: 380, // Higher stiffness for snappy water movement
                        damping: 22     // Low damping lets it stretch fluidly like a liquid droplet
                    }}
                />
            )}

            {/* 2. Link Text Layer - Shifts to deep black on active glass status */}
            <span 
                className={`relative z-10 transition-colors duration-300 ease-in-out ${
                    isActive ? 'text-black font-bold' : ''
                }`}
            >
                {children}
            </span>
        </Link>
    );
};

export default NavLink;