import { User } from '@/types';
import { apiClient } from '@/lib/api';

export const handleUserLogin = async (authData: any): Promise<User | null> => {
  try {
    if (!authData || !authData.user) {
      console.error('No auth data provided to handleUserLogin');
      return null;
    }
    
    const user = authData.user;
    console.log('Processing user:', user.id);
    
    const mappedUser: User = {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role || 'user',
      points: user.points || 0,
      level: user.level || 1,
      createdAt: new Date()
    };
    
    console.log('Mapped user:', mappedUser);
    return mappedUser;
  } catch (err) {
    console.error('Error in handleUserLogin:', err);
    return null;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }

    apiClient.setToken(token);
    const userData = await apiClient.getMe();
    
    if (!userData) {
      return null;
    }

    const mappedUser: User = {
      id: userData.id.toString(),
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar,
      role: userData.role || 'user',
      points: userData.points || 0,
      level: userData.level || 1,
      createdAt: new Date()
    };

    return mappedUser;
  } catch (err) {
    console.error('Error getting current user:', err);
    apiClient.clearToken();
    return null;
  }
};

export const getAvatarFallbackText = (username: string): string => {
  if (!username) return 'UN';
  
  const nameParts = username.split(' ');
  if (nameParts.length > 1) {
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
  }
  
  return username.substring(0, 2).toUpperCase();
};
