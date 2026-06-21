'use client'
import React, { useEffect, useRef } from 'react';
// Import HeroUI v3 layout wrappers
import { Card } from "@heroui/react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";

// Reusable Animated Number counter engine using Framer Motion spring physics
const AnimatedNumber = ({ value }) => {
    const ref = useRef(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        stiffness: 70,
        damping: 20,
    });
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                // Formats numbers with localized commas (e.g., 12,400)
                ref.current.textContent = Math.floor(latest).toLocaleString();
            }
        });
    }, [springValue]);

    return <span ref={ref}>0</span>;
};

const RentalStatistics = () => {
    // 4 strategic real-estate data insight points
    const stats = [
        {
            id: 1,
            number: 12400,
            suffix: "+",
            label: "Active Listings",
            description: "Verified premium homes, apartments, and commercial spaces available nationwide.",
            color: "from-orange-500/10 to-orange-500/5",
            textColor: "text-orange-600"
        },
        {
            id: 2,
            number: 98,
            suffix: "%",
            label: "Satisfaction Rate",
            description: "Thoroughly collected feedback metric score matching tenant to landlord expectations perfectly.",
            color: "from-blue-500/10 to-blue-500/5",
            textColor: "text-blue-600"
        },
        {
            id: 3,
            number: 4500,
            suffix: "+",
            label: "Happy Families",
            description: "Discovered and safely settled down inside their absolute dream houses this calendar year.",
            color: "from-emerald-500/10 to-emerald-500/5",
            textColor: "text-emerald-600"
        },
        {
            id: 4,
            number: 15,
            suffix: "M+",
            label: "Secured Transactions",
            description: "Safely processed rent payments and deposits managed via modern encrypted channels.",
            color: "from-purple-500/10 to-purple-500/5",
            textColor: "text-purple-600"
        }
    ];

    // Cascade grid wrapper animations
    const gridVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section className="py-20 px-4 max-w-7xl mx-auto bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                
                {/* Left Block: Narrative Pitch */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4 lg:pr-6 text-left"
                >
                    <span className="text-sm font-bold tracking-wider text-orange-500 uppercase bg-orange-50 px-3 py-1 rounded-full">
                        Our Impact
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                        PropRent by the Numbers
                    </h2>
                    <p className="text-gray-600 font-medium leading-relaxed">
                        We are fundamentally changing how real estate works in Bangladesh. By pairing technology with verified transparent documentation, we bring absolute safety to your rental search.
                    </p>
                </motion.div>

                {/* Right Block: 2x2 Bento Stats Layout Grid */}
                <motion.div 
                    className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {stats.map((stat) => (
                        <motion.div key={stat.id} variants={cardVariants}>
                            <Card 
                                className={`relative overflow-hidden bg-gradient-to-br ${stat.color} border border-gray-100 p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-300`}
                                radius="2xl"
                            >
                                <Card.Content className="p-0 flex flex-col gap-2 text-left">
                                    {/* Number Counter Header */}
                                    <h3 className={`text-4xl md:text-5xl font-black ${stat.textColor} tracking-tight`}>
                                        <AnimatedNumber value={stat.number} />
                                        {stat.suffix}
                                    </h3>
                                    
                                    {/* Text Descriptions */}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                                            {stat.label}
                                        </h4>
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                            {stat.description}
                                        </p>
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

export default RentalStatistics;