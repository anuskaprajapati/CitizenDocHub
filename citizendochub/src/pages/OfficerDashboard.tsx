import React, { useState } from 'react';
import type { Language } from '../types';
import { Shield, Search, Filter, Eye, CheckCircle, XCircle, Clock, Bell, LogOut, Users, FileText, BarChart } from 'lucide-react';

interface OfficerDashboardProps {
  language: Language;
  onLogout: () => void;
}

const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ language, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed' | 'completed'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { 
      title: language === 'np' ? 'प्रक्रियाधीन' : 'Pending', 
      value: 0, 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-600'
    },
    { 
      title: language === 'np' ? 'समीक्षा गरिएका' : 'Reviewed', 
      value: 0, 
      icon: Eye, 
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      title: language === 'np' ? 'स्वीकृत' : 'Approved', 
      value: 0, 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: language === 'np' ? 'अस्वीकृत' : 'Rejected', 
      value: 0, 
      icon: XCircle, 
      color: 'bg-red-100 text-red-600'
    }
  ];

  const departments = [
    { id: 'citizenship', name: language === 'np' ? 'नागरिकता विभाग' : 'Citizenship Department' },
    { id: 'birth', name: language === 'np' ? 'जन्म दर्ता विभाग' : 'Birth Registration Department' },
    { id: 'marriage', name: language === 'np' ? 'विवाह दर्ता विभाग' : 'Marriage Registration Department' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'np' ? 'अधिकृत ड्यासबोर्ड' : 'Officer Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'np' ? 'सरकारी कर्मचारी' : 'Government Officer'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Department Selector */}
              <select className="border rounded-lg px-4 py-2 bg-white">
                <option>{language === 'np' ? 'विभाग छान्नुहोस्' : 'Select Department'}</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={24} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gray-300 rounded-full"></span>
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
              onClick={() => setActiveTab('pending')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              {language === 'np' ? 'प्रक्रियाधीन' : 'Pending'}
            </button>
            <button
              onClick={() => setActiveTab('reviewed')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'reviewed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              {language === 'np' ? 'समीक्षा गरिएका' : 'Reviewed'}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'completed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              {language === 'np' ? 'पूरा भएका' : 'Completed'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {language === 'np' ? 'स्वागतम्, अधिकृत' : 'Welcome, Officer'}
          </h2>
          <p className="mb-6 opacity-90">
            {language === 'np' 
              ? 'तपाईंले यहाँबाट नागरिकहरूका आवेदनहरू समीक्षा गर्न, स्वीकृत गर्न, वा अस्वीकृत गर्न सक्नुहुन्छ।' 
              : 'You can review, approve, or reject citizen applications from here.'}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'np' ? 'आवेदन खोज्नुहोस्...' : 'Search applications...'}
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
              />
            </div>
            
            <div className="flex gap-4">
              <button className="flex items-center space-x-2 px-4 py-3 border rounded-lg hover:bg-gray-50">
                <Filter size={20} className="text-gray-600" />
                <span>{language === 'np' ? 'फिल्टर' : 'Filter'}</span>
              </button>
              
              <select className="border rounded-lg px-4 py-3 bg-white">
                <option>{language === 'np' ? 'सबै सेवा' : 'All Services'}</option>
                <option>{language === 'np' ? 'नागरिकता प्रमाणपत्र' : 'Citizenship Certificate'}</option>
                <option>{language === 'np' ? 'जन्म दर्ता' : 'Birth Certificate'}</option>
                <option>{language === 'np' ? 'विवाह दर्ता' : 'Marriage Registration'}</option>
              </select>
            </div>
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
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <h3 className="text-lg font-medium text-gray-700">{stat.title}</h3>
            </div>
          ))}
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {activeTab === 'pending' && (language === 'np' ? 'प्रक्रियाधीन आवेदनहरू' : 'Pending Applications')}
                {activeTab === 'reviewed' && (language === 'np' ? 'समीक्षा गरिएका आवेदनहरू' : 'Reviewed Applications')}
                {activeTab === 'completed' && (language === 'np' ? 'पूरा भएका आवेदनहरू' : 'Completed Applications')}
              </h3>
              <span className="text-gray-500">
                0 {language === 'np' ? 'आवेदन' : 'Applications'}
              </span>
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-gray-400" size={32} />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              {language === 'np' ? 'कुनै आवेदन छैन' : 'No Applications'}
            </h4>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {language === 'np' 
                ? 'अहिलेसम्म कुनै नागरिकले आवेदन पेश गरेको छैन। आवेदन आउनुभएपछि यहाँ देखिनेछ।' 
                : "No citizens have submitted applications yet. Applications will appear here when submitted."}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900">{language === 'np' ? 'नागरिक सहयोग' : 'Citizen Support'}</h4>
            </div>
            <p className="text-gray-600 mb-4">
              {language === 'np' 
                ? 'नागरिकहरूलाई सहयोग गर्ने र उनीहरूका प्रश्नहरूको उत्तर दिने' 
                : 'Help citizens and answer their queries'}
            </p>
            <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              {language === 'np' ? 'सहयोग केन्द्र' : 'Support Center'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart className="text-green-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900">{language === 'np' ? 'रिपोर्टहरू' : 'Reports'}</h4>
            </div>
            <p className="text-gray-600 mb-4">
              {language === 'np' 
                ? 'मासिक र वार्षिक रिपोर्टहरू डाउनलोड गर्ने' 
                : 'Download monthly and annual reports'}
            </p>
            <button className="w-full py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50">
              {language === 'np' ? 'रिपोर्ट डाउनलोड' : 'Download Reports'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="text-purple-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-900">{language === 'np' ? 'दस्तावेज' : 'Documents'}</h4>
            </div>
            <p className="text-gray-600 mb-4">
              {language === 'np' 
                ? 'आवश्यक फारामहरू र टेम्पलेटहरू डाउनलोड गर्ने' 
                : 'Download required forms and templates'}
            </p>
            <button className="w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
              {language === 'np' ? 'दस्तावेजहरू' : 'Documents'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficerDashboard;