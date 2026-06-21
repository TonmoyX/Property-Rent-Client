'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
    Pagination,
    Spinner,
    Chip,
    Button,
    Card,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from '@heroui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';

export default function OwnerPropertiesPage() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const user = session?.user;

    // State management
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(false);
    const [page, setPage] = useState(1);
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

                // Filter properties by current owner
                const ownerFiltered = rawProperties.filter(p => {
                    return (
                        p.owner?.id === user?.id ||
                        p.owner?.email === user?.email ||
                        p.ownerId === user?.id ||
                        p.ownerEmail === user?.email
                    );
                });

                setProperties(ownerFiltered);
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

    // Pagination
    const pagesCount = Math.ceil(properties.length / rowsPerPage);
    const itemsOnCurrentPage = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return properties.slice(start, end);
    }, [page, properties]);

    // Get status color for chips
    const getStatusColor = (status = '') => {
        const statusLower = status.toLowerCase();
        if (statusLower === 'rented' || statusLower === 'occupied') return 'success';
        if (statusLower === 'vacant' || statusLower === 'available') return 'warning';
        if (statusLower === 'maintenance') return 'danger';
        if (statusLower === 'pending') return 'default';
        return 'primary';
    };

    // Handle delete property
    const handleDelete = async (propertyId) => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        try {
            const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
            const response = await fetch(`${baseUri}/deleteProperty/${propertyId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete property');

            setProperties(properties.filter(p => p._id !== propertyId));
            toast.success('Property deleted successfully');
        } catch (error) {
            console.error("Error deleting property:", error);
            toast.error('Failed to delete property');
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
                    <Button as={Link} href="/authentication/login" className="w-full bg-black text-white font-medium rounded-xl h-11">
                        Go to Login
                    </Button>
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
                    <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage your rental portfolio. Total: <span className="font-semibold text-black">{properties.length}</span> properties
                    </p>
                </div>
               <Link href="/dashboard/owner/add-properties"> <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl h-11 px-6 shadow-sm transition-all"
                >
                    + Add New Property
                </Button></Link>
            </motion.div>

            {/* Error Message */}
            {apiError && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm"
                >
                    <span className="font-bold">⚠️ Connection Error:</span> Unable to fetch properties. Please ensure your backend server is running.
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
                            <p className="text-gray-500 text-sm">No properties found. Start by adding your first property!</p>
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
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsOnCurrentPage.map((item) => (
                                        <tr key={item._id} className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        name={(item.title || item.name || 'P')[0]}
                                                        className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold rounded-lg w-10 h-10"
                                                    />
                                                    <div className="max-w-[250px]">
                                                        <p className="text-sm font-semibold text-gray-900">{item.title || item.name || 'Untitled'}</p>
                                                        <p className="text-xs text-gray-400">{item._id?.substring(0, 12)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    <p className="font-medium">{item.location || item.address || 'Not Specified'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">
                                                    ${Number(item.rent || item.price || 0).toLocaleString()}
                                                    <span className="text-xs text-gray-400 font-normal ml-1">/month</span>
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
                                                    color={getStatusColor(item.status)}
                                                    className="capitalize font-semibold"
                                                >
                                                    {item.status || (item.isRented ? 'Rented' : 'Available')}
                                                </Chip>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-center items-center">
                                                    <Button
                                                        as={Link}
                                                        href={`/allproperties/${item._id}`}
                                                        size="sm"
                                                        variant="light"
                                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        View
                                                    </Button>

                                                    <Dropdown>
                                                        {/* FIXED: Replaced nested Button with an inline interactive styled span tag */}
                                                        <DropdownTrigger>
                                                            <span
                                                                role="button"
                                                                tabIndex={0}
                                                                className="text-gray-600 text-lg px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-md transition-colors select-none"
                                                            >
                                                                ⋮
                                                            </span>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Property actions listing">
                                                            <DropdownItem
                                                                key="edit"
                                                                as={Link}
                                                                href={`/dashboard/owner/my-properties/${item._id}/edit`}
                                                                className="text-blue-600"
                                                            >
                                                                ✏️ Edit
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                key="delete"
                                                                onClick={() => handleDelete(item._id)}
                                                                className="text-red-600 font-semibold"
                                                            >
                                                                🗑️ Delete
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
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
                        <p className="text-gray-500">Start managing your rental properties by adding your first listing.</p>
                        <Link href="/dashboard/owner/add-properties"> <Button
                            className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl h-11 px-8"
                        >
                            Add Your First Property
                        </Button></Link>
                    </div>
                </motion.div>
            )}
        </div>
    );
}