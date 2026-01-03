import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { getUserTrips, getDestinations, getPublicTrips } from '../services/trip.service';
import { Search, Map, Calendar, Users, SlidersHorizontal, Plus, Filter, ArrowUpDown } from 'lucide-react';
import TripCard from '../components/TripCard';
import { Button, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, isAuthenticated, openAuthModal } = useAuth();
    const [trips, setTrips] = useState([]); // Public/Community Trips
    const [userTrips, setUserTrips] = useState([]); // Private User Trips
    const [topDestinations, setTopDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Public Trips (Always)
                const publicTripsData = await getPublicTrips();
                setTrips(publicTripsData);

                // 2. Fetch User Trips (If Auth)
                if (isAuthenticated) {
                    const myTrips = await getUserTrips();
                    setUserTrips(myTrips);
                } else {
                    setUserTrips([]);
                }

                // 3. Fetch Destinations
                const destData = await getDestinations();
                setTopDestinations(destData);

            } catch (error) {
                console.error("Error loading dashboard data", error);
                toast.error("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [isAuthenticated]); // Reload when auth state changes

    const handleCreateTrip = () => {
        if (!isAuthenticated) {
            openAuthModal('signup');
        } else {
            navigate('/create-trip');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            className="min-h-screen bg-slate-50 relative pb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero / Banner Section */}
            <motion.div variants={itemVariants} className="relative w-full h-[450px] bg-dark overflow-hidden rounded-b-[3rem] shadow-2xl mb-12">
                 <img 
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80" 
                    alt="Hero" 
                    className="w-full h-full object-cover opacity-60"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent" />
                 
                 <div className="absolute bottom-16 left-0 right-0 px-6 md:px-12 max-w-6xl mx-auto text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        {isAuthenticated ? `Welcome back, ${user?.username || 'Traveler'}!` : <>Explore the <span className="text-blue-400">Unseen</span> <br/> World with Vibe.</>}
                    </h1>

                    {/* Search Bar - Wireframe Style */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl w-full flex flex-col md:flex-row items-center shadow-lg gap-2">
                         <div className="flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-white/20 py-2">
                            <label className="block text-xs text-gray-300 uppercase tracking-wider mb-1 flex items-center gap-1"><Map size={12}/> Location</label>
                            <input type="text" placeholder="Where to?" className="w-full bg-transparent text-white placeholder-gray-400 outline-none font-medium" />
                         </div>
                         <div className="flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-white/20 py-2">
                            <label className="block text-xs text-gray-300 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar size={12}/> Date</label>
                            <input type="text" placeholder="Add dates" className="w-full bg-transparent text-white placeholder-gray-400 outline-none font-medium" />
                         </div>
                         <div className="flex-1 w-full px-4 py-2">
                            <label className="block text-xs text-gray-300 uppercase tracking-wider mb-1 flex items-center gap-1"><Users size={12}/> Guests</label>
                            <input type="text" placeholder="Add guests" className="w-full bg-transparent text-white placeholder-gray-400 outline-none font-medium" />
                         </div>
                         <button onClick={() => navigate('/search')} className="bg-primary hover:bg-blue-600 text-white rounded-xl p-4 shadow-lg shadow-blue-500/50 transition-all w-full md:w-auto">
                             <Search size={24} />
                         </button>
                    </div>
                 </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
                
                {/* Top Regional Selections */}
                <motion.section variants={itemVariants}>
                    <div className="flex justify-between items-end mb-6">
                         <h2 className="text-2xl font-bold text-gray-800">Top Regional Selections</h2>
                         <Button onClick={() => navigate('/search')} sx={{textTransform:'none'}}>See All</Button>
                    </div>
                   
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topDestinations.map(dest => (
                             <motion.div 
                                whileHover={{ scale: 1.05 }}
                                key={dest.id} 
                                className="relative group rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-md hover:shadow-xl transition-all"
                                onClick={() => navigate('/search')}
                             >
                                <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">{dest.name}</h3>
                                    <p className="text-sm opacity-90">{dest.country}</p>
                                </div>
                             </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Shortcuts / Quick Actions */}
                <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Community Promo */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer" onClick={() => navigate('/community')}>
                        <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform">
                            <Users size={120} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-2">Join the Community</h3>
                            <p className="mb-6 max-w-sm opacity-90">Explore thousands of itineraries shared by travelers worldwide. Find your next inspiration.</p>
                            <Button variant="contained" sx={{ bgcolor: 'white', color: '#4F46E5', '&:hover': { bgcolor: '#f1f5f9' }, borderRadius: '12px', textTransform:'none' }}>
                                Explore Community
                            </Button>
                        </div>
                    </div>

                    {/* My Trips Promo */}
                     <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer" onClick={() => navigate(isAuthenticated ? '/my-trips' : '/login')}>
                        <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform">
                            <Map size={120} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-2">Plan Your Adventure</h3>
                            <p className="mb-6 max-w-sm opacity-90">Create, organize, and manage your trips with our powerful itinerary builder.</p>
                             <Button onClick={(e) => { e.stopPropagation(); isAuthenticated ? navigate('/create-trip') : openAuthModal('signup'); }} variant="contained" startIcon={<Plus />} sx={{ bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, borderRadius: '12px', textTransform:'none' }}>
                                Create New Trip
                            </Button>
                        </div>
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
};

export default Dashboard;

