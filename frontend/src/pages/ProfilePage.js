import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { User, FileText } from 'lucide-react';
import { getMyCVs, downloadCV } from '../services/api';
import CVCard from '../components/CVCard';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await getMyCVs(user.token);
        setCvs(response.cvs);
      } catch (error) {
        console.error('Error fetching CVs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchCVs();
    }
  }, [user]);

  const handleDownload = async (cvId, pdfUrl) => {
    try {
      await downloadCV(user.token, cvId, pdfUrl);
    } catch (error) {
      console.error('Error downloading CV:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <User size={40} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your CVs</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : cvs?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {cvs.map((cv) => (
              <CVCard 
                key={cv.id}
                cv={cv}
                onDownload={handleDownload}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">Nu ai creat niciun CV încă.</p>
            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <FileText className="w-5 h-5 mr-2" />
              Creează primul tău CV
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;