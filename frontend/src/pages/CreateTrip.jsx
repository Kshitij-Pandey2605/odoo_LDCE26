import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Calendar, Tag, DollarSign, Image as ImageIcon, Sparkles, MapPin } from 'lucide-react';

const COVER_OPTIONS = [
  { name: 'Mountain Retreat', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tropical Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Historic City', url: 'https://images.unsplash.com/photo-1447584322811-36fa8c13038f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Nature Forest', url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80' }
];

const CreateTrip = () => {
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [tripType, setTripType] = useState('Solo');
  const [travelStyle, setTravelStyle] = useState('Relaxation');
  const [coverImage, setCoverImage] = useState(COVER_OPTIONS[0].url);
  const [loading, setLoading] = useState(false);

  // AI assistant form states
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiDestination, setAiDestination] = useState('');
  const [aiDuration, setAiDuration] = useState('3');
  const [aiBudget, setAiBudget] = useState('');
  const [aiStyle, setAiStyle] = useState('Culture');
  const [generatingAI, setGeneratingAI] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !startDate || !endDate || !budget) {
      toastError('Please fill in all required fields (Name, Dates, Budget).');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      toastError('End date cannot be before start date.');
      return;
    }

    if (parseFloat(budget) <= 0) {
      toastError('Budget must be a positive number.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/trips', {
        name,
        description,
        startDate,
        endDate,
        budget: parseFloat(budget),
        tripType,
        travelStyle,
        coverImage,
      });

      toastSuccess('Trip created successfully! Add some stops next.');
      navigate(`/trips/${response.data.id}/itinerary`);
    } catch (error) {
      console.error('Failed to create trip:', error);
      toastError(error.response?.data?.error || 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIPlan = async (e) => {
    e.preventDefault();
    if (!aiDestination || !aiBudget) {
      toastError('Destination and Budget are required to generate an AI plan.');
      return;
    }

    setGeneratingAI(true);
    try {
      const response = await api.post('/api/ai/plan', {
        destination: aiDestination,
        duration: aiDuration,
        budget: parseFloat(aiBudget),
        travelStyle: aiStyle,
        interests: [aiStyle]
      });

      const plan = response.data;
      toastSuccess('AI Plan generated! We have prefilled the trip parameters.');
      
      // Auto fill form with AI suggested configurations
      setName(`Trip to ${plan.destination}`);
      setDescription(`AI-generated adventure in ${plan.destination}. Style: ${plan.travelStyle}.`);
      setBudget(plan.budget.toString());
      setTravelStyle(plan.travelStyle);
      
      // Calculate dates from today
      const today = new Date();
      const end = new Date();
      end.setDate(today.getDate() + parseInt(aiDuration, 10));

      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);

      // Switch cover image dynamically if matching
      const destLower = plan.destination.toLowerCase();
      if (destLower.includes('tokyo') || destLower.includes('japan')) {
        setCoverImage('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80');
      } else if (destLower.includes('paris') || destLower.includes('france')) {
        setCoverImage('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80');
      } else if (destLower.includes('goa')) {
        setCoverImage('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80');
      } else if (destLower.includes('udaipur') || destLower.includes('jaipur') || destLower.includes('rajasthan')) {
        setCoverImage('https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?auto=format&fit=crop&w=800&q=80');
      }

      setShowAIPanel(false);

      // Save a reference to imported stops/activities if we want to run auto-creation on submission!
      // To make it simple and fully editable: the user can review parameters and submit, 
      // and we will save the stops and activities in the database.
      // We will flag this as a session import, or just let them create the trip and add stops.
      // Let's store the generated AI plan in state so upon submission, we can automatically add stops/activities!
      // This is extremely high-value! Let's do it!
      window.pendingAIPlanStops = plan.stops;
      window.pendingAIPlanItinerary = plan.itinerary;

    } catch (error) {
      console.error('AI Planning failed:', error);
      toastError('Failed to generate AI plan. Please check parameters.');
    } finally {
      setGeneratingAI(false);
    }
  };

  // When submitting, if we have pendingAIPlanStops, we create them automatically!
  const handleCreateWithAISupport = async (e) => {
    e.preventDefault();
    if (!name || !startDate || !endDate || !budget) {
      toastError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the Trip
      const tripResponse = await api.post('/api/trips', {
        name,
        description,
        startDate,
        endDate,
        budget: parseFloat(budget),
        tripType,
        travelStyle,
        coverImage,
      });

      const tripId = tripResponse.data.id;

      // 2. If there are pending AI stops, add them to the database!
      if (window.pendingAIPlanStops && window.pendingAIPlanStops.length > 0) {
        let currentDate = new Date(startDate);
        for (const stop of window.pendingAIPlanStops) {
          const stopStart = new Date(currentDate);
          const stopEnd = new Date(currentDate);
          stopEnd.setDate(stopEnd.getDate() + stop.days - 1);

          // Add stop
          const stopResponse = await api.post(`/api/trips/${tripId}/stops`, {
            cityId: stop.cityId,
            startDate: stopStart.toISOString().split('T')[0],
            endDate: stopEnd.toISOString().split('T')[0]
          });

          const stopId = stopResponse.data.id;

          // Find scheduled activities for this city from the AI plan
          const cityActs = window.pendingAIPlanItinerary.filter(day => day.cityId === stop.cityId);
          let dayOffset = 0;
          for (const day of cityActs) {
            const actDate = new Date(stopStart);
            actDate.setDate(actDate.getDate() + dayOffset);

            for (const act of day.activities) {
              await api.post('/api/trip-activities', {
                tripStopId: stopId,
                activityId: act.activityId,
                date: actDate.toISOString().split('T')[0],
                startTime: act.startTime,
                endTime: act.endTime,
                notes: act.notes
              });
            }
            dayOffset++;
          }

          // Advance date for next stop
          currentDate = new Date(stopEnd);
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Clean up
        window.pendingAIPlanStops = null;
        window.pendingAIPlanItinerary = null;
      }

      toastSuccess('Trip created successfully with day-by-day stops and activities!');
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error('Failed to save complete AI trip:', error);
      toastError(error.response?.data?.error || 'Failed to create trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Plan a New Adventure</h1>
          <p className="text-slate-500 text-xs mt-1">Configure your destination parameters, dates, and budget details.</p>
        </div>
        <button
          onClick={() => setShowAIPanel(!showAIPanel)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-all hover-lift shadow-sm text-xs"
        >
          <Sparkles className="h-4 w-4" />
          {showAIPanel ? 'Manual Form' : 'Use AI Planner'}
        </button>
      </div>

      {/* AI generator panel overlay */}
      {showAIPanel && (
        <form onSubmit={handleGenerateAIPlan} className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-6 rounded-2xl shadow-sm space-y-4 animate-slide-down">
          <div className="flex items-center gap-2 text-violet-950 font-bold text-sm">
            <Sparkles className="h-5 w-5 text-violet-600" />
            <h3>Configure AI Custom Itinerary Generator</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Where to? (e.g. Rajasthan, Japan, Goa)</label>
              <input
                type="text"
                required
                value={aiDestination}
                onChange={(e) => setAiDestination(e.target.value)}
                placeholder="Rajasthan, Tokyo, Paris..."
                className="w-full px-3 py-2 border border-violet-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Number of Days)</label>
              <select
                value={aiDuration}
                onChange={(e) => setAiDuration(e.target.value)}
                className="w-full px-3 py-2 border border-violet-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 text-xs"
              >
                {[3, 5, 7, 10, 14].map(day => (
                  <option key={day} value={day}>{day} Days</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Budget Limit (₹)</label>
              <input
                type="number"
                required
                value={aiBudget}
                onChange={(e) => setAiBudget(e.target.value)}
                placeholder="25000"
                className="w-full px-3 py-2 border border-violet-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Style</label>
              <select
                value={aiStyle}
                onChange={(e) => setAiStyle(e.target.value)}
                className="w-full px-3 py-2 border border-violet-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 text-xs"
              >
                {['Adventure', 'Budget', 'Luxury', 'Food', 'Culture', 'Relaxation'].map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={generatingAI}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-xs flex justify-center items-center gap-2"
          >
            {generatingAI ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Plan & Autofill Form
              </>
            )}
          </button>
        </form>
      )}

      {/* Main manual form */}
      <form onSubmit={window.pendingAIPlanStops ? handleCreateWithAISupport : handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-premium space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Trip Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Exploring Royal Rajasthan"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us a little bit about what you hope to see or do on this journey..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-4 w-4 text-slate-400" /> Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-4 w-4 text-slate-400" /> End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-slate-400" /> Budget * (₹)
              </label>
              <input
                type="number"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="25000"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider flex items-center gap-1">
                <Tag className="h-4 w-4 text-slate-400" /> Trip Type
              </label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary text-sm"
              >
                {['Solo', 'Couple', 'Friends', 'Family', 'Business'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-slate-400" /> Travel Style
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary text-sm"
              >
                {['Adventure', 'Budget', 'Luxury', 'Food', 'Culture', 'Relaxation'].map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover image picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1">
              <ImageIcon className="h-4 w-4 text-slate-400" /> Cover Image
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {COVER_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.url}
                  onClick={() => setCoverImage(opt.url)}
                  className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    coverImage === opt.url ? 'border-brand-secondary scale-95 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={opt.url} alt={opt.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[9px] font-bold text-white">
                    {opt.name}
                  </div>
                </button>
              ))}
            </div>
            {/* Custom URL input */}
            <div className="mt-3">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Or paste a custom image URL..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-primary hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-premium hover-lift transition-all text-sm flex justify-center items-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
          ) : window.pendingAIPlanStops ? (
            'Import AI Suggested Itinerary & Create Trip'
          ) : (
            'Continue to Itinerary Builder'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;
