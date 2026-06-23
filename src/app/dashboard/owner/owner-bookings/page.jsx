'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Pagination, 
    Spinner, 
    Chip, 
    Card,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from '@heroui/react';
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';

export default function OwnerBookingsPage() {
    // Core States
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorState, setErrorState] = useState({ hasError: false, statusCode: null, message: "" });
    
    const [page, setPage] = useState(1);
    const rowsPerPage = 8;

    // Tracking inline operation pending matrix
    const [updatingRowId, setUpdatingRowId] = useState(null);

    // Fetch Bookings dynamically via asset allocation records
    const fetchBookings = async () => {
        setIsLoading(true);
        setErrorState({ hasError: false, statusCode: null, message: "" });
        
        try {
            const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
            const response = await fetch(`${baseUri}/addBookings`);
            
            if (!response.ok) {
                setErrorState({ 
                    hasError: true, 
                    statusCode: response.status, 
                    message: `Failed to load bookings matrix (HTTP ${response.status}).`
                });
                setIsLoading(false);
                return;
            }
            
            const allData = await response.json();
            const rawBookings = Array.isArray(allData) ? allData : allData.bookings || [];
            
            setBookings(rawBookings);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setErrorState({ hasError: true, statusCode: 500, message: "Connection error. Please ensure your backend server infrastructure is online." });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Pagination Split Matrix (Defaults to 1 if empty to show active structural placeholder)
    const pagesCount = useMemo(() => {
        const count = Math.ceil(bookings.length / rowsPerPage);
        return count > 0 ? count : 1;
    }, [bookings.length]);

    const itemsOnCurrentPage = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return bookings.slice(start, end);
    }, [page, bookings]);

    // Generate visible page numbers with ellipsis safely
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

    const getStatusColor = (status = '') => {
        const statusLower = status.toLowerCase();
        if (statusLower === 'approved' || statusLower === 'confirmed' || statusLower === 'success') return 'success';
        if (statusLower === 'pending') return 'warning';
        if (statusLower === 'cancelled' || statusLower === 'rejected') return 'danger';
        return 'default';
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 text-black font-sans flex flex-col justify-between">
            <div>
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Reservations & Bookings</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Review asset distribution metrics, verify client tenant credentials, and modify ledger records. Total logs: <span className="font-semibold text-black">{bookings.length}</span> entries
                    </p>
                </div>

                {/* Error Banner */}
                {errorState.hasError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-900 rounded-xl">
                        <div className="flex items-center gap-2 font-bold mb-2">
                            <span>⚠️ System Alert: {errorState.statusCode}</span>
                        </div>
                        <p className="text-xs text-red-700 mb-3">{errorState.message}</p>
                        <button 
                            onClick={fetchBookings} 
                            className="text-xs font-semibold px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Reload Connection
                        </button>
                    </div>
                )}

                {/* Streamlined Asset Table Layout */}
                <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden min-h-[300px] flex flex-col justify-between">
                    {isLoading ? (
                        <div className="w-full flex-grow p-12 flex justify-center items-center">
                            <Spinner color="warning" size="lg" label="Updating interface matrix..." />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="w-full flex-grow p-12 text-center text-gray-500 text-sm flex flex-col items-center justify-center">
                            No active booking reservations registered to your assets.
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full flex-grow">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider select-none">
                                        <th className="px-6 py-4">Real Estate Asset</th>
                                        <th className="px-6 py-4">Client Tenant</th>
                                        <th className="px-6 py-4">Financial Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence mode="popLayout">
                                        {itemsOnCurrentPage.map((booking) => {
                                            const targetId = booking._id || booking.id;
                                            const tenantName = booking.tenantName || booking.userName || booking.userEmail?.split('@')[0] || "Tenant";
                                            const tenantContact = booking.tenantEmail || booking.userEmail || "N/A";
                                            const baseAmount = Number(booking.price || booking.rent || booking.totalAmount || 0);

                                            return (
                                                <motion.tr 
                                                    key={targetId}
                                                    layout
                                                    initial={{ opacity: 0, y: 4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors"
                                                >
                                                    {/* 1. Real Estate Asset */}
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900">{booking.title || booking.propertyName || 'Premium Asset Space'}</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{booking.location || 'Location Log Pending'}</p>
                                                        </div>
                                                    </td>

                                                    {/* 2. Client Tenant */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {/* <Avatar name={tenantName[0]} size="sm" className="bg-orange-100 text-orange-700 font-bold text-xs" /> */}
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{tenantName}</p>
                                                                <p className="text-xs text-gray-400">{tenantContact}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* 3. Financial Value */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900">${baseAmount.toLocaleString()}</p>
                                                                <p className="text-xs text-gray-400 mt-0.5">
                                                                    {booking.timestamp ? new Date(booking.timestamp).toLocaleDateString() : 'Date N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Always Displayed Static Control Footer Container Section */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
                        <p className="text-xs text-gray-500 font-medium">
                            Showing page <span className="text-gray-900 font-bold">{page}</span> of {pagesCount}
                        </p>
                        
                        <Pagination className="flex items-center">
                            <Pagination.Content className="flex items-center gap-1.5 bg-white p-1 border border-gray-200 rounded-xl shadow-sm">
                                {/* Previous Control Item */}
                                <Pagination.Item>
                                    <Pagination.Previous
                                        isDisabled={page === 1 || bookings.length === 0}
                                        onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                                        className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-transparent rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors cursor-pointer select-none"
                                    >
                                        Previous
                                    </Pagination.Previous>
                                </Pagination.Item>
                                
                                {/* Dynamic Interactive Pages Matrix */}
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
                                                isDisabled={bookings.length === 0}
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

                                {/* Next Control Item */}
                                <Pagination.Item>
                                    <Pagination.Next
                                        isDisabled={page === pagesCount || bookings.length === 0}
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
            </div>
        </div>
    );
}