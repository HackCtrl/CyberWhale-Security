import axios from 'axios';

const RECAPTCHA_SECRET_KEY = '6Lf2QwcsAAAAAGHinUQwz8moppW45CNRnfh2i9zW';
const VERIFICATION_URL = 'https://www.google.com/recaptcha/api/siteverify';

export async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    // Правильный способ отправки данных для reCAPTCHA
    const params = new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: token
    });

    const response = await axios.post(VERIFICATION_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('reCAPTCHA verification response:', response.data);

    if (response.data.success) {
      return true;
    } else {
      console.error('reCAPTCHA verification failed:', response.data['error-codes']);
      return false;
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}