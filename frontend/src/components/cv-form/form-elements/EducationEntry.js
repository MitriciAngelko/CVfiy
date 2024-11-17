// src/components/cv-form/form-elements/EducationEntry.js
import React from 'react';
import { InputField } from './InputField';

export const EducationEntry = ({ data, updateEntry, removeEntry, index }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm mb-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Institution"
          value={data.institution}
          onChange={(e) => updateEntry(index, 'institution', e.target.value)}
          placeholder="University Name"
        />
        <InputField
          label="Degree"
          value={data.degree}
          onChange={(e) => updateEntry(index, 'degree', e.target.value)}
          placeholder="Bachelor's Degree"
        />
        <InputField
          label="Start Date"
          type="month"
          value={data.startDate}
          onChange={(e) => updateEntry(index, 'startDate', e.target.value)}
        />
        <InputField
          label="End Date"
          type="month"
          value={data.endDate}
          onChange={(e) => updateEntry(index, 'endDate', e.target.value)}
        />
      </div>
      <button
        onClick={() => removeEntry(index)}
        className="mt-2 text-red-500 hover:text-red-700 text-sm"
      >
        Remove Entry
      </button>
    </div>
  );
};