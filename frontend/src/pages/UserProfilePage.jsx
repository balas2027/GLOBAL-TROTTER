import { motion } from 'framer-motion';

const UserProfilePage = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="p-6 md:p-12 min-h-screen bg-slate-50"
        >
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-gray-500">Profile content coming soon...</p>
            </div>
        </motion.div>
    );
};

export default UserProfilePage;
