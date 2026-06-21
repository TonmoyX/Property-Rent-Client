'use client'
import React from 'react';
// Import HeroUI v3 specific components
import { Card, InputGroup, Button } from "@heroui/react";
import { motion } from "framer-motion";

// --- SOCIAL ICONS (SVG) ---
const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
);
const TwitterIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
);
const LinkedInIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>
);

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        discover: [
            { label: "Dhaka Rentals", href: "#" },
            { label: "Chattogram Properties", href: "#" },
            { label: "Sylhet Apartments", href: "#" },
            { label: "Commercial Spaces", href: "#" }
        ],
        company: [
            { label: "About Us", href: "#" },
            { label: "How it Works", href: "#" },
            { label: "Our Impact", href: "#" },
            { label: "Contact Support", href: "#" }
        ]
    };

    return (
        <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
                
                {/* Top Section: Branding, Links, and Newsletter */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4 text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold bg-gradient-to-r from-[#ef8e38] to-[#108dc7] bg-clip-text text-transparent tracking-tight">
                                PropRent</span>
                        </div>
                        <p className="text-sm text-gray-400 max-w-sm leading-relaxed font-medium">
                            Redefining the modern rental ecosystem across Bangladesh. We secure verified properties, protect lease documentation, and stream platform deposits transparently.
                        </p>
                        
                        {/* Social Links Layout */}
                        <div className="flex gap-4 pt-2">
                            {[
                                { icon: <FacebookIcon />, href: "#" },
                                { icon: <TwitterIcon />, href: "#" },
                                { icon: <InstagramIcon />, href: "#" },
                                { icon: <LinkedInIcon />, href: "#" }
                            ].map((social, index) => (
                                <motion.a 
                                    key={index}
                                    href={social.href}
                                    whileHover={{ y: -3, scale: 1.05 }}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 text-gray-400 hover:bg-orange-500 hover:text-white transition-colors duration-200"
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns Mapping */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="text-left">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                                {title}
                            </h4>
                            <ul className="space-y-2.5 text-sm font-semibold">
                                {links.map((link, idx) => (
                                    <li key={idx}>
                                        <a href={link.href} className="hover:text-orange-500 transition-colors duration-200">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter Subscription Column */}
                    <div className="text-left">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                            Stay Updated
                        </h4>
                        <p className="text-sm mb-4 font-medium leading-relaxed">
                            Subscribe to receive premium listing notifications weekly.
                        </p>
                        
                        {/* HeroUI v3 Compound Form Fields */}
                        <div className="flex flex-col gap-2">
                            <InputGroup className="bg-gray-800 border border-gray-700 h-11 rounded-xl px-3 w-full flex items-center focus-within:border-orange-500 transition-colors">
                                <InputGroup.Input 
                                    type="email" 
                                    placeholder="Your email address" 
                                    className="w-full h-full bg-transparent focus:outline-none text-white text-sm font-medium placeholder-gray-500"
                                />
                            </InputGroup>
                            <Button 
                                className="bg-orange-500 text-white font-bold h-11 text-sm rounded-xl hover:bg-orange-600 transition-colors duration-200 shadow-lg shadow-orange-500/10 active:scale-98"
                            >
                                Subscribe
                            </Button>
                        </div>
                    </div>

                </div>

                {/* Bottom Divider Line */}
                <hr className="border-gray-800 my-8" />

                {/* Legal and License Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500">
                    <p>
                        &copy; {currentYear} PropRent Ltd. All rights reserved. Built with pride in BD.
                    </p>
                    
                    {/* Legal Sublinks Row */}
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gray-300 transition-colors duration-200">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-gray-300 transition-colors duration-200">
                            Terms & Conditions
                        </a>
                        <a href="#" className="hover:text-gray-300 transition-colors duration-200">
                            Cookie Policy
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;