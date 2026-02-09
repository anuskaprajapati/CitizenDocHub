import React, { useState } from 'react';
import type { Language, UserType } from '../../types';
import { Mail, Lock, Eye, EyeOff, User, Smartphone, Shield, Building, Key, X } from 'lucide-react';

interface LoginProps {
  language: Language;
  onToggleLanguage: () => void;
  onNavigateToRegister: () => void;
  onForgotPassword: () => void;
  onLogin: (userType: UserType, credentials: any) => void;
  onBackToHome?: () => void;
}

const Login: React.FC<LoginProps> = ({ 
  language, 
  onToggleLanguage, 
  onNavigateToRegister,
  onForgotPassword,
  onLogin,
  onBackToHome 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'citizenId'>('email');
  const [userType, setUserType] = useState<UserType>('citizen');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [forgotPasswordMethod, setForgotPasswordMethod] = useState<'email' | 'phone' | 'citizenId'>('email');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    citizenId: '',
    password: '',
    rememberMe: false
  });

  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    citizenId: '',
    password: '',
    confirmPassword: '',
    userType: 'citizen' as UserType
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    phone: '',
    citizenId: '',
    password: ''
  });

  const [registrationErrors, setRegistrationErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    citizenId: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    phone: '',
    citizenId: ''
  });

  // Validation functions
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^(98|97)\d{8}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCitizenId = (citizenId: string): boolean => {
    const citizenIdRegex = /^\d{2}-\d{2}-\d{2}-\d{2}-\d{5}$/;
    return citizenIdRegex.test(citizenId);
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d{0,10}$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        phone: value
      }));
      if (formErrors.phone) {
        setFormErrors(prev => ({ ...prev, phone: '' }));
      }
    }
  };

  const handleCitizenIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let formattedValue = value.replace(/[^\d]/g, '');
    
    if (formattedValue.length > 2) formattedValue = formattedValue.slice(0, 2) + '-' + formattedValue.slice(2);
    if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5) + '-' + formattedValue.slice(5);
    if (formattedValue.length > 8) formattedValue = formattedValue.slice(0, 8) + '-' + formattedValue.slice(8);
    if (formattedValue.length > 11) formattedValue = formattedValue.slice(0, 11) + '-' + formattedValue.slice(11);
    if (formattedValue.length > 18) formattedValue = formattedValue.slice(0, 18);
    
    setFormData(prev => ({
      ...prev,
      citizenId: formattedValue
    }));
    
    if (formErrors.citizenId) {
      setFormErrors(prev => ({ ...prev, citizenId: '' }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (errorMessage) setErrorMessage('');
    
    if (name === 'phone') {
      handlePhoneInput(e);
    } else if (name === 'citizenId') {
      handleCitizenIdInput(e);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleRegistrationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'phone') {
      if (value === '' || /^\d{0,10}$/.test(value)) {
        setRegistrationData(prev => ({
          ...prev,
          phone: value
        }));
      }
    } else if (name === 'citizenId') {
      let formattedValue = value.replace(/[^\d]/g, '');
      if (formattedValue.length > 2) formattedValue = formattedValue.slice(0, 2) + '-' + formattedValue.slice(2);
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5) + '-' + formattedValue.slice(5);
      if (formattedValue.length > 8) formattedValue = formattedValue.slice(0, 8) + '-' + formattedValue.slice(8);
      if (formattedValue.length > 11) formattedValue = formattedValue.slice(0, 11) + '-' + formattedValue.slice(11);
      if (formattedValue.length > 18) formattedValue = formattedValue.slice(0, 18);
      
      setRegistrationData(prev => ({
        ...prev,
        citizenId: formattedValue
      }));
    } else {
      setRegistrationData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
    
    if (registrationErrors[name as keyof typeof registrationErrors]) {
      setRegistrationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleForgotPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      phone: '',
      citizenId: '',
      password: ''
    };
    
    let isValid = true;
    
    if (loginMethod === 'email') {
      if (!formData.email.trim()) {
        errors.email = language === 'np' ? 'इमेल आवश्यक छ' : 'Email is required';
        isValid = false;
      } else if (!validateEmail(formData.email)) {
        errors.email = language === 'np' ? 'वैध इमेल ठेगाना प्रविष्ट गर्नुहोस्' : 'Please enter a valid email address';
        isValid = false;
      }
    } else if (loginMethod === 'phone') {
      if (!formData.phone.trim()) {
        errors.phone = language === 'np' ? 'फोन नम्बर आवश्यक छ' : 'Phone number is required';
        isValid = false;
      } else if (!validatePhoneNumber(formData.phone)) {
        errors.phone = language === 'np' ? 'वैध १०-अंकीय फोन नम्बर प्रविष्ट गर्नुहोस् (९८ वा ९७ सुरु)' : 'Please enter a valid 10-digit phone number (starting with 98 or 97)';
        isValid = false;
      }
    } else if (loginMethod === 'citizenId') {
      if (!formData.citizenId.trim()) {
        errors.citizenId = language === 'np' ? 'नागरिकता नम्बर आवश्यक छ' : 'Citizen ID is required';
        isValid = false;
      } else if (!validateCitizenId(formData.citizenId)) {
        errors.citizenId = language === 'np' ? 'वैध नागरिकता नम्बर प्रविष्ट गर्नुहोस् (XX-XX-XX-XX-XXXXX)' : 'Please enter a valid Citizen ID (XX-XX-XX-XX-XXXXX)';
        isValid = false;
      }
    }
    
    if (!formData.password.trim()) {
      errors.password = language === 'np' ? 'पासवर्ड आवश्यक छ' : 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = language === 'np' ? 'पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ' : 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const validateRegistrationForm = (): boolean => {
    const errors = {
      fullName: '',
      email: '',
      phone: '',
      citizenId: '',
      password: '',
      confirmPassword: ''
    };
    
    let isValid = true;
    
    if (!registrationData.fullName.trim()) {
      errors.fullName = language === 'np' ? 'पूरा नाम आवश्यक छ' : 'Full name is required';
      isValid = false;
    }
    
    if (!registrationData.email.trim()) {
      errors.email = language === 'np' ? 'इमेल आवश्यक छ' : 'Email is required';
      isValid = false;
    } else if (!validateEmail(registrationData.email)) {
      errors.email = language === 'np' ? 'वैध इमेल ठेगाना प्रविष्ट गर्नुहोस्' : 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!registrationData.phone.trim()) {
      errors.phone = language === 'np' ? 'फोन नम्बर आवश्यक छ' : 'Phone number is required';
      isValid = false;
    } else if (!validatePhoneNumber(registrationData.phone)) {
      errors.phone = language === 'np' ? 'वैध १०-अंकीय फोन नम्बर प्रविष्ट गर्नुहोस् (९८ वा ९७ सुरु)' : 'Please enter a valid 10-digit phone number (starting with 98 or 97)';
      isValid = false;
    }
    
    // Citizen ID validation only for non-admin users
    const isAdmin = registrationData.userType === 'admin';
    if (!isAdmin) {
      if (!registrationData.citizenId.trim()) {
        errors.citizenId = language === 'np' ? 'नागरिकता नम्बर आवश्यक छ' : 'Citizen ID is required';
        isValid = false;
      } else if (!validateCitizenId(registrationData.citizenId)) {
        errors.citizenId = language === 'np' ? 'वैध नागरिकता नम्बर प्रविष्ट गर्नुहोस् (XX-XX-XX-XX-XXXXX)' : 'Please enter a valid Citizen ID (XX-XX-XX-XX-XXXXX)';
        isValid = false;
      }
    }
    
    if (!registrationData.password.trim()) {
      errors.password = language === 'np' ? 'पासवर्ड आवश्यक छ' : 'Password is required';
      isValid = false;
    } else if (registrationData.password.length < 6) {
      errors.password = language === 'np' ? 'पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ' : 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (!registrationData.confirmPassword.trim()) {
      errors.confirmPassword = language === 'np' ? 'पासवर्ड पुष्टि गर्नुहोस्' : 'Please confirm password';
      isValid = false;
    } else if (registrationData.password !== registrationData.confirmPassword) {
      errors.confirmPassword = language === 'np' ? 'पासवर्ड मेल खाँदैन' : 'Passwords do not match';
      isValid = false;
    }
    
    setRegistrationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, you would make an API call here
      // For now, we'll simulate a successful login
      const credentials = {
        email: formData.email,
        phone: formData.phone,
        citizenId: formData.citizenId,
        name: userType === 'citizen' ? 'Citizen User' : 
              userType === 'officer' ? 'Government Officer' : 
              'Administrator',
        userType: userType
      };
      
      // Call the onLogin prop with user data
      onLogin(userType, credentials);
      
    } catch (error) {
      setErrorMessage(
        language === 'np' 
          ? 'लगइन गर्दा त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।' 
          : 'Error during login. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegistrationForm()) {
      return;
    }
    
    // In a real application, you would make an API call here
    // For now, show a success message
    alert(language === 'np' 
      ? 'दर्ता सफल भयो! कृपया लगइन गर्नुहोस्।' 
      : 'Registration successful! Please login.');
    
    setShowRegistrationForm(false);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const identifier = forgotPasswordMethod === 'email' ? forgotPasswordData.email :
                      forgotPasswordMethod === 'phone' ? forgotPasswordData.phone :
                      forgotPasswordData.citizenId;
    
    if (!identifier.trim()) {
      alert(language === 'np' 
        ? 'कृपया आफ्नो ठेगाना प्रविष्ट गर्नुहोस्' 
        : 'Please enter your contact information');
      return;
    }
    
    // In a real application, you would make an API call here
    alert(language === 'np' 
      ? 'पासवर्ड रिसेट लिंक तपाईंको इमेलमा पठाइएको छ।' 
      : 'Password reset link has been sent to your email.');
    setShowForgotPassword(false);
  };

  const handleNewUserClick = () => {
    setShowRegistrationForm(true);
  };

  const loginMethods = [
    {
      id: 'email',
      icon: Mail,
      labelEn: 'Email',
      labelNp: 'इमेल'
    },
    {
      id: 'phone',
      icon: Smartphone,
      labelEn: 'Phone',
      labelNp: 'फोन नम्बर'
    },
    {
      id: 'citizenId',
      icon: User,
      labelEn: 'Citizen ID',
      labelNp: 'नागरिकता नम्बर'
    }
  ];

  const userTypes = [
    { id: 'citizen' as UserType, icon: User, labelEn: 'Citizen', labelNp: 'नागरिक' },
    { id: 'officer' as UserType, icon: Shield, labelEn: 'Officer', labelNp: 'अधिकृत' },
    { id: 'admin' as UserType, icon: Building, labelEn: 'Administrator', labelNp: 'प्रशासक' }
  ];

  // Helper function to get form value based on login method
  const getFormValue = () => {
    switch (loginMethod) {
      case 'email': return formData.email;
      case 'phone': return formData.phone;
      case 'citizenId': return formData.citizenId;
      default: return '';
    }
  };

  // Registration Form Modal
  const renderRegistrationFormModal = () => {
    if (!showRegistrationForm) return null;

    const isAdmin = registrationData.userType === 'admin';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 my-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {language === 'np' ? 'नयाँ प्रयोगकर्ता दर्ता' : 'New User Registration'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'np' 
                    ? 'तपाईंको विवरणहरू भर्नुहोस्' 
                    : 'Fill in your details to create an account'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRegistrationForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleRegistrationSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'np' ? 'पूरा नाम' : 'Full Name'}
              </label>
              <input
                type="text"
                name="fullName"
                value={registrationData.fullName}
                onChange={handleRegistrationInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  registrationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'np' ? 'राम बहादुर सिंह' : 'Ram Bahadur Singh'}
                required
              />
              {registrationErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">{registrationErrors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'np' ? 'इमेल ठेगाना' : 'Email Address'}
              </label>
              <input
                type="email"
                name="email"
                value={registrationData.email}
                onChange={handleRegistrationInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  registrationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'np' ? 'example@email.com' : 'example@email.com'}
                required
              />
              {registrationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{registrationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'np' ? 'फोन नम्बर' : 'Phone Number'}
              </label>
              <input
                type="tel"
                name="phone"
                value={registrationData.phone}
                onChange={handleRegistrationInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  registrationErrors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'np' ? '९८०१२३४५६७' : '9801234567'}
                required
              />
              {registrationErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{registrationErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'np' ? 'खाता प्रकार' : 'Account Type'}
              </label>
              <select
                name="userType"
                value={registrationData.userType}
                onChange={handleRegistrationInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="citizen">{language === 'np' ? 'नागरिक' : 'Citizen'}</option>
                <option value="officer">{language === 'np' ? 'सरकारी कर्मचारी' : 'Government Officer'}</option>
                <option value="admin">{language === 'np' ? 'प्रशासक' : 'Administrator'}</option>
              </select>
            </div>

            {!isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'np' ? 'नागरिकता नम्बर' : 'Citizen ID'}
                </label>
                <input
                  type="text"
                  name="citizenId"
                  value={registrationData.citizenId}
                  onChange={handleRegistrationInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    registrationErrors.citizenId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={language === 'np' ? '०१-०४-७३-०२-०१२३४' : '01-04-73-02-01234'}
                  required={!isAdmin}
                />
                {registrationErrors.citizenId && (
                  <p className="text-red-500 text-xs mt-1">{registrationErrors.citizenId}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'np' ? 'पासवर्ड' : 'Password'}
              </label>
              <input
                type="password"
                name="password"
                value={registrationData.password}
                onChange={handleRegistrationInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  registrationErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'np' ? 'कम्तिमा ६ अक्षरको' : 'At least 6 characters'}
                required
              />
              {registrationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{registrationErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'np' ? 'पासवर्ड पुष्टि गर्नुहोस्' : 'Confirm Password'}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={registrationData.confirmPassword}
                onChange={handleRegistrationInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  registrationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'np' ? 'पासवर्ड पुनः प्रविष्ट गर्नुहोस्' : 'Re-enter your password'}
                required
              />
              {registrationErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{registrationErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg mt-6"
            >
              {language === 'np' ? 'दर्ता गर्नुहोस्' : 'Register'}
            </button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setShowRegistrationForm(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← {language === 'np' ? 'लग-इनमा फर्कनुहोस्' : 'Back to Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderForgotPasswordModal = () => {
    if (!showForgotPassword) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Key size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {language === 'np' ? 'पासवर्ड रिसेट' : 'Reset Password'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'np' 
                    ? 'पासवर्ड रिसेट गर्न तपाईंको खाता फेला पार्नुहोस्' 
                    : 'Find your account to reset password'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">
              {language === 'np' ? 'रिसेट तरिका:' : 'Reset via:'}
            </p>
            <div className="flex space-x-2">
              {loginMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setForgotPasswordMethod(method.id as 'email' | 'phone' | 'citizenId')}
                    className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      forgotPasswordMethod === method.id
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-xs mt-1 font-medium">
                      {language === 'np' ? method.labelNp : method.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {forgotPasswordMethod === 'email' 
                  ? language === 'np' ? 'इमेल ठेगाना' : 'Email Address'
                  : forgotPasswordMethod === 'phone'
                  ? language === 'np' ? 'फोन नम्बर' : 'Phone Number'
                  : language === 'np' ? 'नागरिकता नम्बर' : 'Citizen ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {forgotPasswordMethod === 'email' && <Mail size={20} className="text-gray-400" />}
                  {forgotPasswordMethod === 'phone' && <Smartphone size={20} className="text-gray-400" />}
                  {forgotPasswordMethod === 'citizenId' && <User size={20} className="text-gray-400" />}
                </div>
                <input
                  type={forgotPasswordMethod === 'email' ? 'email' : 'text'}
                  name={forgotPasswordMethod}
                  value={
                    forgotPasswordMethod === 'email' ? forgotPasswordData.email :
                    forgotPasswordMethod === 'phone' ? forgotPasswordData.phone :
                    forgotPasswordData.citizenId
                  }
                  onChange={handleForgotPasswordInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder={
                    forgotPasswordMethod === 'email'
                      ? language === 'np' ? 'example@email.com' : 'Enter your email'
                      : forgotPasswordMethod === 'phone'
                      ? language === 'np' ? '९८०१२३४५६७' : '9801234567'
                      : language === 'np' ? '०१-०४-७३-०२-०१२३४' : '01-04-73-02-01234'
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
            >
              {language === 'np' ? 'रिसेट लिंक पठाउनुहोस्' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← {language === 'np' ? 'लग-इनमा फर्कनुहोस्' : 'Back to Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← <span className="text-sm font-medium">{language === 'np' ? 'गृहपृष्ठ' : 'Home'}</span>
              </button>
            )}
            <button
              onClick={onToggleLanguage}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="text-sm font-medium">
                {language === 'np' ? 'English' : 'नेपाली'}
              </span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  <div className="text-white font-bold text-2xl">CDH</div>
                </div>
        
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">CitizenDocHub</h1>
                  <p className="text-sm text-gray-500 tracking-wide">
                    {language === 'np' ? 'नागरिक कागजात केन्द्र' : 'Citizen Document Center'}
                  </p>
                </div>
              </div>
    
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-4 rounded-xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === 'np' ? 'लग-इन' : 'Login'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {language === 'np' 
                    ? 'तपाईंको खातामा पहुँच प्राप्त गर्नुहोस्'
                    : 'Access your account to continue'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                {language === 'np' ? 'तपाईं को हुनुहुन्छ?' : 'Who are you?'}
              </p>
              <div className="flex space-x-2">
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  const isActive = userType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setUserType(type.id)}
                      className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-xs mt-1 font-medium">
                        {language === 'np' ? type.labelNp : type.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                {language === 'np' ? 'लग-इन गर्ने तरिका:' : 'Login with:'}
              </p>
              <div className="flex space-x-2">
                {loginMethods.map((method) => {
                  const Icon = method.icon;
                  const isActive = loginMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setLoginMethod(method.id as 'email' | 'phone' | 'citizenId')}
                      className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-xs mt-1 font-medium">
                        {language === 'np' ? method.labelNp : method.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {loginMethod === 'email' 
                    ? language === 'np' ? 'इमेल ठेगाना' : 'Email Address'
                    : loginMethod === 'phone'
                    ? language === 'np' ? 'फोन नम्बर' : 'Phone Number'
                    : language === 'np' ? 'नागरिकता नम्बर' : 'Citizen ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {loginMethod === 'email' && <Mail size={20} className="text-gray-400" />}
                    {loginMethod === 'phone' && <Smartphone size={20} className="text-gray-400" />}
                    {loginMethod === 'citizenId' && <User size={20} className="text-gray-400" />}
                  </div>
                  <input
                    type={loginMethod === 'email' ? 'email' : 'text'}
                    name={loginMethod}
                    value={getFormValue()}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      formErrors[loginMethod] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={
                      loginMethod === 'email'
                        ? language === 'np' ? 'example@email.com' : 'Enter your email'
                        : loginMethod === 'phone'
                        ? language === 'np' ? '९८०१२३४५६७' : '9801234567'
                        : language === 'np' ? '०१-०४-७३-०२-०१२३४' : '01-04-73-02-01234'
                    }
                    required
                  />
                </div>
                {formErrors[loginMethod] && (
                  <p className="text-red-500 text-xs mt-1">{formErrors[loginMethod]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'np' ? 'पासवर्ड' : 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      formErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={language === 'np' ? 'पासवर्ड' : 'Password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center">{errorMessage}</p>
                  <p className="text-red-500 text-xs text-center mt-1">
                    {language === 'np' 
                      ? 'कृपया दर्ता गर्नुहोस् वा आफ्नो लगइन विवरण जाँच गर्नुहोस्।' 
                      : 'Please register or check your login credentials.'}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                    {language === 'np' ? 'मलाई सम्झनुहोस्' : 'Remember me'}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {language === 'np' ? 'पासवर्ड बिर्सनुभयो?' : 'Forgot Password?'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {language === 'np' ? 'प्रवेश गर्दै...' : 'Logging in...'}
                  </span>
                ) : (
                  language === 'np' ? 'लग-इन गर्नुहोस्' : 'Login'
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  {language === 'np' ? 'खाता छैन?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={handleNewUserClick}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    {language === 'np' ? 'दर्ता गर्नुहोस्' : 'Register now'}
                  </button>
                </p>
              </div>
            </form>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <Shield size={18} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  {language === 'np'
                    ? 'तपाईंको सुरक्षा हाम्रो प्राथमिकता हो। कृपया आफ्नो लग-इन विवरण कसैसँग साझा नगर्नुहोस्।'
                    : 'Your security is our priority. Please do not share your login credentials with anyone.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderForgotPasswordModal()}
      {renderRegistrationFormModal()}
    </>
  );
};

export default Login;