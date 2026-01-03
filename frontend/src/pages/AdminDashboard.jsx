import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Users, Map, Activity, TrendingUp } from 'lucide-react';
import { Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [stats, setStats] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [tripTrends, setTripTrends] = useState([]);
    const [popularCities, setPopularCities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            try {
                const [statsRes, usersRes, trendsRes, citiesRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/stats', config),
                    axios.get('http://localhost:5000/api/admin/users', config),
                    axios.get('http://localhost:5000/api/admin/trends/trips', config),
                    axios.get('http://localhost:5000/api/admin/popular/cities', config)
                ]);

                setStats(statsRes.data);
                setUsersList(usersRes.data);
                setTripTrends(trendsRes.data);
                setPopularCities(citiesRes.data);
            } catch (error) {
                console.error("Error loading admin data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.username === 'admin_traveler') {
            fetchAdminData();
        }
    }, [user]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (!user || user.username !== 'admin_traveler') {
        return <div className="p-12 text-center text-red-500 font-bold">Unauthorized Access</div>;
    }

    if (loading) return <div className="p-12 text-center">Loading Analytics...</div>;

    return (
        <div className="p-6 md:p-12 min-h-screen bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 border-b border-gray-700 pb-4">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">System Analytics & User Management</p>
                </header>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} textColor="inherit" indicatorColor="primary">
                        <Tab label="Overview & Analytics" />
                        <Tab label="Manage Users" />
                    </Tabs>
                </Box>

                {/* TAB 0: ANALYTICS */}
                {tabValue === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <EventCard title="Total Users" value={stats.total_users} icon={<Users className="text-blue-400"/>} />
                            <EventCard title="Total Trips" value={stats.total_trips} icon={<Map className="text-green-400"/>} />
                            <EventCard title="Active Trips" value={stats.active_trips} icon={<Activity className="text-yellow-400"/>} />
                            <EventCard title="Completed" value={stats.completed_trips} icon={<TrendingUp className="text-purple-400"/>} />
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                <h3 className="text-xl font-semibold mb-6">Trip Creation Trends</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={tripTrends}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="name" stroke="#9CA3AF" />
                                            <YAxis stroke="#9CA3AF" />
                                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                                            <Line type="monotone" dataKey="trips" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                <h3 className="text-xl font-semibold mb-6">Top Destinations</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                         <PieChart>
                                            <Pie
                                                data={popularCities}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {popularCities.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* TAB 1: USERS */}
                {tabValue === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <TableContainer component={Paper} sx={{ bgcolor: '#1e293b', color: 'white' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: '#94a3b8' }}>User</TableCell>
                                        <TableCell sx={{ color: '#94a3b8' }}>Email</TableCell>
                                        <TableCell sx={{ color: '#94a3b8' }}>Role</TableCell>
                                        <TableCell sx={{ color: '#94a3b8' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usersList.map((row) => (
                                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& td': { color: 'white' } }}>
                                            <TableCell component="th" scope="row">
                                                <div className="flex items-center gap-3">
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#3b82f6' }}>{row.username[0].toUpperCase()}</Avatar>
                                                    {row.username}
                                                </div>
                                            </TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>
                                                 {row.username === 'admin_traveler' ? <Chip label="Admin" color="secondary" size="small" /> : <Chip label="User" color="primary" variant="outlined" size="small" />}
                                            </TableCell>
                                            <TableCell>Active</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const EventCard = ({ title, value, icon }) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center justify-between">
        <div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-slate-700 rounded-xl">
            {icon}
        </div>
    </div>
);

export default AdminDashboard;
