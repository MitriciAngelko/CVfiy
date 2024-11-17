// src/components/cv-form/steps/BasicInfoStep.js
import React from 'react';
import { InputField } from '../form-elements/InputField';

export const BasicInfoStep = ({ data, updateData, errors }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
      <InputField
        label="Full Name"
        value={data.fullName}
        onChange={(e) => updateData('fullName', e.target.value)}
        error={errors.fullName}
        placeholder="John Doe"
      />
      <InputField
        label="Phone"
        value={data.phone}
        onChange={(e) => updateData('phone', e.target.value)}
        error={errors.phone}
        placeholder="+1234567890"
      />
      <InputField
        label="Email"
        type="email"
        value={data.email}
        onChange={(e) => updateData('email', e.target.value)}
        error={errors.email}
        placeholder="john@example.com"
      />
    </div>
  );
};
