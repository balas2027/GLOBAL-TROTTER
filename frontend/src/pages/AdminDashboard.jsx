import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Users, Map, Activity, TrendingUp, Trash2, Plus, BadgeCheck } from 'lucide-react';
import { Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [stats, setStats] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [tripTrends, setTripTrends] = useState([]);
    const [popularCities, setPopularCities] = useState([]);
    const [publicTrips, setPublicTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!user) return;
            
            try {
                const [statsRes, usersRes, trendsRes, citiesRes, tripsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/stats', config),
                    axios.get('http://localhost:5000/api/admin/users', config),
                    axios.get('http://localhost:5000/api/admin/trends/trips', config),
                    axios.get('http://localhost:5000/api/admin/popular/cities', config),
                    axios.get('http://localhost:5000/api/admin/trips', config)
                ]);

                setStats(statsRes.data);
                setUsersList(usersRes.data);
                setTripTrends(trendsRes.data);
                setPopularCities(citiesRes.data);
                setPublicTrips(tripsRes.data);
            } catch (error) {
                console.error("Error loading admin data", error);
                setError("Failed to load admin dashboard data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (user && (user.username === 'admin' || user.username === 'admin_traveler')) {
            fetchAdminData();
        } else {
             setLoading(false);
        }
    }, [user]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleDeleteTrip = async () => {
        if (!tripToDelete) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/trips/${tripToDelete.id}`, config);
            setPublicTrips(prev => prev.filter(t => t.id !== tripToDelete.id));
            // Update stats
            if(stats) setStats(prev => ({...prev, total_trips: prev.total_trips - 1}));
        } catch (err) {
            console.error("Failed to delete trip", err);
        } finally {
            setDeleteDialogOpen(false);
            setTripToDelete(null);
        }
    };

    const openDeleteDialog = (trip) => {
        setTripToDelete(trip);
        setDeleteDialogOpen(true);
    };

    if (!user || (user.username !== 'admin' && user.username !== 'admin_traveler')) {
        return <div className="p-12 text-center text-red-500 font-bold">Unauthorized Access</div>;
    }

    if (loading) return <div className="p-12 text-center text-white bg-slate-900 min-h-screen">Loading Analytics...</div>;
    if (error) return <div className="p-12 text-center text-red-400 bg-slate-900 min-h-screen">{error}</div>;

    return (
        <div className="p-6 md:p-12 min-h-screen bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 border-b border-gray-700 pb-4">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">System Analytics & Content Management</p>
                </header>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} textColor="inherit" indicatorColor="primary">
                        <Tab label="Overview & Analytics" />
                        <Tab label="Manage Users" />
                        <Tab label="Manage Public Trips" />
                    </Tabs>
                </Box>

                {/* TAB 0: ANALYTICS */}
                {tabValue === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        {/* KPI Cards - Clickable */}
                        {stats && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <EventCard title="Total Users" value={stats.total_users} icon={<Users className="text-blue-400"/>} onClick={() => setTabValue(1)} />
                                <EventCard title="Total Trips" value={stats.total_trips} icon={<Map className="text-green-400"/>} onClick={() => setTabValue(2)} />
                                <EventCard title="Active Trips" value={stats.active_trips} icon={<Activity className="text-yellow-400"/>} onClick={() => setTabValue(2)} />
                                <EventCard title="Completed" value={stats.completed_trips} icon={<TrendingUp className="text-purple-400"/>} onClick={() => setTabValue(2)} />
                            </div>
                        )}

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
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#3b82f6' }}>{row.username?.[0]?.toUpperCase()}</Avatar>
                                                    {row.username}
                                                </div>
                                            </TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>
                                                 {row.username === 'admin' || row.username === 'admin_traveler' ? <Chip label="Admin" color="secondary" size="small" /> : <Chip label="User" color="primary" variant="outlined" size="small" />}
                                            </TableCell>
                                            <TableCell>Active</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </motion.div>
                )}

                {/* TAB 2: PUBLIC TRIPS */}
                {tabValue === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Public Trips ({publicTrips.length})</h2>
                            <Button 
                                variant="contained" 
                                startIcon={<Plus size={18}/>}
                                onClick={() => navigate('/create-trip')}
                                sx={{ bgcolor: '#3b82f6' }}
                            >
                                Create Official Trip
                            </Button>
                        </div>
                        <TableContainer component={Paper} sx={{ bgcolor: '#1e293b', color: 'white' }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: '#94a3b8' }}>Title</TableCell>
                                        <TableCell sx={{ color: '#94a3b8' }}>Author</TableCell>
                                        <TableCell sx={{ color: '#94a3b8' }}>Dates</TableCell>
                                        <TableCell sx={{ color: '#94a3b8' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {publicTrips.map((trip) => {
                                        const isOfficial = trip.author?.username === 'admin';
                                        return (
                                            <TableRow key={trip.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& td': { color: 'white' } }}>
                                                <TableCell>{trip.title}</TableCell>
                                                <TableCell>
                                                    {isOfficial ? (
                                                        <div className="flex items-center gap-1 text-blue-400">
                                                            <BadgeCheck size={16} /> VibeHolidays
                                                        </div>
                                                    ) : (
                                                        trip.author?.username || 'N/A'
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {trip.start_date || 'TBD'} - {trip.end_date || 'TBD'}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => openDeleteDialog(trip)}
                                                        sx={{ color: '#ef4444' }}
                                                    >
                                                        <Trash2 size={18}/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </motion.div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the trip "{tripToDelete?.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteTrip} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const EventCard = ({ title, value, icon, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-700 transition-colors"
    >
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
