'use client';
import { authClient } from '@/lib/auth-client';
import React, { useState, useEffect } from 'react';
import { Card, Button, Chip, ProgressBar, Avatar, Spinner } from "@heroui/react";
// Import Recharts visual pipeline components for Synchronized Line Chart
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const TenantDashboard = () => {
  // Extract authenticated session parameter streams from auth client
  const userData = authClient.useSession();
  const user = userData?.data?.user;
  const sessionPending = userData?.isPending;

  // Real-time Dynamic Platform States
  const [bookings, setBookings] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    favouritesCount: 0,
    profileStatus: "100%",
    activeLease: null
  });
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchUserBookingsAndMetrics = async () => {
      if (!user?.email) return;

      try {
        setIsDataLoading(true);
        const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
        
        // 1. Fetch individual booking records strictly isolated via user email context
        const bookingsResponse = await fetch(`${baseUri}/addBookings?email=${user.email}`);
        // 2. Fetch standalone profile matrix payloads if separated on your backend architectural rules
        const metricsResponse = await fetch(`${baseUri}/getTenantDashboardData?email=${user.email}`);
        
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          // Ensure structure acts cleanly as an iterable array pattern
          setBookings(Array.isArray(bookingsData) ? bookingsData : bookingsData.bookings || []);
        }

        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setDashboardMetrics({
            favouritesCount: metricsData?.favouritesCount || 0,
            profileStatus: metricsData?.profileCompletion || "100%",
            activeLease: metricsData?.activeLease || null
          });
        }
      } catch (error) {
        console.error("Critical error compiling isolated individual tenant ledger profiles:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    // Initialize fetching sequence loop once auth validation state settles
    if (!sessionPending && user) {
      fetchUserBookingsAndMetrics();
    } else if (!sessionPending && !user) {
      setIsDataLoading(false);
    }
  }, [user, sessionPending]);

  // Authentication Handshake State Guard Rule
  if (sessionPending || isDataLoading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-3 bg-gray-50">
        <Spinner color="orange" size="lg" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Syncing Account Ledger Profile Streams...
        </p>
      </div>
    );
  }

  // Fallback Guard: Securely Intercept Unauthenticated Access Attempts
  if (!user) {
    return (
      <div className="h-[70vh] w-full flex flex-col items-center justify-center space-y-4 bg-gray-50">
        <div className="text-5xl">🔒</div>
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider">Access Parameters Denied</h2>
        <p className="text-sm font-semibold text-gray-400 max-w-sm text-center">
          Please log in to initialize your secure dashboard overview engine channel.
        </p>
      </div>
    );
  }

  // Dynamic Calculation Engines: Compute metrics exclusively from the current user's data
  const totalBookingsCount = bookings.length;
  const totalSpend = bookings.reduce((acc, booking) => {
    return acc + (Number(booking.rent) || 0);
  }, 0);

  const activeLease = dashboardMetrics.activeLease;
  const daysRemaining = activeLease?.daysRemaining || 0;
  const totalDays = activeLease?.totalDays || 365;
  const leaseProgressPercentage = totalDays > 0 ? Math.round(((totalDays - daysRemaining) / totalDays) * 100) : 0;

  // Transform booking nodes safely into chronology mappings for the Recharts graph visualization
  const chartData = bookings.map((booking, idx) => ({
    name: booking.timestamp ? new Date(booking.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Booking ${idx + 1}`,
    Spend: Number(booking.rent) || 0,
  })).reverse(); // Reverse to display chronological history logic flow from left to right

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* --- WELCOME HEADER BLOCK --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-5">
          <div className="flex items-center gap-3.5">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Tenant'}!
              </h1>
              <p className="text-sm font-semibold text-gray-400">
                Secure individual account profile workspace. Access isolated ledger details.
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
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Your Bookings</span>
            <div className="text-2xl font-black text-gray-900">{totalBookingsCount} Reserved</div>
          </Card>

          <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-5 space-y-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Your Capital Spend</span>
            <div className="text-2xl font-black text-orange-600">${totalSpend.toLocaleString()}</div>
          </Card>

          <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-5 space-y-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Watchlist Favourites</span>
            <div className="text-2xl font-black text-gray-900">{dashboardMetrics.favouritesCount} Units</div>
          </Card>

          <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-5 space-y-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Profile Verification</span>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-emerald-600">{dashboardMetrics.profileStatus}</div>
              <span className="text-[10px] font-bold text-gray-400 uppercase bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md border border-emerald-100">Verified</span>
            </div>
          </Card>
        </div>

        {/* --- LOWER CONTENT ARCHITECTURE BLOCK --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT/MAIN SPACE: INDIVIDUAL BOOKING LISTING STREAM */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">📋 Your Active Reservations</h3>
            
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <Card key={booking._id || booking.id || index} className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="text-base font-black text-gray-900 tracking-tight">{booking.title}</h4>
                    <p className="text-xs font-semibold text-gray-400 mt-0.5">📍 {booking.location || "Location Not Provided"}</p>
                    <span className="text-[10px] text-gray-400 font-medium block mt-1">Booked on: {booking.timestamp ? new Date(booking.timestamp).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <div className="text-lg font-black text-gray-900">${Number(booking.rent).toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lease Rate ({booking.rentType})</div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-8 text-center">
                <span className="text-3xl mb-1 block">📅</span>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">No Isolated Bookings Registry Entries</h4>
                <p className="text-xs text-gray-400 mt-1">You haven't initiated any real estate transactions yet.</p>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN: ACTIVE LEASE TIMELINE VIEW */}
          <div className="w-full">
            <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-6 space-y-5">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                  Rental Agreement Status
                </span>
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">⏱️ Timeline tracking</h3>
              </div>

              {activeLease ? (
                <div className="space-y-4 pt-2 border-t border-gray-50">
                  <div>
                    <h4 className="text-xs font-black text-gray-800">{activeLease.propertyTitle}</h4>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">📍 {activeLease.location}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-500">Lease Progress</span>
                      <span className="text-gray-800">{daysRemaining} Days Left</span>
                    </div>
                    <ProgressBar aria-label="Lease progress timeline" value={leaseProgressPercentage} color="warning" className="w-full" />
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-50 text-center text-xs text-gray-400 font-medium">
                  No execution contracts currently active.
                </div>
              )}
            </Card>
          </div>

        </div>

        {/* --- RECHARTS SYNCHRONIZED LINE CHART LAYER (PLACED UNDER ALL COMPONENTS) --- */}
        <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">📈 Capital Outlay Analysis</h3>
            <p className="text-xs font-semibold text-gray-400">Synchronized financial ledger mapping tracking transaction trends across historical booking nodes.</p>
          </div>
          <div className="h-[240px] w-full pt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {/* syncId allows this chart to align seamlessly with any other synchronized charts */}
                <LineChart data={chartData} syncId="tenantMetricsSync" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}
                    labelStyle={{ fontSize: '11px', fontWeight: '800', color: '#1f2937' }}
                    itemStyle={{ fontSize: '11px', fontWeight: '700', color: '#ea580c' }}
                  />
                  <Line type="monotone" dataKey="Spend" stroke="#ea580c" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-xs text-gray-400 font-medium">
                Insufficient booking datasets available to compile charting analytics streams.
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default TenantDashboard;