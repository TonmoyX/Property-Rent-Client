'use client';
import React, { useState, useEffect } from 'react';
import { Button, Card, InputGroup } from '@heroui/react';
import { toast } from 'react-toastify';

export default function EditModal({ isOpen, onClose, property, onUpdate }) {
    const [isLoading, setIsLoading] = useState(false);
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
        status: 'Pending'
    });

    // Update form when property changes
    useEffect(() => {
        if (property && isOpen) {
            setFormData({
                title: property?.title || '',
                description: property?.description || '',
                location: property?.location || property?.address || '',
                propertyType: property?.propertyType || property?.type || 'Apartment',
                rent: property?.rent || property?.price || '',
                rentType: property?.rentType || 'Monthly',
                bedrooms: property?.bedrooms || '',
                bathrooms: property?.bathrooms || '',
                propertySize: property?.propertySize || '',
                status: property?.status || 'Pending'
            });
        }
    }, [property, isOpen, setFormData]);

    const propertyTypes = ['Apartment', 'House', 'Studio', 'Duplex', 'Commercial Space'];
    const rentTypes = ['Monthly', 'Weekly', 'Daily'];
    const statuses = ['Pending', 'Available', 'Rented', 'Occupied', 'Maintenance', 'Vacant'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
            
            // Prepare the payload
            const updatePayload = {
                ...formData,
                rent: parseFloat(formData.rent) || 0,
                bedrooms: parseInt(formData.bedrooms) || 0,
                bathrooms: parseInt(formData.bathrooms) || 0,
                propertySize: parseInt(formData.propertySize) || 0
            };

            // Make API call to update property
            const response = await fetch(`${baseUri}/getPropertiesData/${property._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatePayload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update property');
            }

            toast.success('Property updated successfully!');
            onUpdate(property._id, data.data || updatePayload);
            onClose();
        } catch (error) {
            console.error("Error updating property:", error);
            toast.error(error.message || 'Failed to update property');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-0">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">
                        Edit Property: {property?.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title and Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Property Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter property title"
                                required
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Property Type
                            </label>
                            <select
                                name="propertyType"
                                value={formData.propertyType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                            >
                                {propertyTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Location / Address
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Enter property location"
                            required
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter property description"
                            rows="3"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none"
                        />
                    </div>

                    {/* Bedrooms, Bathrooms, Size */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Bedrooms
                            </label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleInputChange}
                                placeholder="0"
                                min="0"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Bathrooms
                            </label>
                            <input
                                type="number"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleInputChange}
                                placeholder="0"
                                min="0"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Size (sqft)
                            </label>
                            <input
                                type="number"
                                name="propertySize"
                                value={formData.propertySize}
                                onChange={handleInputChange}
                                placeholder="0"
                                min="0"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Rent Amount and Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Rent Amount ($)
                            </label>
                            <input
                                type="number"
                                name="rent"
                                value={formData.rent}
                                onChange={handleInputChange}
                                placeholder="0"
                                min="0"
                                required
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Rent Type
                            </label>
                            <select
                                name="rentType"
                                value={formData.rentType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                            >
                                {rentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Property Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-6 border-t border-gray-100">
                        <Button
                            onClick={onClose}
                            variant="light"
                            className="flex-1 h-11 font-semibold text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}