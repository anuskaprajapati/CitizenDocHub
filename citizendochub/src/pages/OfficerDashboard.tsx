import React, { useState, useEffect } from 'react';
import type { Language } from '../types';
import { Shield, Search, Filter, Eye, CheckCircle, XCircle, Clock, Bell, LogOut, Users, FileText, BarChart } from 'lucide-react';

interface OfficerDashboardProps {
  language: Language;
  onLogout: () => void;
}

interface Application {
  id: string;
  applicantName: string;
  serviceType: string;
  submittedDate: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  department: string;
}

const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ language, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Load applications from API/localStorage on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Fetch applications from API/localStorage
  const fetchApplications = () => {
    setIsLoading(true);
    // Simulate API call - in real app, this would be an actual API endpoint
    setTimeout(() => {
      // Get applications from localStorage or API
      const storedApps = localStorage.getItem('citizenApplications');
      if (storedApps) {
        setApplications(JSON.parse(storedApps));
      }
      setIsLoading(false);
    }, 500);
  };

  // Listen for new applications from citizens
  useEffect(() => {
    const handleNewApplication = (event: StorageEvent) => {
      if (event.key === 'citizenApplications') {
        fetchApplications();
      }
    };

    window.addEventListener('storage', handleNewApplication);
    return () => window.removeEventListener('storage', handleNewApplication);
  }, []);

  const stats = [
    { 
      title: language === 'np' ? 'प्रक्रियाधीन' : 'Pending', 
      value: applications.filter(app => app?.status === 'pending').length, 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-600'
    },
    { 
      title: language === 'np' ? 'समीक्षा गरिएका' : 'Reviewed', 
      value: applications.filter(app => app?.status === 'reviewed').length, 
      icon: Eye, 
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      title: language === 'np' ? 'स्वीकृत' : 'Approved', 
      value: applications.filter(app => app?.status === 'approved').length, 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: language === 'np' ? 'अस्वीकृत' : 'Rejected', 
      value: applications.filter(app => app?.status === 'rejected').length, 
      icon: XCircle, 
      color: 'bg-red-100 text-red-600'
    }
  ];

  const departments = [
    { id: 'citizenship', name: language === 'np' ? 'नागरिकता विभाग' : 'Citizenship Department' },
    { id: 'birth', name: language === 'np' ? 'जन्म दर्ता विभाग' : 'Birth Registration Department' },
    { id: 'marriage', name: language === 'np' ? 'विवाह दर्ता विभाग' : 'Marriage Registration Department' }
  ];

  const services = [
    { id: 'all', name: language === 'np' ? 'सबै सेवा' : 'All Services' },
    { id: 'citizenship', name: language === 'np' ? 'नागरिकता प्रमाणपत्र' : 'Citizenship Certificate' },
    { id: 'birth', name: language === 'np' ? 'जन्म दर्ता' : 'Birth Certificate' },
    { id: 'marriage', name: language === 'np' ? 'विवाह दर्ता' : 'Marriage Registration' }
  ];

  // Department selection
  const handleDepartmentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    console.log('Department selected:', e.target.value);
  };

  // Service selection
  const handleServiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
    console.log('Service selected:', e.target.value);
  };

  // Notifications
  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  // Filter applications
  const handleFilterClick = () => {
    setShowFilterPanel(!showFilterPanel);
    console.log('Filter clicked');
  };

  // Search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // You can add actual search logic here
    }
  };

  // Support Center - Open in new tab or modal
  const handleSupportCenterClick = () => {
    window.open('/support', '_blank');
  };

  // Download Reports as PDF
  const handleDownloadReportsClick = () => {
    // Generate PDF report
    const reportContent = generatePDFReport();
    downloadPDF(reportContent, `applications_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Generate PDF report content
  const generatePDFReport = () => {
    const filteredApps = applications.filter(app => {
      if (selectedDepartment && app.department !== selectedDepartment) return false;
      if (selectedService !== 'all' && app.serviceType !== selectedService) return false;
      return true;
    });

    let content = `
      <html>
        <head>
          <title>Applications Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #4CAF50; color: white; padding: 10px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            .pending { color: #f39c12; }
            .reviewed { color: #3498db; }
            .approved { color: #27ae60; }
            .rejected { color: #e74c3c; }
          </style>
        </head>
        <body>
          <h1>Applications Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Total Applications: ${filteredApps.length}</p>
          <table>
            <tr>
              <th>Applicant Name</th>
              <th>Service Type</th>
              <th>Submitted Date</th>
              <th>Status</th>
            </tr>
    `;

    filteredApps.forEach(app => {
      content += `
        <tr>
          <td>${app.applicantName || 'N/A'}</td>
          <td>${app.serviceType || 'N/A'}</td>
          <td>${app.submittedDate || 'N/A'}</td>
          <td class="${app.status}">${app.status ? app.status.toUpperCase() : 'N/A'}</td>
        </tr>
      `;
    });

    content += `
          </table>
        </body>
      </html>
    `;

    return content;
  };

  // Download PDF file
  const downloadPDF = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Documents - Open in new tab
  const handleDocumentsClick = () => {
    window.open('/documents', '_blank');
  };

  // Stat card click
  const handleStatClick = (statTitle: string) => {
    if (statTitle.includes('Pending')) setActiveTab('pending');
    if (statTitle.includes('Reviewed')) setActiveTab('reviewed');
    if (statTitle.includes('Approved')) setActiveTab('approved');
    if (statTitle.includes('Rejected')) setActiveTab('rejected');
  };

  // Update application status
  const handleStatusUpdate = (applicationId: string, newStatus: 'pending' | 'reviewed' | 'approved' | 'rejected') => {
    const updatedApps = applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApps);
    localStorage.setItem('citizenApplications', JSON.stringify(updatedApps));
  };

  // Filter applications based on active tab
  const getFilteredApplications = () => {
    return applications.filter(app => {
      if (activeTab === 'pending') return app.status === 'pending';
      if (activeTab === 'reviewed') return app.status === 'reviewed';
      if (activeTab === 'approved') return app.status === 'approved';
      if (activeTab === 'rejected') return app.status === 'rejected';
      return false;
    });
  };

  const filteredApplications = getFilteredApplications();

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
              <select 
                value={selectedDepartment}
                onChange={handleDepartmentSelect}
                className="border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{language === 'np' ? 'विभाग छान्नुहोस्' : 'Select Department'}</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>

              {/* Notifications */}
              <button 
                onClick={handleNotificationsClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={24} className="text-gray-600" />
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-4 z-50">
                    <p className="text-sm text-gray-600">
                      {applications.filter(a => a.status === 'pending').length} new pending applications
                    </p>
                  </div>
                )}
                {applications.filter(a => a.status === 'pending').length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
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
              onClick={() => setActiveTab('approved')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'approved' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              {language === 'np' ? 'स्वीकृत' : 'Approved'}
            </button>
            <button 
              onClick={() => setActiveTab('rejected')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'rejected' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              {language === 'np' ? 'अस्वीकृत' : 'Rejected'}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={language === 'np' ? 'आवेदन खोज्नुहोस्...' : 'Search applications...'}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 text-sm"
              >
                Go
              </button>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleFilterClick}
                className="flex items-center space-x-2 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500"
              >
                <Filter size={20} className="text-gray-600" />
                <span>{language === 'np' ? 'फिल्टर' : 'Filter'}</span>
              </button>
              
              <select 
                value={selectedService}
                onChange={handleServiceSelect}
                className="border rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <h4 className="font-medium mb-3">{language === 'np' ? 'फिल्टर विकल्पहरू' : 'Filter Options'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {language === 'np' ? 'मिति देखि' : 'Date From'}
                  </label>
                  <input 
                    type="date" 
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {language === 'np' ? 'मिति सम्म' : 'Date To'}
                  </label>
                  <input 
                    type="date" 
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {language === 'np' ? 'स्थिति' : 'Status'}
                  </label>
                  <select className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500">
                    <option value="all">{language === 'np' ? 'सबै' : 'All'}</option>
                    <option value="pending">{language === 'np' ? 'प्रक्रियाधीन' : 'Pending'}</option>
                    <option value="reviewed">{language === 'np' ? 'समीक्षा गरिएका' : 'Reviewed'}</option>
                    <option value="approved">{language === 'np' ? 'स्वीकृत' : 'Approved'}</option>
                    <option value="rejected">{language === 'np' ? 'अस्वीकृत' : 'Rejected'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleStatClick(stat.title)}
            >
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
                {activeTab === 'approved' && (language === 'np' ? 'स्वीकृत आवेदनहरू' : 'Approved Applications')}
                {activeTab === 'rejected' && (language === 'np' ? 'अस्वीकृत आवेदनहरू' : 'Rejected Applications')}
              </h3>
              <span className="text-gray-500">
                {filteredApplications.length} {language === 'np' ? 'आवेदन' : 'Applications'}
              </span>
            </div>
          </div>

          {/* Applications List */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {language === 'np' ? 'लोड हुँदैछ...' : 'Loading...'}
              </p>
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="divide-y">
              {filteredApplications.map(app => (
                <div key={app.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{app.applicantName}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {app.serviceType} · {app.submittedDate}
                      </p>
                    </div>
                    
                    {/* Action buttons based on status */}
                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'reviewed')}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {app.status === 'reviewed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={32} />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                {language === 'np' ? 'कुनै आवेदन छैन' : 'No Applications'}
              </h4>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {language === 'np' 
                  ? 'नागरिकहरूबाट आवेदन पेश हुँदा यहाँ देखिनेछ।' 
                  : "Applications from citizens will appear here when submitted."}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
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
            <button 
              onClick={handleSupportCenterClick}
              className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors focus:ring-2 focus:ring-blue-500"
            >
              {language === 'np' ? 'सहयोग केन्द्र' : 'Support Center'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
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
            <button 
              onClick={handleDownloadReportsClick}
              className="w-full py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors focus:ring-2 focus:ring-green-500"
            >
              {language === 'np' ? 'रिपोर्ट डाउनलोड' : 'Download Reports'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
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
            <button 
              onClick={handleDocumentsClick}
              className="w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors focus:ring-2 focus:ring-purple-500"
            >
              {language === 'np' ? 'दस्तावेजहरू' : 'Documents'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficerDashboard;