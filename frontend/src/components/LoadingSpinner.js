import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div 
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
      style={{ pointerEvents: 'all' }} // Asigură că overlay-ul blochează interacțiunile
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-700 font-medium">Se procesează...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;