
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthProvider';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger, 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Award, ChevronDown, Shield, Bell } from 'lucide-react';
import { getAvatarFallbackText } from '@/lib/auth/utils';

export default function UserMenu() {
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Brief loading state for UI transitions - max 3 seconds
  const [showLoading, setShowLoading] = useState(true);
  
  React.useEffect(() => {
    // Set a timeout to exit loading animation after 3 seconds
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show login/register buttons if not loading or loading has finished and no user
  if ((!isLoading || !showLoading) && !user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={() => (window as any).openAuthModal?.('login')}>
          Войти
        </Button>
        <Button size="sm" className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white" onClick={() => (window as any).openAuthModal?.('register')}>
          Регистрация
        </Button>
      </div>
    );
  }
  
  // Only show loading state if we haven't timed out
  if (isLoading && showLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8 rounded-full border border-cyberdark-600">
          <AvatarFallback className="bg-cyberdark-700 text-white animate-pulse">
            ...
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2 px-2 py-1 hover:bg-cyberdark-800 rounded-md"
        >
          <Avatar className="h-8 w-8 rounded-full border border-cyberdark-600">
            <AvatarImage src={user?.avatar} alt={user?.username || 'User'} />
            <AvatarFallback className="bg-cyberdark-700 text-white">
              {getAvatarFallbackText(user?.username || 'User')}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-white">{user?.username || 'User'}</span>
            <span className="text-xs text-gray-400">Уровень {user?.level || 1}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-cyberdark-800 border-cyberdark-700 text-white">
        <div className="px-4 py-2 md:hidden">
          <p className="text-sm font-medium">{user?.username || 'User'}</p>
          <p className="text-xs text-gray-400">{user?.email || ''}</p>
        </div>
        <DropdownMenuLabel className="md:hidden">
          <div className="flex items-center space-x-2 text-white">
            <Award className="h-4 w-4 text-cyberblue-500" />
            <span>Уровень {user?.level || 1} • {user?.points || 0} очков</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="md:hidden border-cyberdark-700" />
        <DropdownMenuItem className="focus:bg-cyberdark-700" asChild>
          <Link to="/profile" className="flex cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Мой профиль</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-cyberdark-700" asChild>
          <Link to="/notifications" className="flex cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            <span>Уведомления</span>
          </Link>
        </DropdownMenuItem>
        {user?.role === 'admin' && (
          <DropdownMenuItem className="focus:bg-cyberdark-700" asChild>
            <Link to="/admin" className="flex cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Админ панель</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="focus:bg-cyberdark-700" asChild>
          <Link to="/settings" className="flex cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Настройки</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-cyberdark-700" />
        <DropdownMenuItem 
          className="focus:bg-cyberdark-700 text-red-400 focus:text-red-300 cursor-pointer"
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
