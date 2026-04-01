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
    console.log('App useEffect - loading:', loading, 'user:', user?.email, 'userRole:', userRole);
    
    if (!loading) {
      if (user) {
        // User is logged in, redirect to appropriate dashboard based on role
        console.log('User logged in, role:', userRole);
        
        if (userRole === 'citizen') {
          console.log('Redirecting to Citizen Dashboard');
          setCurrentPage('citizen');
        } else if (userRole === 'officer') {
          console.log('Redirecting to Officer Dashboard');
          setCurrentPage('officer');
        } else if (userRole === 'admin') {
          console.log('Redirecting to Admin Dashboard');
          setCurrentPage('admin');
        } else {
          // Default to citizen if role not determined
          console.log('Role not determined, defaulting to Citizen Dashboard');
          setCurrentPage('citizen');
        }
      } else {
        // User is not logged in, show home page
        if (currentPage !== 'home' && currentPage !== 'login') {
          console.log('No user, redirecting to Home');
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

  const handleLogin = async (userType: UserType, credentials: { email: string; password: string }) => {
    console.log('App: Attempting login with:', { email: credentials.email, userType });
    
    if (!credentials.email || !credentials.password) {
      alert(language === 'np' ? 'इमेल र पासवर्ड आवश्यक छ' : 'Email and password are required');
      return;
    }
    
    const result = await signIn(credentials.email, credentials.password);
    
    if (result.success) {
      console.log('Login successful');
      // The useEffect will handle redirect based on role
    } else {
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
    console.log('Rendering page:', currentPage);
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