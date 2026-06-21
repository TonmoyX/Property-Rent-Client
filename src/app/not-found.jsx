'use client';
import React from 'react';
import { Button, Card } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[90vh] w-full flex items-center justify-center px-4 py-8 bg-gray-50/50">

            {/* Container wrapper maximizing card visual weight across the screen space */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl w-full"
            >
                <Card className="w-full bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">

                    {/* --- TOP HEADER COVER: Fills upper dead space with a rich visual baseline --- */}
                    <div className="h-32 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                        {/* Geometric abstract background element decorations */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
                        <div className="absolute -bottom-12 -left-6 w-32 h-32 bg-yellow-300/20 rounded-full blur-lg" />

                        {/* System navigation crumbs context inside cover */}
                        <div className="absolute inset-0 flex items-center justify-between px-6 pt-4 text-white/80 text-xs font-black uppercase tracking-widest">
                            <span>⚠️ System Exception</span>
                            <span>Vector Out of Bounds</span>
                        </div>
                    </div>

                    {/* --- MAIN PAGE CONTENT ARCHITECTURE --- */}
                    <div className="px-6 pt-2 pb-10 text-center space-y-8 relative -mt-12 z-10">

                        {/* --- FLOATING ILLUSTRATION GRAPHIC ENGINE --- */}
                        <div className="relative flex justify-center items-center h-44">
                            {/* Animated colorful ambient background glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute w-44 h-44 bg-gradient-to-tr from-orange-400 to-yellow-300 blur-3xl rounded-full opacity-40 z-0"
                            />

                            {/* Central Identity Container */}
                            <div className="bg-white p-3 rounded-full shadow-md z-10 border border-gray-50">
                                <div className="bg-gray-900 rounded-full w-28 h-28 flex items-center justify-center">
                                    <motion.h1
                                        animate={{ y: [-4, 4, -4] }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 tracking-tighter select-none"
                                    >
                                        404
                                    </motion.h1>
                                </div>
                            </div>
                        </div>

                        {/* --- CORE ERROR EXPLANATION MESSAGE --- */}
                        <div className="space-y-3 max-w-md mx-auto">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight sm:text-3xl">
                                Lost in Workspace Parameters?
                            </h2>
                            <p className="text-sm font-semibold text-gray-400 leading-relaxed">
                                The destination client vector or dashboard file path you are searching for does not exist, has been shifted permanently, or your session scope has expired.
                            </p>
                        </div>

                        {/* --- ACTIONS NAVIGATION ACTION SYSTEM --- */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                            {/* Main Action Route Trigger */}
                            <Link href='/'> <Button
                                className="w-full font-black text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-6 shadow-md shadow-orange-500/20 transition-all"
                            >
                                🏠 Return to Home Safety
                            </Button>
                            </Link>
                            {/* Secondary Browser History Step Back */}
                            <Button
                                onClick={() => window.history.back()}
                                variant="bordered"
                                className="w-full font-black text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 border-gray-200 bg-white shadow-sm rounded-xl py-6"
                            >
                                ⬅️ Go Back Sequence
                            </Button>
                        </div>

                        {/* --- METADATA FOOTER SYSTEM DIAGNOSTICS --- */}
                        <div className="pt-4 border-t border-gray-50 max-w-sm mx-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                Error State: HTTP_404_OBJECT_NOT_FOUND
                            </div>
                        </div>

                    </div>
                </Card>
            </motion.div>

        </div>
    );
}