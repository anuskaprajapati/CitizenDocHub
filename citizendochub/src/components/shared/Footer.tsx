import React from 'react';
import type { Language } from '../../types';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Shield, Lock } from 'lucide-react';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column without logo */}
          <div>
            <h2 className="text-xl font-bold mb-2">CitizenDocHub</h2>
            <p className="text-sm text-gray-400 mb-4">नागरिक कागजात केन्द्र</p>
            <p className="text-gray-400 mb-6">
              {language === 'np'
                ? 'नागरिकता, जन्म दर्ता, र विवाह दर्ता सेवाहरू डिजिटल बनाउने हाम्रो अभियान'
                : 'Our mission to digitize citizenship, birth, and marriage certificate services'}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">
              {language === 'np' ? 'छिटो लिङ्कहरू' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">{language === 'np' ? 'सेवाहरू' : 'Services'}</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">{language === 'np' ? 'कसरी काम गर्छ' : 'How It Works'}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{language === 'np' ? 'सेवा शुल्क' : 'Service Fees'}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{language === 'np' ? 'सहयोग केन्द्र' : 'Help Center'}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{language === 'np' ? 'सामान्य प्रश्नहरू' : 'FAQs'}</a></li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">
              {language === 'np' ? 'महत्वपूर्ण लिङ्कहरू' : 'Important Links'}
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{language === 'np' ? 'गोपनीयता नीति' : 'Privacy Policy'}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{language === 'np' ? 'सम्पर्क गर्नुहोस्' : 'Contact Us'}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{language === 'np' ? 'कार्यक्रम' : 'Careers'}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">
              {language === 'np' ? 'सम्पर्क' : 'Contact'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Phone size={20} className="text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">{language === 'np' ? '९८०१२३४५६७, ०१-४२३४५६७' : '9801234567, 01-4234567'}</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">support@citizendochub.np</span>
              </li>
              <li className="flex items-start">
                <MapPin size={20} className="text-gray-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  {language === 'np'
                    ? 'काठमाडौँ, नेपाल'
                    : 'Kathmandu, Nepal'}
                </span>
              </li>
            </ul>
            
            {/* Security Badges */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield size={20} className="text-green-400" />
                  <span className="text-sm text-gray-400">SSL Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock size={20} className="text-blue-400" />
                  <span className="text-sm text-gray-400">GDPR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              {language === 'np'
                ? '© २०२५ CitizenDocHub. सर्वाधिकार सुरक्षित।'
                : '© 2025 CitizenDocHub. All rights reserved.'}
            </p>
            <div className="flex items-center space-x-6">
              <p className="text-gray-400 text-sm">
                {language === 'np'
                  ? 'नेपाल सरकारको आधिकारिक भागीदार'
                  : 'Official Partner of Government of Nepal'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;