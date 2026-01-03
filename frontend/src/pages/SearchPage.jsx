import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Compass, Palmtree, Mountain, Building2, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPublicTrips, getDestinations } from '../services/trip.service';
import TripCard from '../components/TripCard';
import { Skeleton } from '@mui/material';

const CATEGORIES = [
    { id: 'all', label: 'All', icon: Compass },
    { id: 'beach', label: 'Beaches', icon: Palmtree },
    { id: 'mountain', label: 'Mountains', icon: Mountain },
    { id: 'city', label: 'Cities', icon: Building2 },
    { id: 'food', label: 'Culinary', icon: Utensils },
];

const SearchPage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [trips, setTrips] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [tripsData, destsData] = await Promise.all([
                    getPublicTrips(),
                    getDestinations()
                ]);
                setTrips(tripsData);
                setFilteredTrips(tripsData);
                setDestinations(destsData);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = trips;

        // 1. Filter by Search Query
        if (query) {
            const lowerQ = query.toLowerCase();
            result = result.filter(t => 
                t.title.toLowerCase().includes(lowerQ) || 
                t.description?.toLowerCase().includes(lowerQ)
            );
        }

        // 2. Filter by Category
        if (activeCategory !== 'all') {
            const keywords = {
                'beach': ['beach', 'sea', 'ocean', 'bali', 'island'],
                'mountain': ['mountain', 'hike', 'alps', 'ski', 'climb', 'kyoto'], 
                'city': ['city', 'paris', 'tokyo', 'new york', 'urban'],
                'food': ['food', 'culinary', 'eat', 'dinner', 'tasting']
            };
            
            // Also try to match against destination category if available in trip tags? 
            // For now, string matching on title/desc is the robust way given current data.
            const catWords = keywords[activeCategory] || [];
            result = result.filter(t => {
                const text = (t.title + ' ' + (t.description || '')).toLowerCase();
                return catWords.some(w => text.includes(w));
            });
        }

        setFilteredTrips(result);
    }, [query, activeCategory, trips]);

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="min-h-screen bg-slate-50 relative"
        >
            {/* HERO SECTION */}
            <div className="relative text-white pt-24 pb-32 px-6 rounded-b-[40px] shadow-xl overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1920&q=80" 
                        alt="World Exploring" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-xl">Explore the World</h1>
                    <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto drop-shadow-md">Discover community-curated itineraries for your next dream vacation.</p>
                    
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-5 top-4 text-gray-400" size={24} />
                        <input 
                            type="text" 
                            placeholder="Where do you want to go?" 
                            className="w-full py-4 pl-14 pr-6 rounded-full bg-white text-gray-800 shadow-2xl text-lg focus:ring-4 focus:ring-blue-400/50 outline-none placeholder:text-gray-400 transition-all"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                {/* POPULAR DESTINATIONS */}
                <h3 className="text-white font-semibold text-lg mb-4 ml-2 drop-shadow-md">Trending Destinations</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {destinations.slice(0, 4).map(dest => (
                        <motion.div 
                            key={dest.id}
                            whileHover={{ y: -5 }}
                            className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer shadow-xl bg-gray-200"
                            onClick={() => setQuery(dest.name)}
                        >
                            <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                                <span className="text-white font-bold flex items-center gap-1">
                                    <MapPin size={14} className="text-blue-400" /> {dest.name}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CATEGORIES */}
                <div className="flex gap-4 overflow-x-auto pb-6 mb-4 hide-scrollbar justify-start md:justify-center">
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shadow-sm whitespace-nowrap
                                    ${isActive 
                                        ? 'bg-blue-600 text-white shadow-blue-200 ring-2 ring-blue-600 ring-offset-2' 
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={18} />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* RESULTS GRID */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={350} className="rounded-2xl" />)}
                    </div>
                ) : (
                    <div className="mb-20">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {filteredTrips.length} Adventures Found
                        </h2>
                        {filteredTrips.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTrips.map(trip => (
                                    <TripCard 
                                        key={trip.id} 
                                        trip={trip} 
                                        onClick={() => navigate(`/trip/${trip.id}`)}
                                        // Pass onClone logic similar to CommunityPage if needed, or keeping it strictly "Explore"
                                    />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                <Compass size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-600">No adventures found</h3>
                                <p className="text-gray-400">Try adjusting your search or category.</p>
                                <button onClick={() => { setQuery(''); setActiveCategory('all'); }} className="mt-4 text-blue-600 font-medium hover:underline">Clear all filters</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SearchPage;
