// src/components/cv-form/steps/EducationStep.js
import React from 'react';
import { EducationEntry } from '../form-elements/EducationEntry';

export const EducationStep = ({ data, updateEntry, removeEntry, addEntry }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Education History</h2>
      {data.map((edu, index) => (
        <EducationEntry
          key={index}
          data={edu}
          index={index}
          updateEntry={updateEntry}
          removeEntry={removeEntry}
        />
      ))}
      <button
        onClick={addEntry}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Education
      </button>
    </div>
  );
};