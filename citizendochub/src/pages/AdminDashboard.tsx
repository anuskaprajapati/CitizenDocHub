import React, { useState, useEffect } from 'react';
import type { Language } from '../types';
import { Settings, Users, BarChart3, Activity, Shield, Bell, Search, LogOut, Plus, Download, Filter, UserPlus, Key, Database, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
  onLogout: () => void;
}

interface Officer {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

interface Citizen {
  id: string;
  name: string;
  email: string;
  applications: number;
  registeredDate: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'system' | 'reports'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Officer | Citizen | null>(null);
  const [userModalType, setUserModalType] = useState<'officer' | 'citizen'>('officer');
  
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [statsData, setStatsData] = useState([
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
  ]);

  const systemHealth = [
    { name: 'API Response', value: 100, status: 'healthy' },
    { name: 'Database', value: 100, status: 'healthy' },
    { name: 'Storage', value: 100, status: 'healthy' },
    { name: 'Network', value: 100, status: 'healthy' }
  ];

  // Load data on mount
  useEffect(() => {
    fetchStats();
    fetchOfficers();
    fetchCitizens();
    fetchSystemLogs();
  }, []);

  // Update stats when officers/citizens change
  useEffect(() => {
    updateStatsData();
  }, [officers, citizens]);

  const updateStatsData = () => {
    const citizenCount = citizens.length;
    const officerCount = officers.length;
    const applicationCount = parseInt(localStorage.getItem('applicationCount') || '0');
    
    setStatsData([
      { 
        title: language === 'np' ? 'कुल नागरिक' : 'Total Citizens', 
        value: citizenCount, 
        icon: Users, 
        color: 'bg-blue-100 text-blue-600',
        change: '+0%'
      },
      { 
        title: language === 'np' ? 'सक्रिय अधिकृत' : 'Active Officers', 
        value: officerCount, 
        icon: Shield, 
        color: 'bg-green-100 text-green-600',
        change: '+0%'
      },
      { 
        title: language === 'np' ? 'कुल आवेदन' : 'Total Applications', 
        value: applicationCount, 
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
    ]);
  };

  const fetchStats = () => {
    updateStatsData();
  };

  const fetchOfficers = () => {
    const storedOfficers = localStorage.getItem('officers');
    if (storedOfficers) {
      try {
        const parsedOfficers = JSON.parse(storedOfficers);
        // Ensure status is properly typed
        const typedOfficers: Officer[] = parsedOfficers.map((o: any) => ({
          ...o,
          status: o.status === 'active' ? 'active' : 'inactive'
        }));
        setOfficers(typedOfficers);
      } catch (e) {
        console.error('Error parsing officers', e);
      }
    } else {
      // Sample officers with proper typing
      const sampleOfficers: Officer[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          department: 'citizenship',
          status: 'active',
          lastActive: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          department: 'birth',
          status: 'active',
          lastActive: new Date().toISOString()
        }
      ];
      setOfficers(sampleOfficers);
      localStorage.setItem('officers', JSON.stringify(sampleOfficers));
      localStorage.setItem('officerCount', sampleOfficers.length.toString());
    }
  };

  const fetchCitizens = () => {
    const storedCitizens = localStorage.getItem('citizens');
    if (storedCitizens) {
      try {
        setCitizens(JSON.parse(storedCitizens));
      } catch (e) {
        console.error('Error parsing citizens', e);
      }
    } else {
      // Sample citizens
      const sampleCitizens: Citizen[] = [
        {
          id: '1',
          name: 'Ram Sharma',
          email: 'ram@example.com',
          applications: 2,
          registeredDate: '2024-01-15'
        },
        {
          id: '2',
          name: 'Sita Adhikari',
          email: 'sita@example.com',
          applications: 1,
          registeredDate: '2024-02-20'
        }
      ];
      setCitizens(sampleCitizens);
      localStorage.setItem('citizens', JSON.stringify(sampleCitizens));
      localStorage.setItem('citizenCount', sampleCitizens.length.toString());
    }
  };

