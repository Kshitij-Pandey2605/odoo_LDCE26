import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { User, Mail, Globe, Heart, Trash2, ShieldAlert, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout, updatePreferences } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [updating, setUpdating] = useState(false);

  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const loadSavedDestinations = async () => {
    try {
      const response = await api.get('/api/saved-destinations');
      setSavedDestinations(response.data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    loadSavedDestinations();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toastError('Name and email are required.');
      return;
    }

    setUpdating(true);
    try {
      const response = await api.put('/api/profile', { name, email, language });
      updatePreferences(response.data); // Update AuthContext state
      toastSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      toastError(error.response?.data?.error || 'Failed to update settings.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUnsave = async (savedId) => {
    try {
      await api.delete(`/api/saved-destinations/${savedId}`);
      setSavedDestinations(savedDestinations.filter(d => d.id !== savedId));
      toastSuccess('Destination removed from favorites.');
    } catch (error) {
      console.error('Failed to unsave destination:', error);
      toastError('Failed to remove favorite.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: Are you absolutely sure you want to delete your GlobeTrotter account? This will permanently erase your profile, all trips, expenses, and settings. This cannot be undone.')) {
      return;
    }

    try {
      await api.delete('/api/profile');
      toastSuccess('Your account has been deleted. Goodbye!');
      await logout();
      navigate('/signup');
    } catch (error) {
      console.error('Failed to delete account:', error);
      toastError('Failed to delete your account.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-xs">
      {/* Left Columns: Edit profile settings */}
      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="h-5 w-5 text-brand-secondary" />
            <h2 className="text-sm font-extrabold text-slate-900">Profile Settings & Preferences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute inset-y-0 left-3 h-4 w-4 text-slate-400 mt-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute inset-y-0 left-3 h-4 w-4 text-slate-400 mt-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Default Language</label>
              <div className="relative">
                <Globe className="absolute inset-y-0 left-3 h-4 w-4 text-slate-400 mt-2.5" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                  <option value="de">Deutsch (DE)</option>
                  <option value="ja">日本語 (JA)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="bg-brand-primary hover:bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            {updating ? 'Saving...' : 'Save Settings'}
          </button>
        </form>

        {/* Saved Destinations Favorites panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <Heart className="h-4.5 w-4.5 text-rose-500 fill-current" />
            Saved Destinations
          </h2>
          {loadingSaved ? (
            <p className="text-slate-400 italic">Loading favorites...</p>
          ) : savedDestinations.length === 0 ? (
            <p className="text-slate-400 italic">No favorite cities saved yet. Visit the City discovery tab to save locations.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedDestinations.map((fav) => (
                <div
                  key={fav.id}
                  className="border border-slate-100 p-3.5 rounded-xl flex items-center justify-between gap-3 bg-slate-50 hover:border-slate-200 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-950 truncate text-xs">{fav.city.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{fav.city.region}, {fav.city.country}</p>
                  </div>
                  <button
                    onClick={() => handleUnsave(fav.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                    title="Remove Favorite"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Danger zone account actions */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-rose-800 font-extrabold">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            <h3>Danger Zone Console</h3>
          </div>
          <p className="text-[10px] text-rose-700 font-medium">
            Deleting your account will immediately wipe your profile preferences, custom activities, logged expenses, and trips. This process is immediate and irreversible.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
