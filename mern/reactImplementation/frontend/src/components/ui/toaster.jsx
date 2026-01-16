import React from 'react';
import { useToast } from '@/context/toast-context';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Toaster = () => {
    const { toasts, dismiss } = useToast();

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        layout
                        className={cn(
                            "pointer-events-auto relative overflow-hidden rounded-xl border p-4 pr-12 shadow-lg backdrop-blur-md transition-all",
                            toast.variant === "destructive"
                                ? "bg-destructive/10 border-destructive/20 text-destructive-foreground dark:text-red-200"
                                : "bg-white/10 border-white/10 text-foreground"
                        )}
                    >
                        <div className="flex gap-3">
                            <div className={cn(
                                "mt-0.5 shrink-0",
                                toast.variant === "destructive" ? "text-red-500" : "text-emerald-500"
                            )}>
                                {toast.variant === "destructive" ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                            </div>
                            <div className="flex flex-col gap-1">
                                {toast.title && <h3 className="font-semibold text-sm">{toast.title}</h3>}
                                {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
                            </div>
                        </div>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className={cn(
                                "absolute right-2 top-2 rounded-lg p-2 transition-colors hover:bg-black/10",
                                toast.variant === "destructive" ? "hover:bg-red-500/10" : "hover:bg-white/10"
                            )}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
