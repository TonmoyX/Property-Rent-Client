'use client';
import React from 'react';
import banner from '@/assets/banner.jpg';
// Import HeroUI v3 specific layout and input components
import { Card, InputGroup, Select, ListBox, Button } from "@heroui/react";
// Import framer-motion primitives
import { motion } from "framer-motion";

// Simple SVG icon components
const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.601Z" />
    </svg>
);

const BannerSection = () => {
    const propertyTypes = [
        { id: "apartment", label: "Apartment" },
        { id: "house", label: "House" },
        { id: "condo", label: "Condo" }
    ];

    // Animation presets for child tracking configurations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2 // Creates sequential element reveal
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const searchBarVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="relative overflow-hidden w-full">
            {/* Background Image Layer */}
            <div 
                className="bg-cover bg-center flex h-200" 
                style={{ backgroundImage: `url(${banner.src || banner})` }}
            />
            
            {/* Background darkening tint */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Central Content Box - Enhanced with Framer Motion Parent tracking wrapper */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white w-full max-w-6xl px-4 z-10"
            >
                {/* Animated Heading Title */}
                <motion.h1 
                    variants={textVariants}
                    className="text-4xl md:text-7xl font-bold mb-4 drop-shadow-sm"
                >
                    Find Your Dream Rental Property
                </motion.h1>

                {/* Animated Subheading Text */}
                <motion.p 
                    variants={textVariants}
                    className="text-xl md:text-2xl mb-8 opacity-90 font-medium"
                >
                    Discover the best rental properties in your area with PorpRent.
                </motion.p>
                
                {/* --- HERO UI v3 SEARCH BAR SECTION WITH FRAMER MOTION --- */}
                <motion.div variants={searchBarVariants} className="w-full flex justify-center">
                    <Card className="bg-background/20 backdrop-blur-md border border-white/10 p-2 w-full shadow-2xl rounded-2xl">
                        <Card.Content className="flex flex-col md:flex-row gap-3 p-1 items-center">
                            
                            {/* 1. Location Input using InputGroup */}
                            <InputGroup className="bg-white text-black h-12 rounded-xl px-3 w-full md:max-w-xs flex items-center">
                                <InputGroup.Prefix>
                                    <MapPinIcon />
                                </InputGroup.Prefix>
                                <InputGroup.Input 
                                    type="text" 
                                    placeholder="Location" 
                                    className="w-full h-full ml-2 focus:outline-none text-black font-medium"
                                />
                            </InputGroup>

                            {/* 2. Property Type Select (Compound pattern) */}
                            <Select placeholder="Property Type" className="w-full md:max-w-xs text-left">
                                <Select.Trigger className="bg-white text-black font-medium h-12 rounded-xl px-3 flex items-center justify-between">
                                    <Select.Value className="text-black font-medium" />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox className="bg-white text-black rounded-xl p-1 shadow-lg">
                                        {propertyTypes.map((type) => (
                                            <ListBox.Item key={type.id} id={type.id} textValue={type.label} className="text-black hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
                                                {type.label}
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>

                            {/* 3. Max Price Input using InputGroup */}
                            <InputGroup className="bg-white text-black h-12 rounded-xl px-3 w-full flex items-center">
                                <InputGroup.Prefix>
                                    <span className="text-gray-500 font-medium">$</span>
                                </InputGroup.Prefix>
                                <InputGroup.Input 
                                    type="number" 
                                    placeholder="Max price" 
                                    className="w-full h-full ml-2 focus:outline-none text-black font-medium"
                                />
                            </InputGroup>

                            {/* 4. Min Price Input using InputGroup */}
                            <InputGroup className="bg-white text-black h-12 rounded-xl px-3 w-full flex items-center">
                                <InputGroup.Prefix>
                                    <span className="text-gray-500 font-medium">$</span>
                                </InputGroup.Prefix>
                                <InputGroup.Input 
                                    type="number" 
                                    placeholder="Min price" 
                                    className="w-full h-full ml-2 focus:outline-none text-black font-medium"
                                />
                            </InputGroup>

                            {/* 5. Search Button */}
                            <Button 
                                color="foreground" 
                                className="bg-black text-white font-semibold h-12 px-8 w-full md:w-auto rounded-xl transition-transform active:scale-95"
                                startContent={<SearchIcon />}
                            >
                                Search
                            </Button>

                        </Card.Content>
                    </Card>
                </motion.div>
                {/* --- END SEARCH BAR SECTION --- */}

            </motion.div>
       </div> 
    );
};

export default BannerSection;