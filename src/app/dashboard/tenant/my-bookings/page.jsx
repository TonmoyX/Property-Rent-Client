'use client';
import { authClient } from '@/lib/auth-client';
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Chip, Spinner, Button, Pagination } from "@heroui/react";
import Link from "next/link";
import { AnimatePresence, motion } from 'framer-motion';

const TenantBookingsPage = () => {
  // Extract authenticated session parameters from your auth client
  const userData = authClient.useSession();
  const user = userData?.data?.user;
  const sessionPending = userData?.isPending;

  // State Management
  const [bookings, setBookings] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6; 

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

    if (!sessionPending && user) {
      fetchUserBookings();
    } else if (!sessionPending && !user) {
      setIsDataLoading(false);
    }
  }, [user, sessionPending]);

  // Pagination Split Matrix Metrics
  const pagesCount = useMemo(() => {
    const count = Math.ceil(bookings.length / rowsPerPage);
    return count > 0 ? count : 1;
  }, [bookings.length]);

  const itemsOnCurrentPage = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return bookings.slice(start, end);
  }, [page, bookings]);

  // Generate page numbers safely with embedded layout ellipses for long indices
  const pageNumbers = useMemo(() => {
    const pages = [];
    pages.push(1);
    
    if (page > 3) {
      pages.push('ellipsis-start');
    }
    
    const start = Math.max(2, page - 1);
    const end = Math.min(pagesCount - 1, page + 1);
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    
    if (page < pagesCount - 2) {
      pages.push('ellipsis-end');
    }
    
    if (pagesCount > 1 && !pages.includes(pagesCount)) {
      pages.push(pagesCount);
    }
    
    return pages;
  }, [page, pagesCount]);

  useEffect(() => {
    if (page > pagesCount) {
      setPage(pagesCount);
    }
  }, [pagesCount, page]);

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
            <>
              <AnimatePresence mode="popLayout">
                {itemsOnCurrentPage.map((booking, index) => {
                  const targetId = booking._id || booking.id || `gen-key-${index}`;
                  return (
                    <motion.div
                      key={targetId}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="bg-white border border-gray-100 hover:border-orange-200 shadow-sm rounded-2xl p-6 transition-all duration-200">
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
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* --- CONTROL FOOTER LINKED DIRECTLY UNDER MAIN LIST ROWS --- */}
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center px-6 py-4 border border-gray-200/60 bg-white shadow-sm rounded-2xl mt-4">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  Showing page <span className="text-gray-900 font-black">{page}</span> of {pagesCount}
                </p>
                
                <Pagination className="flex items-center">
                  <Pagination.Content className="flex items-center gap-1.5 bg-gray-50 p-1 border border-gray-200 rounded-xl">
                    {/* Previous Button Component */}
                    <Pagination.Item>
                      <Pagination.Previous
                        isDisabled={page === 1}
                        onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-40 transition-colors cursor-pointer select-none"
                      >
                        Previous
                      </Pagination.Previous>
                    </Pagination.Item>
                    
                    {/* Dynamic Interactive Page Numbers & Ellipses */}
                    {pageNumbers.map((p, i) => {
                      if (typeof p === 'string') {
                        return (
                          <Pagination.Item key={`ellipsis-${i}`}>
                            <Pagination.Ellipsis className="px-1.5 text-gray-400 text-sm" />
                          </Pagination.Item>
                        );
                      }
                      return (
                        <Pagination.Item key={p}>
                          <Pagination.Link
                            isActive={p === page}
                            onPress={() => setPage(p)}
                            className={`w-8 h-8 flex items-center justify-center text-xs font-black rounded-lg transition-all cursor-pointer ${
                              p === page 
                              ? "bg-orange-500 text-white shadow-sm border border-orange-600" 
                              : "text-gray-600 hover:bg-gray-200 bg-white border border-gray-200 shadow-sm"
                            }`}
                          >
                            {p}
                          </Pagination.Link>
                        </Pagination.Item>
                      );
                    })}

                    {/* Next Button Component */}
                    <Pagination.Item>
                      <Pagination.Next
                        isDisabled={page === pagesCount}
                        onPress={() => setPage((prev) => Math.min(prev + 1, pagesCount))}
                        className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-40 transition-colors cursor-pointer select-none"
                      >
                        Next
                      </Pagination.Next>
                    </Pagination.Item>
                  </Pagination.Content>
                </Pagination>
              </div>
            </>
          ) : (
            /* Empty State Layout Fallback Rule */
            <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 mt-4">
              <div className="text-5xl">📅</div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-gray-800 uppercase tracking-wider">No Active Reservation Nodes</h3>
                <p className="text-xs font-semibold text-gray-400 max-w-sm mx-auto">
                  Your isolated tenant history log contains zero entries. Any successful bookings you submit will automatically bind here.
                </p>
              </div>
              <Link href="/allproperties" className="inline-block pt-2">
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