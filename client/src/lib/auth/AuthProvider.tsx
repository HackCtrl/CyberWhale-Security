import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  points: number;
  level: number;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth methods
  register: (username: string, email: string, password: string, captchaToken: string) => Promise<{ success: boolean; verificationRequired?: boolean; developmentCode?: string; message?: string; suggestedUsernames?: string[] }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; emailVerificationRequired?: boolean; message?: string }>;
  logout: () => void;
  resendVerification: (email: string) => Promise<{ success: boolean; developmentCode?: string; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; developmentCode?: string; message?: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Произошла ошибка');
    }
    
    return data;
  };

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const userData = await apiCall('/auth/me');
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('auth_token');
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register new user
  const register = async (username: string, email: string, password: string, captchaToken: string) => {
    try {
      const data = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, captchaToken }),
      });

      toast({
        title: "Регистрация успешна!",
        description: data.message,
      });

      return { 
        success: true, 
        verificationRequired: data.verificationRequired,
        developmentCode: data.developmentCode,
        message: data.message,
        suggestedUsernames: data.suggestedUsernames
      };
    } catch (error: any) {
      toast({
        title: "Ошибка регистрации",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, message: error.message };
    }
  };

  // Verify email with code
  const verifyEmail = async (email: string, code: string) => {
    try {
      const data = await apiCall('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });

      // Save token and set user
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);

      toast({
        title: "Email подтвержден!",
        description: data.message,
      });

      return { success: true, message: data.message };
    } catch (error: any) {
      toast({
        title: "Ошибка подтверждения",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, message: error.message };
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.emailVerificationRequired) {
        toast({
          title: "Требуется подтверждение email",
          description: data.message,
          variant: "destructive",
        });
        return { 
          success: false, 
          emailVerificationRequired: true,
          message: data.message 
        };
      }

      // Save token and set user
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);

      toast({
        title: "Добро пожаловать!",
        description: data.message,
      });

      return { success: true, message: data.message };
    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, message: error.message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast({
      title: "Выход выполнен",
      description: "До свидания!",
    });
  };

  // Resend verification code
  const resendVerification = async (email: string) => {
    try {
      const data = await apiCall('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      toast({
        title: "Код отправлен",
        description: data.message,
      });

      return { 
        success: true, 
        developmentCode: data.developmentCode,
        message: data.message 
      };
    } catch (error: any) {
      toast({
        title: "Ошибка отправки",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, message: error.message };
    }
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      const data = await apiCall('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      toast({
        title: "Код восстановления отправлен",
        description: data.message,
      });

      return { 
        success: true, 
        developmentCode: data.developmentCode,
        message: data.message 
      };
    } catch (error: any) {
      toast({
        title: "Ошибка восстановления",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, message: error.message };
    }
  };

  // Reset password with code
  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      const data = await apiCall('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, code, newPassword }),
      });

      toast({
        title: "Пароль изменен",
        description: data.message,
      });

      return { success: true, message: data.message };
    } catch (error: any) {
      toast({
        title: "Ошибка сброса пароля",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, message: error.message };
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      const data = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      setUser(data);

      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      });

      return { success: true, message: "Профиль обновлен" };
    } catch (error: any) {
      toast({
        title: "Ошибка обновления",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, message: error.message };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    verifyEmail,
    login,
    logout,
    resendVerification,
    forgotPassword,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}