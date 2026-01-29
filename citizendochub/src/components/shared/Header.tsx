import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Language } from '../../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">CDH</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CitizenDocHub</h1>
              <p className="text-sm text-gray-600">नागरिक कागजात केन्द्र</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              {language === 'np' ? 'सेवाहरू' : 'Services'}
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              {language === 'np' ? 'कसरी काम गर्छ' : 'How It Works'}
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              {language === 'np' ? 'हाम्रो बारेमा' : 'About Us'}
            </a>
            
            {/* Language Toggle */}
            <div className="flex items-center space-x-2 border-l pl-6">
              <button
                onClick={() => setLanguage('np')}
                className={`px-3 py-1 rounded-lg transition-colors ${language === 'np' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
              >
                नेपाली
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
              >
                English
              </button>
            </div>

            {/* Login Button */}
            <button 
              onClick={onLoginClick}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              {language === 'np' ? 'लगइन गर्नुहोस्' : 'Login'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={28} className="text-gray-700" /> : <Menu size={28} className="text-gray-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 mt-4">
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                {language === 'np' ? 'सेवाहरू' : 'Services'}
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                {language === 'np' ? 'कसरी काम गर्छ' : 'How It Works'}
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors">
                {language === 'np' ? 'हाम्रो बारेमा' : 'About Us'}
              </a>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => {
                      setLanguage('np');
                      setIsMenuOpen(false);
                    }}
                    className={`flex-1 py-3 rounded-lg transition-colors ${language === 'np' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    नेपाली
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsMenuOpen(false);
                    }}
                    className={`flex-1 py-3 rounded-lg transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    English
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    onLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {language === 'np' ? 'लगइन गर्नुहोस्' : 'Login'}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;