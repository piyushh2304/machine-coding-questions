import React from 'react';
import { useAuth } from '../context/AuthContext';
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">👋</span>
        </div>
        <h1 className="text-4xl font-black text-slate-800 mb-2">Hello, {user?.username}!</h1>
        <p className="text-slate-500 font-medium mb-10">You're logged in with {user?.email}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-sm text-indigo-600 font-bold uppercase tracking-wider">Plan</p>
                <p className="text-xl font-bold text-slate-800">Pro Developer</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <p className="text-sm text-purple-600 font-bold uppercase tracking-wider">Status</p>
                <p className="text-xl font-bold text-slate-800">Verified</p>
            </div>
        </div>
        <button 
          onClick={logout} 
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-xl shadow-slate-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
export default Dashboard;