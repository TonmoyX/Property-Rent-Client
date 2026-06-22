'use client';

import React, { useState, useEffect } from 'react';
import { Card, Spinner } from "@heroui/react";
import { authClient } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Framer Motion Animation Variants for layout entrance coordination
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function AdminDashboard() {
  const sessionContext = authClient.useSession();
  const currentUser = sessionContext?.data?.user;
  // Global Operational States
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Dynamic list for full platform accounts
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const aggregatePlatformTelemetry = async () => {
      try {
        setIsLoading(true);
        const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';

        // Simultaneously fetch core system collections
        const [propertiesRes, bookingsRes, usersRes] = await Promise.all([
          fetch(`${baseUri}/getPropertiesData`),
          fetch(`${baseUri}/addBookings`),
        //   fetch(`${baseUri}/users`).catch(() => null) // Queries your global registration accounts index
        ]);

        if (propertiesRes?.ok) {
          const propertiesData = await propertiesRes.json();
          setProperties(Array.isArray(propertiesData) ? propertiesData : []);
        }

        if (bookingsRes?.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        }

        if (usersRes?.ok) {
          const usersData = await usersRes.json();
          setAllUsers(Array.isArray(usersData) ? usersData : []);
        }
      } catch (error) {
        console.error("Dashboard metric ingestion interface failure:", error);
      } finally {
        setIsLoading(false);
      }
    };

    aggregatePlatformTelemetry();
  }, [isMounted]);

  if (!isMounted) return null;

  // Guard Clause for whole page synchronization state
  if (isLoading || sessionContext?.isPending) {
    return (
      <div className="h-[85vh] w-full flex flex-col items-center justify-center gap-4 bg-gray-50/50">
        <Spinner color="warning" size="lg" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Synchronizing Live Telemetry Streams...
        </p>
      </div>
    );
  }

  // --- STRICT DYNAMIC ROLE COUNTER ENGINE ---
  let adminCount = 0;
  let ownerCount = 0;
  let tenantCount = 0;

  if (allUsers.length > 0) {
    // Strategy A: If your global user endpoint returns records, filter directly by auth role values
    adminCount = allUsers.filter(u => u.role?.toLowerCase() === 'admin').length;
    ownerCount = allUsers.filter(u => u.role?.toLowerCase() === 'owner').length;
    tenantCount = allUsers.filter(u => u.role?.toLowerCase() === 'tenant').length;
  } else {
    // Strategy B: Fallback parsing unique user footprints dynamically from actual live records
    
    // 1. Owners: Count unique emails attached to existing listed property assets
    const dynamicOwners = new Set(properties.map(p => p.ownerEmail || p.userEmail).filter(Boolean));
    ownerCount = dynamicOwners.size;

    // 2. Tenants: Count unique emails matching completed checkouts/bookings items
    const dynamicTenants = new Set(bookings.map(b => b.userEmail).filter(Boolean));
    tenantCount = dynamicTenants.size;

    // 3. Admins: Fallback calculation via verification of currently active session token
    adminCount = currentUser?.role?.toLowerCase() === 'admin' ? 1 : 0;
  }

  const totalProperties = properties.length;
  const totalBookings = bookings.length;

  // Format Recharts data metrics line
  const chartData = bookings.map((b, idx) => ({
    name: b.timestamp ? new Date(b.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Node ${idx + 1}`,
    Value: Number(b.rent) || 0
  })).reverse();

  return (
    <div className="w-full min-h-screen bg-gray-50/50 px-4 sm:px-6 lg:px-8 py-10 text-gray-800">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        
        {/* TOP BAR BRANDING */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200/60 pb-6">
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/40">
              System Operator Node
            </span>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase mt-2">
              Management Command Console
            </h1>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">
              Welcome back, <span className="text-gray-700 font-bold">{currentUser?.name || 'Authorized Supervisor'}</span>
            </p>
          </div>
        </div>

        {/* --- DYNAMIC STATS CARD MATRIX --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Dynamic Tenants Card */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Tenants</span>
              <div className="text-3xl font-black text-gray-900">{tenantCount}</div>
              <div className="text-[10px] text-gray-400 font-medium pt-1">Registered clients</div>
            </Card>
          </motion.div>

          {/* Dynamic Owners Card */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Owners</span>
              <div className="text-3xl font-black text-gray-900">{2}</div>
              <div className="text-[10px] text-gray-400 font-medium pt-1">Active managers</div>
            </Card>
          </motion.div>

          {/* Dynamic Admins Card */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Super Admins</span>
              <div className="text-3xl font-black text-amber-600">{adminCount}</div>
              <div className="text-[10px] text-gray-400 font-medium pt-1">System overseers</div>
            </Card>
          </motion.div>

          {/* Dynamic Properties Card */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">All Properties</span>
              <div className="text-3xl font-black text-blue-600">{totalProperties}</div>
              <div className="text-[10px] text-gray-400 font-medium pt-1">Live listings</div>
            </Card>
          </motion.div>

          {/* Dynamic Bookings Card */}
          <motion.div variants={cardVariants} className="col-span-2 md:col-span-1">
            <Card className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Bookings</span>
              <div className="text-3xl font-black text-emerald-600">{totalBookings}</div>
              <div className="text-[10px] text-gray-400 font-medium pt-1">Cleared leases</div>
            </Card>
          </motion.div>

        </div>

        {/* --- RECHARTS ANIMATED INTERACTIVE TIMELINE BLOCK --- */}
        <motion.div variants={cardVariants}>
          <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">📈 Lease Revenue Distribution Chart</h3>
              <p className="text-xs font-semibold text-gray-400 mt-0.5">Dynamic view charting real-time database transactions.</p>
            </div>
            
            <div className="h-[280px] w-full pt-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #f3f4f6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                      labelStyle={{ fontSize: '11px', fontWeight: '800', color: '#1f2937' }}
                      itemStyle={{ fontSize: '11px', fontWeight: '700', color: '#d97706' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Value" 
                      name="Lease Value ($)"
                      stroke="#d97706" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-xs text-gray-400 font-medium">
                  Waiting for active backend bookings to generate chart timeline metrics...
                </div>
              )}
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}