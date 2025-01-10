import { auth } from "../firebase";

// services/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

export const createUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const createCV = async (token, cvData) => {
    try {
      console.log(token)
      console.log('cvData:', cvData);
      const response = await fetch(`${API_URL}/cvs/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cvData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to create CV');
      }
  
      const data = await response.json();
      console.log('CV created successfully:', data);
      return data; // Returnează răspunsul complet care include pdfUrl
    } catch (error) {
      console.error('Error creating CV:', error);
      throw error;
    }
  };

  export const downloadCV = async (token, cvId, pdfUrl) => {
    try {
      const response = await fetch(
        `${API_URL}/cvs/download/${cvId}?url=${encodeURIComponent(pdfUrl)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to download CV');
      }
  
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `cv-${cvId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
  
      return true;
    } catch (error) {
      console.error('Error downloading CV:', error);
      throw error;
    }
  };

  export const getMyCVs = async (token) => {
    try {
      const response = await fetch(`${API_URL}/cvs/my-cvs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch CVs');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching CVs:', error);
      throw error;
    }
  };

  export const startChatSession = async (token) => {
    try {
      const response = await fetch(`${API_URL}/messages/session/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'cv_collection'
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to start chat session');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error starting chat session:', error);
      throw error;
    }
  };
  
  
  export const sendChatMessage = async (token, sessionId, message) => {
    try {
      const response = await fetch(`${API_URL}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          sessionId,
          conversationType: 'cv_collection'
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };
  