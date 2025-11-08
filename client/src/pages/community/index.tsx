
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import ChatAssistant from '@/components/layout/ChatAssistant';

import { 
  Users, 
  Globe, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  ChevronRight, 
  Bell, 
  User,
  Zap,
  ShieldCheck as Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { Event } from '@/types';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Воркшоп по веб-безопасности',
    description: 'Изучите распространенные веб-уязвимости и методы их предотвращения.',
    date: new Date(Date.now() + 86400000), // Tomorrow
    timeZone: 'МСК',
    type: 'workshop',
    registeredUsers: 45,
  },
  {
    id: '2',
    title: 'CTF Соревнование',
    description: 'Проверьте свои навыки в нашем ежемесячном соревновании.',
    date: new Date(Date.now() + 604800000), // Next week
    timeZone: 'МСК',
    type: 'competition',
    registeredUsers: 128,
  },
  {
    id: '3',
    title: 'Вебинар по криптографии',
    description: 'Основы криптографии и её применение в современной кибербезопасности.',
    date: new Date(Date.now() + 1209600000), // Two weeks from now
    timeZone: 'МСК',
    type: 'webinar',
    registeredUsers: 67,
  },
  {
    id: '4',
    title: 'Мастер-класс по реверс-инжинирингу',
    description: 'Практический мастер-класс по анализу бинарных файлов и декомпиляции программ.',
    date: new Date(Date.now() + 1814400000), // Three weeks from now
    timeZone: 'МСК',
    type: 'workshop',
    registeredUsers: 34,
  },
];

const mockTopics = [
  {
    id: '1',
    title: 'Обнаружена новая уязвимость в Apache Log4j',
    category: 'Новости',
    author: 'admin',
    replies: 24,
    views: 342,
    lastUpdate: new Date(Date.now() - 86400000), // Yesterday
  },
  {
    id: '2',
    title: 'Как начать карьеру в сфере кибербезопасности?',
    category: 'Карьера',
    author: 'newbie123',
    replies: 18,
    views: 203,
    lastUpdate: new Date(Date.now() - 172800000), // 2 days ago
  },
  {
    id: '3',
    title: 'Советы по решению CTF заданий для начинающих',
    category: 'CTF',
    author: 'ctfmaster',
    replies: 31,
    views: 289,
    lastUpdate: new Date(Date.now() - 259200000), // 3 days ago
  },
  {
    id: '4',
    title: 'Обзор инструментов для тестирования на проникновение',
    category: 'Инструменты',
    author: 'pentester',
    replies: 15,
    views: 178,
    lastUpdate: new Date(Date.now() - 345600000), // 4 days ago
  },
  {
    id: '5',
    title: 'Вышло обновление Kali Linux 2023.3',
    category: 'Новости',
    author: 'securityguy',
    replies: 7,
    views: 145,
    lastUpdate: new Date(Date.now() - 432000000), // 5 days ago
  },
];

