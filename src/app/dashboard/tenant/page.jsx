'use client';
import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';
import { Card, Button, Chip, ProgressBar, Avatar, Spinner } from "@heroui/react";

const TenatDashboard = () => {
  // Extract session parameters
  const userData = authClient.useSession();
  const user = userData?.data?.user;
  const sessionPending = userData?.isPending;

  // Mock Tenancy State Metrics
  const [tenantStats] = useState({
    totalBookings: 4,
    favouritesCount: 12,
    activeRentals: 1,
    profileStatus: "95%" // Verification/Completion status
  });

  // Mock Active Tenancy Matrix
  const [tenantLease] = useState({
    propertyTitle: "Luxury 3BHK Apartment with Skyline View",
    location: "Sector 12, Road 4, Uttara, Dhaka",
    daysRemaining: 192,
    totalDays: 365,
  });

  // Mock Recent Activity Feed Data Stream
  const [recentActivities] = useState([
    { id: "ACT-041", type: "💳 Payment", text: "Rent payment for July 2026 processed successfully", date: "Today, 11:30 AM", badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { id: "ACT-039", type: "🛠️ Maintenance", text: "Ticket REQ-901 state modified to 'In Progress'", date: "Yesterday", badgeColor: "bg-amber-50 text-amber-600 border-amber-100" },
    { id: "ACT-032", type: "📋 Contract", text: "Lease renewal agreement digitally verified by Owner", date: "June 18, 2026", badgeColor: "bg-blue-50 text-blue-600 border-blue-100" },
    { id: "ACT-021", type: "❤️ Favourite", text: "Added 'Duplex Studio Penthouse' to collection watchlist", date: "June 14, 2026", badgeColor: "bg-rose-50 text-rose-600 border-rose-100" }
  ]);

  // Calculations Engine
  const leaseProgressPercentage = Math.round(((tenantLease.totalDays - tenantLease.daysRemaining) / tenantLease.totalDays) * 100);

  // Authentication Handshake Guard Rule
  if (sessionPending) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-3 bg-gray-50">
        <Spinner color="orange" size="lg" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Syncing Account Ledger Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* --- WELCOME HEADER BLOCK --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-5">
          <div className="flex items-center gap-3.5">
            <Avatar 
              src={user?.image || ""}
              name={user?.name || "Tenant"} 
              className="w-12 h-12 bg-orange-100 text-orange-600 font-black text-sm rounded-xl shrink-0 border border-orange-200" 
            />
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Tenant'}!
              </h1>
              <p className="text-sm font-semibold text-gray-400">
                Monitor your rental overview, bookmark metrics, and real-time activities.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip variant="flat" className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-xs uppercase rounded-lg">
              Verified Tenant Account
            </Chip>
          </div>
        </div>

        {/* --- DYNAMIC STATS OVERVIEW MATRIX GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-5 space-y-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Total Booking</span>
            <div className="text-2xl font-black text-gray-900">{tenantStats.totalBookings} Reserved</div>
          </Card>

          <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-5 space-y-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Favourites</span>
            <div className="text-2xl font-black text-gray-900">{tenantStats.favouritesCount} Properties</div>
          </Card>

          <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-5 space-y-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Active Rental</span>
            <div className="text-2xl font-black text-gray-900">{tenantStats.activeRentals} Unit Occupied</div>
          </Card>

          <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-5 space-y-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Profile Status</span>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-emerald-600">{tenantStats.profileStatus}</div>
              <span className="text-[10px] font-bold text-gray-400 uppercase bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md border border-emerald-100">Complete</span>
            </div>
          </Card>
        </div>

        {/* --- LOWER DASHBOARD CONTENT ARCHITECTURE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT/MAIN SPACE: LEASE DEPLOYMENT DETAILS */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-6 space-y-5">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                  Active Rental Progression
                </span>
                <h2 className="text-lg font-black text-gray-800 tracking-tight">
                  {tenantLease.propertyTitle}
                </h2>
                <p className="text-xs font-semibold text-gray-400 mt-0.5">📍 {tenantLease.location}</p>
              </div>

              {/* Progress Bar Component Integration */}
              <div className="space-y-2 pt-2 border-t border-gray-50">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">Lease Progress Timeline</span>
                  <span className="text-gray-800">{tenantLease.daysRemaining} Days Remaining</span>
                </div>
                <ProgressBar aria-label="Lease progress timeline" value={leaseProgressPercentage} className="w-full" />
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: RECENT ACTIVITY STREAM PIRELINE */}
          <div className="w-full">
            <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
                  ⏱️ Recent Activity
                </h3>
                <p className="text-xs font-semibold text-gray-400">
                  Real-time history logs linked to this profile.
                </p>
              </div>

              {/* Activity Pipeline Stream Loop */}
              <div className="space-y-3 pt-2 border-t border-gray-50">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex flex-col p-3 bg-gray-50/60 border border-gray-100/70 rounded-xl gap-1">
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${activity.badgeColor}`}>
                        {activity.type}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">{activity.date}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-700 leading-snug mt-1">
                      {activity.text}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TenatDashboard;