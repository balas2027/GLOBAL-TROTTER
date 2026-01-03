import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrip, duplicateTrip } from '../services/trip.service'; 
import { getItinerary, addSection, addActivity } from '../services/itinerary.service'; // Added addActivity
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, DollarSign, Plus, ArrowLeft, Copy as CopyIcon, Clock, MapPin, X } from 'lucide-react'; 
import { Button, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { useAuth } from '../context/AuthContext'; 

const TripDetails = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, openAuthModal } = useAuth(); 
    const [trip, setTrip] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [openActivityModal, setOpenActivityModal] = useState(false);
    const [openDayModal, setOpenDayModal] = useState(false); // New state for Day Modal
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [newActivity, setNewActivity] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        cost: 0,
        location: '',
        image_url: ''
    });
    const [newDayNotes, setNewDayNotes] = useState(''); // State for new day notes

    const loadTripData = async () => {
        try {
            const [tripData, itineraryData] = await Promise.all([
                getTrip(tripId),
                getItinerary(tripId)
            ]);
            setTrip(tripData);
            setSections(itineraryData);
        } catch (error) {
            console.error("Failed to load trip", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTripData();
    }, [tripId]);

    const handleOpenDayModal = () => {
        setNewDayNotes('');
        setOpenDayModal(true);
    };

    const handleSaveDay = async () => {
        try {
            await addSection(tripId, { description: newDayNotes });
            setOpenDayModal(false);
            loadTripData(); 
        } catch (error) {
            console.error("Failed to add section", error);
        }
    };

    const handleOpenActivityModal = (sectionId) => {
        setSelectedSectionId(sectionId);
        setNewActivity({ title: '', description: '', start_time: '', end_time: '', cost: 0, location: '', image_url: '' });
        setOpenActivityModal(true);
    };

    const handleSaveActivity = async () => {
        if (!newActivity.title) return alert("Title is required");
        try {
            await addActivity(selectedSectionId, newActivity);
            setOpenActivityModal(false);
            loadTripData();
        } catch (error) {
            console.error("Failed to add activity", error);
            alert("Failed to add activity");
        }
    };

    const handleCloneTrip = async () => {
        if (!isAuthenticated) {
            openAuthModal('signup');
            return;
        }
        if (confirm("Do you want to add this trip to your plan?")) {
            try {
                const newTrip = await duplicateTrip(trip.id);
                navigate(`/${user.username}/trip/${newTrip.id}`);
            } catch (error) {
                console.error("Failed to clone trip", error);
                alert("Failed to clone trip.");
            }
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

    if (loading) return <div className="p-10">Loading...</div>;
    if (!trip) return <div className="p-10 text-center">Trip not found.</div>;

    const isOwner = user && trip.user_id === user.id;

    return (
        <motion.div 
            className="min-h-screen bg-slate-50 p-6 md:p-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col gap-4 mb-8">
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <IconButton onClick={() => navigate('/dashboard')}><ArrowLeft /></IconButton>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{trip.title}</h1>
                                <p className="text-gray-500">{trip.visibility === 1 ? 'Public Trip' : 'Private Trip'}</p>
                            </div>
                         </div>
                         
                         {/* Action Buttons */}
                         <div className="flex gap-2">
                            {trip.visibility === 1 && !isOwner && (
                                <Button 
                                    variant="contained" 
                                    startIcon={<CopyIcon size={18} />}
                                    onClick={handleCloneTrip}
                                    sx={{ borderRadius: '12px', textTransform: 'none', background: '#10b981' }}
                                >
                                    Add to My Plan
                                </Button>
                            )}
                         </div>
                     </div>

                     {/* Trip Dates Display */}
                     <div className="flex gap-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-fit">
                        <div className="flex items-center gap-2 text-gray-700">
                             <Calendar size={18} className="text-blue-500" />
                             <span className="font-medium">Start:</span> {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'}
                        </div>
                        <div className="w-px bg-gray-200"></div>
                        <div className="flex items-center gap-2 text-gray-700">
                             <Calendar size={18} className="text-pink-500" />
                             <span className="font-medium">End:</span> {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : 'TBD'}
                        </div>
                     </div>
                </motion.div>

                {/* Sections List */}
                <div className="space-y-6">
                    {sections.length === 0 && <p className="text-gray-400 text-center py-4">No days added yet. Start planning!</p>}
                    
                    {sections.map((section, index) => (
                        <motion.div 
                            key={section.id} 
                            variants={itemVariants}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-2">
                                <h3 className="text-xl font-bold text-gray-800">Day {section.day_number}</h3>
                                {isOwner && (
                                     <Button 
                                        size="small" 
                                        startIcon={<Plus size={16}/>} 
                                        onClick={() => handleOpenActivityModal(section.id)}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Add Activity
                                    </Button>
                                )}
                            </div>
                            
                            <p className="text-gray-600 mb-6 italic">{section.notes || "No notes for this day."}</p>

                            {/* Activities List */}
                            <div className="space-y-3">
                                {section.activities && section.activities.map(activity => (
                                    <div key={activity.id} className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                                         <div className="flex flex-col items-center justify-center bg-white w-16 h-16 rounded-lg shadow-sm border border-gray-100">
                                             <span className="text-xs font-bold text-gray-500">{activity.start_time || '--:--'}</span>
                                             <div className="h-px w-8 bg-gray-200 my-1"></div>
                                             <span className="text-xs font-bold text-gray-400">{activity.end_time || '--:--'}</span>
                                         </div>
                                         <div className="flex-1">
                                             <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-800">{activity.title}</h4>
                                                {activity.cost > 0 && <span className="text-sm font-medium text-green-600">${activity.cost}</span>}
                                             </div>
                                             {activity.location && (
                                                <div className="flex items-center gap-1 text-xs text-blue-500 mb-1">
                                                    <MapPin size={12}/> {activity.location}
                                                </div>
                                             )}
                                             
                                             <div className="flex gap-3 mt-2">
                                                 {activity.image_url && (
                                                     <img src={activity.image_url} alt={activity.title} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                                                 )}
                                                 <p className="text-sm text-gray-600">{activity.description}</p>
                                             </div>
                                         </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {/* Add Day Button - Only Owner */}
                    {isOwner && (
                        <motion.div variants={itemVariants}>
                            <Button 
                                fullWidth
                                variant="outlined" 
                                startIcon={<Plus />}
                                onClick={handleOpenDayModal}
                                sx={{ 
                                    borderRadius: '16px', 
                                    borderStyle: 'dashed', 
                                    borderWidth: '2px', 
                                    height: '64px',
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    color: '#64748b',
                                    borderColor: '#cbd5e1',
                                    '&:hover': { borderColor: '#3b82f6', color: '#3b82f6',  backgroundColor: '#eff6ff'}
                                }}
                            >
                                Add Day
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Add Activity Modal */}
            <Dialog open={openActivityModal} onClose={() => setOpenActivityModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
                <DialogTitle className="font-bold text-gray-800">Add New Activity</DialogTitle>
                <DialogContent>
                    <div className="flex flex-col gap-4 mt-2">
                        <TextField 
                            label="Activity Title" 
                            fullWidth 
                            variant="outlined" 
                            value={newActivity.title}
                            onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                        />
                         <TextField 
                            label="Description" 
                            fullWidth 
                            multiline
                            rows={3}
                            variant="outlined" 
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                        />
                        <div className="flex gap-4">
                            <TextField 
                                label="Start Time" 
                                type="time"
                                fullWidth 
                                InputLabelProps={{ shrink: true }}
                                value={newActivity.start_time}
                                onChange={(e) => setNewActivity({...newActivity, start_time: e.target.value})}
                            />
                            <TextField 
                                label="End Time" 
                                type="time"
                                fullWidth 
                                InputLabelProps={{ shrink: true }}
                                value={newActivity.end_time}
                                onChange={(e) => setNewActivity({...newActivity, end_time: e.target.value})}
                            />
                        </div>
                        <TextField 
                            label="Location" 
                            fullWidth 
                            variant="outlined" 
                            value={newActivity.location}
                            onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                        />
                         <TextField 
                            label="Image URL" 
                            fullWidth 
                            variant="outlined" 
                            value={newActivity.image_url}
                            onChange={(e) => setNewActivity({...newActivity, image_url: e.target.value})} 
                        />
                         <TextField 
                            label="Estimated Cost ($)" 
                            type="number"
                            fullWidth 
                            value={newActivity.cost}
                            onChange={(e) => setNewActivity({...newActivity, cost: e.target.value})}
                        />
                    </div>
                </DialogContent>
                <DialogActions sx={{ padding: '20px' }}>
                    <Button onClick={() => setOpenActivityModal(false)} sx={{ color: 'gray', textTransform:'none' }}>Cancel</Button>
                    <Button onClick={handleSaveActivity} variant="contained" sx={{ borderRadius: '10px', textTransform:'none' }}>Save Activity</Button>
                </DialogActions>
            </Dialog>

             {/* Add Day Modal */}
             <Dialog open={openDayModal} onClose={() => setOpenDayModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
                <DialogTitle className="font-bold text-gray-800">Add New Day</DialogTitle>
                <DialogContent>
                    <div className="flex flex-col gap-4 mt-4">
                        <p className="text-gray-500 mb-2">Create a new day for your itinerary. You can add a main theme or notes.</p>
                        <TextField 
                            label="Day Focus / Notes" 
                            fullWidth 
                            multiline
                            rows={4}
                            variant="outlined" 
                            placeholder="e.g., City Tour and Museums"
                            value={newDayNotes}
                            onChange={(e) => setNewDayNotes(e.target.value)}
                        />
                    </div>
                </DialogContent>
                <DialogActions sx={{ padding: '20px' }}>
                    <Button onClick={() => setOpenDayModal(false)} sx={{ color: 'gray', textTransform:'none' }}>Cancel</Button>
                    <Button onClick={handleSaveDay} variant="contained" sx={{ borderRadius: '10px', textTransform:'none' }}>Add Day</Button>
                </DialogActions>
            </Dialog>

        </motion.div>
    );
};

export default TripDetails;
