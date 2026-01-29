import React, { useState } from 'react';
import type { Language } from '../types';
import { Settings, Users, BarChart3, Activity, Shield, Bell, Search, LogOut, Plus, Download, Filter, UserPlus, Key, Database } from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'system' | 'reports'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { 
      title: language === 'np' ? 'कुल नागरिक' : 'Total Citizens', 
      value: 0, 
      icon: Users, 
      color: 'bg-blue-100 text-blue-600',
      change: '+0%'
    },
    { 
      title: language === 'np' ? 'सक्रिय अधिकृत' : 'Active Officers', 
      value: 0, 
      icon: Shield, 
      color: 'bg-green-100 text-green-600',
      change: '+0%'
    },
    { 
      title: language === 'np' ? 'कुल आवेदन' : 'Total Applications', 
      value: 0, 
      icon: BarChart3, 
      color: 'bg-purple-100 text-purple-600',
      change: '+0%'
    },
    { 
      title: language === 'np' ? 'सिस्टम स्वास्थ्य' : 'System Health', 
      value: '100%', 
      icon: Activity, 
      color: 'bg-yellow-100 text-yellow-600',
      change: '+0%'
    }
  ];

  const systemHealth = [
    { name: 'API Response', value: 100, status: 'healthy' },
    { name: 'Database', value: 100, status: 'healthy' },
    { name: 'Storage', value: 100, status: 'healthy' },
    { name: 'Network', value: 100, status: 'healthy' }
  ];

  const recentActivities = []; // Empty array

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                <Settings className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'np' ? 'प्रशासक ड्यासबोर्ड' : 'Admin Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'np' ? 'सिस्टम प्रशासन' : 'System Administration'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'np' ? 'खोज्नुहोस्...' : 'Search...'}
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                />
              </div>

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
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'overview' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'}`}
            >
              {language === 'np' ? 'अवलोकन' : 'Overview'}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'users' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'}`}
            >
              {language === 'np' ? 'प्रयोगकर्ताहरू' : 'Users'}
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'system' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'}`}
            >
              {language === 'np' ? 'सिस्टम' : 'System'}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'reports' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'}`}
            >
              {language === 'np' ? 'रिपोर्टहरू' : 'Reports'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {language === 'np' ? 'स्वागतम्, प्रशासक' : 'Welcome, Administrator'}
          </h2>
          <p className="mb-6 opacity-90">
            {language === 'np' 
              ? 'तपाईंले यहाँबाट सम्पूर्ण प्रणाली व्यवस्थापन गर्न सक्नुहुन्छ। प्रयोगकर्ताहरू, सेवाहरू, र सिस्टम सेटिङहरू व्यवस्थापन गर्नुहोस्।' 
              : 'You can manage the entire system from here. Manage users, services, and system settings.'}
          </p>
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

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'np' ? 'छिटो कार्यहरू' : 'Quick Actions'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <UserPlus size={32} className="text-gray-400 mb-3" />
              <span className="font-medium text-gray-700">
                {language === 'np' ? 'नयाँ अधिकृत थप्नुहोस्' : 'Add New Officer'}
              </span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors">
              <Settings size={32} className="text-gray-400 mb-3" />
              <span className="font-medium text-gray-700">
                {language === 'np' ? 'सिस्टम सेटिङ' : 'System Settings'}
              </span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-colors">
              <Key size={32} className="text-gray-400 mb-3" />
              <span className="font-medium text-gray-700">
                {language === 'np' ? 'अनुमतिहरू' : 'Permissions'}
              </span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors">
              <Download size={32} className="text-gray-400 mb-3" />
              <span className="font-medium text-gray-700">
                {language === 'np' ? 'रिपोर्ट डाउनलोड' : 'Download Reports'}
              </span>
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Health Status */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'np' ? 'सिस्टम स्वास्थ्य' : 'System Health'}
              </h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {language === 'np' ? 'सबै सामान्य' : 'All Normal'}
              </span>
            </div>
            
            <div className="space-y-4">
              {systemHealth.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'np' ? 'हालैको गतिविधिहरू' : 'Recent Activities'}
              </h3>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <Filter size={20} />
                <span>{language === 'np' ? 'फिल्टर' : 'Filter'}</span>
              </button>
            </div>
            
            {/* Empty State */}
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity size={32} className="text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                {language === 'np' ? 'कुनै गतिविधि छैन' : 'No Activities'}
              </h4>
              <p className="text-gray-500">
                {language === 'np' 
                  ? 'प्रणाली प्रयोग गर्न सुरु गर्नुहोस् र गतिविधिहरू यहाँ देखिनेछन्।' 
                  : 'Start using the system and activities will appear here.'}
              </p>
            </div>
          </div>
        </div>

        {/* Database Management */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'np' ? 'डाटाबेस व्यवस्थापन' : 'Database Management'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="text-blue-600" size={24} />
                <h4 className="font-bold text-gray-900">{language === 'np' ? 'ब्याकअप' : 'Backup'}</h4>
              </div>
              <p className="text-gray-600 mb-4">
                {language === 'np' 
                  ? 'सिस्टम डाटाको ब्याकअप लिनुहोस्' 
                  : 'Take backup of system data'}
              </p>
              <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                {language === 'np' ? 'ब्याकअप लिनुहोस्' : 'Take Backup'}
              </button>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="text-green-600" size={24} />
                <h4 className="font-bold text-gray-900">{language === 'np' ? 'रिस्टोर' : 'Restore'}</h4>
              </div>
              <p className="text-gray-600 mb-4">
                {language === 'np' 
                  ? 'ब्याकअपबाट डाटा रिस्टोर गर्नुहोस्' 
                  : 'Restore data from backup'}
              </p>
              <button className="w-full py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50">
                {language === 'np' ? 'रिस्टोर गर्नुहोस्' : 'Restore'}
              </button>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="text-purple-600" size={24} />
                <h4 className="font-bold text-gray-900">{language === 'np' ? 'लगहरू' : 'Logs'}</h4>
              </div>
              <p className="text-gray-600 mb-4">
                {language === 'np' 
                  ? 'सिस्टम लगहरू हेर्नुहोस्' 
                  : 'View system logs'}
              </p>
              <button className="w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
                {language === 'np' ? 'लग हेर्नुहोस्' : 'View Logs'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;