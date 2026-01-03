import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/auth.service';
import { User, MapPin, Mail, Phone, Globe, Save } from 'lucide-react';

const Profile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    city: '',
    country: '',
    phone: '',
    bio: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await getProfile();
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        city: user.city || '',
        country: user.country || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || ''
      });
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar / Avatar Card */}
          <div className="glass-panel p-6 text-center h-fit">
            <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-md">
                {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <User size={48} className="text-primary" />
                )}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{formData.first_name} {formData.last_name}</h2>
            <p className="text-gray-500 text-sm">@{formData.username}</p>
            <p className="mt-2 text-gray-600 flex items-center justify-center gap-1">
                <MapPin size={16} /> {formData.city}, {formData.country}
            </p>
          </div>

          {/* Main Edit Form */}
          <div className="md:col-span-2 glass-panel p-8">
            {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    name="first_name"
                    type="text"
                    className="input-field"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    name="last_name"
                    type="text"
                    className="input-field"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About Me</label>
                <textarea
                  name="bio"
                  rows="3"
                  className="input-field"
                  placeholder="Tell us about your travel dreams..."
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      name="city"
                      type="text"
                      className="input-field !pl-12"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <div className="relative">
                    <Globe size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      name="country"
                      type="text"
                      className="input-field !pl-12"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read-only)</label>
                   <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      className="input-field !pl-12 bg-gray-100 text-gray-500 cursor-not-allowed"
                      value={formData.email}
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                   <div className="relative">
                    <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      name="phone"
                      type="text"
                      className="input-field !pl-12"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                  <input
                    name="avatar_url"
                    type="text"
                    className="input-field"
                    placeholder="https://example.com/me.jpg"
                    value={formData.avatar_url}
                    onChange={handleChange}
                  />
                </div>

              <button type="submit" className="btn-primary flex items-center justify-center gap-2">
                <Save size={20} />
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
