import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../services/trip.service';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Save, Calendar, Map, DollarSign, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateTrip = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    
    const { user } = useAuth();
    const isAdmin = user?.username === 'admin' || user?.username === 'admin_traveler';

    // Suggestion Places from Wireframe Screen 4
    const suggestions = [
        { name: 'Paris, France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=300' },
        { name: 'Bali, Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=300' },
        { name: 'New York, USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4a0e29f16e?auto=format&fit=crop&q=80&w=300' },
        { name: 'Tokyo, Japan', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=300' },
    ];
    
    // Sample images for quick selection (Premium/Vibe feeling)
    const presetImages = [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&w=1350&q=80', // Mountains (Swiss)
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&w=1350&q=80', // Beach (Tropical)
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&w=1350&q=80', // City (Tokyo/Neon)
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&w=1350&q=80', // Forest/Nature
    ];

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        budget_limit: '',
        cover_image: presetImages[0], 
        visibility: '0' // Default Private (string '0' will be parsed as int)
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageSelect = (img) => {
        setFormData({ ...formData, cover_image: img });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createTrip(formData);
            showToast('Trip created successfully!', 'success');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            showToast('Failed to create trip. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            className="min-h-screen bg-slate-50 p-6 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Plan a New Adventure</h1>
                    <p className="text-gray-500">Start organizing your dream trip today.</p>
                </div>

                <div className="glass-panel p-8 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label>
                            <input 
                                required
                                name="title"
                                type="text" 
                                placeholder="e.g. Summer in Santorini"
                                className="input-field"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Dates Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input 
                                        required
                                        name="start_date"
                                        type="date" 
                                        className="input-field !pl-12"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input 
                                        required
                                        name="end_date"
                                        type="date" 
                                        className="input-field !pl-12"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        min={formData.start_date} // Cannot end before start
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Suggestion Section (Wireframe Item) */}
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-3">Suggestion for Places to Visit</label>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                 {suggestions.map((s, idx) => (
                                     <div key={idx} className="relative rounded-lg overflow-hidden h-24 cursor-pointer group" onClick={() => setFormData({...formData, title: `Trip to ${s.name}`})}>
                                         <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                             <span className="text-white text-xs font-bold text-center px-1">{s.name}</span>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                            <textarea 
                                name="description"
                                rows="3" 
                                placeholder="Brief overview of what you want to do..."
                                className="input-field"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Budget */}
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget</label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                <input 
                                    name="budget_limit"
                                    type="number" 
                                    placeholder="0.00"
                                    className="input-field !pl-12"
                                    value={formData.budget_limit}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Cover Image Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Choose a Cover Theme</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                {presetImages.map((img, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => handleImageSelect(img)}
                                        className={`cursor-pointer rounded-lg overflow-hidden h-24 border-2 transition-all ${formData.cover_image === img ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-transparent hover:opacity-80'}`}
                                    >
                                        <img src={img} alt="Theme" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                             
                             {/* Custom Image URL */}
                             <div className="relative">
                                <ImageIcon size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                <input 
                                    name="cover_image"
                                    type="text" 
                                    placeholder="Or paste a custom image URL..."
                                    className="input-field !pl-12"
                                    value={formData.cover_image}
                                    onChange={handleChange}
                                />
                             </div>
                        </div>


                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                             <select 
                                name="visibility" 
                                value={formData.visibility} 
                                onChange={handleChange} 
                                className="input-field" 
                                disabled={!isAdmin}
                             >
                                 <option value="0">Private (Only Me)</option>
                                 {isAdmin && <option value="1">Public (Community)</option>}
                             </select>
                             {!isAdmin && <p className="text-xs text-gray-400 mt-1">Only admins can create public community trips.</p>}
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn-primary w-auto px-8 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Creating...' : (
                                    <>
                                        <Save size={20} /> Create Trip
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default CreateTrip;
