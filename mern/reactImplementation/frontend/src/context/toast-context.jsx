import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({
    toasts: [],
    toast: () => { },
    dismiss: () => { },
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback(({ title, description, variant = "default", duration = 3000 }) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { id, title, description, variant, duration };

        setToasts((prev) => [...prev, newToast]);

        if (duration !== Infinity) {
            setTimeout(() => {
                dismiss(id);
            }, duration);
        }
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
        </ToastContext.Provider>
    );
};
