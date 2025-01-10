import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CVSuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XCircle className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            CV creat cu succes!
          </h2>
          <p className="text-gray-600 mb-6">
            CV-ul tău a fost generat și salvat. Îl poți vedea în pagina ta de profil.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleViewProfile}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Vezi CV în profil
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Închide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVSuccessModal;