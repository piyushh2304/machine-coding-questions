import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPage } from '@/components/ui/sign-in';
import { AuthContext } from '../context/auth-context';
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

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignIn = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data);
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    const handleGoogleSignIn = () => {
        alert("Google Sign In selected - Implementation pending");
    };

    const handleResetPassword = () => {
        alert("Reset Password selected");
    }

    const handleCreateAccount = () => {
        navigate('/register');
    }

    return (
        <AuthPage
            mode="signin"
            heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
            testimonials={sampleTestimonials}
            onSubmit={handleSignIn}
            onGoogleSignIn={handleGoogleSignIn}
            onResetPassword={handleResetPassword}
            onCreateAccount={handleCreateAccount}
        />
    );
};

export default LoginPage;
