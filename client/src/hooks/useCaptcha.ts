import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (element: string | HTMLElement, options: any) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
  }
}

interface UseCaptchaProps {
  siteKey: string;
}

export const useCaptcha = ({ siteKey }: UseCaptchaProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [widgetId, setWidgetId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.grecaptcha?.ready(() => {
        setIsLoaded(true);
      });
    }
  }, []);

  const renderCaptcha = useCallback((container: string | HTMLElement) => {
    if (!isLoaded) return;

    const id = window.grecaptcha.render(container, {
      sitekey: siteKey,
      size: 'normal',
      theme: 'dark',
    });
    setWidgetId(id);
  }, [isLoaded, siteKey]);

  const resetCaptcha = useCallback(() => {
    if (widgetId !== null) {
      window.grecaptcha.reset(widgetId);
    }
  }, [widgetId]);

  const getCaptchaResponse = useCallback(() => {
    if (widgetId !== null) {
      return window.grecaptcha.getResponse(widgetId);
    }
    return '';
  }, [widgetId]);

  return {
    isLoaded,
    renderCaptcha,
    resetCaptcha,
    getCaptchaResponse,
  };
};