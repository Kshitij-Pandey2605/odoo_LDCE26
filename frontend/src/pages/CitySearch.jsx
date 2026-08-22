import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Search, SlidersHorizontal, Heart, Plus, MapPin, X, Calendar } from 'lucide-react';

const CitySearch = () => {
  const { toastSuccess, toastError, toastWarning } = useToast();
  const [cities, setCities] = useState([]);
  const [trips, setTrips] = useState([]);
  const [savedIds, setSavedIds] = useState({}); // Map of cityId -> savedRecordId
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [costFilter, setCostFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Modal State for Add to Trip
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [stopStartDate, setStopStartDate] = useState('');
  const [stopEndDate, setStopEndDate] = useState('');
  const [addingStop, setAddingStop] = useState(false);

  const loadCitiesAndTrips = async () => {
    try {
      const [citiesRes, tripsRes, savedRes] = await Promise.all([
        api.get('/api/cities'),
        api.get('/api/trips'),
        api.get('/api/saved-destinations')
      ]);

      setCities(citiesRes.data);
      setTrips(tripsRes.data.filter(t => t.status === 'Upcoming' || t.status === 'Draft'));

      // Index saved destinations
      const savedMap = {};
      savedRes.data.forEach(item => {
        savedMap[item.cityId] = item.id;
      });
      setSavedIds(savedMap);
    } catch (error) {
      console.error('Failed to load cities search data:', error);
      toastError('Failed to retrieve destinations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitiesAndTrips();
  }, []);

  const handleFavoriteToggle = async (cityId) => {
    const isSaved = savedIds[cityId];
    try {
      if (isSaved) {
        // Remove from favorites
        await api.delete(`/api/saved-destinations/${cityId}`);
        const updated = { ...savedIds };
        delete updated[cityId];
        setSavedIds(updated);
        toastSuccess('Destination removed from favorites.');
      } else {
        // Save to favorites
        const response = await api.post('/api/saved-destinations', { cityId });
        setSavedIds({ ...savedIds, [cityId]: response.data.id });
        toastSuccess('Destination added to favorites!');
      }
    } catch (error) {
      console.error('Favorite action failed:', error);
      toastError('Failed to update favorite status.');
    }
  };

  const handleAddStopSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTripId || !stopStartDate || !stopEndDate) {
      toastWarning('Please select a trip and dates.');
      return;
    }

    const trip = trips.find(t => t.id === selectedTripId);
    if (!trip) return;

    const stopStart = new Date(stopStartDate);
    const stopEnd = new Date(stopEndDate);
    const tripStart = new Date(trip.startDate);
    const tripEnd = new Date(trip.endDate);

    if (stopStart < tripStart || stopEnd > tripEnd) {
      toastError(`Stop dates must fit inside trip dates: ${tripStart.toLocaleDateString()} to ${tripEnd.toLocaleDateString()}`);
      return;
    }

    if (stopEnd < stopStart) {
      toastError('End date cannot be before start date.');
      return;
    }

    setAddingStop(true);
    try {
      await api.post(`/api/trips/${selectedTripId}/stops`, {
        cityId: selectedCity.id,
        startDate: stopStartDate,
        endDate: stopEndDate
      });

      toastSuccess(`Successfully added ${selectedCity.name} to "${trip.name}"!`);
      setSelectedCity(null);
      setSelectedTripId('');
      setStopStartDate('');
      setStopEndDate('');
    } catch (error) {
      console.error('Failed to add stop:', error);
      toastError(error.response?.data?.error || 'Failed to add stop to trip.');
    } finally {
      setAddingStop(false);
    }
  };

  // Perform client-side filter based on parameters
  const filteredCities = cities.filter((city) => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          city.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          city.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = countryFilter ? city.country === countryFilter : true;
    const matchesRegion = regionFilter ? city.region === regionFilter : true;
    const matchesCost = costFilter ? city.costIndex === parseInt(costFilter, 10) : true;

    return matchesSearch && matchesCountry && matchesRegion && matchesCost;
  });

  // Extract unique countries/regions for filter dropdowns
  const uniqueCountries = [...new Set(cities.map(c => c.country))];
  const uniqueRegions = [...new Set(cities.map(c => c.region))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-secondary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Search and Filters Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-grow">
            <Search className="absolute inset-y-0 left-3 h-5 w-5 text-slate-400 mt-2.5" />
            <input
              type="text"
              placeholder="Search cities, countries, or regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-350 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 transition-all hover-lift"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Extended filters block */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 animate-slide-down">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Country</label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs"
              >
                <option value="">All Countries</option>
                {uniqueCountries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Region</label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs"
              >
                <option value="">All Regions</option>
                {uniqueRegions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Budget Level</label>
              <select
                value={costFilter}
                onChange={(e) => setCostFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs"
              >
                <option value="">All Budgets</option>
                <option value="1">₹ (Very Cheap)</option>
                <option value="2">₹₹ (Cheap)</option>
                <option value="3">₹₹₹ (Moderate)</option>
                <option value="4">₹₹₹₹ (Expensive)</option>
                <option value="5">₹₹₹₹₹ (Ultra Luxury)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <div
            key={city.id}
            className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
          >
            <div className="h-48 bg-slate-100 relative">
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => handleFavoriteToggle(city.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm shadow-sm transition-all ${
                  savedIds[city.id]
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-white/95 text-slate-400 hover:text-rose-500'
                }`}
              >
                <Heart className="h-4.5 w-4.5 fill-current" />
              </button>
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-extrabold shadow-sm">
                ★ {city.popularity.toFixed(1)}
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1">
                    <MapPin className="h-4.5 w-4.5 text-slate-400" />
                    {city.name}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {'₹'.repeat(city.costIndex)}
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{city.region}, {city.country}</p>
                <p className="text-slate-500 text-xs line-clamp-3 pt-1">
                  {city.description}
                </p>
              </div>

              {/* Add stop button */}
              <button
                onClick={() => setSelectedCity(city)}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs hover-lift transition-all"
              >
                <Plus className="h-4 w-4" />
                Add to Trip stops
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL WINDOW FOR ADDING CITY TO A TRIP */}
      {selectedCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in pointer-events-auto">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all pointer-events-auto">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Add {selectedCity.name} to Trip</h3>
                <p className="text-slate-400 text-[10px]">Select a trip from your schedule and assign dates.</p>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-150 rounded-lg transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {trips.length === 0 ? (
              <div className="p-6 text-center space-y-4">
                <p className="text-slate-500 text-xs">You don't have any active upcoming trips to add stops to.</p>
                <button
                  onClick={() => { setSelectedCity(null); window.location.href = '/trips/create'; }}
                  className="bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Create a Trip First
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddStopSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase">Select Trip</label>
                  <select
                    required
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-brand-secondary/20"
                  >
                    <option value="">-- Select Trip --</option>
                    {trips.map(trip => (
                      <option key={trip.id} value={trip.id}>
                        {trip.name} ({new Date(trip.startDate).toLocaleDateString(undefined, { dateStyle: 'short' })} - {new Date(trip.endDate).toLocaleDateString(undefined, { dateStyle: 'short' })})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={stopStartDate}
                      onChange={(e) => setStopStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={stopEndDate}
                      onChange={(e) => setStopEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={addingStop}
                  className="w-full bg-brand-primary hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex justify-center items-center"
                >
                  {addingStop ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  ) : (
                    'Add Stop to Itinerary'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySearch;
