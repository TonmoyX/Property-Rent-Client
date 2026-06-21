import React from 'react';
import { Card } from "@heroui/react";

const WhyChooseSection = () => {
    // Structured data array to eliminate repetitive code
    const features = [
        { id: 1, emoji: "🏡", title: "Verified Properties" },
        { id: 2, emoji: "🔒", title: "Secure Booking" },
        { id: 3, emoji: "🤝", title: "Trusted Owners" },
        { id: 4, emoji: "📞", title: "24/7 Support" },
    ];

    return (
        <section className="py-16 px-4 bg-gray-50 mx-auto rounded-3xl my-8">
            {/* Header / Subtitle Wrapper */}
            <div className='max-w-7xl mx-auto'>
            <div className="text-center max-w-xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                    Why Choose PropRent
                </h2>
                <p className="text-gray-600 font-medium">
                    Experience a secure, seamless, and verified rental process from start to finish.
                </p>
            </div>

            {/* Responsive Grid Layout System:
                - Mobile: 1 column (stacked)
                - Small screens / Tablets: 2 columns
                - Desktop screens: 4 columns (balanced row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto justify-items-center">
                {features.map((feature) => (
                    <Card
                        key={feature.id}
                        className="w-full max-w-[280px] p-6 bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center transition-transform duration-200 hover:scale-[1.02]"
                        radius="2xl"
                    >
                        <Card.Content className="flex flex-col items-center justify-center gap-4 text-center p-0">

                            {/* 1. Dynamic Emoji Icon Wrapper */}
                            <div className="text-5xl select-none animate-bounce-short">
                                {feature.emoji}
                            </div>

                            {/* 2. Card Typography Heading */}
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                {feature.title}
                            </h3>

                        </Card.Content>
                    </Card>
                ))}
            </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;