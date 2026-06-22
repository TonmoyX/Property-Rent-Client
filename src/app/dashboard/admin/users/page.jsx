'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Pagination, 
    Spinner, 
    Chip, 
    Button,
    Card
} from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function AdminUsersPage() {
    // 1. Session verification & routing guard protection elements
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const currentUser = session?.user;

    // 2. Functional UI hooks
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(false);
    const [page, setPage] = useState(1);
    const [updatingState, setUpdatingState] = useState({ userId: null, targetRole: null });
    const rowsPerPage = 10;

    // 3. Dynamic layout data parsing from backend route mapping structure
    useEffect(() => {
        const fetchAllUsers = async () => {
            if (sessionPending || !currentUser) {
                if (!sessionPending && !currentUser) {
                    setIsLoading(false);
                }
                return;
            }

            setIsLoading(true);
            setApiError(false);
            try {
                const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
                const response = await fetch(`${baseUri}/getUsers`);
                
                if (!response.ok) throw new Error(`HTTP Mismatch Error Status: ${response.status}`);
                
                const data = await response.json();
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Critical failure requesting users indexes stream mapping data:", error);
                setApiError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (!sessionPending) {
            fetchAllUsers();
        }
    }, [currentUser, sessionPending]);

    // 4. Matrix Pagination Calculation Blocks
    const pagesCount = Math.ceil(users.length / rowsPerPage);
    const itemsOnCurrentPage = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return users.slice(start, end);
    }, [page, users]);

    // Role-dependent visual decoration map
    const getRoleChipColor = (role = '') => {
        switch (role.toLowerCase()) {
            case 'admin': return 'danger';
            case 'owner': return 'warning';
            case 'tenant': return 'primary';
            default: return 'default';
        }
    };

    // 5. User Dynamic Update Handler Core Callback Loop
    const handleRoleChange = async (userId, targetRole) => {
        const cleanRoleString = String(targetRole).toLowerCase();
        
        setUpdatingState({ userId, targetRole: cleanRoleString });
        try {
            const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
            const response = await fetch(`${baseUri}/updateUserRole/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: cleanRoleString })
            });

            if (!response.ok) throw new Error('Update payload dismissed by data sync clusters');

            setUsers(prevUsers => 
                prevUsers.map(u => (u._id === userId || u.id === userId) ? { ...u, role: cleanRoleString } : u)
            );
            
            toast.success(`Role successfully changed to ${cleanRoleString.toUpperCase()}!`);
        } catch (error) {
            console.error("Failed to post configuration variables upstream:", error);
            toast.error('Unable to finalize role modifications across indexing paths.');
        } finally {
            setUpdatingState({ userId: null, targetRole: null });
        }
    };

    if (sessionPending) {
        return (
            <div className="h-[75vh] w-full flex items-center justify-center">
                <Spinner color="warning" size="lg" label="Synchronizing administration credentials..." />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-6">
                <Card className="bg-white border border-slate-100 shadow-xl max-w-sm w-full p-8 text-center rounded-3xl space-y-5">
                    <div className="text-6xl text-amber-500">🛡️</div>
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Protected Module</h2>
                        <p className="text-slate-500 text-sm mt-1.5">Administrative dashboard restricted to validated credentials.</p>
                    </div>
                    <Link href="/authentication/login" className="block w-full">
                        <Button className="w-full bg-slate-950 text-white font-semibold rounded-2xl h-12 shadow-sm">
                            Authenticate Account
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/40 p-4 md:p-8 text-slate-900 font-sans">
            {/* Header Identity Deck */}
            <motion.div 
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
            >
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">System Members Control</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        View index mapping paths and modify system clearance parameters. Total entries: <span className="font-bold text-slate-900">{users.length}</span>
                    </p>
                </div>
            </motion.div>

            {apiError && (
                <div className="mb-6 p-4 bg-rose-50/80 border border-rose-100 text-rose-800 rounded-2xl text-sm flex items-center gap-2 backdrop-blur-sm">
                    <span className="font-bold">⚠️ Integration Interruption:</span> Error reaching the backend data service path.
                </div>
            )}

            {/* Base Table Container Block */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
            >
                <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                    {isLoading ? (
                        <div className="w-full p-16 flex items-center justify-center">
                            <Spinner color="warning" size="lg" label="Parsing live record tables..." />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="w-full p-20 text-center text-slate-400 text-sm font-medium">
                            No profiles currently configured in this document repository collection.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse table-auto">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/70">
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email Location Address</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Current Status</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[260px]">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence mode="popLayout">
                                        {itemsOnCurrentPage.map((profile) => {
                                            const currentId = profile._id || profile.id;
                                            const normalizedRole = profile.role?.toLowerCase() || 'tenant';
                                            const isUserUpdating = updatingState.userId === currentId;

                                            return (
                                                <motion.tr 
                                                    key={currentId}
                                                    layout
                                                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4.5 whitespace-nowrap">
                                                        <p className="text-base font-bold text-slate-900 truncate max-w-[220px]">
                                                            {profile.name || 'Anonymous Platform Profile'}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-4.5 whitespace-nowrap">
                                                        <p className="text-sm text-slate-600 font-medium truncate max-w-[260px]">
                                                            {profile.email}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-4.5 text-center whitespace-nowrap">
                                                        <Chip 
                                                            size="sm" 
                                                            variant="flat" 
                                                            color={getRoleChipColor(normalizedRole)}
                                                            className="capitalize font-black tracking-wide min-w-[85px]"
                                                        >
                                                            {normalizedRole}
                                                        </Chip>
                                                    </td>

                                                    {/* FIXED HORIZONTAL DRAWER SEGMENT */}
                                                    <td className="px-6 py-4.5 whitespace-nowrap w-[260px] min-w-[260px]">
                                                        <div className="flex justify-center items-center w-full">
                                                            <div className="flex flex-row items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60 shadow-inner relative w-full max-w-[240px] h-9 overflow-hidden">
                                                                
                                                                {/* Tenant Drawer Segment */}
                                                                <button
                                                                    disabled={isUserUpdating || normalizedRole === 'tenant'}
                                                                    onClick={() => handleRoleChange(currentId, 'tenant')}
                                                                    className={`flex-1 relative z-10 px-2 py-1 text-xs font-bold rounded-lg transition-colors duration-200 text-center flex items-center justify-center h-full whitespace-nowrap ${
                                                                        normalizedRole === 'tenant' ? 'text-primary-700' : 'text-slate-500 hover:text-slate-800'
                                                                    } disabled:opacity-80 disabled:cursor-not-allowed`}
                                                                >
                                                                    {updatingState.userId === currentId && updatingState.targetRole === 'tenant' ? (
                                                                        <Spinner size="sm" color="primary" />
                                                                    ) : (
                                                                        <span>Tenant</span>
                                                                    )}
                                                                    {normalizedRole === 'tenant' && (
                                                                        <motion.div 
                                                                            layoutId={`active-drawer-${currentId}`}
                                                                            className="absolute inset-0 bg-white shadow-sm rounded-lg border border-slate-200/50 -z-10"
                                                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                                        />
                                                                    )}
                                                                </button>

                                                                {/* Owner Drawer Segment */}
                                                                <button
                                                                    disabled={isUserUpdating || normalizedRole === 'owner'}
                                                                    onClick={() => handleRoleChange(currentId, 'owner')}
                                                                    className={`flex-1 relative z-10 px-2 py-1 text-xs font-bold rounded-lg transition-colors duration-200 text-center flex items-center justify-center h-full whitespace-nowrap ${
                                                                        normalizedRole === 'owner' ? 'text-warning-700' : 'text-slate-500 hover:text-slate-800'
                                                                    } disabled:opacity-80 disabled:cursor-not-allowed`}
                                                                >
                                                                    {updatingState.userId === currentId && updatingState.targetRole === 'owner' ? (
                                                                        <Spinner size="sm" color="warning" />
                                                                    ) : (
                                                                        <span>Owner</span>
                                                                    )}
                                                                    {normalizedRole === 'owner' && (
                                                                        <motion.div 
                                                                            layoutId={`active-drawer-${currentId}`}
                                                                            className="absolute inset-0 bg-white shadow-sm rounded-lg border border-slate-200/50 -z-10"
                                                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                                        />
                                                                    )}
                                                                </button>

                                                                {/* Admin Drawer Segment */}
                                                                <button
                                                                    disabled={isUserUpdating || normalizedRole === 'admin'}
                                                                    onClick={() => handleRoleChange(currentId, 'admin')}
                                                                    className={`flex-1 relative z-10 px-2 py-1 text-xs font-bold rounded-lg transition-colors duration-200 text-center flex items-center justify-center h-full whitespace-nowrap ${
                                                                        normalizedRole === 'admin' ? 'text-danger-700' : 'text-slate-500 hover:text-slate-800'
                                                                    } disabled:opacity-80 disabled:cursor-not-allowed`}
                                                                >
                                                                    {updatingState.userId === currentId && updatingState.targetRole === 'admin' ? (
                                                                        <Spinner size="sm" color="danger" />
                                                                    ) : (
                                                                        <span>Admin</span>
                                                                    )}
                                                                    {normalizedRole === 'admin' && (
                                                                        <motion.div 
                                                                            layoutId={`active-drawer-${currentId}`}
                                                                            className="absolute inset-0 bg-white shadow-sm rounded-lg border border-slate-200/50 -z-10"
                                                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                                        />
                                                                    )}
                                                                </button>

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
                    
                    {/* Navigation Stream Pagination Nodes */}
                    {!isLoading && users.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5 px-6 border-t border-slate-100 bg-slate-50/30 w-full">
                            {/* Detailed Page Counter Label */}
                            <p className="text-xs font-semibold text-slate-500 order-2 sm:order-1">
                                Page <span className="text-slate-900 font-extrabold">{page}</span> of <span className="text-slate-900 font-extrabold">{pagesCount || 1}</span>
                            </p>
                            
                            {/* Next / Previous Control Deck */}
                            {pagesCount > 1 && (
                                <div className="flex items-center gap-3 order-1 sm:order-2">
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl shadow-sm h-9 px-3 text-xs"
                                        isDisabled={page === 1}
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    >
                                        ← Previous
                                    </Button>
                                    
                                    <Pagination
                                        isCompact
                                        radius="xl"
                                        color="warning"
                                        page={page}
                                        total={pagesCount}
                                        onChange={(newPage) => setPage(newPage)}
                                        classNames={{
                                            cursor: "bg-amber-500 text-white font-bold rounded-xl shadow-sm",
                                            item: "text-slate-600 rounded-xl bg-white border border-slate-200/60 hover:bg-slate-100/80 transition-colors"
                                        }}
                                    />

                                    <Button
                                        size="sm"
                                        variant="flat"
                                        className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl shadow-sm h-9 px-3 text-xs"
                                        isDisabled={page === pagesCount}
                                        onClick={() => setPage((prev) => Math.min(prev + 1, pagesCount))}
                                    >
                                        Next →
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}