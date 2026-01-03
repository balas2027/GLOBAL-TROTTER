import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTrips } from '../services/trip.service';
import { getProfile } from '../services/auth.service';
import TripCard from '../components/TripCard';
import { Search, Plus, Map, Filter, SlidersHorizontal } from 'lucide-react';
import { Button, IconButton, TextField, InputAdornment, Skeleton } from '@mui/material';

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [topDestinations, setTopDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const profile = await getProfile();
                setUser(profile);
                const [tripData, destData] = await Promise.all([
                    getUserTrips(),
                    getDestinations() // Fetch seeded destinations
                ]);
                setTrips(tripData);
                setTopDestinations(destData);
            } catch (error) {
                console.error("Error loading dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleVideoClick = (dest) => {
       // Placeholder checks if it's a "trip" or a "destination"
       // For now, destinations don't have detail pages, so we do nothing or navigate to a search
       console.log("Clicked destination:", dest);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20">
            {/* Hero / Banner Section */}
            <div className="relative w-full h-[400px] bg-dark overflow-hidden rounded-b-[3rem] shadow-2xl">
                 <img 
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80" 
                    alt="Hero" 
                    className="w-full h-full object-cover opacity-60"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent" />
                 
                 <div className="absolute bottom-16 left-0 right-0 px-6 md:px-12 max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                        Explore the <span className="text-blue-400">Unseen</span> <br/>
                        World with Vibe.
                    </h1>
                    <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-8">
                        Plan and book your perfect trip with expert advice, destination tips, and inspiration from us.
                    </p>

                    {/* Search Bar - Floating */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl w-full max-w-3xl flex items-center shadow-lg">
                         <div className="flex-1 px-4 border-r border-white/20">
                            <label className="block text-xs text-gray-300 uppercase tracking-wider mb-1">Location</label>
                            <input type="text" placeholder="Where to?" className="w-full bg-transparent text-white placeholder-gray-400 outline-none font-medium" />
                         </div>
                         <div className="flex-1 px-4 border-r border-white/20">
                            <label className="block text-xs text-gray-300 uppercase tracking-wider mb-1">Date</label>
                            <input type="text" placeholder="Add dates" className="w-full bg-transparent text-white placeholder-gray-400 outline-none font-medium" />
                         </div>
                         <div className="flex-1 px-4">
                            <label className="block text-xs text-gray-300 uppercase tracking-wider mb-1">Guests</label>
                            <input type="text" placeholder="Add guests" className="w-full bg-transparent text-white placeholder-gray-400 outline-none font-medium" />
                         </div>
                         <button className="bg-primary hover:bg-blue-600 text-white rounded-xl p-4 shadow-lg shadow-blue-500/50 transition-all">
                             <Search size={24} />
                         </button>
                    </div>
                 </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 space-y-16">
                
                {/* Categories / Top Selections */}
                <section>
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Top Regional Selections</h2>
                            <p className="text-gray-500 mt-1">Sought-after destinations just for you</p>
                        </div>
                        <div className="flex gap-2">
                             <Button variant="outlined" startIcon={<SlidersHorizontal size={16}/>} sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b' }}>Filters</Button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topDestinations.map(dest => (
                             <div key={dest.id} className="relative group rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-md hover:shadow-xl transition-all">
                                <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">{dest.name}</h3>
                                    <p className="text-sm opacity-90">{dest.country}</p>
                                </div>
                             </div>
                        ))}
                    </div>
                </section>

                {/* My Trips */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Map className="text-primary" /> My Trips
                         </h2>
                         <Button 
                            variant="contained" 
                            startIcon={<Plus />} 
                            onClick={() => navigate('/create-trip')}
                            sx={{ borderRadius: '12px', textTransform: 'none', background: 'linear-gradient(45deg, #3B82F6, #2563EB)', boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}
                         >
                            Plan a New Trip
                         </Button>
                    </div>

                    {loading ? (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={300} className="rounded-2xl" />)}
                         </div>
                    ) : trips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {trips.map(trip => (
                                <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/${user.username}/trip/${trip.id}`)} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                            <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" alt="No trips" className="w-24 h-24 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-medium text-gray-600 mb-2">No trips planned yet</h3>
                            <p className="text-gray-400 mb-6">Start your adventure today by creating your first itinerary.</p>
                            <Button variant="outlined" onClick={() => navigate('/create-trip')}>Create Trip</Button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
