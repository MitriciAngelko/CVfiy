import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider'; // Assuming AuthProvider is in the right folder
import { db } from '../firebase.js';
import { collection, getDocs } from 'firebase/firestore';

const AdminPage = () => {
  const { loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <h2>Users List</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3">No users found</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button onClick={() => navigate('/')}>Go Back to Home</button>
    </div>
  );
};

export default AdminPage;
