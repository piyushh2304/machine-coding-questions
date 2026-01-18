import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPage } from '@/components/ui/sign-in';
import { AuthContext } from '../context/auth-context';
import { useToast } from '../context/toast-context';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';

const sampleTestimonials = [
    {
        avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
        name: "Sarah Chen",
        handle: "@sarahdigital",
        text: "Amazing platform! The user experience is seamless and the features are exactly what I needed."
    },
    {
        avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
        name: "Marcus Johnson",
        handle: "@marcustech",
        text: "This service has transformed how I work. Clean design, powerful features, and excellent support."
    }
];

const RegisterPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSignUp = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            login(data);
            toast({
                title: "Account created!",
                description: "Welcome to the platform.",
            });
            navigate('/dashboard');
        } catch (error) {
            toast({
                title: "Registration failed",
                description: error.response?.data?.message || 'Something went wrong',
                variant: "destructive"
            });
        }
    };

    const handleGoogleSignIn = () => {
        toast({
            title: "Coming Soon",
            description: "Google Sign In is currently under development.",
            variant: "default"
        });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            // Send the token to backend
            const { data } = await api.post('/auth/google', { token: credential });
            login(data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Google Logic Failed', error);
            alert('Google Login Failed');
        }
    };

    const handleGoogleError = () => {
        console.log('Login Failed');
        alert('Google Login Failed');
    };

    const handleSignInClick = () => {
        navigate('/login');
    }

    return (
        <AuthPage
            mode="signup"
            heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
            testimonials={sampleTestimonials}
            onSubmit={handleSignUp}
            onGoogleSignIn={handleGoogleSignIn}
            onSignInClick={handleSignInClick}
            googleButton={
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_black"
                    shape="pill"
                    text="signup_with"
                    width="320"
                />
            }
        />
    );
};

export default RegisterPage;
