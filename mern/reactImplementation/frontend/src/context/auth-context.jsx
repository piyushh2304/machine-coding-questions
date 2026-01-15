import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
    user: null,
    login: () => { },
    logout: () => { },
    loading: true
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
    }

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}