  const fetchSystemLogs = () => {
    const storedLogs = localStorage.getItem('systemLogs');
    if (storedLogs) {
      try {
        setSystemLogs(JSON.parse(storedLogs));
      } catch (e) {
        console.error('Error parsing logs', e);
      }
    } else {
      // Sample logs
      const sampleLogs = [
        `[${new Date().toLocaleString()}] System started`,
        `[${new Date().toLocaleString()}] Database connection established`,
        `[${new Date().toLocaleString()}] 2 officers loaded`,
        `[${new Date().toLocaleString()}] 2 citizens loaded`,
        `[${new Date().toLocaleString()}] System ready`
      ];
      setSystemLogs(sampleLogs);
      localStorage.setItem('systemLogs', JSON.stringify(sampleLogs));
    }
  };

  // Handlers for all buttons
  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const handleAddOfficer = () => {
    setUserModalType('officer');
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: Officer | Citizen, type: 'officer' | 'citizen') => {
    setUserModalType(type);
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId: string, type: 'officer' | 'citizen') => {
    if (type === 'officer') {
      const updatedOfficers = officers.filter(o => o.id !== userId);
      setOfficers(updatedOfficers);
      localStorage.setItem('officers', JSON.stringify(updatedOfficers));
      localStorage.setItem('officerCount', updatedOfficers.length.toString());
    } else {
      const updatedCitizens = citizens.filter(c => c.id !== userId);
      setCitizens(updatedCitizens);
      localStorage.setItem('citizens', JSON.stringify(updatedCitizens));
      localStorage.setItem('citizenCount', updatedCitizens.length.toString());
    }
    updateStatsData();
    addLog(`${type === 'officer' ? 'Officer' : 'Citizen'} deleted: ${userId}`);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    if (userModalType === 'officer') {
      // Get status with proper type
      const statusValue = formData.get('status') as string;
      const status: 'active' | 'inactive' = statusValue === 'active' ? 'active' : 'inactive';
      
      const officerData: Officer = {
        id: selectedUser?.id || Date.now().toString(),
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        department: formData.get('department') as string,
        status: status,
        lastActive: new Date().toISOString()
      };

      let updatedOfficers: Officer[];
      if (selectedUser) {
        updatedOfficers = officers.map(o => o.id === selectedUser.id ? officerData : o);
        addLog(`Officer updated: ${officerData.name}`);
      } else {
        updatedOfficers = [...officers, officerData];
        addLog(`New officer added: ${officerData.name}`);
      }
      
      setOfficers(updatedOfficers);
      localStorage.setItem('officers', JSON.stringify(updatedOfficers));
      localStorage.setItem('officerCount', updatedOfficers.length.toString());
    } else {
      const citizenData: Citizen = {
        id: selectedUser?.id || Date.now().toString(),
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        applications: selectedUser ? (selectedUser as Citizen).applications : 0,
        registeredDate: selectedUser ? (selectedUser as Citizen).registeredDate : new Date().toISOString().split('T')[0]
      };

      let updatedCitizens: Citizen[];
      if (selectedUser) {
        updatedCitizens = citizens.map(c => c.id === selectedUser.id ? citizenData : c);
        addLog(`Citizen updated: ${citizenData.name}`);
      } else {
        updatedCitizens = [...citizens, citizenData];
        addLog(`New citizen added: ${citizenData.name}`);
      }
      
      setCitizens(updatedCitizens);
      localStorage.setItem('citizens', JSON.stringify(updatedCitizens));
      localStorage.setItem('citizenCount', updatedCitizens.length.toString());
    }
    
    updateStatsData();
    setShowUserModal(false);
  };

