import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserTrips } from '../services/trip.service';
import { updateProfile } from '../services/auth.service';
import { User, Mail, Map, Calendar, Settings, LogOut, Edit2, Sliders } from 'lucide-react';
import { Avatar, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Checkbox, Switch } from '@mui/material';

const UserProfilePage = () => {
    const { user, login, logout } = useAuth(); // login used to update context user if needed, but context might not expose setUser. actually updateProfile in service updates localStorage, but context state might drift.
    // Ideally we would trigger a reload or context update. AuthContext usually reads from localstorage on init.
    // For now we will manually update local stats or rely on re-render.
    
    const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, ongoing: 0 });
    const [loading, setLoading] = useState(true);
    
    // Modals
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openPrefModal, setOpenPrefModal] = useState(false);
    const [openSettingsModal, setOpenSettingsModal] = useState(false);

    // Form Stats
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', bio: '', phone: '' });
    const [prefForm, setPrefForm] = useState({ dietary: [], interests: [] }); // We will store this as JSON string in 'preferences' column

    useEffect(() => {
        if (user) {
            setEditForm({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                bio: user.bio || '',
                phone: user.phone || ''
            });

            if (user.preferences) {
                try {
                    setPrefForm(JSON.parse(user.preferences));
                } catch(e) { console.log("Error parsing prefs", e); }
            }
        }
    }, [user]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const trips = await getUserTrips();
                const now = new Date();
                
                let ongoing = 0;
                let upcoming = 0;
                let completed = 0;

                trips.forEach(trip => {
                    const start = trip.start_date ? new Date(trip.start_date) : null;
                    const end = trip.end_date ? new Date(trip.end_date) : null;

                    if (!start) {
                        upcoming++;
                    } else if (end && now > end) {
                        completed++;
                    } else if (start && now < start) {
                        upcoming++;
                    } else {
                        ongoing++;
                    }
                });

                setStats({
                    total: trips.length,
                    ongoing,
                    upcoming,
                    completed
                });
            } catch (error) {
                console.error("Failed to load trip stats", error);
            } finally {
                setLoading(false);
            }
        };
        
        loadStats();
    }, []);

    const handleSaveProfile = async () => {
        try {
            await updateProfile(editForm);
            setOpenEditModal(false);
            window.location.reload(); // Simple way to refresh context for now
        } catch (error) {
            alert("Failed to update profile");
        }
    };

    const handleSavePreferences = async () => {
        try {
            await updateProfile({ preferences: JSON.stringify(prefForm) });
            setOpenPrefModal(false);
            window.location.reload();
        } catch (error) {
            alert("Failed to update preferences");
        }
    };

    const toggleInterest = (interest) => {
        const current = prefForm.interests || [];
        if (current.includes(interest)) {
            setPrefForm({...prefForm, interests: current.filter(i => i !== interest)});
        } else {
            setPrefForm({...prefForm, interests: [...current, interest]});
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };

    if (!user) return <div className="p-12">Please log in to view your profile.</div>;

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-6 md:p-12 min-h-screen bg-slate-50"
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

                {/* Profile Card */}
                <motion.div variants={containerVariants} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="relative">
                        <Avatar 
                            sx={{ width: 120, height: 120, bgcolor: '#3b82f6', fontSize: '3rem' }}
                        >
                            {user.username ? user.username[0].toUpperCase() : 'U'}
                        </Avatar>
                        {user.username === 'admin_traveler' && (
                            <div className="absolute bottom-0 right-0 bg-purple-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white text-xs">A</div>
                        )}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                            {user.first_name} {user.last_name || `@${user.username}`}
                        </h2>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-4">
                            <Mail size={16} />
                            <span>{user.email}</span>
                        </div>
                        {user.bio && <p className="text-gray-600 mb-4 max-w-lg">{user.bio}</p>}
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <Chip label="Traveller" color="primary" variant="outlined" />
                            {user.username === 'admin_traveler' && <Chip label="Admin" color="secondary" />}
                        </div>

                        <div className="mt-6 flex gap-4 justify-center md:justify-start">
                            <Button 
                                variant="outlined" 
                                startIcon={<Settings size={18} />} 
                                onClick={() => setOpenEditModal(true)}
                                sx={{ borderRadius: '12px', textTransform: 'none' }}
                            >
                                Edit Profile
                            </Button>
                            <Button variant="contained" color="error" startIcon={<LogOut size={18} />} onClick={logout} sx={{ borderRadius: '12px', textTransform: 'none', boxShadow: 'none' }}>
                                Logout
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[200px]">
                        <h3 className="text-gray-500 font-medium mb-4 text-sm uppercase tracking-wider">Travel Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-gray-700">
                                    <Map size={18} className="text-blue-500"/> Total Trips
                                </span>
                                <span className="font-bold text-xl">{stats.total}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-gray-700">
                                    <Calendar size={18} className="text-purple-500"/> Upcoming
                                </span>
                                <span className="font-bold text-xl">{stats.upcoming}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Additional Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                     <motion.div variants={containerVariants} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">Account Settings</h3>
                        <p className="text-gray-500 text-sm">Manage your password, email preferences, and connected accounts.</p>
                        <Button 
                            className="mt-4" 
                            startIcon={<Settings size={16} />}
                            onClick={() => setOpenSettingsModal(true)}
                            sx={{ textTransform: 'none' }}
                        >
                            Manage Settings
                        </Button>
                     </motion.div>

                     <motion.div variants={containerVariants} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">Preferences</h3>
                         <p className="text-gray-500 text-sm">Select your favorite destinations, dietary restrictions, and travel interests.</p>
                        <Button 
                            className="mt-4" 
                             startIcon={<Sliders size={16} />}
                            onClick={() => setOpenPrefModal(true)}
                            sx={{ textTransform: 'none' }}
                        >
                            Update Preferences
                        </Button>
                     </motion.div>
                </div>

                {/* EDIT PROFILE MODAL */}
                <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
                    <DialogTitle className="font-bold">Edit Profile</DialogTitle>
                    <DialogContent>
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex gap-4">
                                <TextField label="First Name" fullWidth value={editForm.first_name} onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} />
                                <TextField label="Last Name" fullWidth value={editForm.last_name} onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} />
                            </div>
                            <TextField label="Bio" multiline rows={3} fullWidth value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} />
                            <TextField label="Phone" fullWidth value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                        </div>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleSaveProfile}>Save Changes</Button>
                    </DialogActions>
                </Dialog>

                {/* PREFERENCES MODAL */}
                <Dialog open={openPrefModal} onClose={() => setOpenPrefModal(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
                    <DialogTitle className="font-bold">Travel Preferences</DialogTitle>
                    <DialogContent>
                        <div className="mt-2">
                            <h4 className="font-medium mb-2">Interests</h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {['Adventure', 'Relaxing', 'City Trip', 'Nature', 'Foodie', 'Culture'].map(tag => (
                                    <Chip 
                                        key={tag} 
                                        label={tag} 
                                        clickable 
                                        color={prefForm.interests?.includes(tag) ? "primary" : "default"}
                                        onClick={() => toggleInterest(tag)}
                                    />
                                ))}
                            </div>

                             <h4 className="font-medium mb-2">Dietary</h4>
                             <TextField 
                                placeholder="E.g. Vegetarian, Gluten Free..." 
                                fullWidth 
                                value={prefForm.dietary || ''} 
                                onChange={(e) => setPrefForm({...prefForm, dietary: e.target.value})}
                             />
                        </div>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                         <Button onClick={() => setOpenPrefModal(false)}>Cancel</Button>
                         <Button variant="contained" onClick={handleSavePreferences}>Save Preferences</Button>
                    </DialogActions>
                </Dialog>

                {/* SETTINGS MODAL (Placeholder) */}
                 <Dialog open={openSettingsModal} onClose={() => setOpenSettingsModal(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '20px' } }}>
                    <DialogTitle className="font-bold">Settings</DialogTitle>
                    <DialogContent>
                        <div className="flex flex-col gap-2 mt-2">
                             <FormControlLabel control={<Switch defaultChecked />} label="Email Notifications" />
                             <FormControlLabel control={<Switch defaultChecked />} label="Public Profile" />
                             <Button variant="outlined" color="warning" className="mt-4">Change Password</Button>
                        </div>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                         <Button onClick={() => setOpenSettingsModal(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

            </div>
        </motion.div>
    );
};

export default UserProfilePage;
