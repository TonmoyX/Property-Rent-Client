'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Pagination, 
    Spinner, 
    Chip, 
    Button,
    Card,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from '@heroui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import EditModal from '@/component/EditModal';

export default function OwnerPropertiesPage() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const user = session?.user;

    // State management
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(false);
    const [page, setPage] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
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

    // Pagination Logic Metrics
    const pagesCount = useMemo(() => {
        const count = Math.ceil(properties.length / rowsPerPage);
        return count > 0 ? count : 1;
    }, [properties.length]);
    
    const itemsOnCurrentPage = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return properties.slice(start, end);
    }, [page, properties]);

    // Generate visible page numbers with ellipsis according to HeroUI guidelines
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

    // Guard fallback against array shrinking/deletions out of range bounds
    useEffect(() => {
        if (page > pagesCount) {
            setPage(pagesCount);
        }
    }, [pagesCount, page]);

    // Get status color for chips
    const getStatusColor = (status = '') => {
        const statusLower = status.toLowerCase();
        if (statusLower === 'rented' || statusLower === 'occupied') return 'success';
        if (statusLower === 'vacant' || statusLower === 'available') return 'warning';
        if (statusLower === 'maintenance') return 'danger';
        if (statusLower === 'pending') return 'default';
        return 'primary';
    };

    // Delete handling logic
    const handleDelete = async (propertyId) => {
        // const {data: tokenData} = authClient.token();
        if (!confirm('Are you sure you want to delete this property permanently?')) return;
        
        try {
            const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
            const response = await fetch(`${baseUri}/getPropertiesData/${propertyId}`, {
                method: 'DELETE',
                // headers:{
                //     authorization : `Bearer ${tokenData?.token}`
                // }
            });

            if (!response.ok) throw new Error('Failed to complete delete request');
            
            const data = await response.json();
            
            if (data.deletedCount > 0) {
                setProperties(properties.filter(p => p._id !== propertyId));
                toast.success('Property deleted successfully!');
            } else {
                toast.error('Property not found or already deleted.');
            }
        } catch (error) {
            console.error("Error executing backend delete:", error);
            toast.error('Failed to complete delete request');
        }
    };

    const handleOpenEditModal = (property) => {
        setSelectedProperty(property);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProperty(null);
    };

    const handleUpdateProperty = (propertyId, updatedData) => {
        setProperties(properties.map(p => 
            p._id === propertyId ? { ...p, ...updatedData } : p
        ));
    };

    // Global session processing spinner checks
    if (sessionPending) {
        return (
            <div className="h-[70vh] w-full flex items-center justify-center">
                <Spinner color="warning" size="lg" label="Loading your properties..." />
            </div>
        );
    }

    // Access authorization wrapper guard
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
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 text-black flex flex-col justify-between">
            <div>
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
                    <Link href="/dashboard/owner/add-properties">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl h-11 px-6 shadow-sm transition-all">
                            + Add New Property
                        </Button>
                    </Link>
                </motion.div>

                {/* API Request Error Panel */}
                {apiError && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm"
                    >
                        <span className="font-bold">⚠️ Connection Error:</span> Unable to fetch properties.
                    </motion.div>
                )}

                {/* Content Core Module Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden min-h-[300px] flex flex-col justify-between">
                        {isLoading ? (
                            <div className="w-full flex-grow p-12 flex items-center justify-center">
                                <Spinner color="warning" size="lg" label="Loading properties..." />
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="w-full flex-grow p-12 text-center flex flex-col items-center justify-center space-y-3">
                                <div className="text-5xl">🏠</div>
                                <h3 className="text-xl font-bold text-gray-900">No Properties Found</h3>
                                <p className="text-gray-400 text-sm max-w-xs">You do not have any property listings documented yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto w-full flex-grow">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50/70">
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
                                                    <p className="text-sm font-bold text-gray-900 truncate max-w-[220px]">
                                                        {item.title || item.name || 'Untitled'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-600 font-medium truncate max-w-[200px]">
                                                        {item.location || item.address || 'Not Specified'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        ${Number(item.rent || item.price || 0).toLocaleString()}
                                                        {item.rentType && <span className="text-xs text-gray-400 font-normal ml-0.5">/{item.rentType}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Chip size="sm" variant="flat" className="capitalize font-semibold">
                                                        {item.propertyType || item.type || 'Apartment'}
                                                    </Chip>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Chip 
                                                        size="sm" 
                                                        variant="flat" 
                                                        color={getStatusColor(item.status)}
                                                        className="capitalize font-bold"
                                                    >
                                                        {item.status || (item.isRented ? 'Rented' : 'Available')}
                                                    </Chip>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <Link href={`/allproperties/${item._id}`}> 
                                                            <Button
                                                                size="sm" 
                                                                variant="light"
                                                                className="text-blue-600 hover:text-blue-700 font-semibold animate-none"
                                                            >
                                                                View
                                                            </Button>
                                                        </Link>
                                                        
                                                        <Dropdown placement="bottom-end">
                                                            <DropdownTrigger>
                                                                <span 
                                                                    role="button"
                                                                    tabIndex={0}
                                                                    className="text-gray-600 text-lg px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-md transition-colors select-none font-bold"
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                                            e.preventDefault();
                                                                            e.currentTarget.click();
                                                                        }
                                                                    }}
                                                                >
                                                                    ⋮
                                                                </span>
                                                            </DropdownTrigger>
                                                            <DropdownMenu aria-label="Property operations">
                                                                <DropdownItem 
                                                                    key="edit"
                                                                    onPress={() => handleOpenEditModal(item)}
                                                                    className="text-blue-600 font-medium"
                                                                >
                                                                    ✏️ Edit Details
                                                                </DropdownItem>
                                                                <DropdownItem 
                                                                    key="delete"
                                                                    onPress={() => handleDelete(item._id)}
                                                                    className="text-red-600 font-bold"
                                                                >
                                                                    🗑️ Delete Permanent
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

                        {/* Composed V3 Static Control Footer Section */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
                            <p className="text-xs text-gray-500 font-medium">
                                Showing page <span className="text-gray-900 font-bold">{page}</span> of {pagesCount}
                            </p>
                            
                            <Pagination className="flex items-center">
                                <Pagination.Content className="flex items-center gap-1.5 bg-white p-1 border border-gray-200 rounded-xl shadow-sm">
                                    {/* Previous Button */}
                                    <Pagination.Item>
                                        <Pagination.Previous
                                            isDisabled={page === 1 || properties.length === 0}
                                            onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                                            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-transparent rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors cursor-pointer select-none"
                                        >
                                            Previous
                                        </Pagination.Previous>
                                    </Pagination.Item>
                                    
                                    {/* Dynamic Iterative Page Links & Ellipses */}
                                    {pageNumbers.map((p, i) => {
                                        if (typeof p === 'string') {
                                            return (
                                                <Pagination.Item key={`ellipsis-${i}`}>
                                                    <Pagination.Ellipsis className="px-2 text-gray-400 text-sm" />
                                                </Pagination.Item>
                                            );
                                        }
                                        return (
                                            <Pagination.Item key={p}>
                                                <Pagination.Link
                                                    isActive={p === page}
                                                    isDisabled={properties.length === 0}
                                                    onPress={() => setPage(p)}
                                                    className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                                        p === page 
                                                        ? "bg-orange-500 text-white shadow-sm" 
                                                        : "text-gray-600 hover:bg-gray-100 bg-transparent"
                                                    }`}
                                                >
                                                    {p}
                                                </Pagination.Link>
                                            </Pagination.Item>
                                        );
                                    })}

                                    {/* Next Button */}
                                    <Pagination.Item>
                                        <Pagination.Next
                                            isDisabled={page === pagesCount || properties.length === 0}
                                            onPress={() => setPage((prev) => Math.min(prev + 1, pagesCount))}
                                            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-transparent rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors cursor-pointer select-none"
                                        >
                                            Next
                                        </Pagination.Next>
                                    </Pagination.Item>
                                </Pagination.Content>
                            </Pagination>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Modal Element Portal */}
            {selectedProperty && (
                <EditModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    property={selectedProperty}
                    onUpdate={handleUpdateProperty}
                />
            )}
        </div>
    );
}