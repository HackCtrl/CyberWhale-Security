import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

export const Captcha: React.FC<CaptchaProps> = ({ siteKey, onVerify }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = async (token: string | null) => {
    setError(null);
    if (!token) {
      setError('Ошибка проверки reCAPTCHA');
      return;
    }

    setIsLoading(true);
    try {
      onVerify(token);
    } catch (err) {
      setError('Ошибка проверки reCAPTCHA');
      console.error('reCAPTCHA error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={handleChange}
  theme="dark"
      />
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};