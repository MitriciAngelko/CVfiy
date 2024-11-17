// src/components/cv-form/steps/ExperienceStep.js
import React from 'react';
import { ExperienceEntry } from '../form-elements/ExperienceEntry';

export const ExperienceStep = ({ data, updateEntry, removeEntry, addEntry }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Work Experience</h2>
      {data.map((exp, index) => (
        <ExperienceEntry
          key={index}
          data={exp}
          index={index}
          updateEntry={updateEntry}
          removeEntry={removeEntry}
        />
      ))}
      <button
        onClick={addEntry}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Experience
      </button>
    </div>
  );
};