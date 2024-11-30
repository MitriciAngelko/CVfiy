import React from 'react';
import { User } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <User size={40} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;