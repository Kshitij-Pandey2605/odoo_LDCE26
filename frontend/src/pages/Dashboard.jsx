import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Compass, Calendar as CalendarIcon, MapPin, ArrowRight, Heart, PlaneTakeoff, TrendingUp, Wallet } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { toastError } = useToast();
  const [trips, setTrips] = useState([]);
  const [savedCities, setSavedCities] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Greeting based on time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [tripsRes, savedRes, citiesRes] = await Promise.all([
          api.get('/api/trips'),
          api.get('/api/saved-destinations'),
          api.get('/api/cities')
        ]);

        setTrips(tripsRes.data);
        setSavedCities(savedRes.data);
        setCities(citiesRes.data.slice(0, 3)); // Grab top 3 for popular list
      } catch (error) {
        console.error('Dashboard load failed:', error);
        toastError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [toastError]);

  const upcomingTrips = trips.filter(t => t.status === 'Upcoming' || t.status === 'Draft');
  const nextTrip = upcomingTrips[0];

  // Calculate days remaining for countdown
  const getCountdown = (startDateStr) => {
    const diff = new Date(startDateStr) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-secondary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section with welcome and quick start */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-brand-primary to-slate-900 text-white p-8 rounded-3xl shadow-premium relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.15),transparent_60%)]"></div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {user?.name} 👋
          </h1>
          <p className="text-slate-300 text-sm max-w-md">
            Where do you want to explore next? Plan your destinations, schedule activities, and track budgets.
          </p>
        </div>
        <Link
          to="/trips/create"
          className="relative z-10 flex items-center gap-2 bg-brand-accent hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold transition-all hover-lift shadow-lg text-sm"
        >
          <PlaneTakeoff className="h-5 w-5" />
          Plan New Trip
        </Link>
      </div>

      {/* Countdown banner for next trip */}
      {nextTrip && (
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🎒</span>
            <div>
              <h3 className="font-bold text-orange-950 text-base">
                Your journey to {nextTrip.name} is calling!
              </h3>
              <p className="text-orange-800 text-xs mt-0.5">
                Starts on {new Date(nextTrip.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-brand-accent">{getCountdown(nextTrip.startDate)}</span>
            <span className="text-xs font-semibold text-orange-800 uppercase tracking-wider">Days Remaining</span>
          </div>
        </div>
      )}

      {/* Travel Stats Widget Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips', val: trips.length, icon: CalendarIcon, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
          { label: 'Saved Spots', val: savedCities.length, icon: Heart, color: 'bg-rose-50 text-rose-600 border-rose-100' },
          { label: 'Upcoming Trips', val: upcomingTrips.length, icon: Compass, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
          { label: 'Total Budget Managed', val: `₹${trips.reduce((acc, t) => acc + t.budget, 0).toLocaleString('en-IN')}`, icon: Wallet, color: 'bg-amber-50 text-amber-600 border-amber-100' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between bg-white ${stat.color.split(' ')[2]}`}>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.val}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 columns: Trips list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-slate-900">Your Upcoming Trips</h2>
            <Link to="/trips" className="text-sm font-bold text-brand-secondary hover:text-brand-primary flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {upcomingTrips.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow-premium border border-slate-100 text-center space-y-4">
              <div className="text-4xl">🏝️</div>
              <h3 className="font-bold text-slate-700">No upcoming trips planned yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to explore the world? Start planning your next dream itinerary now.
              </p>
              <Link
                to="/trips/create"
                className="inline-block bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs hover-lift transition-all"
              >
                Create a Trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingTrips.slice(0, 4).map((trip) => (
                <Link
                  key={trip.id}
                  to={`/trips/${trip.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col hover-lift"
                >
                  <div className="h-32 bg-slate-100 relative">
                    <img
                      src={trip.coverImage}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-slate-800 shadow-sm">
                      {trip.status}
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors text-sm line-clamp-1">
                        {trip.name}
                      </h4>
                      <p className="text-slate-500 text-[11px] font-medium mt-1">
                        {new Date(trip.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-50 pt-3 mt-3">
                      <span className="text-[11px] font-semibold text-slate-400">
                        {trip.stops?.length || 0} destinations
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        ₹{trip.budget.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Popular & Recommendations */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 font-sans">Popular Destinations</h2>
          <div className="space-y-4">
            {cities.map((city) => (
              <div
                key={city.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex items-center gap-3 p-3 hover:border-slate-200 transition-colors"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                  <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{city.name}</h4>
                    <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-bold">
                      ★ {city.popularity.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{city.region}, {city.country}</p>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[10px] text-slate-500">
                      Cost: {'₹'.repeat(city.costIndex)}
                    </span>
                    <Link
                      to="/cities"
                      className="text-[10px] font-extrabold text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-0.5"
                    >
                      Explore <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Saved Destinations */}
          {savedCities.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-slate-800 text-sm">Saved Favorites ({savedCities.length})</h3>
              <div className="flex flex-wrap gap-2">
                {savedCities.slice(0, 5).map((save) => (
                  <Link
                    key={save.id}
                    to="/cities"
                    className="flex items-center gap-1 bg-white border border-slate-150 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all hover-lift"
                  >
                    <MapPin className="h-3 w-3 text-rose-500" />
                    {save.city.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
