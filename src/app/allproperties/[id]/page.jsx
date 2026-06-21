'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, Button, Spinner, Chip, Avatar } from "@heroui/react";
import Link from "next/link";
import Image from 'next/image';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([
    { id: 1, user: "Tahsin Ahmed", avatar: "", date: "2 hours ago", text: "Incredible location! The natural light in the living room is amazing." },
    { id: 2, user: "Anika Rahman", avatar: "", date: "1 day ago", text: "Very responsive landlord. The place looks exactly like the photos." }
  ]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
        const response = await fetch(`${baseUri}/getPropertiesData`);
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          const listings = Array.isArray(data) ? data : data.properties || [];
          const match = listings.find(item => (item._id || item.id) === id);
          setProperty(match);
        }
      } catch (error) {
        console.error("Error compilation array lookups for item ID matrix:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPropertyDetails();
  }, [id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setComments([
      ...comments,
      {
        id: Date.now(),
        user: "Current User",
        avatar: "",
        date: "Just now",
        text: newComment
      }
    ]);
    setNewComment("");
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <Spinner color="orange" size="lg" label="Isolating discrete real estate structural payload..." />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="h-[70vh] w-full flex flex-col items-center justify-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider">Property Object Not Located</h2>
        <Link href="/properties">
          <Button className="bg-gray-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider px-6 py-4">
            ⬅️ Return to Registry Grid
          </Button>
        </Link>
      </div>
    );
  }

  const rentMonthly = property.rentType === 'Monthly' ? property.rent : property.rent * 30;
  const rentWeekly = property.rentType === 'Weekly' ? property.rent : Math.round(rentMonthly / 4.33);
  const rentDaily = property.rentType === 'Daily' ? property.rent : Math.round(rentMonthly / 30);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      
      {/* Parent Content Layout Wrapper */}
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* --- BREADCRUMB / ACTION BACK LINK --- */}
        <div className="flex items-center justify-between">
          <Link href="/properties" className="text-xs font-black uppercase tracking-wider text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-2">
            ⬅️ Back to All Registry Listings
          </Link>
          <Chip variant="flat" className="bg-orange-50 text-orange-600 border border-orange-100 font-black text-xs uppercase px-3 rounded-lg">
            {property.propertyType}
          </Chip>
        </div>

        {/* CSS Grid Architecture:
          On mobile: Grid matches standard DOM rendering layout sequence perfectly.
          On desktop (`lg`): Custom grid tracking places elements precisely into columns.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
          
          {/* =========================================================
              SECTION 1: UNIFIED PROPERTY DETAILS CARD
              ========================================================= */}
          <div className="lg:col-span-2 lg:row-start-1">
            <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Left Side Fixed Width Image Section (Exactly 303px on desktop) */}
                <div className="w-full md:w-[303px] h-[240px] md:h-[320px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner relative shrink-0">
                  {property.images && property.images.length > 0 ? (
                    <Image 
                      src={property.images[0]} 
                      alt={property.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 303px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 font-bold bg-gray-50 p-4 text-center text-xs">
                      <span>🖼️ Primary Structural Image Missing</span>
                    </div>
                  )}
                </div>

                {/* Right Side Content Metadata Column */}
                <div className="flex-1 w-full space-y-6">
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      📍 {property.location || "Undefined Spatial Vector Address"}
                    </div>
                    <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                      {property.title}
                    </h1>
                  </div>

                  {/* Micro Structural Spec Badges Row */}
                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100 text-center">
                    <div className="space-y-0.5">
                      <div className="text-base">🛏️</div>
                      <div className="text-sm font-black text-gray-800">{property.bedrooms || 0}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bedrooms</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-base">🚿</div>
                      <div className="text-sm font-black text-gray-800">{property.bathrooms || 0}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bathrooms</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-base">📐</div>
                      <div className="text-sm font-black text-gray-800">{(property.propertySize || 0).toLocaleString()}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sq Footage</div>
                    </div>
                  </div>

                  {/* Detailed Prose Description Container */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Architectural Space Description</h3>
                    <p className="text-sm font-normal text-gray-600 leading-relaxed whitespace-pre-line">
                      {property.description || "No description registry text provided for this structure."}
                    </p>
                  </div>
                </div>

              </div>
            </Card>
          </div>

          {/* =========================================================
              SECTION 2: BOOK NOW WIDGET (Intercepts Mobile Middle Row Flow)
              ========================================================= */}
          <div className="lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:sticky lg:top-6 w-full">
            <Card className="bg-white border border-gray-100 shadow-xl rounded-2xl p-6 space-y-6">
              
              {/* Header Pricing Information Structure Container */}
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Configuration Lease Matrix</span>
                <div className="text-3xl font-black text-gray-900 tracking-tight">
                  ${property.rent.toLocaleString()}
                  <span className="text-xs text-gray-400 font-medium tracking-normal">/{property.rentType === 'Monthly' ? 'mo' : property.rentType === 'Weekly' ? 'wk' : 'day'}</span>
                </div>
              </div>

              {/* Nested Split Operational Price Increments Card Layout */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Pricing Breakdown Vectors</h4>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {/* Daily Metric Entry */}
                  <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-xl text-xs">
                    <span className="text-gray-500 font-bold">☀️ Daily Valuation Scale</span>
                    <span className="font-black text-gray-900">${rentDaily.toLocaleString()} <span className="text-[10px] text-gray-400 font-medium">/ day</span></span>
                  </div>

                  {/* Weekly Metric Entry */}
                  <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-xl text-xs">
                    <span className="text-gray-500 font-bold">⏱️ Weekly Cluster Cycle</span>
                    <span className="font-black text-gray-900">${rentWeekly.toLocaleString()} <span className="text-[10px] text-gray-400 font-medium">/ wk</span></span>
                  </div>

                  {/* Monthly Metric Entry */}
                  <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-xl text-xs">
                    <span className="text-gray-500 font-bold">🗓️ Monthly Full Horizon</span>
                    <span className="font-black text-gray-900">${rentMonthly.toLocaleString()} <span className="text-[10px] text-gray-400 font-medium">/ mo</span></span>
                  </div>
                </div>
              </div>

              {/* Action Intent Conversion Interface Trigger */}
              <div className="space-y-2.5 pt-2">
                <Button 
                  className="w-full text-xs font-black uppercase tracking-wider bg-orange-500 text-white hover:bg-orange-600 rounded-xl py-5 shadow-md shadow-orange-500/10 transition-all duration-200"
                  onClick={() => alert(`Initializing operational booking stream pipeline for structural node: ${property.title}`)}
                >
                  Book Now 🚀
                </Button>
                <p className="text-[10px] font-medium text-gray-400 text-center leading-normal px-2">
                  Committing locks parameters into the platform clearing engine pool. No transactional balances deduct immediately.
                </p>
              </div>

            </Card>
          </div>

          {/* =========================================================
              SECTION 3: INTERACTIVE FEEDBACK & COMMENTS MODULE
              ========================================================= */}
          <div className="lg:col-span-2 lg:row-start-2">
            <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">💬 Index Registry Reviews ({comments.length})</h3>
                <p className="text-xs font-medium text-gray-400">Public verified tenant ledger logs and validation commentary strings.</p>
              </div>

              {/* Input Form Using Recorrected Native Standard Textarea Element */}
              <form onSubmit={handleAddComment} className="space-y-3">
                <div className="flex flex-col gap-1.5 w-full">
                  <textarea
                    rows={3}
                    placeholder="Compile context log entry comments..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full text-xs font-semibold text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 focus:border-orange-500 focus:bg-white rounded-xl p-4 outline-none transition-all resize-none shadow-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    size="sm"
                    className="bg-gray-900 text-white font-bold uppercase tracking-wider text-xs rounded-xl px-5 py-4 hover:bg-orange-500 transition-colors shadow-sm"
                  >
                    Commit Entry Node
                  </Button>
                </div>
              </form>

              {/* Comments Output Array Stream Rendering Container */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 items-start text-xs border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <Avatar 
                      name={comment.user} 
                      size="sm"
                      className="bg-orange-100 text-orange-600 font-extrabold text-xs shrink-0 rounded-lg"
                    />
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-gray-800">{comment.user}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{comment.date}</span>
                      </div>
                      <p className="text-gray-600 font-medium leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>

      </div>

    </div>
  );
}