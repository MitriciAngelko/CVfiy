import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, GraduationCap, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';
import { StepIndicator } from './cv-form/form-elements/StepIndicator';
import { BasicInfoStep } from './cv-form/steps/BasicInfoStep';
import { EducationStep } from './cv-form/steps/EducationStep';
import { ExperienceStep } from './cv-form/steps/ExperienceStep';
import { useSelector } from 'react-redux';
import { createCV } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import SuccessModal from './SuccessModal';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    education: [],
    workExperience: [], // Changed from 'experience' to match required format
    skills: [], // Added skills array
    otherMentions: '' // Added other mentions field
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
      if (!formData.fullName) newErrors.fullName = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
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
      [field]: value
    }));
  };

  const addEntry = (type) => {
    const newEntry = type === 'education' 
      ? {
          institution: '',
          startDate: '',
          endDate: ''
        } 
      : {
          company: '',
          position: '', // Changed from jobTitle to position
          startDate: '',
          endDate: ''
        };

    setFormData(prev => ({
      ...prev,
      [type === 'education' ? 'education' : 'workExperience']: [...prev[type === 'education' ? 'education' : 'workExperience'], newEntry]
    }));
  };

  const updateEntry = (type, index, field, value) => {
    const arrayName = type === 'education' ? 'education' : 'workExperience';
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeEntry = (type, index) => {
    const arrayName = type === 'education' ? 'education' : 'workExperience';
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        if (!user || !user.token) {
          throw new Error('No authentication token available');
        }

        setIsLoading(true);
        
        // Format the data according to the required structure
        const formattedData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          education: formData.education,
          workExperience: formData.workExperience.map(exp => ({
            company: exp.company,
            position: exp.position,
            startDate: exp.startDate,
            endDate: exp.endDate
          })),
          skills: formData.skills || [], // Include empty array if no skills
          otherMentions: formData.otherMentions || '' // Include empty string if no mentions
        };

        const response = await createCV(user.token, formattedData);
        
        if (!response.pdfUrl || !response.cvId) {
          throw new Error('Invalid response from server');
        }

        localStorage.setItem('cvFormData', JSON.stringify(formattedData));
        localStorage.setItem('lastGeneratedCV', JSON.stringify({
          id: response.cvId,
          pdfUrl: response.pdfUrl
        }));
        
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
    navigate('/profile');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            data={formData}
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
            data={formData.workExperience}
            updateEntry={(index, field, value) => updateEntry('workExperience', index, field, value)}
            removeEntry={(index) => removeEntry('workExperience', index)}
            addEntry={() => addEntry('workExperience')}
          />
        );
      default:
        return null;
    }
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