  const addLog = (message: string) => {
    const newLog = `[${new Date().toLocaleString()}] ${message}`;
    const updatedLogs = [newLog, ...systemLogs];
    setSystemLogs(updatedLogs);
    localStorage.setItem('systemLogs', JSON.stringify(updatedLogs));
  };

  const handleSystemSettings = () => {
    setShowSettingsModal(true);
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const settings = {
      siteName: formData.get('siteName'),
      maintenance: formData.get('maintenance') === 'on',
      emailNotifications: formData.get('emailNotifications') === 'on'
    };
    
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    addLog('System settings updated');
    setShowSettingsModal(false);
  };

  const handlePermissions = () => {
    setShowPermissionsModal(true);
  };

  const handlePermissionsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const permissions = {
      officersCanApprove: formData.get('officersCanApprove') === 'on',
      citizensCanApply: formData.get('citizensCanApply') === 'on',
      requireApproval: formData.get('requireApproval') === 'on'
    };
    
    localStorage.setItem('permissions', JSON.stringify(permissions));
    addLog('Permissions updated');
    setShowPermissionsModal(false);
  };

  const handleDownloadReports = () => {
    const reportContent = generateSystemReport();
    downloadFile(reportContent, `system_report_${new Date().toISOString().split('T')[0]}.txt`);
    addLog('System report downloaded');
  };

  const generateSystemReport = () => {
    return `
SYSTEM REPORT - ${new Date().toLocaleString()}
========================================
Total Citizens: ${citizens.length}
Active Officers: ${officers.length}
Total Applications: ${localStorage.getItem('applicationCount') || '0'}
System Health: 100%
========================================
Officers List:
${officers.map(o => `- ${o.name} (${o.department}) - ${o.status}`).join('\n')}

Citizens List:
${citizens.map(c => `- ${c.name} (${c.applications} applications)`).join('\n')}
========================================
    `;
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleFilterActivities = () => {
    alert('Filter options opened');
  };

  const handleTakeBackup = () => {
    const backup = {
      citizens,
      officers,
      applications: JSON.parse(localStorage.getItem('applications') || '[]'),
      settings: JSON.parse(localStorage.getItem('systemSettings') || '{}'),
      permissions: JSON.parse(localStorage.getItem('permissions') || '{}'),
      timestamp: new Date().toISOString()
    };
    
    const backupStr = JSON.stringify(backup, null, 2);
    downloadFile(backupStr, `system_backup_${new Date().toISOString().split('T')[0]}.json`);
    addLog('System backup created');
  };

  const handleRestore = () => {
    setShowRestoreModal(true);
  };

  const handleRestoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.getElementById('backupFile') as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target?.result as string);
          
          if (backup.citizens) {
            setCitizens(backup.citizens);
            localStorage.setItem('citizens', JSON.stringify(backup.citizens));
            localStorage.setItem('citizenCount', backup.citizens.length.toString());
          }
          if (backup.officers) {
            // Ensure officers have proper status typing
            const typedOfficers: Officer[] = backup.officers.map((o: any) => ({
              ...o,
              status: o.status === 'active' ? 'active' : 'inactive'
            }));
            setOfficers(typedOfficers);
            localStorage.setItem('officers', JSON.stringify(typedOfficers));
            localStorage.setItem('officerCount', typedOfficers.length.toString());
          }
          if (backup.applications) localStorage.setItem('applications', JSON.stringify(backup.applications));
          if (backup.settings) localStorage.setItem('systemSettings', JSON.stringify(backup.settings));
          if (backup.permissions) localStorage.setItem('permissions', JSON.stringify(backup.permissions));
          
