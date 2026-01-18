import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }) => (
    <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-all duration-200 focus-within:border-violet-400/70 focus-within:bg-violet-500/10 focus-within:ring-1 focus-within:ring-violet-400/20">
        {children}
    </div>
);

const TestimonialCard = ({ testimonial, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: parseFloat(delay.replace('animate-delay-', '')) / 1000, duration: 0.8 }}
        className="flex items-start gap-4 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-full max-w-[280px]"
    >
        <img src={testimonial.avatarSrc} className="h-12 w-12 object-cover rounded-2xl shadow-lg" alt="avatar" />
        <div className="text-sm leading-snug">
            <p className="flex items-center gap-1 font-semibold text-foreground">{testimonial.name}</p>
            <p className="text-muted-foreground text-xs">{testimonial.handle}</p>
            <p className="mt-2 text-foreground/80 font-medium italic">"{testimonial.text}"</p>
        </div>
    </motion.div>
);

// --- MAIN COMPONENT ---

export const AuthPage = ({
    mode = 'signin', // 'signin' or 'signup'
    title,
    description,
    heroImageSrc,
    testimonials = [],
    onSubmit,
    onGoogleSignIn,
    onResetPassword,
    onCreateAccount,
    onSignInClick,
    googleButton,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isSignUp = mode === 'signup';

    const defaultTitle = isSignUp ?
        <span className="font-light text-foreground tracking-tighter">Create Account</span> :
        <span className="font-light text-foreground tracking-tighter">Welcome</span>;

    const defaultDescription = isSignUp ?
        "Join our community and start your journey today" :
        "Access your account and continue your journey with us";

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-geist w-full overflow-hidden bg-background">
            {/* Left column: form */}
            <section className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-3">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground"
                            >
                                {title || defaultTitle}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-muted-foreground text-lg"
                            >
                                {description || defaultDescription}
                            </motion.p>
                        </div>

                        <form className="space-y-6" onSubmit={onSubmit}>
                            {isSignUp && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="space-y-2"
                                >
                                    <label className="text-sm font-semibold text-muted-foreground ml-1">Full Name</label>
                                    <GlassInputWrapper>
                                        <input name="name" type="text" placeholder="Enter your full name" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none placeholder:text-muted-foreground/50" required />
                                    </GlassInputWrapper>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-2"
                            >
                                <label className="text-sm font-semibold text-muted-foreground ml-1">Email Address</label>
                                <GlassInputWrapper>
                                    <input name="email" type="email" placeholder="Enter your email address" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none placeholder:text-muted-foreground/50" required />
                                </GlassInputWrapper>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <label className="text-sm font-semibold text-muted-foreground ml-1">Password</label>
                                <GlassInputWrapper>
                                    <div className="relative">
                                        <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none placeholder:text-muted-foreground/50" required />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center">
                                            {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
                                        </button>
                                    </div>
                                </GlassInputWrapper>
                            </motion.div>

                            {!isSignUp && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name="rememberMe" className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-background transition-all" />
                                        <span className="text-foreground/70 group-hover:text-foreground transition-colors">Keep me signed in</span>
                                    </label>
                                    <button type="button" onClick={onResetPassword} className="hover:text-violet-500 font-medium text-violet-400 transition-colors">Reset password</button>
                                </motion.div>
                            )}

                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                type="submit"
                                className="w-full rounded-2xl bg-foreground text-background py-4 font-bold text-lg hover:opacity-90 transition-all active:scale-[0.98] shadow-xl"
                            >
                                {isSignUp ? 'Create Account' : 'Sign In'}
                            </motion.button>
                        </form>

                        <div className="relative flex items-center justify-center py-2">
                            <span className="w-full border-t border-border"></span>
                            <span className="px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-background absolute">Or continue with</span>
                        </div>

                        {googleButton ? (
                            <div className="w-full flex justify-center pt-2">
                                {googleButton}
                            </div>
                        ) : (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                onClick={onGoogleSignIn}
                                className="w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-all active:scale-[0.98] group"
                            >
                                <GoogleIcon />
                                <span className="font-semibold text-sm group-hover:text-foreground transition-colors">Continue with Google</span>
                            </motion.button>
                        )}

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center text-sm text-muted-foreground"
                        >
                            {isSignUp ? (
                                <>Already have an account? <button onClick={onSignInClick} className="text-violet-500 font-bold hover:underline ml-1 transition-colors">Sign In</button></>
                            ) : (
                                <>New to our platform? <button onClick={onCreateAccount} className="text-violet-500 font-bold hover:underline ml-1 transition-colors">Create Account</button></>
                            )}
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Right column: hero image + testimonials */}
            {heroImageSrc && (
                <section className="hidden md:block flex-1 relative p-4 bg-muted/30">
                    <motion.div
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute inset-4 rounded-[2.5rem] bg-cover bg-center shadow-2xl overflow-hidden group"
                        style={{ backgroundImage: `url(${heroImageSrc})` }}
                    >
                        <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/5"></div>
                    </motion.div>

                    {testimonials.length > 0 && (
                        <div className="absolute bottom-12 left-0 right-0 flex flex-wrap gap-4 px-12 justify-center">
                            <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-800" />
                            {testimonials[1] && <div className="hidden lg:flex"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1000" /></div>}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};
