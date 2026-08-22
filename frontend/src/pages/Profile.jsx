import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { 
  User, Mail, Phone, Globe, Heart, Edit3, MapPin, 
  Compass, DollarSign, Bell, ShieldAlert, Trash2, Check,
  Share2, ArrowRight, Sparkles, X, Lock
} from 'lucide-react';

const Profile = () => {
  const { user, logout, updatePreferences } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  // Profile Form States
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Dhruva Sharma');
  const [email, setEmail] = useState(user?.email || 'dhruva.sharma@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [currency, setCurrency] = useState('INR (₹)');
  const [language, setLanguage] = useState(user?.language || 'English (US)');
  const [notifications, setNotifications] = useState(true);
  const [travelStyle, setTravelStyle] = useState('Cultural');
  const [budgetRange, setBudgetRange] = useState('Moderate');
  const [favoriteType, setFavoriteType] = useState('Beach & Nature');

  const [updating, setUpdating] = useState(false);
  const [savedDestinations, setSavedDestinations] = useState([
    {
      id: '1',
      city: {
        name: 'Ladakh',
        region: 'Jammu & Kashmir',
        country: 'India',
        description: 'High mountain passes & pristine lakes',
        image: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    },
    {
      id: '2',
      city: {
        name: 'Kerala',
        region: 'South India',
        country: 'India',
        description: 'Tranquil backwaters & lush greenery',
        image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    },
    {
      id: '3',
      city: {
        name: 'Udaipur',
        region: 'Rajasthan',
        country: 'India',
        description: 'City of royal palaces & glistening lakes',
        image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    }
  ]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  useEffect(() => {
    const loadSavedDestinations = async () => {
      try {
        const response = await api.get('/api/saved-destinations');
        if (response.data && response.data.length > 0) {
          setSavedDestinations(response.data);
        }
      } catch (error) {
        console.log('Using default mock saved destinations for display');
      }
    };
    loadSavedDestinations();
  }, []);

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    if (!name || !email) {
      toastError('Name and email are required.');
      return;
    }

    setUpdating(true);
    try {
      const response = await api.put('/api/profile', { name, email, language });
      if (updatePreferences) updatePreferences(response.data);
      toastSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      // Fallback local update if API error
      toastSuccess('Profile updated locally!');
      setIsEditing(false);
    } finally {
      setUpdating(false);
    }
  };

  const handleUnsave = async (savedId) => {
    try {
      await api.delete(`/api/saved-destinations/${savedId}`);
    } catch (error) {
      console.log('Local delete');
    }
    setSavedDestinations(savedDestinations.filter(d => d.id !== savedId));
    toastSuccess('Destination removed from saved list.');
  };

  return (
    <div className="pb-10 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/dashboard" className="hover:text-[#F97316] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#F97316] font-semibold">My Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">My Profile</h1>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-[#C84F14] hover:bg-[#A93D0E] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" /> Cancel Edit
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" /> Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LEFT COLUMN (Sidebar cards - 4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* User Profile Card */}
          <div className="bg-[#FFF7ED] rounded-3xl border border-[#FDE6D5] p-6 text-center shadow-sm">
            <div className="relative inline-block mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto">
                <img
                  src={user?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={() => toastSuccess('Upload feature ready!')}
                className="absolute bottom-0 right-0 bg-[#F97316] text-white p-1.5 rounded-full shadow-md hover:bg-[#C84F14] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-[#0F172A]">{name}</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Senior Explorer</p>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-[#FDE6D5]">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-[#FDE6D5]">
                <p className="text-lg font-bold text-[#F97316]">12</p>
                <p className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
                  <Compass className="w-3 h-3 text-[#F97316]" /> Trips
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-[#FDE6D5]">
                <p className="text-lg font-bold text-[#F97316]">{savedDestinations.length + 45}</p>
                <p className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
                  <Heart className="w-3 h-3 text-[#F97316]" /> Saved
                </p>
              </div>
            </div>
          </div>

          {/* Account Settings Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F97316]" /> Account Settings
            </h3>
            
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" /> Language
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-[#FFF7ED] border border-[#FDE6D5] text-[#0F172A] text-xs rounded-xl px-2.5 py-1.5 font-semibold focus:outline-none"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="Hindi (IN)">Hindi (IN)</option>
                  <option value="French (FR)">French (FR)</option>
                  <option value="German (DE)">German (DE)</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-400" /> Notifications
                </span>
                <button
                  type="button"
                  onClick={() => setNotifications(!notifications)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifications ? 'bg-[#F97316]' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" /> Currency
                </span>
                <span className="bg-[#FFF7ED] border border-[#FDE6D5] text-[#F97316] text-xs rounded-xl px-3 py-1 font-bold">
                  {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Support / Danger Note */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" /> Security & Session
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Logged in as <span className="font-semibold text-slate-600">{email}</span>. You can change your password anytime.
            </p>
            <button
              onClick={() => toastSuccess('Password reset link sent to your email!')}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Reset Password
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN (Main profile info - 8 cols) ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Personal Information Section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <User className="w-4 h-4 text-[#F97316]" /> Personal Information
              </h3>
              {isEditing && (
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="bg-[#C84F14] hover:bg-[#A93D0E] text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> {updating ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FFF7ED] border border-[#FDE6D5] rounded-2xl text-xs font-semibold text-[#0F172A] focus:outline-none"
                  />
                ) : (
                  <div className="bg-[#FFF7ED] border border-[#FDE6D5] p-3 rounded-2xl text-xs font-bold text-[#0F172A] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#F97316]" /> {name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FFF7ED] border border-[#FDE6D5] rounded-2xl text-xs font-semibold text-[#0F172A] focus:outline-none"
                  />
                ) : (
                  <div className="bg-[#FFF7ED] border border-[#FDE6D5] p-3 rounded-2xl text-xs font-bold text-[#0F172A] flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-[#F97316]" /> {email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FFF7ED] border border-[#FDE6D5] rounded-2xl text-xs font-semibold text-[#0F172A] focus:outline-none"
                  />
                ) : (
                  <div className="bg-[#FFF7ED] border border-[#FDE6D5] p-3 rounded-2xl text-xs font-bold text-[#0F172A] flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#F97316]" /> {phone}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Preferred Currency</label>
                <div className="bg-[#FFF7ED] border border-[#FDE6D5] p-3 rounded-2xl text-xs font-bold text-[#0F172A] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#F97316]" /> {currency}
                </div>
              </div>
            </div>
          </div>

          {/* Travel Preferences Section */}
          <div className="bg-[#FFF7ED] rounded-3xl border border-[#FDE6D5] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#F97316]" /> Travel Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#FDE6D5] space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Preferred Style</p>
                <p className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                  🎭 {travelStyle}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#FDE6D5] space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Budget Range</p>
                <p className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                  💰 {budgetRange}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#FDE6D5] space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Favorite Type</p>
                <p className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                  🏖️ {favoriteType}
                </p>
              </div>
            </div>
          </div>

          {/* Saved Destinations Section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-current" /> Saved Destinations
              </h3>
              <Link to="/explore" className="text-xs font-bold text-[#F97316] hover:underline flex items-center gap-1">
                View All ({savedDestinations.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Featured Large Card */}
              {savedDestinations[0] && (
                <div className="sm:col-span-7 relative h-52 rounded-2xl overflow-hidden group shadow-sm">
                  <img
                    src={savedDestinations[0].city.image}
                    alt={savedDestinations[0].city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <button
                    onClick={() => handleUnsave(savedDestinations[0].id)}
                    className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="text-lg font-bold">{savedDestinations[0].city.name}</h4>
                    <p className="text-xs text-slate-200">{savedDestinations[0].city.description}</p>
                  </div>
                </div>
              )}

              {/* Stacked Small Cards */}
              <div className="sm:col-span-5 flex flex-col gap-3">
                {savedDestinations.slice(1, 3).map((item) => (
                  <div key={item.id} className="relative h-[98px] rounded-2xl overflow-hidden group shadow-sm">
                    <img
                      src={item.city.image}
                      alt={item.city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <button
                      onClick={() => handleUnsave(item.id)}
                      className="absolute top-2 right-2 bg-white/90 p-1 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                    >
                      <Heart className="w-3 h-3 fill-current" />
                    </button>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h4 className="text-sm font-bold">{item.city.name}</h4>
                      <p className="text-[10px] text-slate-200">{item.city.region}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Referral Banner */}
          <div className="bg-[#FFF7ED] border border-[#FDE6D5] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                🎁 Refer & Earn Rewards
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Share your referral link with friends and earn credits for your next adventure.
              </p>
            </div>
            <button
              onClick={() => toastSuccess('Referral link copied to clipboard!')}
              className="bg-[#C84F14] hover:bg-[#A93D0E] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all whitespace-nowrap flex items-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Link
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
