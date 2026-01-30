import React from 'react';
import type { Language } from '../../types';

interface StatusStep {
  id: number;
  name: {
    en: string;
    np: string;
  };
  status: 'completed' | 'current' | 'pending';
  date?: string;
  description?: {
    en: string;
    np: string;
  };
}

interface StatusTrackerProps {
  language: Language;
  applicationId: string;
  currentStep: number;
  steps: StatusStep[];
  estimatedCompletion?: string;
}

const StatusTracker: React.FC<StatusTrackerProps> = ({ 
  language, 
  applicationId, 
  currentStep, 
  steps,
  estimatedCompletion 
}) => {
  const getStatusIcon = (status: 'completed' | 'current' | 'pending') => {
    switch(status) {
      case 'completed':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'current':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        );
      case 'pending':
        return (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        );
    }
  };

  const translations = {
    en: {
      title: 'Application Status',
      applicationId: 'Application ID',
      currentStatus: 'Current Status',
      estimatedCompletion: 'Estimated Completion',
      viewDetails: 'View Details',
      downloadCertificate: 'Download Certificate',
      contactSupport: 'Contact Support'
    },
    np: {
      title: 'आवेदन स्थिति',
      applicationId: 'आवेदन आईडी',
      currentStatus: 'हालको स्थिति',
      estimatedCompletion: 'अनुमानित समाप्ति',
      viewDetails: 'विवरण हेर्नुहोस्',
      downloadCertificate: 'प्रमाणपत्र डाउनलोड गर्नुहोस्',
      contactSupport: 'सहयोग सम्पर्क गर्नुहोस्'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
          <div className="flex items-center mt-2">
            <span className="text-gray-600 mr-2">{t.applicationId}:</span>
            <span className="font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
              {applicationId}
            </span>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          {t.viewDetails}
        </button>
      </div>

      {/* Status Timeline */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Steps */}
        <div className="space-y-8 ml-12">
          {steps.map((step) => (
            <div key={step.id} className="relative">
              <div className="flex items-start">
                {/* Status Icon */}
                <div className="absolute -left-12">
                  {getStatusIcon(step.status)}
                </div>
                
                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {step.name[language]}
                      </h3>
                      {step.description && (
                        <p className="text-gray-600 mt-1">
                          {step.description[language]}
                        </p>
                      )}
                    </div>
                    {step.date && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {step.date}
                      </span>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="mt-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      step.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : step.status === 'current'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {step.status === 'completed' 
                        ? (language === 'np' ? 'पूरा भयो' : 'Completed')
                        : step.status === 'current'
                        ? (language === 'np' ? 'चालू' : 'In Progress')
                        : (language === 'np' ? 'प्रतिक्षा' : 'Pending')
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
        {estimatedCompletion && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex-1 min-w-[250px]">
            <h4 className="font-bold text-yellow-800">{t.estimatedCompletion}</h4>
            <p className="text-yellow-700 mt-1">{estimatedCompletion}</p>
          </div>
        )}
        
        <div className="flex gap-3">
          <button className="px-5 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
            {t.downloadCertificate}
          </button>
          <button className="px-5 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition">
            {t.contactSupport}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;