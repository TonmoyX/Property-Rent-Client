'use client';
import { authClient } from '@/lib/auth-client';
import React, { useState, useEffect } from 'react';
import { Card, Chip, Avatar, Spinner, Button } from "@heroui/react";
import Link from "next/link";

const TenantBookingsPage = () => {
  // Extract authenticated session parameters from your auth client
  const userData = authClient.useSession();
  const user = userData?.data?.user;
  const sessionPending = userData?.isPending;

  // State Management
  const [bookings, setBookings] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user?.email) return;

      try {
        setIsDataLoading(true);
        const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
        
        // Fetch individual booking records strictly filtered by the authenticated email context
        const response = await fetch(`${baseUri}/addBookings?email=${user.email}`);
        
        if (response.ok) {
          const data = await response.json();
          // Safely structure data depending on whether your backend returns a direct array or wrapped object
          setBookings(Array.isArray(data) ? data : data.bookings || []);
        } else {
          console.error("Server responded with an error clearing data streams.");
        }
      } catch (error) {
        console.error("Critical execution error compiling tenant booking registry:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    // Trigger data fetching pipeline once the user session state finishes initializing
    if (!sessionPending && user) {
      fetchUserBookings();
    } else if (!sessionPending && !user) {
      setIsDataLoading(false);
    }
  }, [user, sessionPending]);

  // Loader State: Triggered during authentication or database payload parsing
  if (sessionPending || isDataLoading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-3 bg-gray-50">
        <Spinner color="orange" size="lg" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Isolating Secure Reservation Ledgers...
        </p>
      </div>
    );
  }

  // Security Guard: Intercept anonymous layout requests
  if (!user) {
    return (
      <div className="h-[70vh] w-full flex flex-col items-center justify-center space-y-4 bg-gray-50">
        <div className="text-5xl">🔒</div>
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider">Access Parameters Denied</h2>
        <p className="text-sm font-semibold text-gray-400 max-w-sm text-center">
          Please log in to initialize your individual reservation history stream.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* --- HEADER BLOCK --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-5">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
              📄 Bookings Watchlist
            </h1>
            <p className="text-sm font-semibold text-gray-400 mt-1">
              Secure ledger containing verified transactions mapped to: <span className="text-orange-500 font-bold">{user.email}</span>
            </p>
          </div>
          <Link href="/allproperties">
            <Button size="sm" className="bg-gray-900 text-white font-black text-xs uppercase tracking-wider rounded-xl px-4 py-5 hover:bg-orange-500 transition-colors">
              🏠 Browse Properties
            </Button>
          </Link>
        </div>

        {/* --- BOOKINGS CONTENT INTERACTION GRID --- */}
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <Card 
                key={booking._id || booking.id || index} 
                className="bg-white border border-gray-100 hover:border-orange-200 shadow-sm rounded-2xl p-6 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  
                  {/* Left Side Metadata Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip variant="flat" className="bg-orange-50 text-orange-600 border border-orange-100 font-black text-[10px] uppercase rounded-md px-2">
                        {booking.rentType || "Lease Rate"}
                      </Chip>
                      <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">
                        ID: {booking._id || booking.id || `GEN-${index}`}
                      </span>
                    </div>
                    
                    <h2 className="text-lg font-black text-gray-900 tracking-tight leading-snug">
                      {booking.title || "Property Asset Registry Title"}
                    </h2>
                    
                    <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                      📍 {booking.location || "Undefined Structural Mapping Vector"}
                    </div>
                  </div>

                  {/* Right Side Valuation Metrics */}
                  <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0 gap-2">
                    <div className="text-left md:text-right">
                      <div className="text-2xl font-black text-gray-900">
                        ${Number(booking.rent || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                        Amount Allocated
                      </div>
                    </div>
                    
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200/60 px-2.5 py-1 rounded-lg block md:mt-2">
                      📅 {booking.timestamp ? new Date(booking.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date Unspecified'}
                    </span>
                  </div>

                </div>
              </Card>
            ))
          ) : (
            /* Empty State Layout Fallback Rule */
            <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="text-5xl">📅</div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-gray-800 uppercase tracking-wider">No Active Reservation Nodes</h3>
                <p className="text-xs font-semibold text-gray-400 max-w-sm mx-auto">
                  Your isolated tenant history log contains zero entries. Any successful bookings you submit will automatically bind here.
                </p>
              </div>
              <Link href="/properties" className="inline-block pt-2">
                <Button className="bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-xl px-6 py-4 shadow-md shadow-orange-500/10 hover:bg-orange-600 transition-all">
                  Discover Available Spaces
                </Button>
              </Link>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};

export default TenantBookingsPage;