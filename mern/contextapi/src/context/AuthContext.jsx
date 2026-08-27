import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext();


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email, password) => {
        const fakeUser = {
            email,
            name: piyush
        };
        localStorage.setItem("user", JSON.stringify(fakeUser));
        setUser(fakeUser);
    }

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}