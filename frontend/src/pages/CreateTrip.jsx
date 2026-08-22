import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Upload, Calendar, Users, Wallet, ChevronDown, MapPin,
  CheckCircle2, Info, ArrowRight, X
} from 'lucide-react';

// Travel style options with images from Pexels
const TRAVEL_STYLES = [
  {
    name: 'Cultural',
    img: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Adventure',
    img: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Relaxation',
    img: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Food & Culinary',
    img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const TRIP_TYPES = ['Solo', 'Couple', 'Friends', 'Family', 'Business'];

const CHECKLIST = [
  { id: 1, text: 'Set your destination & dates', done: false },
  { id: 2, text: 'Choose your travel style', done: false },
  { id: 3, text: 'Define your budget', done: false },
  { id: 4, text: 'Build your itinerary', done: false },
];

const CreateTrip = () => {
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  // Form state
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripType, setTripType] = useState('Solo');
  const [budget, setBudget] = useState(25000);
  const [travelStyle, setTravelStyle] = useState('Cultural');
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tripName || !startDate || !endDate) {
      toastError('Please fill in all required fields.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toastError('End date cannot be before start date.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/api/trips', {
        name: tripName,
        destination,
        startDate,
        endDate,
        budget,
        tripType,
        travelStyle,
        coverImage: coverPreview || TRAVEL_STYLES.find(s => s.name === travelStyle)?.img,
      });
      toastSuccess('Trip created successfully!');
      navigate(`/trips/${response.data.id}`);
    } catch (error) {
      toastError(error.response?.data?.error || 'Failed to create trip.');
    } finally {
      setLoading(false);
    }
  };

  // Compute trip duration
  const tripDays =
    startDate && endDate
      ? Math.max(0, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1)
      : null;

  return (
    <div className="pb-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link to="/dashboard" className="hover:text-[#F97316] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#F97316] font-semibold">Create New Trip</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Create Your New Adventure</h1>
        <p className="text-xs text-slate-400 mt-1">Configure your destination, travel style, dates, and budget to get started.</p>
      </div>

      {/* Two-column layout */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT COLUMN: Main Form ── */}
          <div className="flex-1 space-y-5">

            {/* Upload Cover Image */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">
                Cover Image
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-10 transition-colors cursor-pointer ${
                  dragOver ? 'border-[#F97316] bg-[#FFF7ED]' : 'border-slate-200 bg-slate-50 hover:border-[#F97316] hover:bg-[#FFF7ED]/40'
                }`}
                onClick={() => document.getElementById('cover-upload').click()}
              >
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-30" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCoverPreview(null); }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-slate-500 hover:text-rose-500 z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="relative z-10 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-emerald-600">Image uploaded!</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-500">Upload Your Image</p>
                    <p className="text-xs text-slate-400 mt-1">Drag & Drop or <span className="text-[#F97316] underline underline-offset-2">Browse</span></p>
                    <p className="text-[10px] text-slate-300 mt-2">SVG, PNG, JPG or GIF (max 800×400px)</p>
                  </>
                )}
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Trip Name & Destination */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Trip Name *
                </label>
                <input
                  type="text"
                  required
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g. Royal Rajasthan Explorer"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-colors placeholder-slate-300 text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#F97316]" /> Destination</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Jaipur, Rajasthan, India"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-colors placeholder-slate-300 text-[#0F172A]"
                />
              </div>
            </div>

            {/* Dates & Trip Type */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#F97316]" /> Start Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-colors text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#F97316]" /> End Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-colors text-[#0F172A]"
                  />
                </div>
              </div>

              {tripDays !== null && tripDays > 0 && (
                <div className="text-xs text-[#F97316] font-semibold bg-[#FFF7ED] rounded-lg px-3 py-2 inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {tripDays} {tripDays === 1 ? 'day' : 'days'} trip
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#F97316]" /> Trip Type</span>
                </label>
                <div className="relative">
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-full appearance-none px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-colors text-[#0F172A] bg-white pr-10"
                  >
                    {TRIP_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Travel Style */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">
                Travel Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TRAVEL_STYLES.map((style) => (
                  <button
                    type="button"
                    key={style.name}
                    onClick={() => setTravelStyle(style.name)}
                    className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      travelStyle === style.name
                        ? 'border-[#F97316] scale-[0.97] shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:border-slate-200'
                    }`}
                  >
                    <img src={style.img} alt={style.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-bold text-white uppercase tracking-wide">
                      {style.name}
                    </span>
                    {travelStyle === style.name && (
                      <div className="absolute top-2 right-2 bg-[#F97316] rounded-full p-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Slider */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-[#F97316]" /> Total Budget
                </label>
                <span className="text-sm font-bold text-[#F97316]">
                  ₹{Number(budget).toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="500000"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#F97316]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                <span>₹1,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Destination Map Placeholder */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">
                Destination Overview
              </label>
              <div className="relative h-44 rounded-xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1797158/pexels-photo-1797158.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Destination map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white text-xs font-semibold">
                  <MapPin className="w-4 h-4 text-[#F97316]" />
                  {destination || 'Your destination will appear here'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#C84F14] hover:bg-[#A93D0E] text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-[#C84F14]/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Trip <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Info Cards ── */}
          <div className="lg:w-72 xl:w-80 space-y-4 flex-shrink-0">

            {/* Curator's Notes Card */}
            <div className="bg-[#FFF7ED] border border-[#FDE6D5] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-[#F97316] flex items-center justify-center">
                  <Info className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-[#0F172A]">Curator's Notes</h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Pick a meaningful trip name to easily find it later.',
                  'Select dates carefully — accurate durations help with planning.',
                  'Set a realistic budget to get the best itinerary suggestions.',
                  'Your travel style helps us personalise recommendations.',
                ].map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#64748B]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Planning Checklist */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A] mb-3">Planning Checklist</h3>
              <ul className="space-y-3">
                {CHECKLIST.map((item) => {
                  const isDone =
                    (item.id === 1 && tripName && startDate && endDate) ||
                    (item.id === 2 && travelStyle) ||
                    (item.id === 3 && budget > 0) ||
                    (item.id === 4 && false); // Future step
                  return (
                    <li key={item.id} className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                        isDone ? 'bg-[#F97316] border-[#F97316]' : 'border-slate-200'
                      }`}>
                        {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-xs ${isDone ? 'line-through text-slate-400' : 'text-slate-600 font-medium'}`}>
                        {item.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Decorative travel image */}
            <div className="rounded-2xl overflow-hidden shadow-sm h-44 relative">
              <img
                src="https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Travel inspiration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-xs font-bold uppercase tracking-wide text-[#FED7AA]">GlobeTrotter</p>
                <p className="text-sm font-bold leading-tight mt-0.5">Every journey begins<br/>with a single plan.</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Trip Summary</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Duration</span>
                  <span className="text-xs font-bold text-[#0F172A]">
                    {tripDays ? `${tripDays} days` : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Type</span>
                  <span className="text-xs font-bold text-[#0F172A]">{tripType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Style</span>
                  <span className="text-xs font-bold text-[#0F172A]">{travelStyle}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-2.5 mt-2.5">
                  <span className="text-xs font-bold text-slate-500">Budget</span>
                  <span className="text-sm font-bold text-[#F97316]">₹{Number(budget).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;
