import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserTrips } from '../services/trip.service';
import TripCard from '../components/TripCard';
import { Skeleton, Button, Tab, Tabs, Box } from '@mui/material';
import { Plus, Search } from 'lucide-react';

const UserTripsPage = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [allTrips, setAllTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0); // 0=Ongoing, 1=Upcoming, 2=Completed

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (isAuthenticated) {
                    const data = await getUserTrips();
                    setAllTrips(data);
                }
            } catch (error) {
                console.error("Failed to load user trips", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [isAuthenticated]);

    // Simple filtering logic (Mock logic since DB date filtering isn't perfect yet)
    // In a real app, backend should sort this or we compare dates carefully
    const now = new Date();
    
    const ongoingTrips = allTrips.filter(t => {
        if (!t.start_date || !t.end_date) return false;
        return new Date(t.start_date) <= now && new Date(t.end_date) >= now;
    });

    const upcomingTrips = allTrips.filter(t => {
        // If no date, assume upcoming for now or keep in a separate "draft" pile
        if (!t.start_date) return true; 
        return new Date(t.start_date) > now;
    });

    const completedTrips = allTrips.filter(t => {
        if (!t.end_date) return false;
        return new Date(t.end_date) < now;
    });

    // Map tab index to data
    const getTabTrips = () => {
        switch(tabValue) {
            case 0: return ongoingTrips.length > 0 ? ongoingTrips : upcomingTrips; // Fallback to upcoming if no ongoing for UX
            case 1: return upcomingTrips;
            case 2: return completedTrips;
            default: return allTrips;
        }
    };

    const displayTrips = getTabTrips();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <motion.div 
            className="p-6 md:p-12 min-h-screen bg-slate-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Trips</h1>
                        <p className="text-gray-500 mt-1">Manage your ongoing, upcoming, and past adventures.</p>
                    </div>
                     <Button 
                        variant="contained" 
                        startIcon={<Plus />} 
                        onClick={() => navigate('/create-trip')}
                        sx={{ borderRadius: '12px', textTransform: 'none', background: 'linear-gradient(45deg, #3B82F6, #2563EB)', padding: '10px 24px' }}
                     >
                        Plan New Trip
                    </Button>
                </div>

                {/* Search & Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                     <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', maxWidth: 500 }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="trip tabs">
                            <Tab label="Ongoing" />
                            <Tab label="Upcoming" />
                            <Tab label="Completed" />
                        </Tabs>
                    </Box>
                    <div className="relative w-full md:w-64 mr-4">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input type="text" placeholder="Search trips..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none outline-none focus:ring-2 ring-blue-100 transition-all"/>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={300} className="rounded-2xl" />)}
                    </div>
                ) : displayTrips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayTrips.map(trip => (
                            <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/${user.username}/trip/${trip.id}`)} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-300">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" alt="No trips" className="w-24 h-24 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-medium text-gray-600 mb-2">No trips found in this category</h3>
                        <p className="text-gray-400 mb-6">Time to start planning your next adventure!</p>
                        <Button variant="outlined" onClick={() => navigate('/create-trip')}>Create Trip</Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default UserTripsPage;
