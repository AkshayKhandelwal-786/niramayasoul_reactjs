import React, { createContext, useState, useEffect } from 'react';
import axiosConfig from '../../services/axiosToken';

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    // Fetch user profile from API
    const fetchUserProfile = async () => {
      try {
        const response = await axiosConfig.get('/customers/profile');
        if (response.data && response.data.data) {
          setUserProfile(response.data.data); // Set the profile data
        } else {
          throw new Error('Profile data is empty');
        }
      } catch (error) {
        setError('Error fetching user profile'); // Set the error
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false); // Stop the loading spinner once done
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
