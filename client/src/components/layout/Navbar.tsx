 import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import cyberWhaleLogo from '@assets/ChatGPT Image 10 авг. 2025 г., 11_21_16_1755449890714.png';
import { 
  ChevronDown, 
  Menu, 
  Shield, 
  Database, 
  Bot, 
  Users,
  X,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';
import SearchBox from '@/components/search/SearchBox';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useTranslation } from 'react-i18next';

type NavLink = {
  name: string;
  to: string;
  icon?: React.ReactNode;
  submenu?: NavLink[];
  current?: boolean;
  requiresAuth?: boolean;
};

const navLinks: NavLink[] = [
  {
    name: 'navbar.products',
    to: '/products',
    icon: <Shield className="w-4 h-4 mr-1" />,
    requiresAuth: false,
  },
  {
    name: 'navbar.ctf',
    to: '/ctf',
    icon: <Shield className="w-4 h-4 mr-1" />,
    requiresAuth: true,
  },
  {
    name: 'navbar.ai_assistant',
    to: '/ai-assistant',
    icon: <Bot className="w-4 h-4 mr-1" />,
    requiresAuth: true,
  },
  {
    name: 'navbar.community',
    to: '/community',
    icon: <Users className="w-4 h-4 mr-1" />,
    requiresAuth: true,
  },
  {
    name: 'navbar.knowledge',
    to: '/knowledge',
    icon: <Database className="w-4 h-4 mr-1" />,
    requiresAuth: false,
  },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const updatedNavLinks = navLinks.map(link => ({
    ...link,
    current: location.pathname === link.to || location.pathname.startsWith(`${link.to}/`),
    submenu: link.submenu
      ? link.submenu.map(sublink => ({
          ...sublink,
          current: location.pathname === sublink.to,
        }))
      : undefined,
  }));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (link: NavLink) => {
    if (link.requiresAuth && !user) {
      navigate('/login?returnUrl=' + encodeURIComponent(link.to));
      setMobileMenuOpen(false);
      return;
    }
  };

  const isExternalLink = (url: string) => url.startsWith('http');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isScrolled || mobileMenuOpen
          ? "bg-cyberblue-900/95 backdrop-blur-md border-b border-cyberblue-800/50 shadow-md"
          : "bg-gradient-to-b from-cyberdark-900/95 to-cyberdark-900/75 border-b border-cyberdark-800/30"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
              <img 
                src={cyberWhaleLogo} 
                alt="CyberWhale" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-white">CyberWhale</span>
            </Link>
          </div>

          <div className="flex items-center flex-1 justify-end space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center space-x-1">
              {updatedNavLinks.map((link) => {
                const handleClick = () => handleNavLinkClick(link);
                
                const LinkComponent = isExternalLink(link.to) ? (
                  <a
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center px-2 py-2 text-sm font-medium transition-colors relative",
                      link.current
                        ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white"
                        : "text-gray-300 hover:text-white hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-white/50"
                    )}
                  >
                    {link.icon}
                    {t(link.name)}
                  </a>
                ) : (
                  <Link
                    to={!link.requiresAuth || user ? link.to : '/login?returnUrl=' + encodeURIComponent(link.to)}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm font-medium transition-colors relative",
                      link.current
                        ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white"
                        : "text-gray-300 hover:text-white hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-white/50"
                    )}
                    onClick={handleClick}
                  >
                    {link.icon}
                    {t(link.name)}
                    {link.submenu && (
                      <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                );

                return (
                  <div key={link.to} className="relative group">
                    {LinkComponent}
                    {link.submenu && (
                      <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-cyberblue-900 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform origin-top-right">
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.to}
                            to={sublink.to}
                            className={cn(
                              "block px-4 py-2 text-sm",
                              sublink.current
                                ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white"
                                : "text-gray-300 hover:text-white hover:after:content-[''] hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-white/50"
                            )}
                          >
                            {t(sublink.name)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Language Switcher for Desktop */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="text-gray-300 hover:text-white hover:bg-cyberblue-800/40"
                >
                  <Globe className="w-5 h-5" />
                </Button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-cyberblue-900 py-1 z-50">
                    <button
                      onClick={() => changeLanguage('en')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-cyberblue-700/50"
                    >
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage('ru')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-cyberblue-700/50"
                    >
                      Русский
                    </button>
                  </div>
                )}
              </div>
            </div>
            <SearchBox className="w-40 md:w-48 flex-shrink-0" />
            <UserMenu />
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-cyberblue-800/40"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cyberblue-900/95 backdrop-blur-md border-b border-cyberblue-800/50 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {updatedNavLinks.map((link) => {
              const handleClick = () => handleNavLinkClick(link);
              
              const MobileLinkComponent = isExternalLink(link.to) ? (
                <a
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium relative",
                    link.current
                      ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white"
                      : "text-gray-300 hover:text-white hover:after:content-[''] hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-white/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    {link.icon}
                    {t(link.name)}
                  </div>
                </a>
              ) : (
                <Link
                  to={!link.requiresAuth || user ? link.to : '/login?returnUrl=' + encodeURIComponent(link.to)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium relative",
                    link.current
                      ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white"
                      : "text-gray-300 hover:text-white hover:after:content-[''] hover:after:bottom-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-white/50"
                  )}
                  onClick={(e) => {
                    if (link.requiresAuth && !user) {
                      e.preventDefault();
                      handleClick();
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center">
                    {link.icon}
                    {t(link.name)}
                  </div>
                </Link>
              );

              return (
                <React.Fragment key={link.to}>
                  {MobileLinkComponent}
                  {link.submenu && (
                    <div className="pl-4 space-y-1">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.to}
                          to={sublink.to}
                          className={cn(
                            "block px-3 py-2 rounded-md text-sm font-medium relative",
                            sublink.current
                              ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white"
                              : "text-gray-300 hover:text-white hover:after:content-[''] hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-white/50"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t(sublink.name)}
                        </Link>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            {/* Language Switcher for Mobile */}
            <div className="px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-cyberblue-800/40"
              >
                <Globe className="w-5 h-5 mr-2" />
                {i18n.language === 'en' ? 'English' : 'Русский'}
              </Button>
              {isLanguageMenuOpen && (
                <div className="mt-2 w-full rounded-md shadow-lg bg-cyberblue-900 py-1">
                  <button
                    onClick={() => changeLanguage('en')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-cyberblue-700/50"
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('ru')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-cyberblue-700/50"
                  >
                    Русский
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="pt-4 pb-3 border-t border-cyberblue-800/50">
            <div className="px-4 py-2">
              <SearchBox className="w-full mb-3" />
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}