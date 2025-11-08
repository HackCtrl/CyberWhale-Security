
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function EmailConfirm() {
  const [status] = useState<'loading' | 'success' | 'error'>('success');
  const [errorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cyberdark-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-cyberblue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Подтверждение Email
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-cyberdark-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-cyberdark-700">
            <div className="text-center">
              {status === 'loading' && (
                <>
                  <Loader2 className="mx-auto h-12 w-12 text-cyberblue-500 animate-spin mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">
                    Проверка подтверждения...
                  </h3>
                  <p className="text-gray-400">
                    Пожалуйста, подождите, мы проверяем ваше подтверждение email.
                  </p>
                </>
              )}
              
              {status === 'success' && (
                <>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">
                    Email успешно подтвержден
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Ваш email был успешно подтвержден. Вы будете перенаправлены на главную страницу через несколько секунд.
                  </p>
                  <Link to="/">
                    <Button className="bg-cyberblue-500 hover:bg-cyberblue-600">
                      Перейти на главную страницу
                    </Button>
                  </Link>
                </>
              )}
              
              {status === 'error' && (
                <>
                  <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">
                    Ошибка подтверждения
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {errorMessage || 'Произошла ошибка при подтверждении вашего email.'}
                  </p>
                  <div className="flex flex-col space-y-3">
                    <Link to="/login">
                      <Button className="w-full bg-cyberblue-500 hover:bg-cyberblue-600">
                        Перейти на страницу входа
                      </Button>
                    </Link>
                    <Link to="/">
                      <Button variant="outline" className="w-full">
                        Вернуться на главную
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
