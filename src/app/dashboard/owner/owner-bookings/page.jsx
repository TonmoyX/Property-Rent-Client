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
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';

export default function OwnerBookingsPage() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const user = session?.user;

    // Direct state tracking to avoid missing useDisclosure hooks
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Core States
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorState, setErrorState] = useState({ hasError: false, statusCode: null, message: "" });
    
    const [page, setPage] = useState(1);
    const rowsPerPage = 8;

    // Actions & Selection management
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch Bookings Grid from your Base Server URI
    const fetchBookings = async () => {
        if (sessionPending || !user) {
            if (!sessionPending && !user) setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setErrorState({ hasError: false, statusCode: null, message: "" });
        
        try {
            const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
            // Connects directly to the corrected /getBookingsData endpoint
            const response = await fetch(`${baseUri}/getBookingsData`);
            
            if (!response.ok) {
                setErrorState({ 
                    hasError: true, 
                    statusCode: response.status, 
                    message: `Failed to load bookings (HTTP ${response.status}). Ensure the backend route is configured.`
                });
                setIsLoading(false);
                return;
            }
            
            const allData = await response.json();
            const rawBookings = Array.isArray(allData) ? allData : allData.bookings || [];
            
            // Filter records matching the propertyOwner contextual criteria
            const ownerFiltered = rawBookings.filter(b => {
                return (
                    b.propertyOwnerId === user?.id || 
                    b.propertyOwnerEmail === user?.email ||
                    b.property?.ownerId === user?.id ||
                    b.property?.owner?.email === user?.email
                );
            });

            setBookings(ownerFiltered);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setErrorState({ hasError: true, statusCode: 500, message: "Connection error. Please ensure your backend server is running." });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!sessionPending) {
            fetchBookings();
        }
    }, [user?.id, user?.email, sessionPending]);

    // Pagination Split Matrix
    const pagesCount = Math.ceil(bookings.length / rowsPerPage);
    const itemsOnCurrentPage = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return bookings.slice(start, end);
    }, [page, bookings]);

    const getStatusColor = (status = '') => {
        const statusLower = status.toLowerCase();
        if (statusLower === 'approved' || statusLower === 'confirmed' || statusLower === 'success') return 'success';
        if (statusLower === 'pending') return 'warning';
        if (statusLower === 'cancelled' || statusLower === 'rejected') return 'danger';
        return 'default';
    };

    const handleStatusClick = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        if (!selectedBooking || !newStatus) return;
        
        setIsUpdating(true);
        try {
            const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
            const updateUrl = `${baseUri}/getBookingsData?id=${selectedBooking._id || selectedBooking.id}`;
            
            const response = await fetch(updateUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    bookingId: selectedBooking._id || selectedBooking.id,
                    status: newStatus 
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }

            toast.success(`Booking state successfully adjusted to ${newStatus}`);
            setIsModalOpen(false);
            fetchBookings(); 
        } catch (error) {
            console.error("Error updating booking:", error);
            toast.error(error.message || 'Failed to update booking status.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (sessionPending) {
        return (
            <div className="h-[70vh] w-full flex items-center justify-center">
                <Spinner color="warning" size="lg" label="Loading your bookings..." />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <Card className="bg-white p-8 border border-gray-100 max-w-md text-center space-y-4 rounded-2xl">
                    <div className="text-5xl">🔐</div>
                    <h2 className="text-xl font-bold text-black">Authentication Required</h2>
                    <p className="text-gray-500 text-sm">Please sign in to view your bookings.</p>
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Manage tenant bookings and update status. Total: <span className="font-semibold text-black">{bookings.length}</span> bookings
                </p>
            </div>

            {/* Error Banner */}
            {errorState.hasError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-900 rounded-xl">
                    <div className="flex items-center gap-2 font-bold mb-2">
                        <span>⚠️ Error: {errorState.statusCode}</span>
                    </div>
                    <p className="text-xs text-red-700 mb-3">{errorState.message}</p>
                    <Button size="sm" color="danger" variant="flat" onClick={fetchBookings} className="text-xs font-semibold">
                        Retry
                    </Button>
                </div>
            )}

            {/* Bookings Table */}
            <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="w-full p-12 flex justify-center">
                        <Spinner color="warning" size="lg" label="Loading bookings..." />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="w-full p-12 text-center text-gray-500 text-sm">
                        No bookings found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    <th className="px-6 py-4">Property</th>
                                    <th className="px-6 py-4">Tenant</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Booking Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsOnCurrentPage.map((booking) => {
                                    const tenantName = booking.tenantName || booking.userName || booking.userEmail?.split('@')[0] || "Tenant";
                                    const tenantContact = booking.tenantEmail || booking.userEmail || "N/A";
                                    const baseAmount = Number(booking.price || booking.rent || booking.totalAmount || 0);

                                    return (
                                        <tr key={booking._id || booking.id} className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{booking.propertyTitle || booking.propertyName || 'Property'}</p>
                                                    <p className="text-xs text-gray-400">{booking.propertyLocation || 'Location'}</p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={tenantName[0]} size="sm" className="bg-orange-100 text-orange-700 font-bold" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{tenantName}</p>
                                                        <p className="text-xs text-gray-400">{tenantContact}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <span className="font-bold text-gray-900">${baseAmount.toLocaleString()}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}
                                            </td>

                                            <td className="px-6 py-4">
                                                <Chip size="sm" variant="flat" color={getStatusColor(booking.status)} className="capitalize font-semibold">
                                                    {booking.status || 'Pending'}
                                                </Chip>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <span role="button" tabIndex={0} className="text-gray-600 text-lg px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-md transition-colors select-none">⋮</span>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Booking actions">
                                                        <DropdownItem key="edit" onPress={() => handleStatusClick(booking)} className="text-orange-600 font-medium">
                                                            ✏️ Update Status
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && bookings.length > rowsPerPage && (
                    <div className="flex justify-center py-4 border-t border-gray-100">
                        <Pagination
                            isCompact
                            showControls
                            color="warning"
                            page={page}
                            total={pagesCount}
                            onChange={(p) => setPage(p)}
                        />
                    </div>
                )}
            </Card>

            {/* Status Update Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-0">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Update Booking Status</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Change the status of this booking</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Select Status</label>
                                <select
                                    value={selectedBooking?.status || 'Pending'}
                                    onChange={handleStatusChange}
                                    disabled={isUpdating}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all disabled:opacity-50"
                                >
                                    <option value="Pending">⏳ Pending</option>
                                    <option value="Approved">✅ Approved</option>
                                    <option value="Rejected">❌ Rejected</option>
                                </select>
                            </div>

                            {isUpdating && (
                                <div className="flex items-center justify-center gap-2 py-2 text-xs text-orange-500">
                                    <Spinner size="sm" color="warning" />
                                    <span>Updating...</span>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t border-gray-100">
                            <Button
                                onClick={() => setIsModalOpen(false)}
                                variant="light"
                                className="flex-1 h-10 font-semibold text-gray-700 hover:bg-gray-100"
                                disabled={isUpdating}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}