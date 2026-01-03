import { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

const Toast = ({ message, severity, onClose, duration = 3000 }) => {
    const [progress, setProgress] = useState(100);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - (100 / (duration / 50));
            });
        }, 50);

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="text-green-400" size={22} />,
        error: <XCircle className="text-red-400" size={22} />,
        warning: <AlertCircle className="text-yellow-400" size={22} />,
        info: <Info className="text-blue-400" size={22} />,
    };

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-slate-800 text-white rounded-xl shadow-2xl overflow-hidden min-w-[320px] max-w-[400px] border border-slate-700"
        >
            <div className="flex items-center gap-3 p-4">
                {icons[severity] || icons.info}
                <span className="flex-1 font-medium text-sm">{message}</span>
                <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
            {/* Progress Bar */}
            <div className="h-1 bg-slate-700">
                <motion.div 
                    className={`h-full ${colors[severity] || colors.info}`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.05, ease: 'linear' }}
                />
            </div>
        </motion.div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, severity = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, severity, duration }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            severity={toast.severity}
                            duration={toast.duration}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
