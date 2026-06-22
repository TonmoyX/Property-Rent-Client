'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Pagination, 
    Spinner, 
    Chip, 
    Button,
    Card
} from '@heroui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';

export default function AdminPropertiesPage() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const user = session?.user;

    // State management
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(false);
    const [page, setPage] = useState(1);
    const [actionSubmitting, setActionSubmitting] = useState(null); // Track id of processing element
    const rowsPerPage = 10;

    // Fetch properties data
    useEffect(() => {
        const fetchProperties = async () => {
            if (sessionPending || !user) {
                if (!sessionPending && !user) {
                    setIsLoading(false);
                }
                return;
            }

            setIsLoading(true);
            setApiError(false);
            try {
                const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
                const response = await fetch(`${baseUri}/getPropertiesData`);
                
                if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
                
                const allData = await response.json();
                const rawProperties = Array.isArray(allData) ? allData : allData.properties || [];
                
                // --- FIX: ALLOW ADMINS TO SEE ALL BUILDINGS ---
                const userRole = user?.role?.toLowerCase();
                if (userRole === 'admin') {
                    // Admins get global system visibility over all listings to approve/reject
                    setProperties(rawProperties);
                } else {
                    // Regular users/owners only see their own listed properties
                    const ownerFiltered = rawProperties.filter(p => {
                        return (
                            p.owner?.id === user?.id ||
                            p.owner?.email === user?.email ||
                            p.ownerId === user?.id ||
                            p.ownerEmail === user?.email
                        );
                    });
                    setProperties(ownerFiltered);
                }

            } catch (error) {
                console.error("Error fetching properties:", error);
                setApiError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (!sessionPending) {
            fetchProperties();
        }
    }, [user, sessionPending]);

    // Reset layout page frame index to page 1 if list length dramatically drops due to filter changes
    const pagesCount = Math.ceil(properties.length / rowsPerPage);
    useEffect(() => {
        if (page > pagesCount && pagesCount > 0) {
            setPage(pagesCount);
        }
    }, [properties.length, pagesCount, page]);

    // Pagination slice management
    const itemsOnCurrentPage = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return properties.slice(start, end);
    }, [page, properties]);

    // Get status color for chips
    const getStatusColor = (status = '') => {
        const statusLower = status.toLowerCase();
        if (statusLower === 'approved' || statusLower === 'rented' || statusLower === 'occupied') return 'success';
        if (statusLower === 'vacant' || statusLower === 'available') return 'primary';
        if (statusLower === 'maintenance') return 'warning';
        if (statusLower === 'rejected') return 'danger';
        if (statusLower === 'pending') return 'default';
        return 'primary';
    };

    // Handle Property Moderation Update Status API Sync (Approve / Reject)
    const handleModeration = async (propertyId, newStatus) => {
        setActionSubmitting(propertyId);
        try {
            const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
            
            // Sends a updates request to your target backend property verification route
            const response = await fetch(`${baseUri}/getPropertiesData/${propertyId}`, {
                method: 'PATCH', // Or PUT, depending on your routing specifications
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Network response failure during modification context save');
            
            // Update local tracking instance state array structures dynamically
            setProperties(prev => prev.map(p => p._id === propertyId ? { ...p, status: newStatus } : p));
            toast.success(`Property successfully marked as ${newStatus}!`);
        } catch (error) {
            console.error(`Backend sync fault updating status parameter adjustments to ${newStatus}:`, error);
            toast.error(`Could not change property status settings to ${newStatus}.`);
        } finally {
            setActionSubmitting(null);
        }
    };

    // Loading state
    if (sessionPending) {
        return (
            <div className="h-[70vh] w-full flex items-center justify-center">
                <Spinner color="warning" size="lg" label="Loading your properties..." />
            </div>
        );
    }

    // Not authenticated state
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 flex items-center justify-center">
                <Card className="bg-white p-8 border border-gray-100 shadow-sm rounded-2xl max-w-md text-center space-y-4">
                    <div className="text-5xl">🔐</div>
                    <h2 className="text-xl font-bold text-black">Authentication Required</h2>
                    <p className="text-gray-500 text-sm">Please sign in to view your properties.</p>
                    <Link href="/authentication/login">
                        <Button className="w-full bg-black text-white font-medium rounded-xl h-11">
                            Go to Login
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 text-black">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Properties</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage company rental portfolio. Total: <span className="font-semibold text-black">{properties.length}</span> properties
                    </p>
                </div>
            </motion.div>

            {/* Error Message */}
            {apiError && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm"
                >
                    <span className="font-bold">⚠️ Connection Error:</span> Unable to fetch properties.
                </motion.div>
            )}

            {/* Properties Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                    {isLoading ? (
                        <div className="w-full p-8 flex items-center justify-center">
                            <Spinner color="warning" size="lg" label="Loading properties..." />
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="w-full p-12 text-center">
                            <p className="text-gray-500 text-sm">No properties found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Property Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Verification Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsOnCurrentPage.map((item) => {
                                        const isApproved = item.status?.toLowerCase() === 'approved';
                                        const isRejected = item.status?.toLowerCase() === 'rejected';
                                        const isProcessing = actionSubmitting === item._id;

                                        return (
                                            <tr key={item._id} className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="max-w-[250px]">
                                                            <p className="text-base font-bold text-gray-900 truncate">{item.title || item.name || 'Untitled'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600">
                                                        <p className="font-medium truncate max-w-[200px]">{item.location || item.address || 'Not Specified'}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        ${Number(item.rent || item.price || 0).toLocaleString()}
                                                        <span className="text-xs text-gray-400 font-normal ml-1">{item.rentType}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Chip 
                                                        size="sm" 
                                                        variant="flat"
                                                        className="capitalize"
                                                    >
                                                        {item.propertyType || item.type || 'Apartment'}
                                                    </Chip>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Chip 
                                                        size="sm" 
                                                        variant="flat" 
                                                        color={getStatusColor(item.status || 'Pending')}
                                                        className="capitalize font-semibold"
                                                    >
                                                        {item.status || 'Pending'}
                                                    </Chip>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <Link href={`/allproperties/${item._id}`}> 
                                                            <Button
                                                                size="sm" 
                                                                variant="light"
                                                                className="text-blue-600 hover:text-blue-700 font-medium minimal-btn"
                                                            >
                                                                View
                                                            </Button>
                                                        </Link>

                                                        {/* Approve Button */}
                                                        <Button
                                                            size="sm"
                                                            color="success"
                                                            variant={isApproved ? "flat" : "solid"}
                                                            disabled={isApproved || isProcessing}
                                                            isLoading={isProcessing}
                                                            className="font-medium bg-green-600 text-white shadow-sm"
                                                            onPress={() => handleModeration(item._id, 'Approved')}
                                                        >
                                                            {isApproved ? 'Approved' : 'Approve'}
                                                        </Button>

                                                        {/* Reject Button */}
                                                        <Button
                                                            size="sm"
                                                            color="danger"
                                                            variant={isRejected ? "flat" : "solid"}
                                                            disabled={isRejected || isProcessing}
                                                            isLoading={isProcessing}
                                                            className="font-medium bg-red-500 text-white shadow-sm"
                                                            onPress={() => handleModeration(item._id, 'Rejected')}
                                                        >
                                                            {isRejected ? '✕ Rejected' : 'Reject'}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {/* Pagination Context Interface */}
                    {!isLoading && properties.length > 0 && pagesCount > 1 && (
                        <div className="flex w-full justify-center py-4 border-t border-gray-100">
                            <Pagination
                                isCompact
                                showControls
                                showShadow={false}
                                color="warning"
                                page={page}
                                total={pagesCount}
                                onChange={(newPage) => setPage(newPage)}
                                classNames={{
                                    cursor: "bg-orange-500 text-white font-medium rounded-lg",
                                    item: "text-gray-600 rounded-lg hover:bg-gray-100"
                                }}
                            />
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Empty State */}
            {!isLoading && properties.length === 0 && !apiError && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12 text-center"
                >
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="text-6xl">🏠</div>
                        <h3 className="text-2xl font-bold text-gray-900">No Properties Yet</h3>
                        <p className="text-gray-500">No data entries found across database index tracking routes.</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}