import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Bine ați venit la sistemul nostru de generare CV
        </h1>
        
        <p className="text-xl text-gray-600 text-center mb-12">
          Alegeți metoda preferată pentru a crea un CV personalizat
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Buton pentru rezervare prin formular */}
          <button
            onClick={() => navigate('/cv-form')}
            className="group relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                <FileText size={48} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Creare CV Prin Formular
              </h3>
              <p className="text-gray-600 text-center">
                Completați un formular simplu pentru a genera un CV personalizat.
              </p>
            </div>
          </button>

          {/* Buton pentru rezervare conversațională */}
          <button
            onClick={() => navigate('/chat')}
            className="group relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                <MessageSquare size={48} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Creare CV Conversațională
              </h3>
              <p className="text-gray-600 text-center">
                Discutați cu asistentul nostru virtual pentru a genera un CV personalizat.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;