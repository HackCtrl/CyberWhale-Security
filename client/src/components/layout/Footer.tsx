
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Bot, BookOpen, ExternalLink, Mail, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-cyberdark-950 pt-16 border-t border-cyberdark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">CyberWhale</h3>
            <p className="text-gray-400 text-sm mb-4">
              Ваш путь в мир кибербезопасности начинается здесь. Учитесь, практикуйтесь и становитесь экспертом вместе с нами.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:cyberehaleoffical@gmail.com" className="text-gray-400 hover:text-white transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Платформа</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ctf" className="text-gray-400 hover:text-white transition flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>CTF Платформа</span>
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="text-gray-400 hover:text-white transition flex items-center">
                  <Bot className="w-4 h-4 mr-2" />
                  <span>ИИ Ассистент</span>
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-white transition flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Сообщество</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-400 hover:text-red-400 transition flex items-center text-xs">
                  <Shield className="w-3 h-3 mr-2" />
                  <span>Панель управления</span>
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="text-gray-400 hover:text-white transition flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>База знаний</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Ресурсы</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition">
                  Блог
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition">
                  Часто задаваемые вопросы
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition">
                  Поддержка
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Связаться с нами</h3>
            <p className="text-gray-400 text-sm mb-4">
              Есть вопросы или предложения? Напишите нам.
            </p>
            <a 
              href="https://t.me/Valerri_09" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center px-4 py-2 rounded bg-cyberblue-500 hover:bg-cyberblue-600 text-white transition"
            >
              Связаться
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-cyberdark-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} CyberWhale. Все права защищены.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
