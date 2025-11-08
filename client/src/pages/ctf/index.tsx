
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Filter, 
  Search, 
  ArrowRight, 
  Trophy, 
  Code, 
  Cpu, 
  BookOpen, 
  Shield, 
  Clock, 
  Users,
  Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ChallengeCategory } from '@/types';
import Navbar from '@/components/layout/Navbar';
import ChatAssistant from '@/components/layout/ChatAssistant';
import { toast } from '@/hooks/use-toast';
import { mockChallenges } from '@/data/challenges';

const categoryIcons: Record<ChallengeCategory, React.ReactNode> = {
  web: <Code className="w-5 h-5" />,
  crypto: <Shield className="w-5 h-5" />,
  osint: <Search className="w-5 h-5" />,
  steganography: <Search className="w-5 h-5" />,
  'reverse-engineering': <Cpu className="w-5 h-5" />,
  forensics: <Search className="w-5 h-5" />,
  pwn: <Shield className="w-5 h-5" />,
  programming: <Code className="w-5 h-5" />,
  network: <Shield className="w-5 h-5" />,
};

const categoryNames: Record<ChallengeCategory, string> = {
  web: 'Веб-безопасность',
  crypto: 'Криптография',
  osint: 'OSINT',
  steganography: 'Стеганография',
  'reverse-engineering': 'Реверс-инжиниринг',
  forensics: 'Форензика',
  pwn: 'PWN',
  programming: 'Программирование',
  network: 'Сетевая безопасность',
};

const categoryDescriptions: Record<ChallengeCategory, string> = {
  web: 'Исследуйте уязвимости веб-приложений, включая SQL-инъекции, XSS и CSRF атаки, недостатки аутентификации и авторизации.',
  crypto: 'Решайте задачи на расшифровку сообщений, анализ криптографических алгоритмов и поиск уязвимостей в их реализации.',
  osint: 'Находите информацию из открытых источников для решения заданий, используя методы поиска и анализа данных.',
  steganography: 'Извлекайте скрытую информацию из различных файлов, включая изображения, аудио и видео.',
  'reverse-engineering': 'Анализируйте бинарные файлы и исходный код для понимания их функциональности и поиска уязвимостей.',
  forensics: 'Проводите цифровую криминалистику, анализируя образы дисков, сетевой трафик и другие артефакты.',
  pwn: 'Используйте уязвимости в исполняемых файлах для получения контроля над системой.',
  programming: 'Создавайте скрипты и программы для автоматизации решения заданий и анализа данных.',
  network: 'Анализируйте сетевой трафик, протоколы и настройки для обнаружения и эксплуатации уязвимостей.',
};

const getCategoryChallengesCount = (category: ChallengeCategory) => {
  return mockChallenges.filter(challenge => challenge.category === category).length;
};

