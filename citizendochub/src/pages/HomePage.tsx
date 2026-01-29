import React from 'react';
import type { Language } from '../types/index';
import Header from '../components/shared/Header';
import HeroSection from '../components/landing/HeroSection';
import ServiceCards from '../components/landing/ServiceCards';
import HowItWorks from '../components/landing/HowItWorks';
import Footer from '../components/shared/Footer';

interface HomePageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onLoginClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ language, setLanguage, onLoginClick }) => {
  return (
    <div className="min-h-screen">
      <Header language={language} setLanguage={setLanguage} onLoginClick={onLoginClick} />
      <HeroSection language={language} onLoginClick={onLoginClick} />
      <ServiceCards language={language} />
      <HowItWorks language={language} />
      <Footer language={language} />
    </div>
  );
};

export default HomePage;