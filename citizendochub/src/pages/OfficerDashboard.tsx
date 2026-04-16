import React, { useState, useEffect } from 'react';
import type { Language } from '../types';
import { Shield, Search, Filter, Eye, CheckCircle, XCircle, Clock, Bell, LogOut, Users, FileText, BarChart, Download } from 'lucide-react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc,
  Timestamp
} from 'firebase/firestore';

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
  citizenId: string;
  userId?: string;
  reviewNotes?: string;
}

const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ language, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Firebase Auth
  const { user, userRole, loading: authLoading } = useFirebaseAuth();

  // Check if user is authorized (officer or admin)
  useEffect(() => {
    if (!authLoading && user && userRole !== 'officer' && userRole !== 'admin') {
      alert(language === 'np' 
        ? 'तपाईंसँग यो पृष्ठ हेर्ने अनुमति छैन।' 
        : 'You do not have permission to view this page.');
      onLogout();
    }
  }, [user, userRole, authLoading, language, onLogout]);

  // Real-time listener for applications from Firebase
  useEffect(() => {
    if (!user || (userRole !== 'officer' && userRole !== 'admin')) return;

    let applicationsQuery;
    
    if (selectedDepartment && selectedDepartment !== '') {
      applicationsQuery = query(
        collection(db, 'applications'),
        where('department', '==', selectedDepartment),
        orderBy('submittedDate', 'desc')
      );
    } else {
      applicationsQuery = query(
        collection(db, 'applications'),
        orderBy('submittedDate', 'desc')
      );
    }
    
    const unsubscribe = onSnapshot(applicationsQuery, (snapshot) => {
      const apps: Application[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({
          id: doc.id,
          applicantName: data.applicantName,
          serviceType: data.serviceType,
          submittedDate: data.submittedDate,
          citizenId: data.citizenId,
          status: data.status,
          department: data.department,
          userId: data.userId,
          reviewNotes: data.reviewNotes
        });
      });
      setApplications(apps);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [user, userRole, selectedDepartment]);

  const stats = [
    { 
      title: language === 'np' ? 'प्रक्रियाधीन' : 'Pending', 
      value: applications.filter(app => app.status === 'pending').length, 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-600'
    },
    { 
      title: language === 'np' ? 'समीक्षा गरिएका' : 'Reviewed', 
      value: applications.filter(app => app.status === 'reviewed').length, 
      icon: Eye, 
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      title: language === 'np' ? 'स्वीकृत' : 'Approved', 
      value: applications.filter(app => app.status === 'approved').length, 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: language === 'np' ? 'अस्वीकृत' : 'Rejected', 
      value: applications.filter(app => app.status === 'rejected').length, 
      icon: XCircle, 
      color: 'bg-red-100 text-red-600'
    }
  ];

  const departments = [
    { id: 'citizenship-certificate', name: language === 'np' ? 'नागरिकता विभाग' : 'Citizenship Department' },
    { id: 'birth-certificate', name: language === 'np' ? 'जन्म दर्ता विभाग' : 'Birth Registration Department' },
    { id: 'marriage-registration', name: language === 'np' ? 'विवाह दर्ता विभाग' : 'Marriage Registration Department' }
  ];

  const services = [
    { id: 'all', name: language === 'np' ? 'सबै सेवा' : 'All Services' },
    { id: 'citizenship-certificate', name: language === 'np' ? 'नागरिकता प्रमाणपत्र' : 'Citizenship Certificate' },
    { id: 'birth-certificate', name: language === 'np' ? 'जन्म दर्ता' : 'Birth Certificate' },
    { id: 'marriage-registration', name: language === 'np' ? 'विवाह दर्ता' : 'Marriage Registration' }
  ];

  const handleDepartmentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    showToast(language === 'np' ? 'विभाग परिवर्तन गरियो' : 'Department changed');
  };

  const handleServiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
    showToast(language === 'np' ? 'सेवा फिल्टर गरियो' : 'Service filtered');
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };
  const formatNotificationDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return language === 'np' ? 'अहिलेै' : 'Just now';
  if (diffMins < 60) return `${diffMins} ${language === 'np' ? 'मिनेट पहिले' : 'min ago'}`;
  if (diffHours < 24) return `${diffHours} ${language === 'np' ? 'घण्टा पहिले' : 'hours ago'}`;
  if (diffDays < 7) return `${diffDays} ${language === 'np' ? 'दिन पहिले' : 'days ago'}`;
  return date.toLocaleDateString(language === 'np' ? 'ne-NP' : 'en-US');
};

  const handleSearch = () => {
    if (searchQuery.trim()) {
      showToast(language === 'np' ? `"${searchQuery}" को लागि खोज्दै...` : `Searching for "${searchQuery}"...`);
    }
  };

  const handleFilterClick = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const handleSupportCenterClick = () => {
    alert(language === 'np' ? 'सहयोग केन्द्र खुल्दै...' : 'Opening support center...');
  };

  const handleDownloadReportsClick = () => {
    const filteredApps = getFilteredApplications();
    const reportContent = generatePDFReport(filteredApps);
    downloadPDF(reportContent, `applications_report_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast(language === 'np' ? 'रिपोर्ट डाउनलोड सुरु भयो' : 'Report download started');
  };

  const generatePDFReport = (apps: Application[]) => {
    return `
      <html>
        <head>
          <title>Applications Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #4CAF50; color: white; padding: 10px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Applications Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Total Applications: ${apps.length}</p>
          <p>Department: ${selectedDepartment || 'All'}</p>
          <p>Service: ${selectedService === 'all' ? 'All' : selectedService}</p>
           <table>
            <thead>
               <tr>
                <th>Applicant Name</th>
                <th>Service Type</th>
                <th>Submitted Date</th>
                <th>Status</th>
               </tr>
            </thead>
            <tbody>
              ${apps.map(app => `
                 <tr>
                  <td>${app.applicantName}</td>
                  <td>${app.serviceType}</td>
                  <td>${app.submittedDate}</td>
                  <td>${app.status.toUpperCase()}</td>
                 </tr>
              `).join('')}
            </tbody>
           </table>
        </body>
      </html>
    `;
  };

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

  const handleDocumentsClick = () => {
    alert(language === 'np' ? 'दस्तावेजहरू खुल्दै...' : 'Opening documents...');
  };

  const handleStatClick = (statTitle: string) => {
    if (statTitle.includes('Pending') || statTitle.includes('प्रक्रियाधीन')) setActiveTab('pending');
    else if (statTitle.includes('Reviewed') || statTitle.includes('समीक्षा')) setActiveTab('reviewed');
    else if (statTitle.includes('Approved') || statTitle.includes('स्वीकृत')) setActiveTab('approved');
    else if (statTitle.includes('Rejected') || statTitle.includes('अस्वीकृत')) setActiveTab('rejected');
    showToast(language === 'np' ? `${statTitle} आवेदनहरू देखाउँदै` : `Showing ${statTitle} applications`);
  };

  // Update application status in Firebase
  const handleStatusUpdate = async (applicationId: string, newStatus: 'pending' | 'reviewed' | 'approved' | 'rejected') => {
    try {
      const appRef = doc(db, 'applications', applicationId);
      await updateDoc(appRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
        updatedBy: user?.uid,
        updatedByEmail: user?.email
      });
      
      const statusMessages: Record<string, string> = {
        reviewed: language === 'np' ? 'समीक्षामा राखियो' : 'Marked as reviewed',
        approved: language === 'np' ? 'स्वीकृत गरियो' : 'Approved',
        rejected: language === 'np' ? 'अस्वीकृत गरियो' : 'Rejected'
      };
      
      showToast(statusMessages[newStatus] || 'Status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast(language === 'np' ? 'अपडेट गर्न असफल' : 'Failed to update');
    }
  };

  const getFilteredApplications = () => {
    let filtered = applications.filter(app => {
      if (activeTab === 'pending') return app.status === 'pending';
      if (activeTab === 'reviewed') return app.status === 'reviewed';
      if (activeTab === 'approved') return app.status === 'approved';
      if (activeTab === 'rejected') return app.status === 'rejected';
      return false;
    });
    
    if (selectedDepartment && selectedDepartment !== '') {
      filtered = filtered.filter(app => app.department === selectedDepartment);
    }
    
    if (selectedService !== 'all') {
      filtered = filtered.filter(app => app.serviceType.toLowerCase().includes(selectedService.toLowerCase()));
    }
    
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredApplications = getFilteredApplications();
  const pendingCount = applications.filter(a => a.status === 'pending').length;

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authorized, don't render
  if (!user || (userRole !== 'officer' && userRole !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
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
                {userRole === 'admin' && (
                  <span className="text-xs text-purple-600 font-medium ml-2">(Admin Access)</span>
                )}
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
  onClick={() => setShowNotifications(!showNotifications)}
  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
>
  <Bell size={24} className="text-gray-600" />
  {pendingCount > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
      {pendingCount}
    </span>
  )}
  
  {/* Notifications Dropdown */}
  {showNotifications && (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center space-x-2">
          <Bell size={18} className="text-blue-600" />
          <h4 className="font-bold text-gray-900">
            {language === 'np' ? 'सूचनाहरू' : 'Notifications'}
          </h4>
          {pendingCount > 0 && (
            <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
              {pendingCount} {language === 'np' ? 'नयाँ' : 'new'}
            </span>
          )}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab('pending');
            setShowNotifications(false);
          }}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {language === 'np' ? 'सबै हेर्नुहोस्' : 'View all'}
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {applications.filter(app => app.status === 'pending').length > 0 ? (
          <div className="divide-y">
            {applications
              .filter(app => app.status === 'pending')
              .map((app) => (
                <div 
                  key={app.id} 
                  className="p-4 hover:bg-blue-50 transition-colors cursor-pointer group"
                  onClick={() => {
                    setActiveTab('pending');
                    setShowNotifications(false);
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                        <FileText size={18} className="text-yellow-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          {language === 'np' ? 'नयाँ आवेदन' : 'New Application'}
                        </p>
                        <span className="text-xs text-gray-400">
                          {new Date(app.submittedDate).toLocaleDateString(language === 'np' ? 'ne-NP' : 'en-US')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">{language === 'np' ? 'आवेदक:' : 'Applicant:'}</span> {app.applicantName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {app.serviceType}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          {language === 'np' ? 'प्रक्रियाधीन' : 'Pending'}
                        </span>
                        <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {language === 'np' ? 'हेर्नुहोस् →' : 'View →'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            
            {/* View All Button at Bottom */}
            <div className="p-3 border-t bg-gray-50">
              <button 
                onClick={() => {
                  setActiveTab('pending');
                  setShowNotifications(false);
                  showToast(language === 'np' ? 'सबै प्रक्रियाधीन आवेदनहरू देखाउँदै' : 'Showing all pending applications');
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {language === 'np' ? 'सबै आवेदनहरू हेर्नुहोस् →' : 'View all applications →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              {language === 'np' ? 'कुनै नयाँ सूचना छैन' : 'No new notifications'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {language === 'np' 
                ? 'नयाँ आवेदन आउँदा यहाँ देखिनेछ' 
                : 'New applications will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
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
              {language === 'np' ? 'प्रक्रियाधीन' : 'Pending'} ({applications.filter(a => a.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('reviewed')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'reviewed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              {language === 'np' ? 'समीक्षा गरिएका' : 'Reviewed'} ({applications.filter(a => a.status === 'reviewed').length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'approved' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              {language === 'np' ? 'स्वीकृत' : 'Approved'} ({applications.filter(a => a.status === 'approved').length})
            </button>
            <button 
              onClick={() => setActiveTab('rejected')}
              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'rejected' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              {language === 'np' ? 'अस्वीकृत' : 'Rejected'} ({applications.filter(a => a.status === 'rejected').length})
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
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm">
              {language === 'np' 
                ? `${pendingCount} वटा नयाँ प्रक्रियाधीन आवेदनहरू` 
                : `${pendingCount} new pending applications`}
            </p>
          </div>
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
                className="w-full pl-10 pr-24 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 text-sm"
              >
                {language === 'np' ? 'खोज्नुहोस्' : 'Search'}
              </button>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleFilterClick}
                className="flex items-center space-x-2 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
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
            <div className="mt-6 p-4 border-t border-gray-200 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-4">{language === 'np' ? 'फिल्टर विकल्पहरू' : 'Filter Options'}</h4>
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
                <div key={app.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <p className="font-medium text-gray-900 text-lg">{app.applicantName}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.status === 'pending' ? (language === 'np' ? 'प्रक्रियाधीन' : 'Pending') :
                           app.status === 'reviewed' ? (language === 'np' ? 'समीक्षा गरिएको' : 'Reviewed') :
                           app.status === 'approved' ? (language === 'np' ? 'स्वीकृत' : 'Approved') :
                           (language === 'np' ? 'अस्वीकृत' : 'Rejected')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{language === 'np' ? 'सेवा' : 'Service'}:</span> {app.serviceType}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{language === 'np' ? 'मिति' : 'Date'}:</span> {app.submittedDate}
                      </p>
                      {app.reviewNotes && (
                        <p className="text-sm text-gray-500 mt-2 italic">
                          📝 {language === 'np' ? 'समीक्षा नोट:' : 'Review Notes:'} {app.reviewNotes}
                        </p>
                      )}
                    </div>
                    
                    {/* Action buttons based on status */}
                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'reviewed')}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {language === 'np' ? 'समीक्षा गर्नुहोस्' : 'Review'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          {language === 'np' ? 'स्वीकृत गर्नुहोस्' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          {language === 'np' ? 'अस्वीकृत गर्नुहोस्' : 'Reject'}
                        </button>
                      </div>
                    )}
                    {app.status === 'reviewed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          {language === 'np' ? 'स्वीकृत गर्नुहोस्' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          {language === 'np' ? 'अस्वीकृत गर्नुहोस्' : 'Reject'}
                        </button>
                      </div>
                    )}
                    {(app.status === 'approved' || app.status === 'rejected') && (
                      <div className="text-sm text-gray-500">
                        {app.status === 'approved' ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={16} /> {language === 'np' ? 'स्वीकृत भयो' : 'Approved'}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600">
                            <XCircle size={16} /> {language === 'np' ? 'अस्वीकृत भयो' : 'Rejected'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={32} />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                {language === 'np' ? 'कुनै आवेदन छैन' : 'No Applications'}
              </h4>
              <p className="text-gray-500">
                {language === 'np' 
                  ? 'नागरिकहरूबाट आवेदन पेश हुँदा यहाँ देखिनेछ।' 
                  : 'Applications from citizens will appear here when submitted.'}
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
              className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
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
              className="w-full py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
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
              className="w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              {language === 'np' ? 'दस्तावेजहरू' : 'Documents'}
            </button>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OfficerDashboard;