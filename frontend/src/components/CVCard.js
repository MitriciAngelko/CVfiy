import React from 'react';
import { Download, Mail, Phone, Briefcase, School } from 'lucide-react';

const CVCard = ({ cv, onDownload }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp._seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {cv.basicInfo.fullName}
          </h3>
          <p className="text-sm text-gray-500">Created on {formatDate(cv.createdAt)}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          cv.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {cv.status}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex-grow">
        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            <span className="text-sm">{cv.basicInfo.email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm">{cv.basicInfo.phone}</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-3">
          {cv.experience && cv.experience.length > 0 && (
            <div className="flex items-center text-gray-600">
              <Briefcase className="w-4 h-4 mr-2" />
              <span className="text-sm">{cv.experience.length} work experiences</span>
            </div>
          )}
          {cv.education && cv.education.length > 0 && (
            <div className="flex items-center text-gray-600">
              <School className="w-4 h-4 mr-2" />
              <span className="text-sm">{cv.education.length} education entries</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions Section - Always at the bottom */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onDownload(cv.id, cv.pdfUrl)}
          className="w-full flex items-center justify-center px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
        >
          <Download className="w-4 h-4 mr-1" />
          Download
        </button>
      </div>
    </div>
  );
};

export default CVCard;