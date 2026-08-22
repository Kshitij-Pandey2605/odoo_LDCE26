import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import CitySearch from './pages/CitySearch';
import ItineraryBuilder from './pages/ItineraryBuilder';
import TripDetails from './pages/TripDetails';
import TripBudget from './pages/TripBudget';
import SharedItinerary from './pages/SharedItinerary';
import Profile from './pages/Profile';
import TripCalendar from './pages/TripCalendar';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/share/:shareToken" element={<SharedItinerary />} />

            {/* Protected dashboard and trip planning routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/trips" element={<MyTrips />} />
                <Route path="/trips/create" element={<CreateTrip />} />
                <Route path="/trips/:tripId" element={<TripDetails />} />
                <Route path="/trips/:tripId/itinerary" element={<ItineraryBuilder />} />
                <Route path="/trips/:tripId/budget" element={<TripBudget />} />
                <Route path="/cities" element={<CitySearch />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/calendar" element={<TripCalendar />} />
              </Route>
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
