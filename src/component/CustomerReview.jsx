'use client'
import React from 'react';
// Import HeroUI v3 specific layout and avatar primitives
import { Card, Avatar } from "@heroui/react";
// Import framer-motion primitives
import { motion } from "framer-motion";

// Simple SVG Star Icon component
const StarIcon = ({ filled }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={filled ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth={1.5} 
        className={`w-5 h-5 ${filled ? "text-amber-500" : "text-gray-300"}`}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.173-.434.764-.434.938 0l2.03 5.033 5.4 1.018c.47.088.658.667.318.997l-3.9 3.805.921 5.38a.53.53 0 0 1-.769.56l-4.816-2.532-4.816 2.532a.53.53 0 0 1-.769-.56l.921-5.38-3.9-3.805c-.34-.33-.153-.909.318-.997l5.4-1.018 2.03-5.033Z" />
    </svg>
);

const CustomerReview = () => {
    const reviews = [
        {
            id: 1,
            name: "Sarah Jenkins",
            role: "Verified Tenant",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            rating: 5,
            comment: "Finding an apartment through PropRent was incredibly smooth. The verified listings gave me total peace of mind, and the virtual tours were exactly identical to reality!"
        },
        {
            id: 2,
            name: "Alex Rivera",
            role: "Property Owner",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
            rating: 5,
            comment: "As a landlord, managing background checks and security deposits used to be a nightmare. This dashboard simplifies everything into a single, seamless platform."
        },
        {
            id: 3,
            name: "Emily Taylor",
            role: "Verified Tenant",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
            rating: 4,
            comment: "Excellent customer service support team. I had a minor issue with my digital lease signing, but they stepped in and fixed it within 10 minutes flat."
        },
        {
            id: 4,
            name: "Marcus Chen",
            role: "Real Estate Agent",
            avatar: "https://i.pravatar.cc/150?u=a032581f4e29026704a",
            rating: 5,
            comment: "The UI design is modern, lightning-fast, and highly intuitive for clients. My listing engagement metrics doubled within the first month of migrating over."
        }
    ];

    // Parent container layout orchestrator
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15 // Time delay gap between sequential card reveals
            }
        }
    };

    // Single item variant configuration sets
    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.5, ease: "easeOut" } 
        }
    };

    return (
        <section className="py-16 px-4 mx-auto bg-gray-100 my-12">
            <div className="max-w-7xl mx-auto">
            {/* Header Content Section */}
            <div className="text-center max-w-xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                    What Our Users Say
                </h2>
                <p className="text-gray-600 font-medium">
                    Discover how PropRent is redefining the modern rental experience for tenants and property managers alike.
                </p>
            </div>

            {/* Responsive Grid System controlled by Motion Wrapper */}
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible" // Triggers when element is scrolled into view
                viewport={{ once: true, margin: "-100px" }} // Triggers once to avoid cyclic triggers
            >
                {reviews.map((review) => (
                    <motion.div key={review.id} variants={itemVariants}>
                        <Card 
                            className="bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
                            radius="2xl"
                        >
                            <Card.Content className="flex flex-col gap-4 p-0 h-full justify-between">
                                
                                {/* Top Segment: Star Ratings & Comment text */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, index) => (
                                            <StarIcon 
                                                key={index} 
                                                filled={index < review.rating} 
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed font-medium">
                                        `{review.comment}`
                                    </p>
                                </div>

                                {/* Bottom Segment: User Information Details Profile */}
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-auto">
                                    <Avatar className="w-10 h-10 rounded-full border-2 border-gray-200 p-0.5 overflow-hidden">
                                        <Avatar.Image 
                                            src={review.avatar} 
                                            alt={review.name}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </Avatar>

                                    <div className="text-left">
                                        <h4 className="text-sm font-bold text-gray-900">
                                            {review.name}
                                        </h4>
                                        <span className="text-xs font-semibold text-gray-500 block">
                                            {review.role}
                                        </span>
                                    </div>
                                </div>

                            </Card.Content>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
            </div>
        </section>
    );
};

export default CustomerReview;