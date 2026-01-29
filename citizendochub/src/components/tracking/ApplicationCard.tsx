import React from 'react';
import type { Language } from '../../types';

interface ApplicationCardProps {
  language: Language;
  application: {
    id: string;
    title: {
      en: string;
      np: string;
    };
    type: 'citizenship' | 'birth' | 'marriage' | 'passport' | 'other';
    status: 'approved' | 'rejected' | 'pending' | 'under_review' | 'submitted';
    submittedDate: string;
    lastUpdated: string;
    priority: 'high' | 'medium' | 'low';
    documentsCount: number;
    officerAssigned?: string;
  };
  onClick?: () => void;
  onDownload?: () => void;
  onTrack?: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  language, 
  application,
  onClick,
  onDownload,
  onTrack
}) => {
  const getTypeIcon = (type: ApplicationCardProps['application']['type']) => {
    const icons = {
      citizenship: '🏛️',
      birth: '👶',
      marriage: '💍',
      passport: '📘',
      other: '📄'
    };
    return icons[type] || '📄';
  };

  const getStatusColor = (status: ApplicationCardProps['application']['status']) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'submitted': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: ApplicationCardProps['application']['status']) => {
    const texts = {
      approved: { en: 'Approved', np: 'स्वीकृत' },
      rejected: { en: 'Rejected', np: 'अस्वीकृत' },
      pending: { en: 'Pending', np: 'प्रतिक्षा' },
      under_review: { en: 'Under Review', np: 'समीक्षामा' },
      submitted: { en: 'Submitted', np: 'पेश गरियो' }
    };
    return texts[status][language];
  };

  const getPriorityColor = (priority: ApplicationCardProps['application']['priority']) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: ApplicationCardProps['application']['priority']) => {
    const texts = {
      high: { en: 'High Priority', np: 'उच्च प्राथमिकता' },
      medium: { en: 'Medium Priority', np: 'मध्यम प्राथमिकता' },
      low: { en: 'Low Priority', np: 'कम प्राथमिकता' }
    };
    return texts[priority][language];
  };

  const translations = {
    en: {
      submitted: 'Submitted',
      lastUpdated: 'Last Updated',
      documents: 'Documents',
      officer: 'Officer',
      viewDetails: 'View Details',
      download: 'Download',
      track: 'Track Status',
      appId: 'App ID'
    },
    np: {
      submitted: 'पेश गरियो',
      lastUpdated: 'अन्तिम अपडेट',
      documents: 'कागजात',
      officer: 'कर्मचारी',
      viewDetails: 'विवरण हेर्नुहोस्',
      download: 'डाउनलोड गर्नुहोस्',
      track: 'स्थिति ट्र्याक गर्नुहोस्',
      appId: 'आवेदन आईडी'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getTypeIcon(application.type)}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                {application.title[language]}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                  {t.appId}: {application.id}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(application.priority)}`}>
                  {getPriorityText(application.priority)}
                </span>
              </div>
            </div>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
            {getStatusText(application.status)}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{t.submitted}:</span>
              <span>{application.submittedDate}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{t.lastUpdated}:</span>
              <span>{application.lastUpdated}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">{t.documents}:</span>
              <span className="font-bold">{application.documentsCount}</span>
            </div>
            
            {application.officerAssigned && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">{t.officer}:</span>
                <span className="font-bold">{application.officerAssigned}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          {onClick && (
            <button 
              onClick={onClick}
              className="flex-1 min-w-[120px] px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t.viewDetails}
            </button>
          )}
          
          {onTrack && (
            <button 
              onClick={onTrack}
              className="flex-1 min-w-[120px] px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t.track}
            </button>
          )}
          
          {onDownload && (
            <button 
              onClick={onDownload}
              className="flex-1 min-w-[120px] px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t.download}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;