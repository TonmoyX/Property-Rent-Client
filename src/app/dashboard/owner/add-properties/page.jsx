'use client';
import React, { useState } from 'react';
import { Card, Button, Spinner, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';

export default function AddPropertiesPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Form Field State Management
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    propertyType: 'Apartment',
    rent: '',
    rentType: 'Monthly',
    bedrooms: '',
    bathrooms: '',
    propertySize: '',
    extraFeatures: '',
  });

  // Array states for interactive UI controls
  const [amenities, setAmenities] = useState([]);
  
  // Track BOTH raw file objects (for uploading) and previews (for the UI)
  const [imageFiles, setImageFiles] = useState([]); 
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available options for selection mappings
  const propertyTypes = ['Apartment', 'House', 'Studio', 'Duplex', 'Commercial Space'];
  const rentTypes = ['Monthly', 'Weekly', 'Daily'];
  const availableAmenities = ['⚡ Generator Backup', '🚗 Parking Space', '📶 High-Speed Wi-Fi', '🛡️ 24/7 Security', '🏊 Swimming Pool', '🏋️ Gym Access', '💨 Air Conditioning', '🌳 Balcony / Terrace'];

  // Handle baseline inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle collection entries for active amenities arrays
  const handleAmenityToggle = (amenity) => {
    setAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Handle local multi-image select and save file objects alongside previews
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Save actual raw files for later API processing
    setImageFiles(prev => [...prev, ...files]);

    // Generate local URLs strictly for rendering previews in browser
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Synchronously remove image pointers from state matrices
  const removeImage = (indexToRemove) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    
    // Revoke object URL memory before filtering out preview
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const IMAGE_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API || '';
    if (!IMAGE_API_KEY && imageFiles.length > 0) {
      toast.error("ImgBB API key is missing. Please check your environmental configurations.");
      setIsSubmitting(false);
      return;
    }

    try {
      const uploadedImageUrls = [];

      // 1. Process local image file instances via sequential ImgBB uploads
      for (const file of imageFiles) {
        const imgbbFormData = new FormData();
        imgbbFormData.append('image', file);

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMAGE_API_KEY}`, {
          method: 'POST',
          body: imgbbFormData,
        });

        if (!imgbbResponse.ok) {
          throw new Error('Failed to upload one or more media files to ImgBB cloud storage.');
        }

        const imgbbData = await imgbbResponse.json();
        if (imgbbData.success) {
          uploadedImageUrls.push(imgbbData.data.url); // Use remote secure production link
        }
      }

      // 2. Compiled data payload ready for database ingestion
      const propertyPayload = {
        ...formData,
        rent: parseFloat(formData.rent) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        propertySize: parseInt(formData.propertySize) || 0,
        amenities,
        images: uploadedImageUrls, // Verified web-accessible production URLs
        status: 'Pending',
        owner: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
        }
      };

      const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
      const response = await fetch(`${baseUri}/addProperties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyPayload),
      });

      // Validate JSON formatting structures
      const contentType = response.headers.get("content-type");
      let data = {};
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textFallback = await response.text();
        console.error("HTML/Text error received from endpoint target:", textFallback);
        throw new Error(`Server configuration issue. Received HTML response status code: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong while listing your property.');
      }

      toast.success('Property listed successfully! Set to Pending review state.');
      
      // Clear all state values upon compilation success
      setFormData({
        title: '', description: '', location: '', propertyType: 'Apartment',
        rent: '', rentType: 'Monthly', bedrooms: '', bathrooms: '', propertySize: '', extraFeatures: ''
      });
      setAmenities([]);
      setImageFiles([]);
      setImagePreviews([]);

    } catch (error) {
      console.error("Submission Error Details:", error);
      toast.error(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner color="orange" size="lg" label="Validating owner authorization credentials..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* --- WORKSPACE OVERVIEW TITLE --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">List a New Property</h1>
          <p className="text-sm font-semibold text-gray-400">Fill out structural metrics to publish parameters for review.</p>
        </div>
        <Chip variant="flat" className="bg-amber-50 text-amber-600 border border-amber-100 font-bold text-xs uppercase rounded-lg">
          ⏳ Listing Status: Pending Approval
        </Chip>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT & CENTER COLUMN: MAIN DATA CAPTURE FIELDS --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-2">
              Core Property Details
            </h2>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Property Title</label>
              <input 
                type="text" required name="title" value={formData.title} onChange={handleInputChange}
                placeholder="e.g., Luxury 3BHK Apartment with Skyline View"
                className="w-full text-sm font-semibold text-gray-800 bg-gray-50/60 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-3 outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Description</label>
              <textarea 
                required name="description" rows={4} value={formData.description} onChange={handleInputChange}
                placeholder="Detail layout architecture, immediate neighborhood benefits, conditions, and utilities..."
                className="w-full text-sm font-semibold text-gray-800 bg-gray-50/60 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-3 outline-none transition-all resize-none"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Location Address</label>
              <input 
                type="text" required name="location" value={formData.location} onChange={handleInputChange}
                placeholder="e.g., Sector 12, Road 4, Uttara, Dhaka"
                className="w-full text-sm font-semibold text-gray-800 bg-gray-50/60 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-3 outline-none transition-all"
              />
            </div>

            {/* Pricing & Structure Matrix Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Property Type</label>
                <select 
                  name="propertyType" value={formData.propertyType} onChange={handleInputChange}
                  className="w-full text-sm font-bold text-gray-700 bg-gray-50/60 border border-gray-200 focus:border-orange-500 rounded-xl px-3 py-3 outline-none transition-all cursor-pointer"
                >
                  {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Rent Price ($)</label>
                  <input 
                    type="number" required min="1" name="rent" value={formData.rent} onChange={handleInputChange}
                    placeholder="2500"
                    className="w-full text-sm font-semibold text-gray-800 bg-gray-50/60 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-3 outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Cycle</label>
                  <select 
                    name="rentType" value={formData.rentType} onChange={handleInputChange}
                    className="w-full text-sm font-bold text-gray-700 bg-gray-50/60 border border-gray-200 focus:border-orange-500 rounded-xl px-2 py-3 outline-none transition-all cursor-pointer"
                  >
                    {rentTypes.map(cycle => <option key={cycle} value={cycle}>{cycle}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Bedrooms, Bathrooms & Sq Ft Metrics Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Bedrooms</label>
                <input 
                  type="number" required min="0" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} placeholder="3"
                  className="w-full text-sm font-semibold text-gray-800 bg-gray-50/60 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-3 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Bathrooms</label>
                <input 
                  type="number" required min="0" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} placeholder="2"
                  className="w-full text-sm font-semibold text-gray-800 bg-gray-50/60 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-3 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Size (Sq Ft)</label>
                <input 
                  type="number" required min="1" name="propertySize" value={formData.propertySize} onChange={handleInputChange} placeholder="1450"
                  className="w-full text-sm font-semibold text-gray-800 bg-gray-50/60 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-3 outline-none transition-all"
                />
              </div>
            </div>
          </Card>

          {/* --- AMENITIES SELECTION BLOCK --- */}
          <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-2">
              Select Included Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {availableAmenities.map((amenity) => {
                const isSelected = amenities.includes(amenity);
                return (
                  <button
                    type="button" key={amenity} onClick={() => handleAmenityToggle(amenity)}
                    className={`p-3 text-xs font-bold rounded-xl border text-left transition-all duration-200 ${
                      isSelected 
                        ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' 
                        : 'bg-gray-50/40 border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: IMAGES, METADATA & OWNER VERIFICATION --- */}
        <div className="space-y-6">
          
          {/* --- MULTI-IMAGE UPLOAD INTERACTIVE BOX --- */}
          <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-2">
              Property Media
            </h2>
            
            <div className="relative border-2 border-dashed border-gray-200 hover:border-orange-400 bg-gray-50/40 rounded-2xl transition-colors p-4 text-center cursor-pointer group">
              <input 
                type="file" multiple accept="image/*" onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="space-y-1.5 py-4">
                <span className="text-2xl group-hover:scale-110 transition-transform block">📸</span>
                <p className="text-xs font-black text-gray-700">Upload Gallery Images</p>
                <p className="text-[10px] font-semibold text-gray-400">PNG, JPG formats accepted</p>
              </div>
            </div>

            {/* Dynamically Populated Image Grid Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group shadow-sm">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button" onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* --- EXTRA FEATURES METADATA BLOCK --- */}
          <Card className="bg-white border border-gray-100/80 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-2">
              Extra Features
            </h2>
            <div className="flex flex-col gap-1.5">
              <textarea 
                name="extraFeatures" rows={2} value={formData.extraFeatures} onChange={handleInputChange}
                placeholder="e.g., Gas pipeline available, South facing layout, Pet friendly workspace rules..."
                className="w-full text-xs font-semibold text-gray-800 bg-gray-50/60 border border-gray-200 focus:border-orange-500 rounded-xl px-3 py-2.5 outline-none transition-all resize-none"
              />
            </div>
          </Card>

          {/* --- OWNER INFORMATION CARD (AUTO-FILLED) --- */}
          <Card className="bg-gradient-to-br from-gray-900 to-slate-800 border-none text-white rounded-2xl p-5 shadow-md">
            <div className="space-y-3.5">
              <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest border-b border-white/10 pb-2">
                Verified Owner Profile
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-400">Account Identity:</span>
                  <span className="font-extrabold text-white">{user?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-400">Contact Email:</span>
                  <span className="font-semibold text-gray-300 break-all pl-2 text-right">{user?.email}</span>
                </div>
              </div>

              {/* Action Trigger Submit Execution Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 font-black text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-6 shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Spinner color="white" size="sm" />
                ) : (
                  <>🚀 Publish Property Listing</>
                )}
              </Button>
            </div>
          </Card>

        </div>
      </form>
    </div>
  );
}