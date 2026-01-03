import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicTrips, duplicateTrip } from '../services/trip.service';
import TripCard from '../components/TripCard';
import { Skeleton } from '@mui/material';
import FilterSortBar from '../components/FilterSortBar';

const CommunityPage = () => {
    const { isAuthenticated, openAuthModal, user } = useAuth(); // Added user
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await getPublicTrips();
                setTrips(data);
                setFilteredTrips(data);
            } catch (error) {
                console.error("Failed to load community trips", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleClone = async (trip) => {
        if (!isAuthenticated) {
            openAuthModal('signup');
            return;
        }
        if (confirm(`Do you want to add "${trip.title}" to your plans?`)) {
            try {
                const newTrip = await duplicateTrip(trip.id);
                navigate(`/${user.username}/trip/${newTrip.id}`);
            } catch (error) {
                console.error("Failed to clone trip", error);
                alert("Failed to add trip to your plan.");
            }
        }
    };

    const handleFilter = (filters) => {
        const { minBudget, maxBudget, minDistance, maxDistance } = filters;
        const result = trips.filter(trip => {
            const cost = trip.budget_limit || 0;
            const dist = trip.distance || 0;
            return cost >= minBudget && cost <= maxBudget && dist >= minDistance && dist <= maxDistance;
        });
        setFilteredTrips(result);
    };

    const handleSort = (type) => {
        let sorted = [...filteredTrips];
        if (type === 'price_asc') sorted.sort((a,b) => (a.budget_limit || 0) - (b.budget_limit || 0));
        if (type === 'price_desc') sorted.sort((a,b) => (b.budget_limit || 0) - (a.budget_limit || 0));
        if (type === 'dist_asc') sorted.sort((a,b) => (a.distance || 0) - (b.distance || 0));
        if (type === 'date_new') sorted.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        setFilteredTrips(sorted);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <motion.div 
            className="p-6 md:p-12 min-h-screen bg-slate-50"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Community Board</h1>
                        <p className="text-gray-500 mt-1">Discover itineraries shared by fellow travelers.</p>
                    </div>
                    
                    <FilterSortBar onFilter={handleFilter} onSort={handleSort} />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} variant="rectangular" height={300} className="rounded-2xl" />
                        ))}
                    </div>
                ) : filteredTrips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTrips.map(trip => (
                            <TripCard 
                                key={trip.id} 
                                trip={trip} 
                                onClone={handleClone} // Passed onClone prop
                                onClick={() => {
                                    // Navigate to public view
                                    navigate(`/trip/${trip.id}`);
                                }} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="w-full text-center py-20 text-gray-500 bg-white rounded-2xl border border-dashed">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" alt="No trips" className="w-24 h-24 mx-auto mb-4 opacity-30" />
                        <h3 className="text-lg font-medium">No community trips found</h3>
                        <p>Be the first to share your adventure!</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CommunityPage;