          updateStatsData();
          addLog('System restored from backup');
          setShowRestoreModal(false);
        } catch (error) {
          alert('Invalid backup file');
        }
      };
      
      reader.readAsText(file);
    }
  };

  const handleViewLogs = () => {
    setShowLogsModal(true);
  };

  const handleToggleOfficerStatus = (officerId: string) => {
    const updatedOfficers: Officer[] = officers.map(o => 
      o.id === officerId ? { 
        ...o, 
        status: o.status === 'active' ? 'inactive' : 'active' 
      } : o
    );
    setOfficers(updatedOfficers);
    localStorage.setItem('officers', JSON.stringify(updatedOfficers));
    addLog(`Officer status toggled`);
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      {React.createElement(stat.icon, { size: 24 })}
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
                <button 
                  onClick={handleAddOfficer}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <UserPlus size={32} className="text-gray-400 mb-3" />
                  <span className="font-medium text-gray-700">
                    {language === 'np' ? 'नयाँ अधिकृत थप्नुहोस्' : 'Add New Officer'}
                  </span>
                </button>
                
                <button 
                  onClick={handleSystemSettings}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors"
                >
                  <Settings size={32} className="text-gray-400 mb-3" />
                  <span className="font-medium text-gray-700">
                    {language === 'np' ? 'सिस्टम सेटिङ' : 'System Settings'}
                  </span>
                </button>
                
                <button 
                  onClick={handlePermissions}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
                >
                  <Key size={32} className="text-gray-400 mb-3" />
                  <span className="font-medium text-gray-700">
                    {language === 'np' ? 'अनुमतिहरू' : 'Permissions'}
                  </span>
                </button>
                
                <button 
                  onClick={handleDownloadReports}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  <Download size={32} className="text-gray-400 mb-3" />
                  <span className="font-medium text-gray-700">
                    {language === 'np' ? 'रिपोर्ट डाउनलोड' : 'Download Reports'}
                  </span>
                </button>
              </div>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <button 
                    onClick={handleFilterActivities}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <Filter size={20} />
                    <span>{language === 'np' ? 'फिल्टर' : 'Filter'}</span>
                  </button>
                </div>
                
                {systemLogs.slice(0, 5).length > 0 ? (
                  <div className="space-y-3">
                    {systemLogs.slice(0, 5).map((log, index) => (
                      <div key={index} className="text-sm text-gray-600 border-b pb-2">
                        {log}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity size={32} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      {language === 'np' ? 'कुनै गतिविधि छैन' : 'No Activities'}
                    </h4>
                  </div>
                )}
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
                    {language === 'np' ? 'सिस्टम डाटाको ब्याकअप लिनुहोस्' : 'Take backup of system data'}
                  </p>
                  <button 
                    onClick={handleTakeBackup}
                    className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    {language === 'np' ? 'ब्याकअप लिनुहोस्' : 'Take Backup'}
                  </button>
                </div>

                <div className="border rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Settings className="text-green-600" size={24} />
                    <h4 className="font-bold text-gray-900">{language === 'np' ? 'रिस्टोर' : 'Restore'}</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {language === 'np' ? 'ब्याकअपबाट डाटा रिस्टोर गर्नुहोस्' : 'Restore data from backup'}
                  </p>
                  <button 
                    onClick={handleRestore}
                    className="w-full py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
                  >
                    {language === 'np' ? 'रिस्टोर गर्नुहोस्' : 'Restore'}
                  </button>
                </div>

                <div className="border rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="text-purple-600" size={24} />
                    <h4 className="font-bold text-gray-900">{language === 'np' ? 'लगहरू' : 'Logs'}</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {language === 'np' ? 'सिस्टम लगहरू हेर्नुहोस्' : 'View system logs'}
                  </p>
                  <button 
                    onClick={handleViewLogs}
                    className="w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    {language === 'np' ? 'लग हेर्नुहोस्' : 'View Logs'}
                  </button>
                </div>
              </div>
            </div>
          </>
        );

      case 'users':
        return (
          <div className="space-y-8">
            {/* Officers Section */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'np' ? 'अधिकृतहरू' : 'Officers'}
                </h3>
                <button
                  onClick={handleAddOfficer}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={20} />
                  <span>{language === 'np' ? 'थप्नुहोस्' : 'Add'}</span>
                </button>
              </div>
              
              <div className="divide-y">
                {officers.map(officer => (
                  <div key={officer.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{officer.name}</p>
                        <p className="text-sm text-gray-600">{officer.email} • {officer.department}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          officer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {officer.status}
                        </span>
                        <button
                          onClick={() => handleToggleOfficerStatus(officer.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          {officer.status === 'active' ? <XCircle size={18} className="text-red-500" /> : <CheckCircle size={18} className="text-green-500" />}
                        </button>
                        <button
                          onClick={() => handleEditUser(officer, 'officer')}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit size={18} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(officer.id, 'officer')}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {officers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {language === 'np' ? 'कुनै अधिकृत छैन' : 'No officers found'}
                  </div>
                )}
              </div>
            </div>

            {/* Citizens Section */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'np' ? 'नागरिकहरू' : 'Citizens'}
                </h3>
              </div>
              
              <div className="divide-y">
                {citizens.map(citizen => (
                  <div key={citizen.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{citizen.name}</p>
                        <p className="text-sm text-gray-600">{citizen.email} • {citizen.applications} applications</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-500">Joined: {citizen.registeredDate}</span>
                        <button
                          onClick={() => handleEditUser(citizen, 'citizen')}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit size={18} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(citizen.id, 'citizen')}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {citizens.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {language === 'np' ? 'कुनै नागरिक छैन' : 'No citizens found'}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-8">
            {/* System Settings */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'np' ? 'सिस्टम सेटिङहरू' : 'System Settings'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h4 className="font-bold mb-2">General Settings</h4>
                  <p className="text-gray-600 mb-4">Configure general system settings</p>
                  <button
                    onClick={handleSystemSettings}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Configure
                  </button>
                </div>
                <div className="border rounded-lg p-6">
                  <h4 className="font-bold mb-2">Permissions</h4>
                  <p className="text-gray-600 mb-4">Manage user permissions and roles</p>
                  <button
                    onClick={handlePermissions}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>

            {/* Database Management */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'np' ? 'डाटाबेस व्यवस्थापन' : 'Database Management'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6">
                  <Database className="text-blue-600 mb-3" size={32} />
                  <h4 className="font-bold mb-2">Backup</h4>
                  <p className="text-gray-600 mb-4">Create system backup</p>
                  <button
                    onClick={handleTakeBackup}
                    className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Backup Now
                  </button>
                </div>
                <div className="border rounded-lg p-6">
                  <Settings className="text-green-600 mb-3" size={32} />
                  <h4 className="font-bold mb-2">Restore</h4>
                  <p className="text-gray-600 mb-4">Restore from backup</p>
                  <button
                    onClick={handleRestore}
                    className="w-full py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
                  >
                    Restore
                  </button>
                </div>
                <div className="border rounded-lg p-6">
                  <Activity className="text-purple-600 mb-3" size={32} />
                  <h4 className="font-bold mb-2">System Logs</h4>
                  <p className="text-gray-600 mb-4">View system logs</p>
                  <button
                    onClick={handleViewLogs}
                    className="w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    View Logs
                  </button>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'np' ? 'सिस्टम स्वास्थ्य' : 'System Health'}
              </h3>
              <div className="space-y-4">
                {systemHealth.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-green-500`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'np' ? 'रिपोर्टहरू' : 'Reports'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h4 className="font-bold mb-2">System Report</h4>
                  <p className="text-gray-600 mb-4">Download complete system report</p>
                  <button
                    onClick={handleDownloadReports}
                    className="flex items-center justify-center space-x-2 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Download size={20} />
                    <span>Download Report</span>
                  </button>
                </div>

                <div className="border rounded-lg p-6">
                  <h4 className="font-bold mb-2">Applications Report</h4>
                  <p className="text-gray-600 mb-4">Download applications statistics</p>
                  <button
                    onClick={() => {
                      const apps = JSON.parse(localStorage.getItem('applications') || '[]');
                      const report = `Applications Report\nTotal: ${apps.length}`;
                      downloadFile(report, 'applications_report.txt');
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Download size={20} />
                    <span>Download</span>
                  </button>
                </div>

                <div className="border rounded-lg p-6">
                  <h4 className="font-bold mb-2">Users Report</h4>
                  <p className="text-gray-600 mb-4">Download users statistics</p>
                  <button
                    onClick={() => {
                      const report = `Users Report\nOfficers: ${officers.length}\nCitizens: ${citizens.length}`;
                      downloadFile(report, 'users_report.txt');
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download size={20} />
                    <span>Download</span>
                  </button>
                </div>

                <div className="border rounded-lg p-6">
                  <h4 className="font-bold mb-2">System Logs</h4>
                  <p className="text-gray-600 mb-4">Download system logs</p>
                  <button
                    onClick={() => {
                      const logText = systemLogs.join('\n');
                      downloadFile(logText, `system_logs_${new Date().toISOString().split('T')[0]}.txt`);
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <Download size={20} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={language === 'np' ? 'खोज्नुहोस्...' : 'Search...'}
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                />
              </div>

              {/* Notifications */}
              <button 
                onClick={handleNotificationsClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg"
              >
                <Bell size={24} className="text-gray-600" />
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-4 z-50">
                    <p className="text-sm text-gray-600">
                      {systemLogs.length} new activities
                    </p>
                  </div>
                )}
                {systemLogs.length > 0 && (
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
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-600 hover:text-purple-600'
              }`}
            >
              {language === 'np' ? 'अवलोकन' : 'Overview'}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'users' 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-600 hover:text-purple-600'
              }`}
            >
              {language === 'np' ? 'प्रयोगकर्ताहरू' : 'Users'}
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'system' 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-600 hover:text-purple-600'
              }`}
            >
              {language === 'np' ? 'सिस्टम' : 'System'}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'reports' 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-600 hover:text-purple-600'
              }`}
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

        {/* Tab Content */}
        {renderTabContent()}
      </main>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {userModalType === 'officer' 
                ? (selectedUser ? 'Edit Officer' : 'Add New Officer')
                : (selectedUser ? 'Edit Citizen' : 'Add New Citizen')}
            </h3>
            <form onSubmit={handleUserSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedUser?.name || ''}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedUser?.email || ''}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                {userModalType === 'officer' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select 
                        name="department" 
                        defaultValue={(selectedUser as Officer)?.department || 'citizenship'}
                        required 
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="citizenship">Citizenship</option>
                        <option value="birth">Birth Registration</option>
                        <option value="marriage">Marriage Registration</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select 
                        name="status" 
                        defaultValue={(selectedUser as Officer)?.status || 'active'}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {selectedUser ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">System Settings</h3>
            <form onSubmit={handleSettingsSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    name="siteName"
                    defaultValue="CitizenDocHub"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="maintenance" />
                    <span>Maintenance Mode</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="emailNotifications" defaultChecked />
                    <span>Email Notifications</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Permissions</h3>
            <form onSubmit={handlePermissionsSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="officersCanApprove" defaultChecked />
                    <span>Officers can approve applications</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="citizensCanApply" defaultChecked />
                    <span>Citizens can apply</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="requireApproval" defaultChecked />
                    <span>Require approval for all applications</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPermissionsModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Restore from Backup</h3>
            <form onSubmit={handleRestoreSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Backup File
                  </label>
                  <input
                    type="file"
                    id="backupFile"
                    accept=".json"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRestoreModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Restore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">System Logs</h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              {systemLogs.map((log, index) => (
                <div key={index} className="py-2 border-b last:border-b-0 text-sm font-mono">
                  {log}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowLogsModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const logText = systemLogs.join('\n');
                  downloadFile(logText, `system_logs_${new Date().toISOString().split('T')[0]}.txt`);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;