import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Compass, Calendar, Plane, Plus, Share2, Copy, Trash2, Edit3, ArrowRight } from 'lucide-react';

const MyTrips = () => {
  const { toastSuccess, toastError, toastInfo } = useToast();
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const response = await api.get('/api/trips');
      setTrips(response.data);
    } catch (error) {
      console.error('Failed to retrieve trips:', error);
      toastError('Failed to fetch your trips list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDuplicate = async (id, name) => {
    try {
      toastInfo(`Duplicating trip "${name}"...`);
      await api.post(`/api/trips/${id}/duplicate`);
      toastSuccess('Trip duplicated successfully!');
      fetchTrips(); // Refresh
    } catch (error) {
      console.error('Duplication failed:', error);
      toastError('Failed to duplicate trip.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the trip "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/api/trips/${id}`);
      toastSuccess('Trip deleted successfully.');
      setTrips(trips.filter(t => t.id !== id));
    } catch (error) {
      console.error('Deletion failed:', error);
      toastError('Failed to delete trip.');
    }
  };

  const handleShare = async (id) => {
    try {
      const response = await api.post(`/api/trips/${id}/share`);
      const { url } = response.data;
      const absoluteUrl = `${window.location.origin}${url}`;

      // Try copy to clipboard
      await navigator.clipboard.writeText(absoluteUrl);
      toastSuccess('Public itinerary link copied to clipboard!');
    } catch (error) {
      console.error('Sharing failed:', error);
      toastError('Failed to generate sharing link.');
    }
  };

  // Filter trips based on activeTab
  const filteredTrips = trips.filter((trip) => {
    if (activeTab === 'Upcoming') return trip.status === 'Upcoming';
    if (activeTab === 'Ongoing') return trip.status === 'Ongoing';
    if (activeTab === 'Completed') return trip.status === 'Completed';
    if (activeTab === 'Drafts') return trip.status === 'Draft';
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-secondary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Compass className="h-6 w-6 text-brand-secondary" />
            My Travel Itineraries
          </h1>
          <p className="text-slate-500 text-xs mt-1">Manage, copy, delete, and share your upcoming and past travel details.</p>
        </div>
        <Link
          to="/trips/create"
          className="flex items-center gap-1 bg-brand-primary hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold transition-all hover-lift shadow-premium text-xs"
        >
          <Plus className="h-4 w-4" />
          Plan Trip
        </Link>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200">
        {['Upcoming', 'Ongoing', 'Completed', 'Drafts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === tab
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List content */}
      {filteredTrips.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-premium text-center space-y-4">
          <div className="text-5xl">✈️</div>
          <h3 className="font-bold text-slate-800 text-base">No {activeTab.toLowerCase()} trips found</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            It looks like you don't have any travel plans in this category. Let's design a new journey!
          </p>
          <Link
            to="/trips/create"
            className="inline-block bg-brand-primary hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover-lift transition-all"
          >
            Plan a Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
            >
              <div className="h-44 bg-slate-100 relative">
                <img
                  src={trip.coverImage}
                  alt={trip.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[9px] font-extrabold shadow-sm">
                  {trip.status}
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-900 group-hover:text-brand-primary transition-colors text-base line-clamp-1">
                    {trip.name}
                  </h3>
                  <p className="text-slate-500 text-xs font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(trip.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </p>
                  <p className="text-slate-400 text-[11px] line-clamp-2">
                    {trip.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-50 pt-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400">EST. BUDGET</span>
                    <p className="font-bold text-slate-950">₹{trip.budget.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[10px] font-semibold text-slate-400">DESTINATIONS</span>
                    <p className="font-bold text-slate-950">{trip.stops?.length || 0} cities</p>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="flex justify-between items-center border-t border-slate-50 pt-4 gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleShare(trip.id)}
                      className="p-2 text-slate-400 hover:text-brand-secondary hover:bg-sky-50 rounded-lg transition-colors"
                      title="Share Public Link"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(trip.id, trip.name)}
                      className="p-2 text-slate-400 hover:text-brand-accent hover:bg-orange-50 rounded-lg transition-colors"
                      title="Duplicate Trip"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id, trip.name)}
                      className="p-2 text-slate-400 hover:text-brand-danger hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/trips/${trip.id}/itinerary`}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Edit Stops / Build Itinerary"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/trips/${trip.id}`}
                      className="flex items-center gap-0.5 bg-slate-950 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm"
                    >
                      View <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