const EventCard = ({ event }: { event: Event }) => {
  const [registered, setRegistered] = useState(false);
  
  const handleRegister = () => {
    setRegistered(!registered);
    toast({
      title: registered ? "Регистрация отменена" : "Вы зарегистрированы!",
      description: registered 
        ? `Вы отменили регистрацию на событие "${event.title}"` 
        : `Вы успешно зарегистрировались на событие "${event.title}"`,
    });
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  const getEventBadgeColor = (type: Event['type']) => {
    switch (type) {
      case 'workshop':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'competition':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'webinar':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'meetup':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'workshop':
        return <Users className="w-4 h-4" />;
      case 'competition':
        return <Zap className="w-4 h-4" />;
      case 'webinar':
        return <Globe className="w-4 h-4" />;
      case 'meetup':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-cyberdark-800 rounded-lg overflow-hidden border border-cyberdark-700 hover:border-cyberblue-500/30 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={getEventBadgeColor(event.type)}>
            <div className="flex items-center">
              {getEventIcon(event.type)}
              <span className="ml-1">
                {event.type === 'workshop' && 'Воркшоп'}
                {event.type === 'competition' && 'Соревнование'}
                {event.type === 'webinar' && 'Вебинар'}
                {event.type === 'meetup' && 'Встреча'}
              </span>
            </div>
          </Badge>
          <div className="flex items-center text-gray-400 text-sm">
            <Users className="w-4 h-4 mr-1" />
            <span>{event.registeredUsers} участников</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
        
        <p className="text-gray-300 mb-4">
          {event.description}
        </p>
        
        <div className="flex items-center text-gray-400 text-sm mb-6">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(event.date)} {event.timeZone}</span>
        </div>
        
        <Button
          onClick={handleRegister}
          className={registered ? "bg-red-500 hover:bg-red-600" : "bg-cyberblue-500 hover:bg-cyberblue-600"}
          variant={registered ? "destructive" : "default"}
        >
          {registered ? 'Отменить регистрацию' : 'Зарегистрироваться'}
        </Button>
      </div>
    </div>
  );
};

export default function Community() {
  return (
    <div className="min-h-screen bg-cyberdark-900 flex flex-col">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        <div className="bg-gradient-to-b from-cyberdark-800 to-cyberdark-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                СООБЩЕСТВО
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                <span className="text-gradient">Присоединяйтесь к нашей сети безопасности</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Станьте частью активного сообщества профессионалов и энтузиастов кибербезопасности.
                Обменивайтесь опытом, участвуйте в дискуссиях и расширяйте свои знания вместе с нами.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                  <div className="text-2xl font-bold text-white">5,000+</div>
                  <div className="text-gray-400">Активных участников</div>
                </div>
                <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-gray-400">Каналы для обсуждений</div>
                </div>
                <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                  <div className="text-2xl font-bold text-white">Еженедельно</div>
                  <div className="text-gray-400">События и воркшопы</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="https://t.me/HackCtrl_Official" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center"
                >
                  <Button className="bg-cyberblue-500 hover:bg-cyberblue-600 btn-glow">
                    Присоединиться к сообществу
                    <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M22.05 2.25c.566 0 1.029.463 1.029 1.03v17.445c0 .566-.463 1.029-1.03 1.029H4.604a1.029 1.029 0 01-1.03-1.03V3.28c0-.567.464-1.03 1.03-1.03h17.446zM4.604 1A2.28 2.28 0 002.325 3.28v17.445A2.28 2.28 0 004.604 23H22.05a2.28 2.28 0 002.28-2.28V3.28A2.28 2.28 0 0022.05 1H4.604z" fill="currentColor"/>
                      <path d="M10.75 8.848c2.798-1.21 4.355-1.887 4.67-2.03.95-.432 2.058-.147 2.347.917.117.432.216 1.328.294 2.687.117 2.079.311 5.586-.117 7.32-.216.874-.639 1.167-1.056 1.198-.899.061-1.581-.54-2.452-1.062-.49-.295-2.179-1.4-2.935-1.771-.432-.216-.961-.433-1.58.147-.372.355-1.257 1.225-1.803 1.756-.249.246-.558.338-.838.329a.66.66 0 01-.34-.075c-.413-.153-.911-.352-1.209-.468-.932-.36-1.674-.726-1.602-1.529.037-.4.269-.803.9-1.323 1.684-1.384 3.175-2.56 4.104-3.405 1.184-1.077 2.576-2.712 1.617-3.69z" fill="currentColor"/>
                    </svg>
                  </Button>
                </a>
                <a 
                  href="#events" 
                  className="inline-flex items-center justify-center"
                >
                  <Button variant="outline">
                    Предстоящие события
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div id="events" className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Предстоящие события</h2>
              <Link to="/community/events" className="text-cyberblue-500 hover:text-cyberblue-400 flex items-center">
                Все события
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
          
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Обсуждения на форуме</h2>
              <Link to="/community/forum" className="text-cyberblue-500 hover:text-cyberblue-400 flex items-center">
                Перейти на форум
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-cyberdark-800 rounded-lg overflow-hidden border border-cyberdark-700">
              <table className="w-full">
                <thead className="bg-cyberdark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Тема</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Категория</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Автор</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Ответы</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Просмотры</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Последнее</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyberdark-700">
                  {mockTopics.map((topic) => (
                    <tr key={topic.id} className="hover:bg-cyberdark-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/community/forum/topic/${topic.id}`} className="font-medium text-white hover:text-cyberblue-400 transition-colors">
                          {topic.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <Badge variant="outline" className="bg-cyberdark-700/50 text-gray-300">
                          {topic.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-cyberdark-600 mr-2"></div>
                          <span className="text-gray-300">{topic.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 hidden sm:table-cell">{topic.replies}</td>
                      <td className="px-6 py-4 text-gray-300 hidden lg:table-cell">{topic.views}</td>
                      <td className="px-6 py-4 text-gray-300 hidden sm:table-cell">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{topic.lastUpdate.toLocaleDateString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Активные участники</h2>
              <Link to="/community/members" className="text-cyberblue-500 hover:text-cyberblue-400 flex items-center">
                Все участники
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700 hover:border-cyberblue-500/30 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="Avatar" />
                      <AvatarFallback>ПИ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">Пользователь{i}</div>
                      <div className="text-gray-400 text-sm">@user{i}</div>
                    </div>
                  </div>
                  <div className="text-gray-300 mb-4">
                    Специалист по кибербезопасности с опытом работы в области {['веб-безопасности', 'сетевой безопасности', 'криптографии', 'анализа вредоносного ПО'][i-1]}.
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-400 text-sm">
                      <Badge className="bg-cyberdark-700 text-gray-300">
                        Ранг: {['Эксперт', 'Продвинутый', 'Средний', 'Начинающий'][i-1]}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      Профиль
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Каналы коммуникации</h2>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-4 w-full bg-cyberdark-800 rounded-t-lg">
                <TabsTrigger value="all">Все каналы</TabsTrigger>
                <TabsTrigger value="telegram">Telegram</TabsTrigger>
                <TabsTrigger value="discord">Discord</TabsTrigger>
                <TabsTrigger value="forum">Форум</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="bg-cyberdark-800 rounded-b-lg p-6 border border-t-0 border-cyberdark-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a 
                    href="https://t.me/cyberwhale" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-cyberdark-700 rounded-lg p-6 hover:bg-cyberdark-600 transition-colors"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                        <svg width="20" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                          <path d="M22.05 2.25c.566 0 1.029.463 1.029 1.03v17.445c0 .566-.463 1.029-1.03 1.029H4.604a1.029 1.029 0 01-1.03-1.03V3.28c0-.567.464-1.03 1.03-1.03h17.446zM4.604 1A2.28 2.28 0 002.325 3.28v17.445A2.28 2.28 0 004.604 23H22.05a2.28 2.28 0 002.28-2.28V3.28A2.28 2.28 0 0022.05 1H4.604z" fill="currentColor"/>
                          <path d="M10.75 8.848c2.798-1.21 4.355-1.887 4.67-2.03.95-.432 2.058-.147 2.347.917.117.432.216 1.328.294 2.687.117 2.079.311 5.586-.117 7.32-.216.874-.639 1.167-1.056 1.198-.899.061-1.581-.54-2.452-1.062-.49-.295-2.179-1.4-2.935-1.771-.432-.216-.961-.433-1.58.147-.372.355-1.257 1.225-1.803 1.756-.249.246-.558.338-.838.329a.66.66 0 01-.34-.075c-.413-.153-.911-.352-1.209-.468-.932-.36-1.674-.726-1.602-1.529.037-.4.269-.803.9-1.323 1.684-1.384 3.175-2.56 4.104-3.405 1.184-1.077 2.576-2.712 1.617-3.69z" fill="currentColor"/>
                        </svg>
                      </div>
                      <h3 className="text-white font-medium">Telegram</h3>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Присоединяйтесь к нашему Telegram-каналу для новостей, обсуждений и помощи по кибербезопасности.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">3,200+ участников</span>
                      <span className="text-blue-400">@cyberwhale</span>
                    </div>
                  </a>
                  
                  <a 
                    href="https://discord.gg/cyberwhale" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-cyberdark-700 rounded-lg p-6 hover:bg-cyberdark-600 transition-colors"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                        <svg width="20" height="15" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                          <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <h3 className="text-white font-medium">Discord</h3>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Общайтесь в реальном времени с другими специалистами и энтузиастами в нашем Discord-сервере.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">1,800+ участников</span>
                      <span className="text-indigo-400">discord.gg/cyberwhale</span>
                    </div>
                  </a>
                  
                  <Link 
                    to="/community/forum"
                    className="bg-cyberdark-700 rounded-lg p-6 hover:bg-cyberdark-600 transition-colors"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-cyberblue-500 flex items-center justify-center mr-3">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-white font-medium">Форум</h3>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Наш форум предлагает структурированные дискуссии и базу знаний по различным темам кибербезопасности.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">500+ тем</span>
                      <span className="text-cyberblue-400">forum.cyberwhale.com</span>
                    </div>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="telegram" className="bg-cyberdark-800 rounded-b-lg p-6 border border-t-0 border-cyberdark-700">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                      <svg width="32" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                        <path d="M22.05 2.25c.566 0 1.029.463 1.029 1.03v17.445c0 .566-.463 1.029-1.03 1.029H4.604a1.029 1.029 0 01-1.03-1.03V3.28c0-.567.464-1.03 1.03-1.03h17.446zM4.604 1A2.28 2.28 0 002.325 3.28v17.445A2.28 2.28 0 004.604 23H22.05a2.28 2.28 0 002.28-2.28V3.28A2.28 2.28 0 0022.05 1H4.604z" fill="currentColor"/>
                        <path d="M10.75 8.848c2.798-1.21 4.355-1.887 4.67-2.03.95-.432 2.058-.147 2.347.917.117.432.216 1.328.294 2.687.117 2.079.311 5.586-.117 7.32-.216.874-.639 1.167-1.056 1.198-.899.061-1.581-.54-2.452-1.062-.49-.295-2.179-1.4-2.935-1.771-.432-.216-.961-.433-1.58.147-.372.355-1.257 1.225-1.803 1.756-.249.246-.558.338-.838.329a.66.66 0 01-.34-.075c-.413-.153-.911-.352-1.209-.468-.932-.36-1.674-.726-1.602-1.529.037-.4.269-.803.9-1.323 1.684-1.384 3.175-2.56 4.104-3.405 1.184-1.077 2.576-2.712 1.617-3.69z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Telegram канал CyberWhale</h3>
                      <p className="text-gray-300">@cyberwhale • 3,200+ участников</p>
                    </div>
                  </div>
                  <div className="bg-cyberdark-700 rounded-lg p-6 mb-6">
                    <h4 className="font-medium text-white mb-4">О канале:</h4>
                    <p className="text-gray-300 mb-4">
                      Официальный Telegram-канал сообщества CyberWhale. Здесь вы найдете:
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-cyberblue-500 rounded-full mt-2 mr-2"></div>
                        <span className="text-gray-300">Новости из мира кибербезопасности</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-cyberblue-500 rounded-full mt-2 mr-2"></div>
                        <span className="text-gray-300">Анонсы событий и соревнований</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-cyberblue-500 rounded-full mt-2 mr-2"></div>
                        <span className="text-gray-300">Обсуждение актуальных тем и уязвимостей</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-cyberblue-500 rounded-full mt-2 mr-2"></div>
                        <span className="text-gray-300">Помощь от сообщества и экспертов</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex justify-center">
                    <a 
                      href="https://t.me/cyberwhale" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        Присоединиться к каналу
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="discord" className="bg-cyberdark-800 rounded-b-lg p-6 border border-t-0 border-cyberdark-700">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center mr-4">
                      <svg width="32" height="25" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                        <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Discord сервер CyberWhale</h3>
                      <p className="text-gray-300">discord.gg/cyberwhale • 1,800+ участников</p>
                    </div>
                  </div>
                  <div className="bg-cyberdark-700 rounded-lg p-6 mb-6">
                    <h4 className="font-medium text-white mb-4">Доступные каналы:</h4>
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center">
                        <span className="text-gray-400 w-32">#general</span>
                        <span className="text-gray-300">Общее обсуждение кибербезопасности</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 w-32">#ctf</span>
                        <span className="text-gray-300">Обсуждение CTF задач и соревнований</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 w-32">#web-security</span>
                        <span className="text-gray-300">Веб-безопасность и уязвимости</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 w-32">#crypto</span>
                        <span className="text-gray-300">Криптография и шифрование</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 w-32">#reverse-eng</span>
                        <span className="text-gray-300">Реверс-инжиниринг и анализ</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 w-32">#help</span>
                        <span className="text-gray-300">Помощь и поддержка</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <a 
                      href="https://discord.gg/cyberwhale" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-indigo-500 hover:bg-indigo-600">
                        Присоединиться к серверу
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="forum" className="bg-cyberdark-800 rounded-b-lg p-6 border border-t-0 border-cyberdark-700">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-cyberblue-500 flex items-center justify-center mr-4">
                      <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Форум CyberWhale</h3>
                      <p className="text-gray-300">forum.cyberwhale.com • 500+ тем</p>
                    </div>
                  </div>
                  <div className="bg-cyberdark-700 rounded-lg p-6 mb-6">
                    <h4 className="font-medium text-white mb-4">Популярные категории:</h4>
                    <div className="space-y-4 mb-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-cyberblue-400 mr-3" />
                          <span className="text-white">Web Security</span>
                        </div>
                        <span className="text-gray-400">124 темы</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-cyberblue-400 mr-3" />
                          <span className="text-white">Криптография</span>
                        </div>
                        <span className="text-gray-400">87 тем</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-cyberblue-400 mr-3" />
                          <span className="text-white">Reverse Engineering</span>
                        </div>
                        <span className="text-gray-400">93 темы</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-cyberblue-400 mr-3" />
                          <span className="text-white">CTF и соревнования</span>
                        </div>
                        <span className="text-gray-400">118 тем</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-cyberblue-400 mr-3" />
                          <span className="text-white">Карьера и обучение</span>
                        </div>
                        <span className="text-gray-400">78 тем</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Link to="/community/forum">
                      <Button className="bg-cyberblue-500 hover:bg-cyberblue-600">
                        Перейти на форум
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="bg-gradient-to-b from-cyberdark-900 to-cyberdark-800 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Присоединяйтесь к нашему сообществу сегодня
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Станьте частью растущего сообщества специалистов и энтузиастов кибербезопасности. 
              Обменивайтесь знаниями, участвуйте в событиях и развивайтесь вместе с нами.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button className="bg-cyberblue-500 hover:bg-cyberblue-600 btn-glow text-lg px-8 py-6">
                  Зарегистрироваться
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="text-white text-lg px-8 py-6">
                  Уже зарегистрированы? Войти
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
