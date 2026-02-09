import React from 'react';
import type { Language } from '../types/index';
import Header from '../components/shared/Header';
import HeroSection from '../components/landing/HeroSection';
import ServiceCards from '../components/landing/ServiceCards';
import HowItWorks from '../components/landing/HowItWorks';
import AboutUs from '../components/landing/AboutUs';
import Footer from '../components/shared/Footer';

interface HomePageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onLoginClick: () => void;
  onOfficerLoginClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ language, setLanguage, onLoginClick, onOfficerLoginClick }) => {
  const handleOfficerClick = () => {
    console.log('Government Officer Login Clicked');
    onOfficerLoginClick();
  };

  const handleCitizenClick = () => {
    console.log('Citizen Login Clicked');
    onLoginClick();
  };
  
  return (
    <div className="min-h-screen">
      <Header language={language} setLanguage={setLanguage} onLoginClick={onLoginClick} />
      <HeroSection language={language} onLoginClick={onLoginClick} onOfficerLoginClick={onOfficerLoginClick}/>
      <ServiceCards language={language} onApplyClick={onLoginClick} />
      <HowItWorks language={language} />
      <AboutUs language={language} />
      <Footer language={language} />
    </div>
  );
};

export default HomePage;