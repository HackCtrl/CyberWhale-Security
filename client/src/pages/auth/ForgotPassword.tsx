
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, isLoading, error } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cyberdark-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-cyberblue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Восстановление пароля
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Вспомнили пароль?{' '}
            <Link to="/login" className="font-medium text-cyberblue-500 hover:text-cyberblue-400">
              Вернуться к входу
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-cyberdark-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-cyberdark-700">
            {isSubmitted ? (
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Проверьте вашу почту
                </h3>
                <p className="text-gray-400 mb-6">
                  Мы отправили ссылку для сброса пароля на {email}. Нажмите на ссылку в письме, чтобы сбросить пароль.
                </p>
                <p className="text-gray-400 text-sm">
                  Не получили письмо?{' '}
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="font-medium text-cyberblue-500 hover:text-cyberblue-400"
                  >
                    Отправить снова
                  </button>
                </p>
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
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-200">
                      Email
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="bg-cyberdark-700 border-cyberdark-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Мы отправим вам ссылку для сброса пароля.
                    </p>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-cyberblue-500 hover:bg-cyberblue-600"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        'Сбросить пароль'
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
