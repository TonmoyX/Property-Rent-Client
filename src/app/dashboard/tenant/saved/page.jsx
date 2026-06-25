'use client';
import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Chip, Avatar } from "@heroui/react";
import Link from "next/link";
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'framer-motion';

export default function TenantFavoritesTablePage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(null);

  // Listen to authenticated session stream
  const userData = authClient.useSession();
  const user = userData?.data?.user;

  // 1. Fetch data from backend and match by logged-in user email
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.email) return;
      
      try {
        const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
        const res = await fetch(`${serverUri}/addUserFav`);
        
        if (!res.ok) {
          throw new Error(`Server returned status code: ${res.status}`);
        }

        const allFavorites = await res.json();
        
        // Filter elements explicitly assigned to the logged-in tenant's email parameter
        const tenantFilteredData = Array.isArray(allFavorites)
          ? allFavorites.filter(item => item.userEmail === user.email)
          : [];

        setFavorites(tenantFilteredData);
      } catch (error) {
        console.error("Failed executing favorited items catalog matrix loading:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchFavorites();
    } else if (userData?.data === null) {
      setIsLoading(false);
    }
  }, [user?.email, userData]);

  // 2. Perform target MongoDB item purge sequence
  const handleRemoveFavorite = async (favId) => {
    if (!favId) return;
    setIsRemoving(favId);
    
    try {
      const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
      const { data: tokenData } = await authClient.token();

      // Hits your exact app.delete("/addUserFav/:id") backend controller node
      const res = await fetch(`${serverUri}/addUserFav/${favId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${tokenData?.token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to clear element directly from MongoDB stack.");
      }

      // Optimistic client-side filter mapping array cleanup
      setFavorites(prev => prev.filter(item => (item._id || item.id) !== favId));
    } catch (error) {
      console.error("Failed removing target profile asset sequence connection:", error);
      alert("Error processing deletion request with the server database middleware.");
    } finally {
      setIsRemoving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center bg-gray-50">
        <Spinner color="orange" size="lg" label="Compiling verified structural registry database matches..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[75vh] w-full flex flex-col items-center justify-center space-y-4 px-4 bg-gray-50 text-center">
        <div className="text-4xl">🔐</div>
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider">Access Clearance Restricted</h2>
        <p className="text-xs font-semibold text-gray-400 max-w-sm">
          Please log into your tenant portal profile to view your personal real estate baseline favorites index.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- PROFILE HERO TITLE ELEMENT BAR --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Saved Structural Registries
            </h1>
            <p className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
              <span>👤 Tenant Node:</span> 
              <span className="text-orange-500 font-bold underline">{user.email}</span>
            </p>
          </div>
          <Chip variant="flat" className="bg-orange-50 text-orange-600 border border-orange-100 font-black text-xs uppercase px-3 rounded-lg w-fit">
            💖 {favorites.length} Rows Registered
          </Chip>
        </div>

        {/* --- DATA LOGIC RENDER MATRIX --- */}
        {favorites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm max-w-lg mx-auto space-y-5"
          >
            <div className="text-5xl">🏘️</div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Favorites Registry Empty</h3>
              <p className="text-xs text-gray-400 font-medium px-4 leading-normal">
                You haven't committed any micro real estate property listings to your tracking ledger database context yet.
              </p>
            </div>
            <Link href="/properties" className="inline-block">
              <Button className="bg-gray-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider px-6 py-4 hover:bg-orange-500 transition-colors">
                Explore Available Grid Listings
              </Button>
            </Link>
          </motion.div>
        ) : (
          
          /* --- DESIGNED RESPONSIVE DATA TABLE --- */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-white border border-gray-200/60 shadow-sm rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200/80 text-gray-400 font-black text-[11px] uppercase tracking-widest">
                    <th className="py-4 px-6 font-black">Property Details</th>
                    <th className="py-4 px-6 font-black">Location Vector</th>
                    <th className="py-4 px-6 font-black">Monthly Rent Scale</th>
                    <th className="py-4 px-6 font-black">Registration Session</th>
                    <th className="py-4 px-6 text-center font-black">Action Handlers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  <AnimatePresence mode="popLayout">
                    {favorites.map((item) => {
                      const favId = item._id || item.id;
                      return (
                        <motion.tr
                          key={favId}
                          layout
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15, bg: "#fef2f2" }}
                          transition={{ duration: 0.25 }}
                          className="hover:bg-gray-50/40 transition-colors group"
                        >
                          {/* Column 1: Image Frame & Title Info */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="w-[64px] h-[48px] rounded-lg overflow-hidden bg-gray-100 relative shrink-0 border border-gray-200 shadow-sm">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.title || "Property Asset"}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[8px] text-gray-400 text-center font-bold">
                                    🖼️ N/A
                                  </div>
                                )}
                              </div>
                              <div className="space-y-0.5 max-w-[280px]">
                                <h4 className="font-black text-gray-800 text-sm tracking-tight truncate group-hover:text-orange-500 transition-colors">
                                  {item.title}
                                </h4>
                                <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded uppercase">
                                  ID: {item.propertyId?.slice(-6) || "N/A"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Address String Mapping */}
                          <td className="py-4 px-6 font-semibold text-gray-500">
                            📍 {item.location || "Undefined Vector"}
                          </td>

                          {/* Column 3: Pricing Parameters */}
                          <td className="py-4 px-6 font-black text-gray-900 text-sm">
                            ${item.rent?.toLocaleString() || "0"}
                            <span className="text-[10px] text-gray-400 font-medium"> / mo</span>
                          </td>

                          {/* Column 4: Timestamp Processing Node */}
                          <td className="py-4 px-6 text-gray-400 font-medium">
                            {item.timestamp ? new Date(item.timestamp).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'Recent Log'}
                          </td>

                          {/* Column 5: View Details + Direct DB Purge Integration */}
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <Link href={`/allproperties/${item.propertyId}`}>
                                <Button size="sm" className="bg-gray-900 hover:bg-orange-500 text-white font-bold uppercase tracking-wider text-[10px] rounded-lg py-4 px-4 shadow-sm transition-colors">
                                  View
                                </Button>
                              </Link>
                              
                              <Button 
                                size="sm"
                                isLoading={isRemoving === favId}
                                onClick={() => handleRemoveFavorite(favId)}
                                className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 rounded-lg font-bold text-[10px] py-4 px-3 flex items-center gap-1 transition-colors min-w-0"
                                aria-label="Purge MongoDB Row Entry"
                              >
                                {isRemoving !== favId && (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                    <span>Delete</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}