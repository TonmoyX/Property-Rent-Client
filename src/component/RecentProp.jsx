import React from 'react';
import { Card, Button, Chip } from "@heroui/react";
import Link from 'next/link';

// Types/Interfaces can be removed if not using TypeScript
const RecentProp = async () => {
  let properties = [];

  try {
    // 1. Fetch live data parameters from backend context layer
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/getPropertiesData`, {
        cache:'no-store',
      next: { revalidate: 60 }, // Revalidate every 60 seconds to keep dynamic yet performant
    });

    if (res.ok) {
      const data = await res.json();
      // Expecting array payload. Slice the last 3 elements (most recently added)
      properties = Array.isArray(data) ? data.slice(-3).reverse() : [];
    }
  } catch (error) {
    console.error("Failed executing dynamic properties pipeline retrieval:", error);
  }

  // Fallback state if database records return empty matrices
  if (!properties || properties.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-sm font-semibold text-gray-400">No properties found inside the active directory registry.</p>
      </div>
    );
  }

  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* SECTION HEADER TRACK */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-gray-100 pb-5">
          <div>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">
              Fresh Listings
            </span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Recently Added Properties
            </h2>
            <p className="text-sm font-semibold text-gray-400 mt-0.5">
              Explore the latest architectural additions uploaded directly into our global asset hub.
            </p>
          </div>
          {/* <Button 
            size="md" 
            className="bg-gray-900 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-xl px-5 transition-colors self-start md:self-auto"
          >
            Browse Full Portfolio
          </Button> */}
        </div>

        {/* 3-COLUMN RENDER GRID MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((property) => {
            // Normalize internal fallback properties dynamically
            const title = property.title || property.propertyTitle || "Premium Modern Unit";
            const location = property.location || "Uttara, Dhaka";
            const price = property.price || property.rentAmount || 0;
            const type = property.type || property.rentType || "Monthly";
            const status = property.status || "Available";
            const image = property.images?.[0] || property.image || " ";

            return (
              <Card 
                key={property._id || property.id} 
                className="bg-white border border-gray-100 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden group transition-all duration-300"
              >
                {/* Image Media Wrapper */}
                <div className="relative w-full h-52 bg-gray-100 overflow-hidden shrink-0">
                  <img 
                    src={image} 
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      className="font-black text-[10px] uppercase bg-white/90 text-gray-900 backdrop-blur-md border border-white/20 shadow-sm rounded-md"
                    >
                      ✨ New Listing
                    </Chip>
                  </div>
                </div>

                {/* Content Details Block */}
                <div className="p-5 space-y-4 flex flex-col justify-between flex-grow">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-gray-800 tracking-tight line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      📍 {location}
                    </p>
                  </div>

                  {/* Pricing Matrix & Call-to-Action Vector */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50/80">
                    <div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                        Rate Framework
                      </span>
                      <div className="text-lg font-black text-gray-900 tracking-tight">
                        ${property.rent}
                        <span className="text-xs text-gray-400 font-medium tracking-normal">
                          /{property.rentType === 'Monthly' || type === 'mo' ? 'mo' : type === 'Weekly' ? 'wk' : 'dy'}
                        </span>
                      </div>
                    </div>
                    {/* <Link href={`/allproperties/${property._id}`}>
                    <Button 
                      size="sm"
                      className="bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-800 font-black text-[10px] uppercase tracking-wider rounded-xl px-3.5 transition-all"
                    >
                      View Spaces
                    </Button></Link> */}
                   
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default RecentProp;