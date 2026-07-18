'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apiRequest, setAuthToken, getAuthToken } from '../utils/api';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  industry: string;
  targetAudience: string;
  launchDate?: string;
  launchReadinessScore: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  fetchProjects: () => Promise<Project[]>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  const setCurrentProject = (proj: Project | null) => {
    setCurrentProjectState(proj);
    if (proj && typeof window !== 'undefined') {
      localStorage.setItem('selectedProjectId', proj._id);
    }
  };

  const fetchProjects = async (): Promise<Project[]> => {
    try {
      const data = await apiRequest<Project[]>('/projects');
      setProjects(data);
      
      // Auto-select project
      if (data.length > 0) {
        const savedId = localStorage.getItem('selectedProjectId');
        const found = data.find((p) => p._id === savedId);
        if (found) {
          setCurrentProjectState(found);
        } else {
          setCurrentProjectState(data[0]);
        }
      } else {
        setCurrentProjectState(null);
      }
      return data;
    } catch (err) {
      console.error('Error fetching projects:', err);
      return [];
    }
  };

  const loadCurrentUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const userData = await apiRequest('/auth/me');
      setUser(userData);
      await fetchProjects();
    } catch (err) {
      console.warn('Session expired or invalid token');
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  // Protect Dashboard routes
  useEffect(() => {
    if (!loading) {
      const isAuthRoute = pathname === '/login' || pathname === '/signup';
      const isRoot = pathname === '/';
      
      if (!user && !isAuthRoute && !isRoot) {
        router.push('/login');
      } else if (user && isAuthRoute) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname]);

  const login = async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.token);
    setUser(data.user);
    const projs = await apiRequest<Project[]>('/projects');
    setProjects(projs);
    if (projs.length > 0) {
      setCurrentProjectState(projs[0]);
      localStorage.setItem('selectedProjectId', projs[0]._id);
    }
    router.push('/dashboard');
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setAuthToken(data.token);
    setUser(data.user);
    setProjects([]);
    setCurrentProjectState(null);
    router.push('/dashboard');
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setProjects([]);
    setCurrentProjectState(null);
    localStorage.removeItem('selectedProjectId');
    router.push('/login');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          user,
          loading,
          projects,
          currentProject,
          setCurrentProject,
          fetchProjects,
          login,
          signup,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
