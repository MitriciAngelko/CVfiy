// src/components/cv-form/steps/SkillsStep.js
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export const SkillsStep = ({ skills, updateSkills }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      updateSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (indexToRemove) => {
    updateSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Professional Skills</h2>
      <p className="text-gray-600 mb-4">
        Add your skills, technologies, and areas of expertise
      </p>

      <form onSubmit={handleAddSkill} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter a skill (e.g., JavaScript, Project Management, etc.)"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={!newSkill.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                     flex items-center gap-2"
          >
            <Plus size={20} />
            Add Skill
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="group flex items-center gap-2 px-3 py-1.5 bg-blue-100 
                     text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
          >
            <span className="text-sm font-medium">{skill}</span>
            <button
              onClick={() => removeSkill(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity 
                       hover:bg-blue-300 rounded-full p-1"
              title="Remove skill"
            >
              <X size={14} className="text-blue-700 hover:text-blue-900" />
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-gray-500 italic">No skills added yet</p>
        )}
      </div>
    </div>
  );
};