export default function CTFPlatform() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<ChallengeCategory | 'all'>('all');
  
  const categoriesToShow = Object.keys(categoryNames).filter(category => {
    const count = getCategoryChallengesCount(category as ChallengeCategory);
    return count > 0;
  }) as ChallengeCategory[];

  const handleStartChallenge = () => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Для начала выполнения заданий необходимо войти в систему",
        variant: "destructive",
      });
      navigate('/login?returnUrl=/ctf');
      return;
    }
    
    toast({
      title: "Начато новое задание",
      description: "Удачи в решении!",
      variant: "default",
    });
    
    navigate(`/ctf/challenge/1`);
  };

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Гостевой режим",
        description: "Для решения заданий необходимо войти в систему",
        variant: "default",
      });
    }
  }, [user, isLoading]);

  const handleCategoryClick = (category: ChallengeCategory) => {
    if (!user && !isLoading) {
      toast({
        title: "Требуется авторизация",
        description: "Для доступа к заданиям необходимо войти в систему",
        variant: "destructive",
      });
      navigate('/login?returnUrl=/ctf/category/' + category);
      return;
    }
    
    navigate(`/ctf/category/${category}`);
  };

  return (
    <div className="min-h-screen bg-cyberdark-900 flex flex-col">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        <div className="bg-cyberdark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  <span className="block text-cyberblue-400">CTF ПЛАТФОРМА</span>
                  <span className="block mt-1">Проверьте свои навыки в реальных сценариях</span>
                </h1>
                <p className="mt-3 text-lg text-gray-300">
                  Наша CTF платформа предлагает разнообразные задания по кибербезопасности, от начального до продвинутого уровня. 
                  Решайте задачи, зарабатывайте очки и соревнуйтесь с другими участниками.
                </p>
                <div className="mt-6 flex">
                  <Button 
                    className="bg-cyberblue-500 hover:bg-cyberblue-600"
                    onClick={() => {
                      if (!user && !isLoading) {
                        toast({
                          title: "Требуется авторизация",
                          description: "Для доступа к заданиям необходимо войти в систему",
                          variant: "destructive",
                        });
                        navigate('/login?returnUrl=/ctf');
                        return;
                      }
                      const firstCategory = categoriesToShow[0];
                      navigate(`/ctf/category/${firstCategory}`);
                    }}
                  >
                    Начать решать задания
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="hidden md:block md:w-1/3 mt-8 md:mt-0">
                <div className="bg-cyberdark-700 rounded-lg p-6 text-center border border-cyberdark-600">
                  <h3 className="text-xl font-semibold text-white mb-4">Статистика платформы</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-cyberdark-800 p-4 rounded-md">
                      <div className="text-2xl font-bold text-white">{mockChallenges.length}+</div>
                      <div className="text-sm text-gray-400">Активных заданий</div>
                    </div>
                    <div className="bg-cyberdark-800 p-4 rounded-md">
                      <div className="text-2xl font-bold text-white">500+</div>
                      <div className="text-sm text-gray-400">Участников</div>
                    </div>
                    <div className="bg-cyberdark-800 p-4 rounded-md">
                      <div className="text-2xl font-bold text-white">{categoriesToShow.length}</div>
                      <div className="text-sm text-gray-400">Категорий</div>
                    </div>
                    <div className="bg-cyberdark-800 p-4 rounded-md">
                      <div className="text-2xl font-bold text-white">4</div>
                      <div className="text-sm text-gray-400">Уровня сложности</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Категории заданий</h2>
            <p className="mt-2 md:mt-0 text-gray-400">
              Выберите категорию, чтобы перейти к соответствующим заданиям
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {categoriesToShow.map((category) => (
              <div 
                key={category}
                className="bg-cyberdark-800 rounded-lg overflow-hidden border border-cyberdark-700 hover:border-cyberblue-500/50 transition-all duration-300 hover:shadow-glow-sm"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-cyberdark-700 rounded-full p-2">
                      {categoryIcons[category]}
                    </div>
                    <h3 className="text-xl font-bold text-white">{categoryNames[category]}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6 min-h-[4rem]">
                    {categoryDescriptions[category]}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-cyberdark-700 px-2 py-1 rounded text-sm text-gray-300">
                        {getCategoryChallengesCount(category)} заданий
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleCategoryClick(category)}
                      variant="outline"
                    >
                      Перейти к кейсам
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
              <div className="bg-cyberdark-700 inline-flex items-center justify-center p-3 rounded-lg mb-4">
                <Code className="h-6 w-6 text-cyberblue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Практические навыки</h3>
              <p className="text-gray-300">
                Развивайте практические навыки кибербезопасности в безопасной среде с реалистичными сценариями.
              </p>
            </div>
            
            <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
              <div className="bg-cyberdark-700 inline-flex items-center justify-center p-3 rounded-lg mb-4">
                <Trophy className="h-6 w-6 text-cyberblue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Соревнования</h3>
              <p className="text-gray-300">
                Участвуйте в регулярных соревнованиях, сравнивайте свои результаты с другими и выигрывайте призы.
              </p>
            </div>
            
            <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
              <div className="bg-cyberdark-700 inline-flex items-center justify-center p-3 rounded-lg mb-4">
                <BookOpen className="h-6 w-6 text-cyberblue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Обучение</h3>
              <p className="text-gray-300">
                Изучайте новые концепции и техники кибербезопасности через практические задания и подробные разборы.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-r from-cyberdark-800 to-cyberdark-900 rounded-lg overflow-hidden border border-cyberdark-700">
            <div className="md:flex">
              <div className="p-8 md:w-2/3">
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 text-cyberblue-400 mr-2" />
                  <span className="text-sm font-medium text-cyberblue-400">Следующая неделя, 18:00 МСК</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">CTF Соревнование</h3>
                <p className="text-gray-300 mb-6">
                  Примите участие в нашем ежемесячном CTF соревновании. Решайте уникальные задачи, соревнуйтесь с другими участниками и выигрывайте ценные призы. Подходит для всех уровней подготовки.
                </p>
                <Button 
                  className="bg-cyberblue-500 hover:bg-cyberblue-600" 
                  onClick={() => {
                    if (!user && !isLoading) {
                      toast({
                        title: "Требуется авторизация",
                        description: "Для регистрации необходимо войти в систему",
                        variant: "destructive",
                      });
                      navigate('/login?returnUrl=/ctf');
                      return;
                    }
                    toast({
                      title: "Регистрация открыта",
                      description: "Вы успешно зарегистрированы на соревнование!",
                      variant: "default",
                    });
                  }}
                >
                  Зарегистрироваться
                </Button>
              </div>
              <div className="md:w-1/3 bg-cyberdark-700 flex items-center justify-center p-8">
                <div className="text-center">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">1-е место</h4>
                  <p className="text-gray-300">5000 очков + VIP доступ на 1 месяц</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatAssistant />
    </div>
  );
}
