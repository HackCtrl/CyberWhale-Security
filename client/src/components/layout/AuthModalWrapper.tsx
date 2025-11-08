import React, { useState } from 'react';
import { AuthModal } from '@/components/auth/NewAuthModal';

export function AuthModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<'login' | 'register'>('login');

  // Expose functions globally for easy access
  React.useEffect(() => {
    (window as any).openAuthModal = (tab: 'login' | 'register' = 'login') => {
      setInitialTab(tab);
      setIsOpen(true);
    };

    return () => {
      delete (window as any).openAuthModal;
    };
  }, []);

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      initialTab={initialTab}
    />
  );
}