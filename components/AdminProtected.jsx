'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import customFetch from '@/utils/customFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export function AdminProtected({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Get token from cookies (set by the consolidated login)
      const token = Cookies.get('accessToken');

      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Verify user is admin by calling the users/me endpoint with Bearer token (JWT)
      const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Auth check failed:', response.status, response.statusText);
        router.push('/auth/login');
        return;
      }

      const userData = await response.json();

      // Check if user is staff or superuser
      if (!userData.is_staff && !userData.is_superuser) {
        router.push('/admin/unauthorized');
        return;
      }

      setAuthorized(true);
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return children;
}
