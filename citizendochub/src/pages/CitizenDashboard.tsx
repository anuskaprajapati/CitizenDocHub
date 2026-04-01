import React, { useState, useRef, useEffect } from 'react';
import type { Language, ServiceType } from '../types';
import { 
  User, FileText, Clock, CheckCircle, Plus, Upload, LogOut, Search, Bell, Home, 
  X, Calendar, UserCheck, FileCheck, AlertCircle, Download, Edit, Trash2, Eye
} from 'lucide-react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp
} from 'firebase/firestore';

interface CitizenDashboardProps {
  language: Language;
  onLogout: () => void;
}

interface Application {
  id: string;
  service: ServiceType;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  date: string;
  title: string;
  description?: string;
  submittedDate?: string;
  estimatedCompletion?: string;
  requiredDocuments?: string[];
  notes?: string;
  firebaseId?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ language, onLogout }) => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'documents'>('overview');
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Firebase Auth
  const { user } = useFirebaseAuth();

  // Real-time listener for user's applications from Firebase
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'applications'),
      where('userId', '==', user.uid),
      orderBy('submittedDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps: Application[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({
          id: `app-${doc.id}`,
          firebaseId: doc.id,
          service: data.serviceType?.toLowerCase().replace(/\s+/g, '-') as ServiceType || 'citizenship-certificate',
          status: data.status === 'pending' ? 'pending' : 
                  data.status === 'reviewed' ? 'in-progress' : 
                  data.status === 'approved' ? 'completed' : 'pending',
          date: data.submittedDate,
          title: `${data.serviceType} - Application`,
          description: `Application for ${data.serviceType?.toLowerCase() || 'service'}`,
          submittedDate: data.submittedDate,
          estimatedCompletion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          requiredDocuments: ['ID Proof', 'Address Proof'],
          notes: data.reviewNotes || 'Application submitted'
        });
      });
      setApplications(apps);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Stats based on actual data
  const totalApplications = applications.length;
  const inProgressApplications = applications.filter(app => app.status === 'in-progress').length;
  const completedApplications = applications.filter(app => app.status === 'completed').length;
  const uploadedDocuments = documents.length;

  const stats = [
    { 
      title: language === 'np' ? 'कुल आवेदन' : 'Total Applications', 
      value: totalApplications, 
      icon: FileText, 
      color: 'bg-blue-100 text-blue-600',
      change: '+0%'
    },
    { 
      title: language === 'np' ? 'प्रक्रियाधीन' : 'In Progress', 
      value: inProgressApplications, 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-600',
      change: '+0%'
    },
    { 
      title: language === 'np' ? 'पूरा भएको' : 'Completed', 
      value: completedApplications, 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-600',
      change: '+0%'
    },
    { 
      title: language === 'np' ? 'अपलोड कागजात' : 'Uploaded Documents', 
      value: uploadedDocuments, 
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

  const handleNewApplication = () => {
    alert(language === 'np' 
      ? 'नयाँ आवेदन फारम खुल्दै...' 
      : 'Opening new application form...');
  };

  const handleUploadDocuments = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newDocuments: Document[] = Array.from(files).map((file, index) => ({
        id: `doc-${Date.now()}-${index}`,
        name: file.name,
        type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        date: new Date().toLocaleDateString(),
      }));
      
      setDocuments(prev => [...prev, ...newDocuments]);
      alert(language === 'np'
        ? `${files.length} कागजात(हरू) सफलतापूर्वक अपलोड गरियो`
        : `${files.length} document(s) uploaded successfully`);
      
      event.target.value = '';
    }
  };

  const handleServiceSelect = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
  };

  const handleSubmitFirstApplication = () => {
    setActiveTab('applications');
    handleNewApplication();
  };

  const handleHomeClick = () => {
    setActiveTab('overview');
    setSelectedService(null);
    setSelectedApplication(null);
    setShowApplicationDetails(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllAsRead = () => {
    setNotificationCount(0);
    setShowNotifications(false);
  };

  const handleClearNotifications = () => {
    setNotificationCount(0);
    setShowNotifications(false);
  };

  // Create new application and save to Firebase
  const createNewApplication = async () => {
    if (!selectedService) {
      alert(language === 'np' 
        ? 'कृपया पहिले सेवा चयन गर्नुहोस्' 
        : 'Please select a service first');
      return;
    }

    if (!user) {
      alert('Please login again');
      return;
    }

    const service = services.find(s => s.id === selectedService);
    const submittedDate = new Date().toISOString().split('T')[0];
    
    try {
      // Save to Firebase
      const docRef = await addDoc(collection(db, 'applications'), {
        applicantName: user.email?.split('@')[0] || 'Citizen',
        serviceType: service?.name || selectedService,
        submittedDate: submittedDate,
        citizenId: user.uid,
        documents: [],
        status: 'pending',
        department: selectedService,
        userId: user.uid,
        userEmail: user.email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      alert(language === 'np'
        ? `तपाईंको ${service?.name} आवेदन सफलतापूर्वक पेश गरियो`
        : `Your ${service?.name} application has been submitted successfully`);
      
      setSelectedService(null);
    } catch (error) {
      console.error('Error creating application:', error);
      alert(language === 'np'
        ? 'आवेदन पेश गर्न असफल भयो'
        : 'Failed to submit application');
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowApplicationDetails(true);
  };

  const handleCloseDetails = () => {
    setShowApplicationDetails(false);
    setSelectedApplication(null);
  };

  const handleDownloadApplication = (application: Application) => {
    alert(language === 'np'
      ? `${application.title} डाउनलोड गर्दै...`
      : `Downloading ${application.title}...`);
  };

  const handleEditApplication = (application: Application) => {
    const newTitle = window.prompt(
      language === 'np' 
        ? 'आवेदनको नया नाम प्रविष्ट गर्नुहोस्:' 
        : 'Enter new application name:',
      application.title
    );
    
    if (newTitle && newTitle.trim() !== '' && newTitle !== application.title) {
      setApplications(prev => prev.map(app => 
        app.id === application.id ? { ...app, title: newTitle.trim() } : app
      ));
      
      if (selectedApplication?.id === application.id) {
        setSelectedApplication(prev => prev ? { ...prev, title: newTitle.trim() } : null);
      }
      
      alert(language === 'np' 
        ? 'आवेदन सफलतापूर्वक अपडेट गरियो' 
        : 'Application updated successfully');
    }
  };

  // Delete application from Firebase
  const handleDeleteApplication = async (applicationId: string) => {
    if (window.confirm(language === 'np' 
      ? 'के तपाईं यो आवेदन हटाउन निश्चित हुनुहुन्छ?' 
      : 'Are you sure you want to delete this application?')) {
      
      // Find the Firebase document ID
      const appToDelete = applications.find(app => app.id === applicationId);
      if (appToDelete?.firebaseId) {
        try {
          await deleteDoc(doc(db, 'applications', appToDelete.firebaseId));
          alert(language === 'np' ? 'आवेदन हटाइयो' : 'Application deleted');
        } catch (error) {
          console.error('Error deleting application:', error);
          alert(language === 'np' ? 'हटाउन असफल' : 'Failed to delete');
        }
      } else {
        // Fallback to local deletion
        setApplications(prev => prev.filter(app => app.id !== applicationId));
        if (selectedApplication?.id === applicationId) {
          setShowApplicationDetails(false);
          setSelectedApplication(null);
        }
        alert(language === 'np' ? 'आवेदन हटाइयो' : 'Application deleted');
      }
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'in-progress': return <Clock size={16} />;
      case 'rejected': return <AlertCircle size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const filteredApplications = applications.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderApplicationDetails = () => {
    if (!selectedApplication) return null;

    const service = services.find(s => s.id === selectedApplication.service);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedApplication.title}</h2>
              <p className="text-gray-600">{selectedApplication.description}</p>
            </div>
            <button
              onClick={handleCloseDetails}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{language === 'np' ? 'आवेदन आईडी' : 'Application ID'}</p>
                    <p className="font-medium">{selectedApplication.id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    {getStatusIcon(selectedApplication.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{language === 'np' ? 'स्थिति' : 'Status'}</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{language === 'np' ? 'पेश गरिएको मिति' : 'Submitted Date'}</p>
                    <p className="font-medium">{selectedApplication.submittedDate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar className="text-yellow-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{language === 'np' ? 'अनुमानित समाप्ति' : 'Estimated Completion'}</p>
                    <p className="font-medium">{selectedApplication.estimatedCompletion}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{service?.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500">{language === 'np' ? 'सेवा' : 'Service'}</p>
                    <p className="font-medium">{service?.name}</p>
                    <p className="text-sm text-gray-600">{service?.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">
                    {language === 'np' ? 'आवश्यक कागजातहरू' : 'Required Documents'}
                  </h4>
                  <ul className="space-y-1">
                    {selectedApplication.requiredDocuments?.map((doc, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <FileCheck size={16} className="text-green-600" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {selectedApplication.notes && (
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-2">
                  {language === 'np' ? 'टिप्पणीहरू' : 'Notes'}
                </h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedApplication.notes}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50 flex flex-wrap gap-3">
            <button
              onClick={() => handleDownloadApplication(selectedApplication)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download size={20} />
              <span>{language === 'np' ? 'डाउनलोड गर्नुहोस्' : 'Download'}</span>
            </button>
            <button
              onClick={() => handleEditApplication(selectedApplication)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Edit size={20} />
              <span>{language === 'np' ? 'सम्पादन गर्नुहोस्' : 'Edit'}</span>
            </button>
            <button
              onClick={() => handleDeleteApplication(selectedApplication.id)}
              className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={20} />
              <span>{language === 'np' ? 'हटाउनुहोस्' : 'Delete'}</span>
            </button>
            <button
              onClick={handleCloseDetails}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 ml-auto"
            >
              <span>{language === 'np' ? 'बन्द गर्नुहोस्' : 'Close'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'applications':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'np' ? 'मेरा आवेदनहरू' : 'My Applications'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredApplications.length} {language === 'np' ? 'आवेदन' : 'applications'}
                </p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {language === 'np' ? 'कुनै आवेदन छैन' : 'No Applications'}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {language === 'np' 
                    ? 'तपाईंसँग कुनै आवेदन छैन। अवलोकन पृष्ठमा जानुहोस् र नयाँ आवेदन सिर्जना गर्नुहोस्।' 
                    : 'You have no applications. Go to the overview page to create a new application.'}
                </p>
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  <span>{language === 'np' ? 'अवलोकनमा जानुहोस्' : 'Go to Overview'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map(app => (
                  <div key={app.id} className="bg-white border rounded-xl hover:shadow-sm transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="flex-shrink-0">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                                {app.status}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">{app.title}</h3>
                              {app.description && (
                                <p className="text-gray-600 mb-3">{app.description}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Calendar size={14} />
                                  <span>{app.date}</span>
                                </span>
                                <span>•</span>
                                <span className="capitalize">{app.service.replace('-', ' ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleViewDetails(app)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye size={18} />
                            <span>{language === 'np' ? 'विवरण हेर्नुहोस्' : 'View Details'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">
                {language === 'np' ? 'मेरा कागजातहरू' : 'My Documents'}
              </h3>
              <button 
                onClick={handleUploadDocuments}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Upload size={20} />
                <span>{language === 'np' ? 'कागजात अपलोड' : 'Upload Documents'}</span>
              </button>
            </div>
            
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-4">
                  {language === 'np' 
                    ? 'तपाईंले कुनै कागजात अपलोड गर्नुभएको छैन' 
                    : 'You have not uploaded any documents'}
                </p>
                <button 
                  onClick={handleUploadDocuments}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {language === 'np' ? 'कागजात अपलोड गर्नुहोस्' : 'Upload Documents'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map(doc => (
                  <div key={doc.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="text-blue-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                        <p className="text-sm text-gray-600">{doc.type} • {doc.size}</p>
                        <p className="text-sm text-gray-500">{doc.date}</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 text-sm">
                        {language === 'np' ? 'हेर्नुहोस्' : 'View'}
                      </button>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        {language === 'np' ? 'डाउनलोड' : 'Download'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <>
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
                <button 
                  onClick={createNewApplication}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Plus size={20} />
                  <span>{language === 'np' ? 'नयाँ आवेदन' : 'New Application'}</span>
                </button>
                <button 
                  onClick={handleUploadDocuments}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Upload size={20} />
                  <span>{language === 'np' ? 'कागजात अपलोड' : 'Upload Documents'}</span>
                </button>
              </div>
            </div>

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
                    className={`flex flex-col items-center justify-center p-8 border-2 rounded-xl transition-all duration-300 ${service.color} ${
                      selectedService === service.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                    }`}
                  >
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h4>
                    <p className="text-gray-600 text-center">{service.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'np' ? 'मेरा आवेदनहरू' : 'My Applications'}
                </h3>
                <div className="text-gray-500">
                  {totalApplications} {language === 'np' ? 'आवेदन' : 'applications'}
                </div>
              </div>

              {totalApplications === 0 ? (
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
                  <button 
                    onClick={() => {
                      if (!selectedService) {
                        alert(language === 'np' 
                          ? 'कृपया पहिले सेवा चयन गर्नुहोस्' 
                          : 'Please select a service first');
                        return;
                      }
                      createNewApplication();
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Plus size={20} />
                    <span>{language === 'np' ? 'पहिलो आवेदन पेश गर्नुहोस्' : 'Submit First Application'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-4">
                    {applications.slice(0, 3).map(app => (
                      <div key={app.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">{app.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{app.date}</span>
                              <span>•</span>
                              <span className={`px-2 py-1 rounded ${getStatusColor(app.status)}`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleViewDetails(app)}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                          >
                            <Eye size={18} />
                            <span>{language === 'np' ? 'विवरण हेर्नुहोस्' : 'View Details'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {applications.length > 3 && (
                    <div className="text-center pt-4">
                      <button 
                        onClick={() => setActiveTab('applications')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {language === 'np' 
                          ? 'सबै आवेदन हेर्नुहोस् →' 
                          : 'View all applications →'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        );
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />

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
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={language === 'np' ? 'खोज्नुहोस्...' : 'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="relative">
                  <button 
                    onClick={handleNotificationClick}
                    className="relative p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Bell size={24} className="text-gray-600" />
                    {notificationCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold">{language === 'np' ? 'सूचनाहरू' : 'Notifications'}</h3>
                          <div className="space-x-2">
                            <button 
                              onClick={handleMarkAllAsRead}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {language === 'np' ? 'सबै पढियो' : 'Mark all read'}
                            </button>
                            <button 
                              onClick={handleClearNotifications}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              {language === 'np' ? 'सबै हटाउनुहोस्' : 'Clear all'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-8 text-center">
                        <Bell className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600">
                          {language === 'np' 
                            ? 'कुनै सूचना छैन' 
                            : 'No notifications'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleHomeClick}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Home size={24} className="text-gray-600" />
                </button>

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

        <main className="container mx-auto px-4 py-8">
          {renderTabContent()}
        </main>
      </div>

      {showApplicationDetails && renderApplicationDetails()}
    </>
  );
};

export default CitizenDashboard;