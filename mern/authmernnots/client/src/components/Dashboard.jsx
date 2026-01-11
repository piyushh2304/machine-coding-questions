import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="p-8 bg-white rounded-xl shadow-md text-center">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Welcome back!</h1>
                <div className="space-y-2 mb-6">
                    <p className="text-lg text-slate-600">Username: <span className="font-semibold text-indigo-600">{user?.username}</span></p>
                    <p className="text-lg text-slate-600">Email: <span className="font-semibold text-indigo-600">{user?.email}</span></p>
                </div>
                <button
                    onClick={logout}
                    className="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200 font-medium"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};
export default Dashboard;