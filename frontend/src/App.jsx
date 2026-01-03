import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateTrip from './pages/CreateTrip';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes inside Layout */}
          <Route element={<ProtectedRoute />}>
             <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-trip" element={<CreateTrip />} />
                {/* Trip Details with Username */}
                <Route path="/:username/trip/:tripId" element={<div className="p-10 text-center">Trip Details Coming in Phase 4</div>} />
             </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
