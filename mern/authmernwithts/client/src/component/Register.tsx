import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Register: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { error: contextError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Registration failed');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-4xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-600">
          Join Us
        </h2>
        <p className="text-gray-500 text-center mb-8">Create your premium account</p>
        
        {(localError || contextError) && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-xl">
            {localError || contextError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none"
              placeholder="johndoe" 
              value={formData.username} 
              onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none"
              placeholder="name@example.com" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none"
              placeholder="••••••••" 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 px-6 text-white font-bold bg-gradient-to-r from-pink-600 to-red-600 rounded-xl hover:opacity-90 transform active:scale-95 transition-all shadow-lg shadow-pink-200"
          >
            Create Account
          </button>
        </form>
        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500 font-medium">Have an account? </span>
          <Link to="/login" className="text-pink-600 font-bold hover:underline">Sign In here</Link>
        </div>
      </div>
    </div>
  );
};
export default Register;