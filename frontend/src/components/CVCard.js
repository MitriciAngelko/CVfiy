import React from 'react';
import { Download, Mail, Phone, Briefcase, School } from 'lucide-react';

const CVCard = ({ cv, onDownload }) => {
  if (!cv) {
    return null;
  }

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return '';
    return new Date(timestamp._seconds * 1000).toLocaleDateString();
  };

  // Verificăm dacă avem basicInfo și extragem datele în siguranță
  const fullName = cv.fullName || 'Nume necunoscut';
  const email = cv.email || '';
  const phone = cv.phone || '';

  // Verificăm dacă avem arrays pentru education și experience
  const educationCount = Array.isArray(cv.education) ? cv.education.length : 0;
  const experienceCount = Array.isArray(cv.experience) ? cv.experience.length : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {fullName}
          </h3>
          <p className="text-sm text-gray-500">
            {cv.createdAt ? `Creat pe ${formatDate(cv.createdAt)}` : 'Data necunoscută'}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          cv.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {cv.status || 'În așteptare'}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex-grow">
        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          {email && (
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-sm">{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm">{phone}</span>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="space-y-3">
          {experienceCount > 0 && (
            <div className="flex items-center text-gray-600">
              <Briefcase className="w-4 h-4 mr-2" />
              <span className="text-sm">{experienceCount} experiență profesională</span>
            </div>
          )}
          {/* {educationCount > 0 && (
            <div className="flex items-center text-gray-600">
              <School className="w-4 h-4 mr-2" />
              <span className="text-sm">{educationCount} educație</span>
            </div>
          )} */}
        </div>
      </div>

      {/* Actions Section */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => cv.id && cv.pdfUrl && onDownload(cv.id, cv.pdfUrl)}
          className="w-full flex items-center justify-center px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
          disabled={!cv.id || !cv.pdfUrl}
        >
          <Download className="w-4 h-4 mr-1" />
          Download
        </button>
      </div>
    </div>
  );
};

export default CVCard;