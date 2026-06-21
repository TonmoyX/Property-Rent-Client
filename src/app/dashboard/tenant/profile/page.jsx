'use client';
import React from 'react';
import { Card, Avatar, Chip, Button, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';

export default function TenantProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Format the MongoDB / Better Auth ISO timestamp beautifully
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isPending) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner color="orange" size="lg" label="Loading profile parameters..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* --- HERO PROFILE HEADER CARD --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full border-none bg-white shadow-sm overflow-hidden rounded-2xl">
          {/* Colorful Vibrant Mesh Cover Banner Background */}
          <div className="h-44 w-full bg-gradient-to-tr from-[#ff4e50] via-[#f9d423] to-[#00c6ff] relative opacity-90">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
          </div>

          {/* Replaced CardBody with standard HeroUI padding wrapper to avoid export issues */}
          <div className="relative px-6 pb-6 pt-0 flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 z-10">
            {/* Outer ring border for the avatar frame */}
            <div className="p-1.5 bg-white rounded-full shadow-md">
              <Image
              width={100}
              height={100}
              alt={`${user?.name}`}
                src={user?.image || ""}
                name={user?.name || "User"}
                className="w-28 h-28 text-xl font-bold border-2 border-transparent bg-gradient-to-br rounded-full from-orange-400 to-amber-500 text-white"
              />
            </div>

            {/* Main Text Content Column Block */}
            <div className="flex-1 text-center sm:text-left space-y-1.5 sm:mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 justify-center sm:justify-start">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {user?.name || "Verified Tenant"}
                </h2>
                <div>
                  <Chip
                    variant="flat"
                    className="bg-orange-50 text-orange-600 border border-orange-100 font-black text-xs uppercase tracking-widest px-2 py-0.5 rounded-lg h-6"
                  >
                    ✨ {user?.role || "Tenant"}
                  </Chip>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-400 tracking-normal">{user?.email}</p>
            </div>

            {/* Quick Action Context Button */}
            {/* <div className="sm:mb-2">
              <Button 
                size="sm" 
                variant="bordered"
                className="font-bold text-xs text-gray-600 hover:text-gray-900 border-gray-200 bg-white shadow-sm rounded-xl px-4"
              >
                ⚙️ Edit Profile
              </Button>
            </div> */}
          </div>
        </Card>
      </motion.div>

      {/* --- DETAILED DATA METRICS GRID SYSTEM --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Card Account Details Profile Meta Info Column */}
        <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl">
          <div className="p-5 space-y-4">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-2">
              Account Parameters
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400">Full Name</span>
                <span className="font-extrabold text-gray-800">{user?.name || "N/A"}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400">Email Address</span>
                <span className="font-extrabold text-gray-700 break-all pl-4 text-right">{user?.email}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400">Account Access Level</span>
                <span className="font-black text-orange-600 capitalize bg-orange-50/60 px-2 py-0.5 rounded-md border border-orange-100/30 text-xs">
                  {user?.role}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400">Member Since</span>
                <span className="font-extrabold text-gray-800">
                  🗓️ {formatDate(user?.createdAt || user?.createdAtDate)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Informative Secondary Activity Summary Box */}
        <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl">
          <div className="p-5 h-full flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-2">
                Workspace Verification
              </h3>
              <p className="text-xs font-medium text-gray-400 leading-relaxed mt-2">
                Your profile is synchronized with Better Auth secure drivers. Use your client dashboard tools to update active rental inquiries or to view your processed property applications.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/40 rounded-xl p-3 flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="text-xs font-extrabold text-blue-900">Security Verified</p>
                <p className="text-[11px] font-semibold text-blue-600/80">Account is protected with active session hashing.</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

    </div>
  );
}