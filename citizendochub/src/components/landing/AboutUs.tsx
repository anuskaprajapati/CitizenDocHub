// components/landing/AboutUs.tsx
import React from 'react';
import type { Language } from '../../types';
import { Users, Target, Shield, Award } from 'lucide-react';

interface AboutUsProps {
  language: Language;
}

const AboutUs: React.FC<AboutUsProps> = ({ language }) => {
  const features = [
    {
      icon: <Target className="text-blue-600" size={24} />,
      title: language === 'np' ? 'हाम्रो मिशन' : 'Our Mission',
      description: language === 'np' 
        ? 'सरकारी सेवाहरू डिजिटल रूपमा पहुँचयोग्य बनाउनु'
        : 'To make government services digitally accessible'
    },
    {
      icon: <Shield className="text-green-600" size={24} />,
      title: language === 'np' ? 'सुरक्षा' : 'Security',
      description: language === 'np'
        ? 'उच्च गोपनीयता मानकहरूको साथ डाटा सुरक्षित गर्नु'
        : 'Secure data with high privacy standards'
    },
    {
      icon: <Users className="text-purple-600" size={24} />,
      title: language === 'np' ? 'सेवाका क्षेत्र' : 'Service Coverage',
      description: language === 'np'
        ? 'सम्पूर्ण नेपालभरि सेवा उपलब्ध'
        : 'Service available across all of Nepal'
    },
    {
      icon: <Award className="text-yellow-600" size={24} />,
      title: language === 'np' ? 'गुणस्तर' : 'Quality',
      description: language === 'np'
        ? 'राज्यको गुणस्तरका साथ सेवा प्रदान गर्नु'
        : 'Provide service with state-level quality'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'np' ? 'हाम्रो बारेमा' : 'About Us'}
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {language === 'np'
              ? 'सिटिजन डक हब नागरिकहरूलाई सरकारी सेवाहरू डिजिटल रूपमा पहुँच गराउने एक प्लेटफर्म हो। हाम्रो लक्ष्य नागरिकता प्रमाणपत्र, जन्म दर्ता, र विवाह दर्ता जस्ता सेवाहरू सजिलो र पारदर्शी बनाउनु हो।'
              : 'Citizen Doc Hub is a platform designed to provide citizens with digital access to government services. Our mission is to simplify and make transparent services like citizenship certificates, birth registration, and marriage registration.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {language === 'np' ? 'हाम्रो इतिहास' : 'Our History'}
              </h3>
              <p className="mb-6 opacity-90">
                {language === 'np'
                  ? '२०२० मा सुरु गरिएको, सिटिजन डक हबले नेपाल सरकारको साथ सहकार्य गर्दै लाखौं नागरिकहरूलाई सेवा प्रदान गरिसकेको छ। हामी निरन्तर नयाँ प्रविधि समेट्छौं र सेवा गुणस्तर सुधार्छौं।'
                  : 'Founded in 2020, Citizen Doc Hub has served millions of citizens in collaboration with the Government of Nepal. We continuously integrate new technologies and improve service quality.'}
              </p>
              <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                {language === 'np' ? 'थप जानकारी' : 'Learn More'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-3xl font-bold">
                  {language === 'np' ? '५००+' : '500+'}
                </div>
                <div className="text-sm opacity-90">
                  {language === 'np' ? 'नगरपालिका' : 'Municipalities'}
                </div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-3xl font-bold">
                  {language === 'np' ? '१० लाख+' : '10 Lakhs+'}</div>
                <div className="text-sm opacity-90">
                  {language === 'np' ? 'प्रयोगकर्ता' : 'Users'}
                </div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-3xl font-bold">
                  {language === 'np' ? '९८%' : '98%'}
                </div>
                <div className="text-sm opacity-90">
                  {language === 'np' ? 'सन्तुष्टि दर' : 'Satisfaction Rate'}
                </div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-3xl font-bold">
                  {language === 'np' ? '२४/७' : '24/7'}
                </div>
                <div className="text-sm opacity-90">
                  {language === 'np' ? 'सहयोग' : 'Support'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;