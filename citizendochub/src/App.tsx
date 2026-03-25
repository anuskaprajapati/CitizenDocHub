import React, { useState, useEffect } from 'react';
import type { Language, UserType } from './types';
import HomePage from './pages/HomePage';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/auth/LoginPage';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'citizen' | 'officer' | 'admin'>('home');
  const [language, setLanguage] = useState<Language>('np');
  const { user, userRole, loading, signIn, signOut } = useFirebaseAuth();

  // Auto-redirect based on auth state
  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in, redirect to appropriate dashboard
        if (userRole === 'citizen') {
          setCurrentPage('citizen');
        } else if (userRole === 'officer') {
          setCurrentPage('officer');
        } else if (userRole === 'admin') {
          setCurrentPage('admin');
        } else {
          setCurrentPage('citizen'); // Default to citizen if role not set
        }
      } else {
        // User is not logged in, show home page
        if (currentPage !== 'home' && currentPage !== 'login') {
          setCurrentPage('home');
        }
      }
    }
  }, [user, userRole, loading]);

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleOfficerLoginClick = () => {
    setCurrentPage('login');
  };

  // Fixed: Handle login with proper credentials
  const handleLogin = async (userType: UserType, credentials: { email: string; password: string }) => {
    console.log('Attempting login with:', credentials.email);
    
    if (!credentials.email || !credentials.password) {
      alert(language === 'np' ? 'इमेल र पासवर्ड आवश्यक छ' : 'Email and password are required');
      return;
    }
    
    const result = await signIn(credentials.email, credentials.password);
    
    if (result.success) {
      console.log('Login successful');
      // The useEffect will handle redirect based on role
    } else {
      console.error('Login failed:', result.error);
      alert(language === 'np' 
        ? `लगइन असफल: ${result.error}` 
        : `Login failed: ${result.error}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentPage('home');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'np' ? 'en' : 'np');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handleNavigateToRegister = () => {
    console.log('Navigate to register');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <Login
            language={language}
            onToggleLanguage={toggleLanguage}
            onNavigateToRegister={handleNavigateToRegister}
            onForgotPassword={handleForgotPassword}
            onLogin={handleLogin}
            onBackToHome={handleBackToHome}
          />
        );
      case 'citizen':
        return <CitizenDashboard language={language} onLogout={handleLogout} />;
      case 'officer':
        return <OfficerDashboard language={language} onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard language={language} onLogout={handleLogout} />;
      default:
        return (
          <HomePage 
            language={language} 
            setLanguage={setLanguage}
            onLoginClick={handleLoginClick}
            onOfficerLoginClick={handleOfficerLoginClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
};

export default App;