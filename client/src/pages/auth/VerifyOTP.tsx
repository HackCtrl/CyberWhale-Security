
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const { verifyOtp, isLoading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  
  if (!email) {
    navigate('/register');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await verifyOtp(email, otp);
      navigate('/');
    } catch (err) {
      console.error('Verification error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cyberdark-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Подтверждение аккаунта
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Введите код, отправленный на {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-cyberdark-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-cyberdark-700">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="otp" className="block text-sm font-medium text-gray-200">
                Код подтверждения
              </Label>
              <div className="mt-1">
                <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="bg-cyberdark-700 border-cyberdark-600" />
                    <InputOTPSlot index={1} className="bg-cyberdark-700 border-cyberdark-600" />
                    <InputOTPSlot index={2} className="bg-cyberdark-700 border-cyberdark-600" />
                    <InputOTPSlot index={3} className="bg-cyberdark-700 border-cyberdark-600" />
                    <InputOTPSlot index={4} className="bg-cyberdark-700 border-cyberdark-600" />
                    <InputOTPSlot index={5} className="bg-cyberdark-700 border-cyberdark-600" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full bg-cyberblue-500 hover:bg-cyberblue-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Проверка...
                </>
              ) : (
                'Подтвердить'
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Не получили код?{' '}
                <Button 
                  variant="link" 
                  className="p-0 text-cyberblue-500 hover:text-cyberblue-400"
                  onClick={() => navigate('/register')}
                >
                  Запросить снова
                </Button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
