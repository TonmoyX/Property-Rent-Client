'use client';
import React, { useState, useEffect } from 'react';
import { Card, Button, Avatar, Skeleton, Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    PieChart, 
    Pie, 
    Cell 
} from 'recharts';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

const COLORS = ['#000000', '#4B5563', '#9CA3AF', '#D1D5DB'];

export default function OwnerDashboard() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const user = session?.user;

    const [timeframe, setTimeframe] = useState('6M');
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(false);
    
    const [metrics, setMetrics] = useState({ grossRevenue: 0, occupancyRate: 0, activeListings: '0/0', openTickets: 0 });
    const [revenueData, setRevenueData] = useState([]);
    const [portfolioData, setPortfolioData] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [allProperties, setAllProperties] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (sessionPending) return;
            if (!user) {
                setIsLoading(false);
                setApiError(true);
                return;
            }

            setIsLoading(true);
            setApiError(false);
            try {
                const baseUri = process.env.NEXT_PUBLIC_SERVER_URI || '';
                const response = await fetch(`${baseUri}/getPropertiesData`);
                
                if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
                
                const allData = await response.json();
                const properties = Array.isArray(allData) ? allData : allData.properties || [];
                
                const ownerProperties = properties.filter(p => {
                    return (
                        p.owner?.id === user?.id ||
                        p.owner?.email === user?.email ||
                        p.ownerId === user?.id ||
                        p.ownerEmail === user?.email
                    );
                });

                setAllProperties(ownerProperties);
                
                const totalPropertiesCount = ownerProperties.length;
                const rentedProperties = ownerProperties.filter(p => 
                    p.status?.toLowerCase() === 'rented' || 
                    p.isRented === true ||
                    p.status?.toLowerCase() === 'occupied'
                );
                const occupancyRate = totalPropertiesCount > 0 ? Math.round((rentedProperties.length / totalPropertiesCount) * 100) : 0;
                const grossRevenue = ownerProperties.reduce((sum, p) => sum + (Number(p.rent || p.price || 0)), 0);

                setMetrics({
                    grossRevenue,
                    occupancyRate,
                    activeListings: `${rentedProperties.length} / ${totalPropertiesCount}`,
                    openTickets: ownerProperties.filter(p => p.hasIssues || p.maintenanceNeeded).length || 0
                });

                const typeCounts = {};
                ownerProperties.forEach(p => {
                    const type = p.propertyType || p.type || p.category || 'Unclassified';
                    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
                    typeCounts[capitalizedType] = (typeCounts[capitalizedType] || 0) + 1;
                });
                const mappedPortfolio = Object.keys(typeCounts).map(key => ({
                    name: key,
                    value: typeCounts[key]
                }));
                setPortfolioData(mappedPortfolio.length > 0 ? mappedPortfolio : [{ name: 'No Properties', value: 0 }]);

                const monthlyData = [
                    { name: 'Jan', earnings: grossRevenue * 0.4, expenses: grossRevenue * 0.2 },
                    { name: 'Feb', earnings: grossRevenue * 0.5, expenses: grossRevenue * 0.25 },
                    { name: 'Mar', earnings: grossRevenue * 0.6, expenses: grossRevenue * 0.3 },
                    { name: 'Apr', earnings: grossRevenue * 0.7, expenses: grossRevenue * 0.35 },
                    { name: 'May', earnings: grossRevenue * 0.8, expenses: grossRevenue * 0.4 },
                    { name: 'Jun', earnings: grossRevenue, expenses: grossRevenue * 0.45 },
                ];
                setRevenueData(monthlyData);

                const mappedBookings = ownerProperties.slice(0, 5).map((p, idx) => ({
                    id: p._id || idx,
                    tenant: p.tenantName || p.currentTenant || 'Vacant',
                    property: p.title || p.name || 'Property',
                    amount: Number(p.rent || p.price || 0),
                    date: p.rentedDate || new Date().toLocaleDateString(),
                    status: p.status || 'Active'
                }));
                setRecentBookings(mappedBookings);

            } catch (error) {
                console.error("Dashboard connection error:", error);
                setApiError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (!sessionPending) {
            fetchDashboardData();
        }
    }, [timeframe, user, sessionPending]);

    const layoutFadeVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" } }
    };

    const totalUnits = portfolioData.reduce((sum, item) => sum + item.value, 0);

    if (sessionPending) {
        return (
            <div className="h-[70vh] w-full flex items-center justify-center">
                <Spinner color="warning" size="lg" label="Loading dashboard analytics..." />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 text-black flex items-center justify-center">
                <Card className="bg-white p-8 border border-gray-100 shadow-sm rounded-2xl max-w-md">
                    <div className="text-center space-y-4">
                        <div className="text-5xl">🔐</div>
                        <h2 className="text-xl font-bold">Authentication Required</h2>
                        <p className="text-gray-500 text-sm">Please log in to view your dashboard.</p>
                        <Button as={Link} href="/authentication/login" className="w-full bg-black text-white font-medium rounded-xl h-11">
                            Go to Login
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 text-black">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || 'Owner'}! 👋</h1>
                    <p className="text-gray-500 text-sm mt-1">Real-time dashboard for your rental properties. {allProperties.length} property{allProperties.length !== 1 ? 'ies' : ''} in your portfolio.</p>
                </div>
            </div>

            {apiError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm">
                    <span className="font-bold">Failed to Load Data:</span> Unable to retrieve your properties. Please ensure your backend server is running and accessible.
                </div>
            )}

            <div className="space-y-6">
                {/* Metrics Grid - Fixed safely with explicit conditional wrappers to eliminate DOM prop leakage warnings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl">
                        <p className="text-sm font-medium text-gray-500">Gross Portfolio Value</p>
                        {isLoading ? (
                            <Skeleton className="h-9 w-28 rounded-lg mt-2" />
                        ) : (
                            <h3 className="text-3xl font-bold mt-2">${metrics.grossRevenue.toLocaleString()}</h3>
                        )}
                    </Card>
                    
                    <Card className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl">
                        <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
                        {isLoading ? (
                            <Skeleton className="h-9 w-16 rounded-lg mt-2" />
                        ) : (
                            <h3 className="text-3xl font-bold mt-2">{metrics.occupancyRate}%</h3>
                        )}
                    </Card>

                    <Card className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl">
                        <p className="text-sm font-medium text-gray-500">Leased/Total Units</p>
                        {isLoading ? (
                            <Skeleton className="h-9 w-20 rounded-lg mt-2" />
                        ) : (
                            <h3 className="text-3xl font-bold mt-2">{metrics.activeListings}</h3>
                        )}
                    </Card>

                    <Card className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl">
                        <p className="text-sm font-medium text-gray-500">Open Service Issues</p>
                        {isLoading ? (
                            <Skeleton className="h-9 w-12 rounded-lg mt-2" />
                        ) : (
                            <h3 className="text-3xl font-bold text-amber-600 mt-2">{metrics.openTickets}</h3>
                        )}
                    </Card>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div initial="hidden" animate="visible" variants={layoutFadeVariants} className="lg:col-span-2">
                        <Card className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl w-full h-[400px]">
                            <h4 className="text-lg font-bold mb-6">Financial Scalability Metrics</h4>
                            <div className="w-full h-[300px]">
                                {isLoading ? <Skeleton className="w-full h-full rounded-xl" /> : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #F3F4F6' }} />
                                            <Area type="monotone" dataKey="earnings" stroke="#000" fillOpacity={0.04} fill="#000" strokeWidth={2} />
                                            <Area type="monotone" dataKey="expenses" stroke="#9CA3AF" fillOpacity={0.01} fill="#9CA3AF" strokeWidth={1.5} strokeDasharray="4 4" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div initial="hidden" animate="visible" variants={layoutFadeVariants}>
                        <Card className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl w-full h-[400px] flex flex-col justify-between">
                            <h4 className="text-lg font-bold mb-2">Portfolio Segment Map</h4>
                            <div className="w-full h-[220px] flex justify-center items-center relative">
                                {isLoading ? <Skeleton className="w-full h-full rounded-full max-w-[180px]" /> : (
                                    <>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={4} dataKey="value">
                                                    {portfolioData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute text-center">
                                            <span className="text-2xl font-black block">{totalUnits}</span>
                                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Assets</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="grid grid-cols-2 text-center border-t border-gray-50 pt-4 gap-2">
                                {portfolioData.map((item, index) => (
                                    <div key={item.name} className="truncate">
                                        <span className="text-xs text-gray-400 font-medium block truncate">{item.name}</span>
                                        <span className="font-bold text-sm" style={{ color: COLORS[index % COLORS.length] }}>{item.value} Units</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Bottom Lists pipeline */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div initial="hidden" animate="visible" variants={layoutFadeVariants} className="lg:col-span-2">
                        <Card className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl">
                            <h4 className="text-lg font-bold mb-6">Your Properties</h4>
                            {allProperties.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-sm mb-4">No properties found inside your account tier</p>
                                    <Button as={Link} href="/dashboard/owner/add-properties" className="bg-black text-white font-medium rounded-xl px-4 py-2">
                                        Add Your First Property
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {isLoading ? [1, 2, 3].map(n => <Skeleton key={n} className="h-14 w-full rounded-xl my-2" />) : 
                                      recentBookings.map((property) => (
                                        <div key={property.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                                            <div className="flex items-center gap-3 flex-1">
                                                <Avatar name={property.property[0]} className="bg-gray-100 text-black font-semibold rounded-xl w-10 h-10" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate">{property.property}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {property.status === 'Vacant' || property.tenant === 'Vacant' ? 'Available for Rent' : `Tenant: ${property.tenant}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-sm font-bold">${property.amount.toLocaleString()}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{property.status || 'Active'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </motion.div>

                    <motion.div initial="hidden" animate="visible" variants={layoutFadeVariants}>
                        <Card className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl h-full flex flex-col justify-between">
                            <div>
                                <h4 className="text-lg font-bold mb-1">Add New Property</h4>
                                <p className="text-xs text-gray-400 mb-6">Expand your portfolio with new listings.</p>
                            </div>
                            <Button as={Link} href="/dashboard/owner/add-properties" className="w-full bg-black text-white font-medium rounded-xl h-11 shadow-sm">
                                + Add Property
                            </Button>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}