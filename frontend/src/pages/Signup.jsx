import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth.service';
import { UserPlus } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    city: '',
    country: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      showToast('Account created! Please login.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-10">
      <div className="glass-panel w-full max-w-2xl p-8">
        <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-secondary/30">
                <UserPlus size={24} />
            </div>
          <h2 className="text-2xl font-bold text-gray-800">Join VibeHolidays</h2>
          <p className="text-gray-500">Create your traveler profile</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              name="username"
              type="text"
              placeholder="GlobeTrotter99"
              className="input-field"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              name="first_name"
              type="text"
              placeholder="John"
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
              placeholder="Doe"
              className="input-field"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
           <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              name="city"
              type="text"
              placeholder="New York"
              className="input-field"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              name="country"
              type="text"
              placeholder="USA"
              className="input-field"
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button type="submit" className="btn-primary">
              Register
            </button>
          </div>
        </form>
         <div className="mt-6 text-center text-sm text-gray-500">
          Already have a passport?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
