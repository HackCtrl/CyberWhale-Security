import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
  const { register, login, verifyEmail, resendVerification, forgotPassword, resetPassword } = useAuth();
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'auth' | 'verify' | 'forgot' | 'reset'>('auth');
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [verifyForm, setVerifyForm] = useState({ email: '', code: '' });
  const [forgotForm, setForgotForm] = useState({ email: '' });
  const [resetForm, setResetForm] = useState({ email: '', code: '', newPassword: '', confirmPassword: '' });
  
  const [developmentCode, setDevelopmentCode] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await login(loginForm.email, loginForm.password);
      
      if (result.success) {
        onClose();
        resetForms();
      } else if (result.emailVerificationRequired) {
        setVerifyForm({ email: loginForm.email, code: '' });
        setStep('verify');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await register(registerForm.username, registerForm.email, registerForm.password);
      
      if (result.success && result.verificationRequired) {
        setVerifyForm({ email: registerForm.email, code: '' });
        setDevelopmentCode(result.developmentCode || '');
        setStep('verify');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await verifyEmail(verifyForm.email, verifyForm.code);
      
      if (result.success) {
        onClose();
        resetForms();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await resendVerification(verifyForm.email);
      if (result.success) {
        setDevelopmentCode(result.developmentCode || '');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await forgotPassword(forgotForm.email);
      
      if (result.success) {
        setResetForm({ email: forgotForm.email, code: '', newPassword: '', confirmPassword: '' });
        setDevelopmentCode(result.developmentCode || '');
        setStep('reset');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await resetPassword(resetForm.email, resetForm.code, resetForm.newPassword);
      
      if (result.success) {
        setStep('auth');
        setActiveTab('login');
        resetForms();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' });
    setVerifyForm({ email: '', code: '' });
    setForgotForm({ email: '' });
    setResetForm({ email: '', code: '', newPassword: '', confirmPassword: '' });
    setDevelopmentCode('');
    setStep('auth');
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-cyberdark-900 border-cyberdark-700">
        <DialogHeader>
          <DialogTitle className="text-white text-center">
            {step === 'verify' && (
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                Подтверждение Email
              </div>
            )}
            {step === 'forgot' && 'Восстановление пароля'}
            {step === 'reset' && 'Новый пароль'}
            {step === 'auth' && (
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                CyberWhale
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="text-center text-gray-400 text-sm">
              Мы отправили код подтверждения на <strong>{verifyForm.email}</strong>
            </div>
            
            {developmentCode && (
              <div className="bg-blue-950 border border-blue-800 rounded-lg p-3 text-center">
                <div className="text-blue-300 text-sm mb-1">Код для разработки:</div>
                <div className="text-blue-100 font-mono text-lg">{developmentCode}</div>
              </div>
            )}
            
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div>
                <Label htmlFor="verify-code" className="text-gray-300">Код подтверждения</Label>
                <Input
                  id="verify-code"
                  type="text"
                  placeholder="Введите 6-значный код"
                  value={verifyForm.code}
                  onChange={(e) => setVerifyForm({ ...verifyForm, code: e.target.value })}
                  className="bg-cyberdark-800 border-cyberdark-600 text-white"
                  maxLength={6}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Подтвердить'}
              </Button>
              
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onClick={handleResendCode}
                  disabled={isLoading}
                >
                  Отправить код повторно
                </Button>
              </div>
            </form>
            
            <Button
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
              onClick={() => setStep('auth')}
            >
              Назад к входу
            </Button>
          </div>
        )}

        {step === 'forgot' && (
          <div className="space-y-4">
            <div className="text-center text-gray-400 text-sm">
              Введите ваш email для получения кода восстановления
            </div>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label htmlFor="forgot-email" className="text-gray-300">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="your@email.com"
                  value={forgotForm.email}
                  onChange={(e) => setForgotForm({ email: e.target.value })}
                  className="bg-cyberdark-800 border-cyberdark-600 text-white"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Отправить код'}
              </Button>
            </form>
            
            <Button
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
              onClick={() => setStep('auth')}
            >
              Назад к входу
            </Button>
          </div>
        )}

        {step === 'reset' && (
          <div className="space-y-4">
            <div className="text-center text-gray-400 text-sm">
              Введите код из email и новый пароль
            </div>
            
            {developmentCode && (
              <div className="bg-red-950 border border-red-800 rounded-lg p-3 text-center">
                <div className="text-red-300 text-sm mb-1">Код для разработки:</div>
                <div className="text-red-100 font-mono text-lg">{developmentCode}</div>
              </div>
            )}
            
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="reset-code" className="text-gray-300">Код восстановления</Label>
                <Input
                  id="reset-code"
                  type="text"
                  placeholder="Введите 6-значный код"
                  value={resetForm.code}
                  onChange={(e) => setResetForm({ ...resetForm, code: e.target.value })}
                  className="bg-cyberdark-800 border-cyberdark-600 text-white"
                  maxLength={6}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="reset-password" className="text-gray-300">Новый пароль</Label>
                <div className="relative">
                  <Input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    value={resetForm.newPassword}
                    onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                    className="bg-cyberdark-800 border-cyberdark-600 text-white pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="reset-confirm-password" className="text-gray-300">Подтвердите пароль</Label>
                <Input
                  id="reset-confirm-password"
                  type="password"
                  value={resetForm.confirmPassword}
                  onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                  className="bg-cyberdark-800 border-cyberdark-600 text-white"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Сбросить пароль'}
              </Button>
            </form>
            
            <Button
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
              onClick={() => setStep('auth')}
            >
              Назад к входу
            </Button>
          </div>
        )}

        {step === 'auth' && (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-cyberdark-800">
              <TabsTrigger value="login" className="data-[state=active]:bg-cyberdark-700 text-white">
                Вход
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-cyberdark-700 text-white">
                Регистрация
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="bg-cyberdark-800 border-cyberdark-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="login-password" className="text-gray-300">Пароль</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="bg-cyberdark-800 border-cyberdark-600 text-white pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Войти'}
                </Button>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-gray-400 hover:text-white text-sm"
                    onClick={() => setStep('forgot')}
                  >
                    Забыли пароль?
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-username" className="text-gray-300">Имя пользователя</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="username"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                    className="bg-cyberdark-800 border-cyberdark-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="register-email" className="text-gray-300">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="bg-cyberdark-800 border-cyberdark-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="register-password" className="text-gray-300">Пароль</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="bg-cyberdark-800 border-cyberdark-600 text-white pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="register-confirm-password" className="text-gray-300">Подтвердите пароль</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    className="bg-cyberdark-800 border-cyberdark-600 text-white"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Зарегистрироваться'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}