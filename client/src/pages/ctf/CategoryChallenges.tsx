import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Trophy, Users } from 'lucide-react';
import { Challenge } from '@/types';
import { mockChallenges } from '@/data/challenges';
import Navbar from '@/components/layout/Navbar';
import ChatAssistant from '@/components/layout/ChatAssistant';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

// Map difficulty to color classes
const difficultyColors: Record<Challenge['difficulty'], string> = {
  beginner: 'bg-green-500/20 text-green-500 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  advanced: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  expert: 'bg-red-500/20 text-red-500 border-red-500/30',
};

// Map difficulty to display names
const difficultyNames: Record<Challenge['difficulty'], string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
  expert: 'Эксперт',
};

// Map categories to display names
const categoryNames: Record<string, string> = {
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

export default function CategoryChallenges() {
  const { category } = useParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<Challenge['difficulty'] | 'all'>('all');
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Если пользователь не авторизован и загрузка завершена, перенаправляем на страницу входа
    if (!isLoading && !user) {
      toast({
        title: "Требуется авторизация",
        description: "Для доступа к заданиям необходимо войти в систему",
        variant: "destructive",
      });
      navigate('/login?returnUrl=/ctf/category/' + category);
    }
  }, [user, isLoading, navigate, category]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyberdark-900 flex flex-col">
        <Navbar />
        <div className="pt-20 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyberblue-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Не показываем содержимое до перенаправления
  }

  const handleChallengeComplete = () => {
    toast({
      title: "Задание выполнено!",
      description: "Вы успешно решили задание и получили очки.",
      variant: "default",
    });
  };

  // Фильтруем задания по выбранной категории
  const categoryChallenges = mockChallenges.filter(challenge => 
    challenge.category === category &&
    (filterDifficulty === 'all' || challenge.difficulty === filterDifficulty) &&
    (searchQuery === '' || 
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-cyberdark-900 flex flex-col">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link to="/ctf" className="text-cyberblue-400 hover:text-cyberblue-300">
              ← Назад к CTF платформе
            </Link>
            <h1 className="text-3xl font-bold text-white mt-4">
              Кейсы: {categoryNames[category || 'web']}
            </h1>
            <p className="mt-2 text-gray-400">
              Решайте практические задания по {categoryNames[category || 'web'].toLowerCase()} и улучшайте свои навыки кибербезопасности
            </p>
          </div>

          {/* Search and filter */}
          <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
            <div className="flex-1 relative sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Поиск по кейсам..."
                className="pl-10 w-full bg-cyberdark-800 border-cyberdark-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                className="appearance-none bg-cyberdark-800 border border-cyberdark-700 text-white py-2 px-4 pr-8 rounded focus:outline-none focus:ring-1 focus:ring-cyberblue-500"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value as Challenge['difficulty'] | 'all')}
              >
                <option value="all">Все уровни</option>
                <option value="beginner">Начальный</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
                <option value="expert">Эксперт</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Challenges list */}
          {categoryChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-cyberdark-800 rounded-lg overflow-hidden border border-cyberdark-700 hover:border-cyberblue-500/50 transition-all duration-300 hover:shadow-glow-sm"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-cyberblue-400">
                        Кейс #{challenge.id}
                      </span>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full border ${difficultyColors[challenge.difficulty]}`}>
                        {difficultyNames[challenge.difficulty]}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                    
                    <p className="text-gray-300 mb-6 line-clamp-3">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-400">
                          <Trophy className="w-4 h-4 mr-1" />
                          <span className="text-sm">{challenge.points} очков</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm">{challenge.solvedBy} решили</span>
                        </div>
                      </div>
                      
                      <Link to={`/ctf/challenge/${challenge.id}`}>
                        <Button size="sm">
                          Решить
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-cyberdark-800 rounded-lg p-8 text-center border border-cyberdark-700">
              <h3 className="text-xl font-semibold text-white mb-2">Кейсы не найдены</h3>
              <p className="text-gray-400 mb-4">По вашему запросу не найдено ни одного кейса</p>
              <Button onClick={() => {
                setSearchQuery('');
                setFilterDifficulty('all');
              }}>
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </div>

      <ChatAssistant />
    </div>
  );
}
