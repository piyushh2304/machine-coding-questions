import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in context and available via 'error'
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-4xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-8">Please enter your details</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-xl">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 px-6 text-white font-bold bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:opacity-90 transform active:scale-95 transition-all shadow-lg shadow-purple-200"
          >
            Sign In
          </button>
        </form>
        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500 font-medium">New here? </span>
          <Link to="/register" className="text-purple-600 font-bold hover:underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
};
export default Login;