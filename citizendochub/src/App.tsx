import React, { useState } from 'react';
import type { Language, UserType } from './types';
import HomePage from './pages/HomePage';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/auth/LoginPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'citizen' | 'officer' | 'admin'>('home');
  const [language, setLanguage] = useState<Language>('np');

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleLogin = (userType: UserType) => {
    setCurrentPage(userType); // Directly set to the dashboard
  };

  const handleLogout = () => {
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

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <Login
            language={language}
            onToggleLanguage={toggleLanguage}
            onNavigateToRegister={handleNavigateToRegister}
            onForgotPassword={handleForgotPassword}
            onLogin={handleLogin} // Pass the login handler
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