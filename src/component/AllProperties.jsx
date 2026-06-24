'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Spinner, Chip } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { authClient } from '@/lib/auth-client';

export default function AllProperties() {
  // --- CORE STATE ARCHITECTURE ---
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

    const userData = authClient.useSession();
    const user =  userData?.data?.user;

  // Filter Engine Vectors
  const [selectedType, setSelectedType] = useState('All');
  const [searchLocation, setSearchLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // Hardcoded mappings matching layout constants
  const propertyTypes = ['All', 'Apartment', 'House', 'Studio', 'Duplex', 'Commercial Space'];
  
  const sortOptions = [
    { key: 'latest', label: '⏱️ Latest Listings' },
    { key: 'price-asc', label: '📉 Price: Low to High' },
    { key: 'price-desc', label: '📈 Price: High to Low' }
  ];

  // --- FETCH INITIAL PAYLOAD SYSTEM ---
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        
        const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
        const response = await fetch(`${baseUri}/getPropertiesData`);
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setProperties(Array.isArray(data) ? data : data.properties || []);
        } else {
          console.error("Endpoint returned unexpected structural response format.");
        }
      } catch (error) {
        console.error("Failed compiling listings dataset array matrix:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // --- FILTER & SORT MATH LOGIC MATRIX ---
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties];

    if (selectedType !== 'All') {
      result = result.filter(item => item.propertyType === selectedType);
    }
    if (searchLocation.trim() !== '') {
      result = result.filter(item => 
        item.location?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    if (minPrice !== '') {
      result = result.filter(item => item.rent >= parseFloat(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(item => item.rent <= parseFloat(maxPrice));
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.rent - b.rent);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.rent - a.rent);
    } else if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.createdAt || b._id?.toString().substring(0,8)) - new Date(a.createdAt || a._id?.toString().substring(0,8)));
    }

    return result;
  }, [properties, selectedType, searchLocation, minPrice, maxPrice, sortBy]);

  const handleClearFilters = () => {
    setSelectedType('All');
    setSearchLocation('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('latest');
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center">
        <Spinner color="orange" size="lg" label="Compiling verified network property index..." />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-gray-50 min-h-screen">
      
      {/* --- DASHBOARD HEADER PANEL BLOCK --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Explore Properties</h1>
          <p className="text-sm font-medium text-gray-500">Query and isolate curated real estate structures using multi-variable matrices.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Chip variant="flat" className="bg-orange-50 text-orange-600 border border-orange-100 font-extrabold text-xs uppercase rounded-xl px-4 py-4 shadow-sm">
            📊 Index Registry: {filteredAndSortedProperties.length} Matches
          </Chip>
        </div>
      </div>

      {/* --- LIVE INTERACTIVE FILTER ENGINE PANEL --- */}
      <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Structure Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs font-bold text-gray-700 bg-gray-50/80 border border-gray-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-3 outline-none cursor-pointer transition-all"
            >
              {propertyTypes.map(type => <option key={type} value={type}>{type === 'All' ? '🏢 All Typologies' : type}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Target Location</label>
            <input
              type="text"
              placeholder="e.g., Uttara, Dhaka"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full text-xs font-semibold text-gray-800 bg-gray-50/80 border border-gray-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2.5 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Min Price ($)</label>
            <input
              type="number"
              placeholder="Min Floor"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full text-xs font-semibold text-gray-800 bg-gray-50/80 border border-gray-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2.5 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Max Price ($)</label>
            <input
              type="number"
              placeholder="Max Ceiling"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full text-xs font-semibold text-gray-800 bg-gray-50/80 border border-gray-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2.5 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Sort Metrics Sequence</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs font-bold text-gray-700 bg-gray-50/80 border border-gray-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-3 outline-none cursor-pointer transition-all"
            >
              {sortOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
            </select>
          </div>

        </div>

        {(selectedType !== 'All' || searchLocation !== '' || minPrice !== '' || maxPrice !== '' || sortBy !== 'latest') && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
            <Button 
              size="sm" 
              variant="light" 
              onClick={handleClearFilters}
              className="text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-xl px-4"
            >
              • Clear Active Filter Arrays
            </Button>
          </div>
        )}
      </Card>

      {/* --- COMPREHENSIVE RESPONSIVE GRID WRAPPER (4, 3, 2, 1 Scale Matrix) --- */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedProperties.map((property) => (
            <motion.div
              layout
              key={property._id || property.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Card className="bg-white border border-gray-200/60 shadow-sm hover:shadow-xl hover:border-gray-300/80 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-[360px] group relative">
                
                {/* Image Media Canvas Frame Wrapper */}
                <div className="relative h-[190px] w-full bg-gray-100 overflow-hidden shrink-0">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 font-bold text-xs uppercase bg-gray-50/50 gap-2">
                      <span>🖼️ No Media Bound</span>
                    </div>
                  )}
                  
                  {/* Property Type Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-gray-200 text-gray-800 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm z-10">
                    {property.propertyType}
                  </div>
                </div>

                {/* Information Layout Context Node Container */}
                <div className="p-4 flex flex-col flex-grow justify-between bg-white relative">
                  
                  {/* Top segment: Location, Price, and Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 max-w-[65%] truncate">
                        📍 {property.location || "Unknown Address Vector"}
                      </div>
                      
                      {/* Price Element */}
                      <div className="text-xs font-black text-orange-600 tracking-tight shrink-0">
                        ${property.rent.toLocaleString()}
                        <span className="text-[9px] text-gray-400 font-bold tracking-normal">/{property.rentType === 'Monthly' ? 'mo' : property.rentType === 'Weekly' ? 'wk' : 'day'}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 tracking-tight line-clamp-1 group-hover:text-orange-500 transition-colors duration-200">
                      {property.title}
                    </h3>
                  </div>

                  {/* Bottom segment: Call to Action Button */}
                  <div className="pt-2 shrink-0">
                    {
                   user && <Link href={`/allproperties/${property._id}`}> <Button
                      className="w-full text-xs font-bold uppercase tracking-wider bg-gray-900 text-white hover:bg-orange-500 rounded-xl py-4.5 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group-hover:shadow"
                    >
                      View Details ➡️
                    </Button></Link>
                    }
                      {
                   !user && <Link href='/authentication/login'> <Button
                      className="w-full text-xs font-bold uppercase tracking-wider bg-gray-900 text-white hover:bg-orange-500 rounded-xl py-4.5 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group-hover:shadow"
                    >
                      View Details ➡️
                    </Button></Link>
                    }
                  </div>
                </div>

              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* --- DATA EXCEPTION NULL CHECK FALLBACK MODULE --- */}
      {filteredAndSortedProperties.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white border border-gray-200 rounded-2xl max-w-md mx-auto space-y-4 shadow-sm"
        >
          <div className="text-4xl">📭</div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-gray-800 uppercase tracking-wider">No Properties Found</h4>
            <p className="text-xs font-medium text-gray-400 max-w-xs mx-auto leading-relaxed">
              No registered property objects fit the active parameters configured within your current filtration setup.
            </p>
          </div>
          <Button 
            size="sm"
            onClick={handleClearFilters}
            className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl px-5 py-4"
          >
            Reset Search Arrays
          </Button>
        </motion.div>
      )}

    </div>
  );
}