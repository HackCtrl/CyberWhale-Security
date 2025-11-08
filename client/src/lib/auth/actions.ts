import { NavigateFunction } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';
import { User } from '@/types';
import { apiClient } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    role: string;
    points: number;
    level: number;
    emailVerified?: boolean;
  };
  token: string;
  message?: string;
}

interface RegisterResponse {
  userId: number;
  email: string;
  message: string;
  verificationRequired?: boolean;
  developmentCode?: string;
}

export const login = async (
  email: string,
  password: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>
): Promise<AuthResponse | null> => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Login failed');
      toast({
        title: "Ошибка входа",
        description: data.message || 'Неверный email или пароль',
        variant: "destructive",
      });
      return null;
    }

    if (data.token) {
      apiClient.setToken(data.token);
    }
    
    toast({
      title: "Успешный вход",
      description: "Добро пожаловать в CyberWhale!",
    });

    return data;
  } catch (err: any) {
    console.error('Unexpected login error:', err);
    setError(err.message);
    toast({
      title: "Ошибка входа",
      description: "Произошла неожиданная ошибка при входе",
      variant: "destructive",
    });
    return null;
  } finally {
    setIsLoading(false);
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
  navigate: NavigateFunction
): Promise<RegisterResponse | null> => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Registration failed');
      toast({
        title: "Ошибка регистрации",
        description: data.message,
        variant: "destructive",
      });
      return null;
    }
    
    if (data.verificationRequired) {
      toast({
        title: "Регистрация прошла успешно!",
        description: data.message,
      });
      
      if (data.developmentCode) {
        console.log('Verification code:', data.developmentCode);
      }
      
      navigate('/auth/verify-otp', { state: { email: data.email } });
    }
    
    return data;
  } catch (err: any) {
    console.error('Unexpected registration error:', err);
    setError(err.message);
    toast({
      title: "Ошибка регистрации",
      description: "Произошла неожиданная ошибка при регистрации",
      variant: "destructive",
    });
    return null;
  } finally {
    setIsLoading(false);
  }
};

export const logout = async (
  setUser: Dispatch<SetStateAction<User | null>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
  navigate: NavigateFunction
): Promise<void> => {
  setIsLoading(true);
  
  try {
    apiClient.clearToken();
    setUser(null);
    navigate('/');
    
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
  } catch (err: any) {
    console.error('Unexpected logout error:', err);
    setError(err.message);
    toast({
      title: "Ошибка выхода",
      description: "Произошла неожиданная ошибка при выходе",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

export const resetPassword = async (
  email: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>
): Promise<void> => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Password reset failed');
      toast({
        title: "Ошибка сброса пароля",
        description: data.message,
        variant: "destructive",
      });
      return;
    }

    if (data.developmentCode) {
      console.log('Reset code:', data.developmentCode);
    }
    
    toast({
      title: "Код отправлен",
      description: data.message,
    });
  } catch (err: any) {
    console.error('Unexpected password reset error:', err);
    setError(err.message);
    toast({
      title: "Ошибка сброса пароля",
      description: "Произошла неожиданная ошибка при сбросе пароля",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

export const updatePassword = async (
  email: string,
  code: string,
  newPassword: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>
): Promise<boolean> => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Password update failed');
      toast({
        title: "Ошибка обновления пароля",
        description: data.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Пароль обновлен",
      description: data.message,
    });

    return true;
  } catch (err: any) {
    console.error('Unexpected password update error:', err);
    setError(err.message);
    toast({
      title: "Ошибка обновления пароля",
      description: "Произошла неожиданная ошибка при обновлении пароля",
      variant: "destructive",
    });
    return false;
  } finally {
    setIsLoading(false);
  }
};

export const updateProfile = async (
  userId: number,
  updates: Partial<User>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>
): Promise<User | null> => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await apiClient.updateProfile(updates);
    
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные успешно обновлены",
    });

    return response;
  } catch (err: any) {
    console.error('Unexpected profile update error:', err);
    setError(err.message);
    toast({
      title: "Ошибка обновления профиля",
      description: "Произошла неожиданная ошибка при обновлении профиля",
      variant: "destructive",
    });
    return null;
  } finally {
    setIsLoading(false);
  }
};

export const verifyOtp = async (
  email: string,
  code: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>
): Promise<AuthResponse | null> => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Verification failed');
      toast({
        title: "Ошибка верификации",
        description: data.message,
        variant: "destructive",
      });
      return null;
    }

    if (data.token) {
      apiClient.setToken(data.token);
    }
    
    toast({
      title: "Email подтвержден!",
      description: "Добро пожаловать в CyberWhale!",
    });

    return data;
  } catch (err: any) {
    console.error('Unexpected verification error:', err);
    setError(err.message);
    toast({
      title: "Ошибка верификации",
      description: "Произошла неожиданная ошибка при верификации",
      variant: "destructive",
    });
    return null;
  } finally {
    setIsLoading(false);
  }
};

export const resendVerification = async (
  email: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>
): Promise<void> => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Resend failed');
      toast({
        title: "Ошибка отправки",
        description: data.message,
        variant: "destructive",
      });
      return;
    }

    if (data.developmentCode) {
      console.log('Verification code:', data.developmentCode);
    }
    
    toast({
      title: "Код отправлен",
      description: data.message,
    });
  } catch (err: any) {
    console.error('Unexpected resend error:', err);
    setError(err.message);
    toast({
      title: "Ошибка отправки",
      description: "Произошла неожиданная ошибка при отправке кода",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
