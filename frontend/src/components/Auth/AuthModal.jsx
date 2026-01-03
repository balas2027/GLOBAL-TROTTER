import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
    Dialog, 
    DialogContent, 
    Tabs, 
    Tab, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    IconButton,
    Alert,
    InputAdornment,
    Avatar
} from '@mui/material';
import { X, Mail, Lock, User, ArrowRight, UserPlus, MapPin, Phone, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = () => {
    const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [bio, setBio] = useState('');

    const handleTabChange = (event, newValue) => {
        setAuthMode(newValue);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (authMode === 'login') {
                await login(email, password);
            } else {
                const res = await register({ 
                    username, 
                    email, 
                    password,
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                    city,
                    country,
                    bio
                });
                if(res.success) {
                   // Success
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={isAuthModalOpen} 
            onClose={closeAuthModal} 
            maxWidth={authMode === 'signup' ? 'sm' : 'xs'} 
            fullWidth
            PaperProps={{
                style: { borderRadius: '24px', overflow: 'hidden' }
            }}
        >
            <div className="relative bg-white overflow-hidden">
                <DialogContent sx={{ p: 4 }}>
                    <div className="flex justify-end absolute top-4 right-4 z-10">
                         <IconButton onClick={closeAuthModal} size="small" className="hover:bg-slate-100 rounded-full">
                            <X size={20} className="text-gray-500" />
                        </IconButton>
                    </div>

                    {/* Centered Avatar Placeholder for Login Screen */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <User size={40} className="text-blue-500" />
                        </div>
                        <Typography variant="h5" fontWeight="bold" className="text-gray-800">
                             {authMode === 'login' ? 'Welcome Back' : 'Join Global Trotter'}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 mt-1">
                            {authMode === 'login' ? 'Please log in to continue' : 'Create your traveler profile'}
                        </Typography>
                    </div>

                    <Tabs 
                        value={authMode} 
                        onChange={handleTabChange} 
                        centered
                        sx={{ 
                            mb: 3, 
                            minHeight: '40px',
                            '& .MuiTab-root': { textTransform: 'none', fontSize: '0.95rem', fontWeight: 500, minHeight: '40px' }
                        }}
                    >
                        <Tab label="Log In" value="login" />
                        <Tab label="Sign Up" value="signup" />
                    </Tabs>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={authMode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {authMode === 'login' ? (
                                    // LOGIN SCREEN (Simple column)
                                    <>
                                        <div className="mb-4">
                                             <TextField
                                                fullWidth
                                                type="email"
                                                label="Email Address"
                                                variant="outlined"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                InputProps={{ sx: { borderRadius: '12px' } }}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <TextField
                                                fullWidth
                                                type="password"
                                                label="Password"
                                                variant="outlined"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                InputProps={{ sx: { borderRadius: '12px' } }}
                                                required
                                            />
                                        </div>
                                    </>
                                ) : (
                                    // REGISTER SCREEN (Grid Layout)
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         <div className="col-span-1 md:col-span-1">
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                variant="outlined"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                InputProps={{ sx: { borderRadius: '12px' } }}
                                                size="small"
                                            />
                                        </div>
                                         <div className="col-span-1 md:col-span-1">
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                variant="outlined"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                InputProps={{ sx: { borderRadius: '12px' } }}
                                                size="small"
                                            />
                                        </div>
                                        
                                        <div className="col-span-1 md:col-span-2">
                                            <TextField
                                                fullWidth
                                                label="Username"
                                                variant="outlined"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                InputProps={{ sx: { borderRadius: '12px' } }}
                                                size="small"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-1">
                                            <TextField
                                                fullWidth
                                                type="email"
                                                label="Email Address"
                                                variant="outlined"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                InputProps={{ sx: { borderRadius: '12px' } }}
                                                size="small"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-1">
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                variant="outlined"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                InputProps={{ sx: { borderRadius: '12px' } }}
                                                size="small"
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-1">
                                            <TextField
                                                fullWidth
                                                label="City"
                                                variant="outlined"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                InputProps={{ sx: { borderRadius: '12px' } }}
                                                size="small"
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-1">
                                            <TextField
                                                fullWidth
                                                label="Country"
                                                variant="outlined"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                InputProps={{ sx: { borderRadius: '12px' } }}
                                                size="small"
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-2">
                                            <TextField
                                                fullWidth
                                                type="password"
                                                label="Password"
                                                variant="outlined"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                InputProps={{ sx: { borderRadius: '12px' } }}
                                                size="small"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-2">
                                             <TextField
                                                fullWidth
                                                label="Additional Information (Bio)"
                                                multiline
                                                rows={3}
                                                variant="outlined"
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                InputProps={{ sx: { borderRadius: '12px' } }}
                                                placeholder="Tell us a bit about yourself..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth 
                            size="large"
                            disabled={loading}
                            sx={{ 
                                borderRadius: '12px', 
                                py: 1.5,
                                textTransform: 'none', 
                                fontSize: '1rem',
                                fontWeight: 600,
                                mt: 2,
                                background: 'linear-gradient(45deg, #2563EB, #3B82F6)',
                                boxShadow: '0 4px 14px 0 rgba(37,99,235,0.39)'
                            }}
                            endIcon={authMode === 'login' ? <ArrowRight size={20}/> : <UserPlus size={20}/>}
                        >
                            {loading ? 'Processing...' : authMode === 'login' ? 'Log In' : 'Register User'}
                        </Button>
                    </form>
                </DialogContent>
            </div>
        </Dialog>
    );
};

export default AuthModal;
