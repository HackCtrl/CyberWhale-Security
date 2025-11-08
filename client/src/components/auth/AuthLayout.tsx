
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cyberdark-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-cyberblue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {subtitle}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-cyberdark-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-cyberdark-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
