import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import UserTripsPage from './pages/UserTripsPage';
import UserProfilePage from './pages/UserProfilePage';
import SearchPage from './pages/SearchPage';
import ItineraryViewPage from './pages/ItineraryViewPage';
import CommunityPage from './pages/CommunityPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/Auth/AuthModal';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AuthModal />
          <Routes>
            {/* Public Routes inside Layout */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/community" element={<CommunityPage />} />
              {/* Trip Details might be public */}
              <Route path="/trip/:tripId" element={<TripDetails />} />
              <Route path="/:username/trip/:tripId" element={<TripDetails />} />
              <Route path="/trip/:tripId/itinerary" element={<ItineraryViewPage />} />
            </Route>

            {/* Protected Routes inside Layout */}
            <Route element={<ProtectedRoute />}>
               <Route element={<Layout />}>
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/my-trips" element={<UserTripsPage />} />
                  <Route path="/create-trip" element={<CreateTrip />} />
               </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
