'use client';
import React, { useState, useEffect } from 'react';
import banner from '@/assets/banner.jpg';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, InputGroup, Select, ListBox, Button } from "@heroui/react";
import { motion } from "framer-motion";

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
    const router = useRouter();
    const searchParams = useSearchParams();

    // 1. Search Criteria Form States
    const [location, setLocation] = useState(searchParams.get("location") || "");
    const [propertyType, setPropertyType] = useState(searchParams.get("type") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    // 2. Data Cache Matrix States
    const [rawProperties, setRawProperties] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const propertyTypes = [
        { id: "apartment", label: "Apartment" },
        { id: "house", label: "House" },
        // { id: "condo", label: "Condo" }
    ];

    // Prefetch database payload synchronously to verify values instantly on execution
    useEffect(() => {
        const prefetchPropertiesCollection = async () => {
            try {
                const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
                const response = await fetch(`${baseUri}/getPropertiesData`);
                if (response.ok) {
                    const data = await response.json();
                    setRawProperties(data);
                }
            } catch (err) {
                console.error("Failed to connect with properties collection records:", err);
            }
        };
        prefetchPropertiesCollection();
    }, []);

    const handleSearchExecution = () => {
        setIsSearching(true);

        const locQuery = location.trim().toLowerCase();
        const typeQuery = propertyType.toLowerCase();
        const minP = parseFloat(minPrice) || 0;
        const maxP = parseFloat(maxPrice) || Infinity;

        // Perform local criteria validation alignment against fetched schema properties array
        const targetedFilteredResults = rawProperties.filter((property) => {
            const itemLocation = (property.location || property.propertyLocation || "").toLowerCase();
            const itemType = (property.type || property.propertyType || "").toLowerCase();
            const itemPrice = parseFloat(property.price || property.rent || 0);

            const matchesLocation = !locQuery || itemLocation.includes(locQuery);
            const matchesType = !typeQuery || itemType === typeQuery;
            const matchesPriceRange = itemPrice >= minP && itemPrice <= maxP;

            return matchesLocation && matchesType && matchesPriceRange;
        });

        // Generate clean URL queries to populate state context on /allproperties route target
        const queryParams = new URLSearchParams();
        if (location.trim()) queryParams.set("location", location.trim());
        if (propertyType) queryParams.set("type", propertyType);
        if (minPrice) queryParams.set("minPrice", minPrice);
        if (maxPrice) queryParams.set("maxPrice", maxPrice);

        // route forward layout parameters to grid page section
        router.push(`/allproperties?${queryParams.toString()}`);
        setIsSearching(false);
    };

    // Animation Configurations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const searchBarVariants = {
        hidden: { opacity: 0, scale: 0.97, y: 15 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="relative overflow-hidden w-full">
            {/* Background Container Hero Segment */}
            <div 
                className="bg-cover bg-center flex h-[540px]" 
                style={{ backgroundImage: `url(${banner.src || banner})` }}
            />
            <div className="absolute inset-0 bg-black/45" />

            {/* Floating Form Grid Interactive Surface */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white w-full max-w-6xl px-4 z-10"
            >
                <motion.h1 
                    variants={textVariants}
                    className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md tracking-tight"
                >
                    Find Your Dream Rental Property
                </motion.h1>

                <motion.p 
                    variants={textVariants}
                    className="text-md md:text-xl mb-10 opacity-90 font-medium tracking-wide"
                >
                    Discover the best rental properties in your area with PropRent.
                </motion.p>
                
                <motion.div variants={searchBarVariants} className="w-full flex justify-center">
                    <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-4 w-full shadow-2xl rounded-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-center w-full">
                            
                            {/* 1. Location Input */}
                            <InputGroup className="bg-white text-black h-12 rounded-xl px-3 w-full flex items-center border border-gray-200">
                                <InputGroup.Prefix>
                                    <MapPinIcon />
                                </InputGroup.Prefix>
                                <InputGroup.Input 
                                    type="text" 
                                    placeholder="Location (e.g. Dhaka)" 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full h-full ml-2 focus:outline-none text-black font-semibold placeholder-gray-400 text-sm bg-transparent"
                                />
                            </InputGroup>

                            {/* 2. Property Type Select Framework */}
                            <Select 
                                placeholder="Property Type" 
                                className="w-full text-left"
                                value={propertyType}
                                onChange={(value) => setPropertyType(value)}
                            >
                                <Select.Trigger className="bg-white text-black font-semibold h-12 rounded-xl px-3 flex items-center justify-between border border-gray-200 text-sm">
                                    <Select.Value className="text-black font-semibold" />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox className="bg-white text-black rounded-xl p-1 shadow-xl border border-gray-100">
                                        {propertyTypes.map((type) => (
                                            <ListBox.Item key={type.id} id={type.id} textValue={type.label} className="text-black hover:bg-gray-50 p-2.5 rounded-lg cursor-pointer text-sm font-semibold">
                                                {type.label}
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>

                            {/* 3. Min Price Metric Input */}
                            <InputGroup className="bg-white text-black h-12 rounded-xl px-3 w-full flex items-center border border-gray-200">
                                <InputGroup.Prefix>
                                    <span className="text-gray-400 font-bold text-sm">$</span>
                                </InputGroup.Prefix>
                                <InputGroup.Input 
                                    type="number" 
                                    placeholder="Min price" 
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full h-full ml-1 focus:outline-none text-black font-semibold text-sm bg-transparent"
                                />
                            </InputGroup>

                            {/* 4. Max Price Metric Input */}
                            <InputGroup className="bg-white text-black h-12 rounded-xl px-3 w-full flex items-center border border-gray-200">
                                <InputGroup.Prefix>
                                    <span className="text-gray-400 font-bold text-sm">$</span>
                                </InputGroup.Prefix>
                                <InputGroup.Input 
                                    type="number" 
                                    placeholder="Max price" 
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full h-full ml-1 focus:outline-none text-black font-semibold text-sm bg-transparent"
                                />
                            </InputGroup>

                            {/* 5. Execution Search Action Button */}
                            <Button 
                                color="foreground" 
                                isLoading={isSearching}
                                onClick={handleSearchExecution}
                                className="bg-black text-white font-bold h-12 px-6 w-full rounded-xl transition-all active:scale-95 shadow-lg hover:bg-gray-900 flex items-center justify-center gap-2 text-sm"
                                startContent={!isSearching && <SearchIcon />}
                            >
                                Search
                            </Button>

                        </div>
                    </Card>
                </motion.div>
            </motion.div>
       </div> 
    );
};

export default BannerSection;