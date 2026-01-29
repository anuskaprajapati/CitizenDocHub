import React, { useState } from 'react';
import type { Language, ServiceType } from '../types';
import { User, FileText, Clock, CheckCircle, Plus, Upload, LogOut, Search, Bell, Home } from 'lucide-react';

interface CitizenDashboardProps {
  language: Language;
  onLogout: () => void;
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ language, onLogout }) => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'documents'>('overview');

  const stats = [
    { 
      title: language === 'np' ? 'कुल आवेदन' : 'Total Applications', 
      value: 0, 
      icon: FileText, 
      color: 'bg-blue-100 text-blue-600',
      change: '+0%'
    },
    { 
      title: language === 'np' ? 'प्रक्रियाधीन' : 'In Progress', 
      value: 0, 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-600',
      change: '+0%'
    },
    { 
      title: language === 'np' ? 'पूरा भएको' : 'Completed', 
      value: 0, 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-600',
      change: '+0%'
    },
    { 
      title: language === 'np' ? 'अपलोड कागजात' : 'Uploaded Documents', 
      value: 0, 
      icon: Upload, 
      color: 'bg-purple-100 text-purple-600',
      change: '+0%'
    }
  ];

  const services = [
    {
      id: 'citizenship-certificate' as ServiceType,
      name: language === 'np' ? 'नागरिकता प्रमाणपत्र' : 'Citizenship Certificate',
      description: language === 'np' ? 'नयाँ वा नक्कल नागरिकता' : 'New or duplicate citizenship',
      icon: '🆔',
      color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50'
    },
    {
      id: 'birth-certificate' as ServiceType,
      name: language === 'np' ? 'जन्म दर्ता' : 'Birth Certificate',
      description: language === 'np' ? 'जन्म दर्ता र प्रतिलिपि' : 'Birth registration and copy',
      icon: '👶',
      color: 'border-green-200 hover:border-green-400 hover:bg-green-50'
    },
    {
      id: 'marriage-registration' as ServiceType,
      name: language === 'np' ? 'विवाह दर्ता' : 'Marriage Registration',
      description: language === 'np' ? 'विवाह दर्ता र प्रमाणपत्र' : 'Marriage registration and certificate',
      icon: '💍',
      color: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'np' ? 'नागरिक ड्यासबोर्ड' : 'Citizen Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'np' ? 'स्वागतम्, नागरिक' : 'Welcome, Citizen'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={language === 'np' ? 'खोज्नुहोस्...' : 'Search...'}
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={24} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Home */}
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Home size={24} className="text-gray-600" />
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={20} />
                <span>{language === 'np' ? 'लगआउट' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              {language === 'np' ? 'अवलोकन' : 'Overview'}
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'applications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              {language === 'np' ? 'आवेदनहरू' : 'Applications'}
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              {language === 'np' ? 'कागजातहरू' : 'Documents'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {language === 'np' ? 'स्वागतम्, नागरिक' : 'Welcome, Citizen'}
          </h2>
          <p className="mb-6 opacity-90">
            {language === 'np' 
              ? 'तपाईंले यहाँबाट नयाँ आवेदन पेश गर्न, आफ्ना आवेदनहरू हेर्न, र कागजातहरू व्यवस्थापन गर्न सक्नुहुन्छ।' 
              : 'You can submit new applications, view your applications, and manage documents from here.'}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
              <Plus size={20} />
              <span>{language === 'np' ? 'नयाँ आवेदन' : 'New Application'}</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors">
              <Upload size={20} />
              <span>{language === 'np' ? 'कागजात अपलोड' : 'Upload Documents'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-sm text-gray-500">{stat.change}</span>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">{stat.title}</h3>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'np' ? 'उपलब्ध सेवाहरू' : 'Available Services'}
            </h3>
            <span className="text-gray-500">
              {services.length} {language === 'np' ? 'सेवा' : 'Services'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`flex flex-col items-center justify-center p-8 border-2 rounded-xl transition-all duration-300 ${service.color}`}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h4>
                <p className="text-gray-600 text-center">{service.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'np' ? 'मेरा आवेदनहरू' : 'My Applications'}
            </h3>
            <div className="text-gray-500">
              {language === 'np' ? 'कुनै आवेदन छैन' : 'No applications'}
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-gray-400" size={32} />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              {language === 'np' ? 'कुनै आवेदन छैन' : 'No Applications'}
            </h4>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {language === 'np' 
                ? 'तपाईंले अहिलेसम्म कुनै आवेदन पेश गर्नुभएको छैन। माथिको सेवाहरू मध्ये एउटा छानेर पहिलो आवेदन पेश गर्नुहोस्।' 
                : "You haven't submitted any applications yet. Choose one of the services above to submit your first application."}
            </p>
            <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
              <Plus size={20} />
              <span>{language === 'np' ? 'पहिलो आवेदन पेश गर्नुहोस्' : 'Submit First Application'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;