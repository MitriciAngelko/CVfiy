// src/components/cv-form/form-elements/ExperienceEntry.js
import React from 'react';
import { InputField } from './InputField';

export const ExperienceEntry = ({ data, updateEntry, removeEntry, index }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm mb-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Job Title"
          value={data.jobTitle}
          onChange={(e) => updateEntry(index, 'jobTitle', e.target.value)}
          placeholder="Software Engineer"
        />
        <InputField
          label="Company"
          value={data.company}
          onChange={(e) => updateEntry(index, 'company', e.target.value)}
          placeholder="Company Name"
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
        <div className="col-span-2">
          <InputField
            label="Description"
            value={data.description}
            onChange={(e) => updateEntry(index, 'description', e.target.value)}
            placeholder="Describe your responsibilities and achievements..."
          />
        </div>
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