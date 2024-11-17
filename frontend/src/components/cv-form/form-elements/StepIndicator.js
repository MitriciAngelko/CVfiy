// src/components/cv-form/form-elements/StepIndicator.js
import React from 'react';
import { User, GraduationCap, Briefcase } from 'lucide-react';

export const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-center space-x-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full 
              ${currentStep === index 
                ? 'bg-blue-500 text-white' 
                : currentStep > index 
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'}`}>
              {step.icon}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-20 h-1 mx-2 ${
                currentStep > index ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};