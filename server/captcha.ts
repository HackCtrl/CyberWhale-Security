import axios from 'axios';

const VERIFICATION_URL = 'https://www.google.com/recaptcha/api/siteverify';

// Используем секрет из переменных окружения. `server/index.ts` уже загружает `dotenv/config`.
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '';

export async function verifyCaptcha(token: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY is not set in environment. reCAPTCHA verification will fail.');
    return false;
  }

  try {
    const params = new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: token
    });

    const response = await axios.post(VERIFICATION_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Логируем ответ в режиме разработки
    console.debug('reCAPTCHA verification response:', response.data);

    if (response.data && response.data.success) {
      return true;
    } else {
      console.error('reCAPTCHA verification failed:', response.data?.['error-codes']);
      return false;
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}