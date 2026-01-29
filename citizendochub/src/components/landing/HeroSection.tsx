import React from 'react';
import type { Language } from '../../types';

interface HeroSectionProps {
  language: Language;
  onLoginClick: () => void;
  onOfficerLoginClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  language, 
  onLoginClick,
  onOfficerLoginClick 
}) => {
  // Stats data organized by language
  const statsData = {
    en: {
      successRate: { value: "98%", label: "Success Rate" },
      serviceAvailable: { value: "24/7", label: "Service Available" },
      noQueueWaiting: { value: "0", label: "No Queue Waiting" },
      dataSecure: { value: "100%", label: "Data Secure" }
    },
    np: {
      successRate: { value: "९८%", label: "सफल दर" },
      serviceAvailable: { value: "२४/७", label: "सेवा उपलब्ध" },
      noQueueWaiting: { value: "०", label: "लाइनमा बस्नु पर्दैन" },
      dataSecure: { value: "१००%", label: "डाटा सुरक्षित" }
    }
  };

  // Get current language data
  const currentStats = statsData[language] || statsData.en;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">

      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {language === 'np' 
              ? 'घरबाटै सबै सरकारी कागजात पेश गर्नुहोस्' 
              : 'Submit All Government Documents From Home'}
          </h1>
          
          {/* Sub-heading */}
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            {language === 'np'
              ? 'नागरिकता प्रमाणपत्र, जन्म दर्ता, विवाह दर्ता - सबै कागजात एकै ठाउँमा'
              : 'Citizenship Certificate, Birth Registration, Marriage Registration - All in One Place'}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {/* Submit Documents Button */}
            <button 
              onClick={onLoginClick}
              className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:scale-105 group"
            >
              <div className="flex items-center justify-center gap-2">
                <span>{language === 'np' ? 'कागजात पेश गर्नुहोस्' : 'Submit Documents'}</span>
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            {/* Government Officer Button */}
            <button 
              onClick={() => onOfficerLoginClick?.()}
              className="px-8 py-4 bg-transparent border-2 border-white text-lg rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group"
            >
              <div className="flex items-center justify-center gap-2">
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{language === 'np' ? 'सरकारी कर्मचारी लगदुन' : 'Government Officer Login'}</span>
              </div>
            </button>
          </div>
          
          {/* Stats Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{currentStats.successRate.value}</div>
                <div className="text-sm opacity-90">{currentStats.successRate.label}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{currentStats.serviceAvailable.value}</div>
                <div className="text-sm opacity-90">{currentStats.serviceAvailable.label}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{currentStats.noQueueWaiting.value}</div>
                <div className="text-sm opacity-90">{currentStats.noQueueWaiting.label}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{currentStats.dataSecure.value}</div>
                <div className="text-sm opacity-90">{currentStats.dataSecure.label}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-auto" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 45C840 60 960 90 1080 97.5C1200 105 1320 90 1380 82.5L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;