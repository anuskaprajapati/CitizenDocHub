import React from 'react';
import type { Language } from '../../types';
import { FileText, Upload, Search, Download } from 'lucide-react';

interface HowItWorksProps {
  language: Language;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ language }) => {
  const steps = [
    {
      id: 1,
      number: "१",
      numberEn: 1,
      title: "सेवा छान्नुहोस्",
      titleEn: "Select Service",
      description: "नागरिकता प्रमाणपत्र, जन्म दर्ता, वा विवाह दर्ता मध्ये एउटा सेवा छान्नुहोस्",
      descriptionEn: "Choose one service: Citizenship Certificate, Birth Registration, or Marriage Registration",
      icon: <FileText className="text-blue-600" size={32} />
    },
    {
      id: 2,
      number: "२",
      numberEn: 2,
      title: "कागजात अपलोड गर्नुहोस्",
      titleEn: "Upload Documents",
      description: "आवश्यक कागजातहरू स्क्यान गरेर वा फोटो खिचेर अपलोड गर्नुहोस्",
      descriptionEn: "Upload required documents by scanning or taking photos",
      icon: <Upload className="text-green-600" size={32} />
    },
    {
      id: 3,
      number: "३",
      numberEn: 3,
      title: "आवेदन पेश गर्नुहोस्",
      titleEn: "Submit Application",
      description: "आफ्नो विवरण भरेर आवेदन पेश गर्नुहोस् र भुक्तानी गर्नुहोस्",
      descriptionEn: "Fill your details, submit application and make payment",
      icon: <Search className="text-yellow-600" size={32} />
    },
    {
      id: 4,
      number: "४",
      numberEn: 4,
      title: "प्रमाणपत्र प्राप्त गर्नुहोस्",
      titleEn: "Receive Certificate",
      description: "डिजिटल प्रमाणपत्र प्राप्त गर्नुहोस् वा अफिसबाट लिनुहोस्",
      descriptionEn: "Receive digital certificate or collect from office",
      icon: <Download className="text-purple-600" size={32} />
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'np' ? 'सजिलो ४ चरण प्रक्रिया' : 'Simple 4-Step Process'}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {language === 'np' 
              ? 'कागजात पेश गर्ने र प्रमाणपत्र प्राप्त गर्ने सजिलो तरिका' 
              : 'Easy way to submit documents and receive certificates'}
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-green-200 to-purple-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative z-10">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  {language === 'np' ? step.number : step.numberEn}
                </div>
                
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full">
                  <div className="text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      {step.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {language === 'np' ? step.title : step.titleEn}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600">
                      {language === 'np' ? step.description : step.descriptionEn}
                    </p>
                  </div>
                </div>
                
                {/* Arrow for Mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-8">
                    <div className="w-8 h-8 border-b-2 border-r-2 border-gray-300 transform rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {language === 'np' ? 'तयार हुनुभयो?' : 'Ready to Get Started?'}
          </h3>
          <p className="mb-8 max-w-2xl mx-auto opacity-90 text-lg">
            {language === 'np'
              ? 'आजै निःशुल्क सदस्य बन्नुहोस् र १० मिनेटमा आफ्नो आवेदन पेश गर्नुहोस्'
              : 'Join free today and submit your application in 10 minutes'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
              {language === 'np' ? 'निःशुल्क सदस्य बन्नुहोस्' : 'Join Free Now'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;