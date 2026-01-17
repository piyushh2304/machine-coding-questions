import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/auth-context';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '../context/toast-context';
import { ChevronLeft, User, Lock, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
    const { user, login } = useContext(AuthContext); // login updates local state
    const { toast } = useToast();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const res = await updateUserProfile({
                name,
                email,
                password: password || undefined
            });
            //update local context
            login({ ...user, ...res.data });
            toast({ title: "Success", description: "Profile updated successfully!" });
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Update failed",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-card border border-border/50 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 opacity-50" />

                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-xl">
                        <ChevronLeft />
                    </Button>
                    <h1 className="text-2xl font-bold">Profile Settings</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 bg-muted/50 border-input/50 h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Email Address</label>
                        <Input
                            value={email}
                            disabled
                            className="bg-muted/20 border-input/20 h-11 cursor-not-allowed opacity-70"
                        />
                    </div>

                    <div className="pt-4 border-t border-border/30 space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Change Password</h3>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Leave blank to keep current"
                                    className="pl-10 bg-muted/50 border-input/50 h-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="pl-10 bg-muted/50 border-input/50 h-11"
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white mt-6 font-semibold shadow-lg shadow-violet-600/20" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;