import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { User } from '../types/auth';

export const useAuth = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user: User = await response.json();
        dispatch({ type: 'SET_USER', payload: user });
        
        // Fetch user data
        await Promise.all([
          fetchCredentials(token),
          fetchResources(token),
        ]);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const fetchCredentials = async (token: string) => {
    try {
      const response = await fetch('/.netlify/functions/credentials/read', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const credentials = await response.json();
        dispatch({ type: 'SET_CREDENTIALS', payload: credentials });
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    }
  };

  const fetchResources = async (token: string) => {
    try {
      const response = await fetch('/.netlify/functions/resources/read', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const resources = await response.json();
        dispatch({ type: 'SET_RESOURCES', payload: resources });
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_CREDENTIALS', payload: [] });
    dispatch({ type: 'SET_RESOURCES', payload: [] });
  };

  return {
    user: state.user,
    loading,
    logout,
  };
};