'use client'
import React from 'react';
// Import HeroUI v3 layout components
import { Card } from "@heroui/react";
// Import framer-motion primitives
import { motion } from "framer-motion";

const PopulerCity = () => {
    const cities = [
        {
            id: 1,
            name: "Dhaka",
            properties: "1,240+ Properties",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRohaqLKeps5W4bBH03HiD5v57ZQRiosBk6vWX-b3vMOLL_qPdpwIadTeWn&s=10",
        },
        {
            id: 2,
            name: "Chattogram",
            properties: "850+ Properties",
            image: "https://chittagongportagent.com/wp-content/uploads/2025/03/Aerial-view-of-Chittagong-Port.webp",
        },
        {
            id: 3,
            name: "Sylhet",
            properties: "420+ Properties",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6zIHPj6tAtmcBY7PUW7_MG9Qh9yKJ1JGgRQqH419YJkhOUYQlFk2RPg&s=10",
        },
        {
            id: 4,
            name: "Cox's Bazar",
            properties: "310+ Properties",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTSgyiFv6rPK50CxyBUSlrbc-UNtEU1gzhwiwwPgcrTDs04ArqaffpsLpD&s=10",
        },
        {
            id: 5,
            name: "Rajshahi",
            properties: "190+ Properties",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFRYWHvAdDtDWTLghRzAi4e5UVL28vpjBSGgYXZLjK3Kj8otQh5T9C438&s=10",
        },
        {
            id: 6,
            name: "Khulna",
            properties: "150+ Properties",
            image: "https://media.istockphoto.com/id/1056699672/photo/tetulia-jame-masjid-at-tala-satkhira-bangladesh.jpg?s=612x612&w=0&k=20&c=_C_VDY59cFpFyREt8_aa_4bPO-VHN842juxZinLB2Mg=",
        }
    ];

    // Parent container variant to coordinate staggered entry
    const gridVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Time delay between each card's entry
            }
        }
    };

    // Card animation: Scales up from 90% and fades in cleanly
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            {/* Header section text */}
            <div className="text-center max-w-xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                    Explore Popular Cities
                </h2>
                <p className="text-gray-600 font-medium">
                    Find your next dream rental home in the most vibrant locations across Bangladesh.
                </p>
            </div>

            {/* Framer Motion Grid Wrapper */}
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {cities.map((city) => (
                    <motion.div 
                        key={city.id} 
                        variants={cardVariants}
                        className="w-full h-full"
                    >
                        <Card 
                            className="relative h-64 w-full overflow-hidden group cursor-pointer border border-gray-100 shadow-sm"
                            radius="2xl"
                        >
                            {/* HeroUI v3 Compound Component Pattern */}
                            <Card.Content className="p-0 w-full h-full relative">
                                
                                {/* 1. Background Image Element with internal hover scaling */}
                                <img 
                                    src={city.image} 
                                    alt={city.name} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* 2. Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                                {/* 3. Text content alignment pinned to the bottom-left edge */}
                                <div className="absolute bottom-0 left-0 p-6 text-left text-white z-10">
                                    <h3 className="text-2xl font-bold tracking-wide mb-1 drop-shadow-sm">
                                        {city.name}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-200 opacity-90">
                                        {city.properties}
                                    </p>
                                </div>

                            </Card.Content>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default PopulerCity;