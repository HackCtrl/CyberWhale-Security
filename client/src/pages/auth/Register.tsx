
import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { SocialLogin } from '@/components/auth/SocialLogin';

export default function Register() {
  return (
    <AuthLayout 
      title="Создать аккаунт"
      subtitle={
        <>
          Или{' '}
          <Link to="/login" className="font-medium text-cyberblue-500 hover:text-cyberblue-400">
            войти, если у вас уже есть аккаунт
          </Link>
        </>
      }
    >
      <RegisterForm />
      <SocialLogin type="register" />
    </AuthLayout>
  );
}
