import React from 'react';

const UserCard = React.memo(({ user }) => {
    if (!user) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center p-6 w-full max-w-sm group">
            <div className="relative mb-4">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img
                    className="relative w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-gray-50"
                    src={user.image || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`}
                    alt={`${user.firstName} ${user.lastName}`}
                />
            </div>

            <h2 className="text-xl font-bold text-gray-800 tracking-tight text-center">
                {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-blue-600 font-semibold mb-5 text-center bg-blue-50 px-3 py-1 rounded-full mt-2">
                {user.company?.title || user.role || 'Member'}
            </p>

            <div className="w-full bg-slate-50 p-4 rounded-xl space-y-3 mt-auto border border-slate-100">
                <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <span className="truncate flex-1">{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span>{user.phone}</span>
                </div>
            </div>
        </div>
    );
});

export default UserCard;