import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SocialLogin } from '@/components/auth/SocialLogin';
import { LoginForm } from '@/components/auth/LoginForm';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();

  return (
    <AuthLayout 
      title={t('login.title')}
      subtitle={
        <span dangerouslySetInnerHTML={{ __html: t('login.subtitle') }} />
      }
    >
      <LoginForm />
      <SocialLogin type="login" />
    </AuthLayout>
  );
}