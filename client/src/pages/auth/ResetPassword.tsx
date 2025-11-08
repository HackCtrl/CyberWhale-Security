
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, AlertCircle, Loader2, CheckCircle, Lock } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  
  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      return 'Пароль должен содержать минимум 6 символов';
    }
    return null;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await updatePassword(password);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cyberdark-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-cyberblue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Сброс пароля
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-cyberdark-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-cyberdark-700">
            {isSubmitted ? (
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Пароль успешно изменен
                </h3>
                <p className="text-gray-400 mb-6">
                  Ваш пароль был успешно изменен. Теперь вы можете войти в систему с новым паролем.
                </p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-cyberblue-500 hover:bg-cyberblue-600"
                >
                  Перейти на страницу входа
                </Button>
              </div>
            ) : (
              <>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-200">
                      Новый пароль
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="bg-cyberdark-700 border-cyberdark-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Минимум 6 символов
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-200">
                      Подтвердите новый пароль
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        required
                        className={`bg-cyberdark-700 border-cyberdark-600 ${
                          confirmPassword && password !== confirmPassword ? 'border-red-500' : ''
                        }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">Пароли не совпадают</p>
                    )}
                  </div>

                  <div>
                    <Button
                      type="submit"
                      disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                      className="w-full bg-cyberblue-500 hover:bg-cyberblue-600"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Обновление...
                        </>
                      ) : (
                        'Обновить пароль'
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
