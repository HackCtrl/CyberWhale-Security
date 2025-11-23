
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Captcha } from '@/components/ui/captcha';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return; // Password mismatch is handled by form validation
    }
    
    if (!captchaToken) {
      setError('Пожалуйста, подтвердите, что вы не робот');
      return;
    }

    try {
      const response = await register(username, email, password, captchaToken);
      if (response.suggestedUsernames) {
        setSuggestedUsernames(response.suggestedUsernames);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при регистрации');
      console.error('Registration error:', err);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="username" className="block text-sm font-medium text-gray-200">
            Имя пользователя
          </Label>
          <div className="mt-1">
            <Input
              id="username"
              name="username"
              type="text"
              required
              className="bg-cyberdark-700 border-cyberdark-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              minLength={3}
              maxLength={30}
            />
          </div>
          {suggestedUsernames.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-amber-500">Это имя уже занято. Попробуйте одно из предложенных:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {suggestedUsernames.map((suggestedName) => (
                  <Button
                    key={suggestedName}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-cyberblue-500 border-cyberblue-500 hover:bg-cyberblue-500/10"
                    onClick={() => setUsername(suggestedName)}
                  >
                    {suggestedName}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

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
        </div>

        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-gray-200">
            Пароль
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
              minLength={6}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">Минимум 6 символов</p>
        </div>

        <div>
          <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-200">
            Подтвердите пароль
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

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-cyberdark-600 bg-cyberdark-700 text-cyberblue-500 focus:ring-cyberblue-500"
          />
          <Label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
            Я согласен с{' '}
            <Link to="/terms" className="font-medium text-cyberblue-500 hover:text-cyberblue-400">
              условиями использования
            </Link>{' '}
            и{' '}
            <Link to="/privacy" className="font-medium text-cyberblue-500 hover:text-cyberblue-400">
              политикой конфиденциальности
            </Link>
          </Label>
        </div>

        <div className="space-y-4">
            <Captcha
              siteKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Lf2QwcsAAAAAHoTaNJZhsAXCnqP-hokgbAocrJx'}
              onVerify={handleCaptchaVerify}
            />
          
          <Button
            type="submit"
            disabled={isLoading || (!!confirmPassword && password !== confirmPassword) || !captchaToken}
            className="w-full bg-cyberblue-500 hover:bg-cyberblue-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Регистрация...
              </>
            ) : (
              'Зарегистрироваться'
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
