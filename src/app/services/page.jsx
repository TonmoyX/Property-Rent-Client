'use client';
import React from 'react';
// Import HeroUI v3 structural tokens
import { Card } from "@heroui/react";
import { motion } from "framer-motion";
// Import only the strictly verified, safe icons from GravityUI
import { 
    House, 
    ShieldCheck, 
    Magnifier, 
    Headphones 
} from "@gravity-ui/icons";

const ServicesPage = () => {
    // 8 core data points arranged strategically for PropRent
    const services = [
        {
            id: 1,
            icon: <House className="w-6 h-6 text-orange-500" />,
            title: "Verified Listings",
            description: "Every apartment and commercial space undergoes meticulous physical and legal verification before going live."
        },
        {
            id: 2,
            icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
            title: "Secure Deposits",
            description: "Platform escrow holds advanced balances safely until agreements are completed and keys are handed over."
        },
        {
            id: 3,
            // Safe SVG replacement for FileSign
            icon: (
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: "Digital Lease Agreements",
            description: "Legally binding electronic contracts tailored to local property codes, signed effortlessly from any device."
        },
        {
            id: 4,
            // Safe SVG replacement for Handshake
            icon: (
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: "Tenant Screening",
            description: "Comprehensive verification background checks matching ideal tenants to perfect properties safely."
        },
        {
            id: 5,
            // Safe SVG replacement for CreditCard
            icon: (
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            title: "Automated Rent Collection",
            description: "Receive or clear rent invoices through flexible automated mobile banking and cards instantly."
        },
        {
            id: 6,
            icon: <span className="text-xl font-bold text-rose-500 select-none">⇄</span>, 
            title: "Seamless Relocation",
            description: "Affiliated moving logistics assistance to shift your belongings cleanly without administrative hassle."
        },
        {
            id: 7,
            icon: <Magnifier className="w-6 h-6 text-teal-500" />,
            title: "Smart Market Insights",
            description: "Real-time analytics outlining real-estate yield curves and price estimations across target cities."
        },
        {
            id: 8,
            icon: <Headphones className="w-6 h-6 text-amber-500" />,
            title: "24/7 Dedicated Support",
            description: "Round-the-clock maintenance reporting dispatch lines resolving tenant issues instantly."
        }
    ];

    // Parent orchestration layout engine
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    // Card entry glide physics
    const cardVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-20 px-4 select-none">
            <div className="max-w-7xl mx-auto">
                
                {/* Section Header Text Block */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                        Our Ecosystem
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                        Smart Rental Solutions
                    </h1>
                    <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed">
                        PropRent modernizes every single step of your housing journey. Explore our specialized systems built directly for tenants and owners.
                    </p>
                </div>

                {/* Main 8-Card Grid Layout */}
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                >
                    {services.map((service) => (
                        <motion.div key={service.id} variants={cardVariants}>
                            <Card 
                                className="h-full p-6 bg-white border border-gray-100 hover:border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                                radius="2xl"
                            >
                                <Card.Content className="p-0 flex flex-col gap-4 text-left">
                                    
                                    {/* Icon Ring Base Container */}
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center transition-colors duration-300 group-hover:bg-gray-900/5">
                                        {service.icon}
                                    </div>

                                    {/* Service Description Metrics */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-orange-500 transition-colors duration-200">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>

                                </Card.Content>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </div>
    );
};

export default ServicesPage;