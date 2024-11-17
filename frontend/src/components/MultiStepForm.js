// src/components/cv-form/MultiStepForm.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, GraduationCap, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';
import { StepIndicator } from './cv-form/form-elements/StepIndicator';
import { BasicInfoStep } from './cv-form/steps/BasicInfoStep';
import { EducationStep } from './cv-form/steps/EducationStep';
import { ExperienceStep } from './cv-form/steps/ExperienceStep';
import { useSelector } from 'react-redux';
import { createCV, downloadCV } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import SuccessModal from './SuccessModal';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    basicInfo: {
      fullName: '',
      phone: '',
      email: ''
    },
    education: [],
    experience: []
  });
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { name: 'Basic Info', icon: <User size={20} /> },
    { name: 'Education', icon: <GraduationCap size={20} /> },
    { name: 'Experience', icon: <Briefcase size={20} /> }
  ];

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.basicInfo.fullName) newErrors.fullName = 'Name is required';
      if (!formData.basicInfo.email) newErrors.email = 'Email is required';
      if (!formData.basicInfo.phone) newErrors.phone = 'Phone is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const updateBasicInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value
      }
    }));
  };

  const addEntry = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], type === 'education' ? {
        institution: '',
        degree: '',
        startDate: '',
        endDate: ''
      } : {
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  const updateEntry = (type, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeEntry = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            data={formData.basicInfo}
            updateData={updateBasicInfo}
            errors={errors}
          />
        );
      case 1:
        return (
          <EducationStep
            data={formData.education}
            updateEntry={(index, field, value) => updateEntry('education', index, field, value)}
            removeEntry={(index) => removeEntry('education', index)}
            addEntry={() => addEntry('education')}
          />
        );
      case 2:
        return (
          <ExperienceStep
            data={formData.experience}
            updateEntry={(index, field, value) => updateEntry('experience', index, field, value)}
            removeEntry={(index) => removeEntry('experience', index)}
            addEntry={() => addEntry('experience')}
          />
        );
      default:
        return null;
    }
  };


  const downloadPDF = async (url) => {
    try {
      console.log('Starting PDF download from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Verificăm dacă răspunsul este de tip PDF
      const contentType = response.headers.get('content-type');
      console.log('Content Type:', contentType);
  
      const blob = await response.blob();
      console.log('Blob size:', blob.size);
  
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }
  
      // Creăm URL-ul pentru blob
      const downloadUrl = window.URL.createObjectURL(blob);
      console.log('Created Blob URL:', downloadUrl);
  
      // Creăm și simulăm click pe link-ul de descărcare
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `cv-${Date.now()}.pdf`; // Nume unic pentru fișier
      link.style.display = 'none';
      
      // Adăugăm link-ul în DOM
      document.body.appendChild(link);
      
      // Simulăm click și apoi curățăm
      link.click();
      
      // Ștergem link-ul din DOM după un scurt delay
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
  
      return true;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again or check console for details.');
      return false;
    }
  };
  



  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        if (!user || !user.token) {
          throw new Error('No authentication token available');
        }
  
        setIsLoading(true);
        const response = await createCV(user.token, formData);
        
        console.log('Server response:', response);
  
        if (!response.pdfUrl || !response.cvId) {
          throw new Error('Invalid response from server');
        }
  
        // Încercăm să descărcăm PDF-ul prin backend
        // await downloadCV(user.token, response.cvId, response.pdfUrl);
  
        // Salvăm în localStorage
        localStorage.setItem('cvFormData', JSON.stringify(formData));
        localStorage.setItem('lastGeneratedCV', JSON.stringify({
          id: response.cvId,
          pdfUrl: response.pdfUrl
        }));
        
        // Arătăm dialogul de succes
        setShowSuccess(true);
      } catch (error) {
        console.error('Error in submit process:', error);
        alert(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/profile'); // Redirecționare către profil
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
        {isLoading && <LoadingSpinner />}
        <SuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
        <StepIndicator currentStep={currentStep} steps={steps} />
      
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center px-4 py-2 rounded-lg
              ${currentStep === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
          >
            <ChevronLeft size={20} className="mr-2" />
            Previous
          </button>
          
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Next
              <ChevronRight size={20} className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;