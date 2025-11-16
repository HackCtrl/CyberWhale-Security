import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ChatAssistant from '@/components/layout/ChatAssistant';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ArrowRight, 
  BookOpen, 
  Shield, 
  Code, 
  Cpu, 
  Filter,
  Clock,
  ChevronRight,
  Star,
  Github,
  ExternalLink,
  BookMarked,
  Database,
  Library
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock articles data
const mockArticles = [
  {
    id: '1',
    title: 'Введение в веб-уязвимости',
    description: 'Обзор основных типов веб-уязвимостей и методов их эксплуатации.',
    category: 'web-security',
    tags: ['web', 'vulnerabilities', 'owasp'],
    author: 'Алексей Петров',
    date: new Date('2023-05-15'),
    readTime: 12,
    difficulty: 'beginner',
    views: 1245,
    likes: 87,
  },
  {
    id: '2',
    title: 'Основы криптографии',
    description: 'Введение в основные концепции криптографии и их применение в кибербезопасности.',
    category: 'cryptography',
    tags: ['crypto', 'encryption', 'hashing'],
    author: 'Мария Иванова',
    date: new Date('2023-06-10'),
    readTime: 15,
    difficulty: 'intermediate',
    views: 982,
    likes: 65,
  },
  {
    id: '3',
    title: 'Реверс-инжиниринг вредоносного ПО',
    description: 'Методы и инструменты для анализа вредоносного программного обеспечения.',
    category: 'malware-analysis',
    tags: ['reverse-engineering', 'malware', 'analysis'],
    author: 'Дмитрий Сидоров',
    date: new Date('2023-07-05'),
    readTime: 20,
    difficulty: 'advanced',
    views: 756,
    likes: 42,
  },
  {
    id: '4',
    title: 'Безопасность сетей: основы',
    description: 'Фундаментальные принципы сетевой безопасности и защиты инфраструктуры.',
    category: 'network-security',
    tags: ['network', 'firewall', 'ids'],
    author: 'Елена Смирнова',
    date: new Date('2023-08-20'),
    readTime: 10,
    difficulty: 'beginner',
    views: 1102,
    likes: 73,
  },
  {
    id: '5',
    title: 'Атаки типа "человек посередине"',
    description: 'Подробный разбор MITM-атак и способов защиты от них.',
    category: 'network-security',
    tags: ['mitm', 'attack', 'network'],
    author: 'Игорь Волков',
    date: new Date('2023-09-10'),
    readTime: 14,
    difficulty: 'intermediate',
    views: 845,
    likes: 51,
  },
  {
    id: '6',
    title: 'Безопасность контейнеров Docker',
    description: 'Лучшие практики обеспечения безопасности при использовании Docker.',
    category: 'cloud-security',
    tags: ['docker', 'containers', 'devsecops'],
    author: 'Анна Козлова',
    date: new Date('2023-10-05'),
    readTime: 18,
    difficulty: 'intermediate',
    views: 678,
    likes: 39,
  },
];

// Category icons mapping
const categoryIcons = {
  'web-security': <Code className="w-5 h-5" />,
  'cryptography': <Shield className="w-5 h-5" />,
  'malware-analysis': <Cpu className="w-5 h-5" />,
  'network-security': <Shield className="w-5 h-5" />,
  'cloud-security': <Cpu className="w-5 h-5" />,
  'osint': <Search className="w-5 h-5" />,
  'forensics': <Search className="w-5 h-5" />,
};

// Difficulty color mapping
const difficultyColors = {
  'beginner': 'bg-green-500/20 text-green-500 border-green-500/30',
  'intermediate': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  'advanced': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  'expert': 'bg-red-500/20 text-red-500 border-red-500/30',
};

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [filterDifficulty, setFilterDifficulty] = React.useState('all');

  // Filter articles based on search and filters
  const filteredArticles = mockArticles.filter(article => {
    // Apply search query filter
    const matchesSearch = 
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply category filter
    const matchesCategory = 
      filterCategory === 'all' || 
      article.category === filterCategory;
    
    // Apply difficulty filter
    const matchesDifficulty = 
      filterDifficulty === 'all' || 
      article.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-cyberdark-900 flex flex-col">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        {/* Hero section */}
        <div className="bg-cyberdark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  <span className="block text-cyberblue-400">БАЗА ЗНАНИЙ</span>
                  <span className="block mt-1">Изучайте кибербезопасность с нуля до профессионала</span>
                </h1>
                <p className="mt-3 text-lg text-gray-300">
                  Наша база знаний содержит сотни статей, руководств и учебных материалов по различным аспектам кибербезопасности.
                  От основ для начинающих до продвинутых техник для профессионалов.
                </p>
                <div className="mt-6 flex">
                  <Link to="/knowledge/roadmap">
                    <Button className="bg-cyberblue-500 hover:bg-cyberblue-600">
                      Начать обучение
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="hidden md:block md:w-1/3 mt-8 md:mt-0">
                <div className="bg-cyberdark-700 rounded-lg p-6 text-center border border-cyberdark-600">
                  <h3 className="text-xl font-semibold text-white mb-4">Статистика базы знаний</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-cyberdark-800 p-4 rounded-md">
                      <div className="text-2xl font-bold text-white">200+</div>
                      <div className="text-sm text-gray-400">Статей</div>
                    </div>
                    <div className="bg-cyberdark-800 p-4 rounded-md">
                      <div className="text-2xl font-bold text-white">15+</div>
                      <div className="text-sm text-gray-400">Курсов</div>
                    </div>
                    <div className="bg-cyberdark-800 p-4 rounded-md">
                      <div className="text-2xl font-bold text-white">8</div>
                      <div className="text-sm text-gray-400">Категорий</div>
                    </div>
                    <div className="bg-cyberdark-800 p-4 rounded-md">
                      <div className="text-2xl font-bold text-white">50+</div>
                      <div className="text-sm text-gray-400">Авторов</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* CyberWhale Reference Repository Section */}
          <div className="mb-16 bg-gradient-to-r from-cyberdark-800 via-cyberdark-700 to-cyberdark-800 rounded-lg overflow-hidden border border-cyberblue-500/30 shadow-glow-sm">
            <div className="md:flex">
              <div className="md:w-2/3 p-8">
                <div className="flex items-center mb-4">
                  <Library className="w-8 h-8 text-cyberblue-400 mr-3" />
                  <h2 className="text-3xl font-bold text-white">Справочник CyberWhale</h2>
                </div>
                <Badge className="bg-cyberblue-500/20 text-cyberblue-400 border-cyberblue-500/30 mb-4">Эксклюзив</Badge>
                <p className="text-gray-300 text-lg mb-6">
                  Полный справочник инструментов и ресурсов для специалистов по кибербезопасности. Более 300 инструментов, 
                  разделенных по категориям: пентестинг, анализ вредоносного ПО, OSINT, форензика и многое другое.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-cyberblue-400 mr-2" />
                    <span className="text-gray-300">Операционные системы для пентеста и анализа</span>
                  </div>
                  <div className="flex items-center">
                    <Database className="w-5 h-5 text-cyberblue-400 mr-2" />
                    <span className="text-gray-300">Базы данных уязвимостей и угроз</span>
                  </div>
                  <div className="flex items-center">
                    <Code className="w-5 h-5 text-cyberblue-400 mr-2" />
                    <span className="text-gray-300">Инструменты для анализа кода и поиска уязвимостей</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://github.com/CyberWhaleOffical1/CyberWhale_Cybersecurity_Reference" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-cyberblue-500 hover:bg-cyberblue-600 w-full sm:w-auto">
                      <Github className="mr-2 h-5 w-5" />
                      Открыть справочник
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <Link to="/knowledge/reference-guide">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <BookMarked className="mr-2 h-5 w-5" />
                      Подробнее о справочнике
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block md:w-1/3 bg-cyberdark-700 p-8 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyberblue-500/20 rounded-full animate-pulse"></div>
                  <div className="relative bg-cyberdark-800 rounded-full p-8 border border-cyberblue-500/30">
                    <BookOpen className="h-24 w-24 text-cyberblue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:flex md:items-center md:justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">База знаний по кибербезопасности</h2>
            <p className="mt-2 md:mt-0 text-gray-400">
              Изучайте кибербезопасность с помощью наших подробных статей и руководств
            </p>
          </div>

          {/* Search and filter */}
          <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
            <div className="flex-1 relative sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Поиск по статьям..."
                className="pl-10 w-full bg-cyberdark-800 border-cyberdark-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  className="appearance-none bg-cyberdark-800 border border-cyberdark-700 text-white py-2 px-4 pr-8 rounded focus:outline-none focus:ring-1 focus:ring-cyberblue-500"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">Все категории</option>
                  <option value="web-security">Веб-безопасность</option>
                  <option value="cryptography">Криптография</option>
                  <option value="malware-analysis">Анализ вредоносного ПО</option>
                  <option value="network-security">Сетевая безопасность</option>
                  <option value="cloud-security">Облачная безопасность</option>
                  <option value="osint">OSINT</option>
                  <option value="forensics">Форензика</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none bg-cyberdark-800 border border-cyberdark-700 text-white py-2 px-4 pr-8 rounded focus:outline-none focus:ring-1 focus:ring-cyberblue-500"
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
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
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-cyberdark-800 rounded-lg overflow-hidden border border-cyberdark-700 hover:border-cyberblue-500/50 transition-all duration-300 hover:shadow-glow-sm"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-cyberdark-700 rounded-full p-2">
                        {(categoryIcons as any)[article.category]}
                      </div>
                      <span className="text-sm font-medium text-gray-300">
                        {article.category === 'web-security' && 'Веб-безопасность'}
                        {article.category === 'cryptography' && 'Криптография'}
                        {article.category === 'malware-analysis' && 'Анализ вредоносного ПО'}
                        {article.category === 'network-security' && 'Сетевая безопасность'}
                        {article.category === 'cloud-security' && 'Облачная безопасность'}
                        {article.category === 'osint' && 'OSINT'}
                        {article.category === 'forensics' && 'Форензика'}
                      </span>
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full border ${(difficultyColors as any)[article.difficulty]}`}>
                      {article.difficulty === 'beginner' && 'Начальный'}
                      {article.difficulty === 'intermediate' && 'Средний'}
                      {article.difficulty === 'advanced' && 'Продвинутый'}
                      {article.difficulty === 'expert' && 'Эксперт'}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                  
                  <p className="text-gray-300 mb-6 line-clamp-3">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{article.readTime} мин.</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-sm">{article.likes}</span>
                      </div>
                    </div>
                    
                    <Link to={`/knowledge/article/${article.id}`}>
                      <Button variant="outline" size="sm">
                        Читать
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Learning paths section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Учебные пути</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-cyberdark-800 to-cyberdark-700 rounded-lg overflow-hidden border border-cyberdark-700">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">Путь начинающего</h3>
                  <p className="text-gray-300 mb-4">
                    Идеально подходит для тех, кто только начинает свой путь в кибербезопасности. Изучите основы и постепенно переходите к более сложным темам.
                  </p>
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <ChevronRight className="w-4 h-4 text-cyberblue-500 mr-2" />
                      <span className="text-gray-300">Основы информационной безопасности</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <ChevronRight className="w-4 h-4 text-cyberblue-500 mr-2" />
                      <span className="text-gray-300">Введение в сетевую безопасность</span>
                    </div>
                    <div className="flex items-center">
                      <ChevronRight className="w-4 h-4 text-cyberblue-500 mr-2" />
                      <span className="text-gray-300">Основы криптографии</span>
                    </div>
                  </div>
                  <Link to="/knowledge/path/beginner">
                    <Button className="bg-cyberblue-500 hover:bg-cyberblue-600">
                      Начать обучение
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-cyberdark-800 to-cyberdark-700 rounded-lg overflow-hidden border border-cyberdark-700">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">Путь пентестера</h3>
                  <p className="text-gray-300 mb-4">
                    Специализированный путь для тех, кто хочет стать специалистом по тестированию на проникновение. Изучите методы и инструменты пентеста.
                  </p>
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <ChevronRight className="w-4 h-4 text-cyberblue-500 mr-2" />
                      <span className="text-gray-300">Разведка и сбор информации</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <ChevronRight className="w-4 h-4 text-cyberblue-500 mr-2" />
                      <span className="text-gray-300">Эксплуатация веб-уязвимостей</span>
                    </div>
                    <div className="flex items-center">
                      <ChevronRight className="w-4 h-4 text-cyberblue-500 mr-2" />
                      <span className="text-gray-300">Постэксплуатация и закрепление</span>
                    </div>
                  </div>
                  <Link to="/knowledge/path/pentester">
                    <Button className="bg-cyberblue-500 hover:bg-cyberblue-600">
                      Начать обучение
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tools from the Reference Repository */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Популярные инструменты из справочника</h2>
              <a 
                href="https://github.com/CyberWhaleOffical1/CyberWhale_Cybersecurity_Reference" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyberblue-400 hover:text-cyberblue-300 flex items-center"
              >
                <span>Все инструменты</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-cyberdark-800 border-cyberdark-700 text-white hover:shadow-glow-sm transition-all duration-300 hover:border-cyberblue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-cyberblue-400" />
                    Kali Linux
                  </CardTitle>
                  <CardDescription className="text-gray-400">Операционные системы</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Лучшая OS для пентеста с более чем 300 предустановлеными инструментами.</p>
                </CardContent>
                <CardFooter>
                  <a 
                    href="https://www.kali.org/" 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-cyberblue-400 hover:text-cyberblue-300 text-sm flex items-center"
                  >
                    Подробнее
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>
              
              <Card className="bg-cyberdark-800 border-cyberdark-700 text-white hover:shadow-glow-sm transition-all duration-300 hover:border-cyberblue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Database className="mr-2 h-5 w-5 text-cyberblue-400" />
                    MITRE ATT&CK
                  </CardTitle>
                  <CardDescription className="text-gray-400">Базы данных угроз</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">База данных тактик и техник атак, используемых злоумышленниками.</p>
                </CardContent>
                <CardFooter>
                  <a 
                    href="https://attack.mitre.org/" 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-cyberblue-400 hover:text-cyberblue-300 text-sm flex items-center"
                  >
                    Подробнее
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>
              
              <Card className="bg-cyberdark-800 border-cyberdark-700 text-white hover:shadow-glow-sm transition-all duration-300 hover:border-cyberblue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Search className="mr-2 h-5 w-5 text-cyberblue-400" />
                    OSINT Framework
                  </CardTitle>
                  <CardDescription className="text-gray-400">OSINT</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Фреймворк для поиска информации из открытых источников.</p>
                </CardContent>
                <CardFooter>
                  <a 
                    href="https://osintframework.com/" 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-cyberblue-400 hover:text-cyberblue-300 text-sm flex items-center"
                  >
                    Подробнее
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Courses section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Популярные курсы</h2>
            
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="bg-cyberdark-800 border-b border-cyberdark-700 p-0">
                <TabsTrigger value="all" className="data-[state=active]:bg-cyberdark-700">Все</TabsTrigger>
                <TabsTrigger value="web" className="data-[state=active]:bg-cyberdark-700">Веб</TabsTrigger>
                <TabsTrigger value="network" className="data-[state=active]:bg-cyberdark-700">Сети</TabsTrigger>
                <TabsTrigger value="crypto" className="data-[state=active]:bg-cyberdark-700">Крипто</TabsTrigger>
                <TabsTrigger value="malware" className="data-[state=active]:bg-cyberdark-700">Вредоносное ПО</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-cyberdark-800 rounded-lg overflow-hidden border border-cyberdark-700">
                    <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Code className="h-16 w-16 text-white" />
                    </div>
                    <div className="p-6">
                      <Badge className="mb-2 bg-blue-500/20 text-blue-400 border-blue-500/30">Веб-безопасность</Badge>
                      <h3 className="text-xl font-bold text-white mb-2">Веб-уязвимости от А до Я</h3>
                      <p className="text-gray-300 mb-4">
                        Полный курс по веб-уязвимостям, от основ до продвинутых техник эксплуатации.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">12 уроков • 6 часов</div>
                        <Link to="/knowledge/course/web-vulnerabilities">
                          <Button variant="outline" size="sm">
                            Подробнее
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-cyberdark-800 rounded-lg overflow-hidden border border-cyberdark-700">
                    <div className="h-40 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                      <Shield className="h-16 w-16 text-white" />
                    </div>
                    <div className="p-6">
                      <Badge className="mb-2 bg-green-500/20 text-green-400 border-green-500/30">Сетевая безопасность</Badge>
                      <h3 className="text-xl font-bold text-white mb-2">Защита сетевой инфраструктуры</h3>
                      <p className="text-gray-300 mb-4">
                        Изучите методы защиты сетей от различных типов атак и угроз.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">10 уроков • 5 часов</div>
                        <Link to="/knowledge/course/network-security">
                          <Button variant="outline" size="sm">
                            Подробнее
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-cyberdark-800 rounded-lg overflow-hidden border border-cyberdark-700">
                    <div className="h-40 bg-gradient-to-r from-red-500 to-orange-600 flex items-center justify-center">
                      <Cpu className="h-16 w-16 text-white" />
                    </div>
                    <div className="p-6">
                      <Badge className="mb-2 bg-red-500/20 text-red-400 border-red-500/30">Анализ вредоносного ПО</Badge>
                      <h3 className="text-xl font-bold text-white mb-2">Основы реверс-инжиниринга</h3>
                      <p className="text-gray-300 mb-4">
                        Научитесь анализировать и понимать принципы работы вредоносного ПО.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">8 уроков • 4 часа</div>
                        <Link to="/knowledge/course/reverse-engineering">
                          <Button variant="outline" size="sm">
                            Подробнее
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="web" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-cyberdark-800 rounded-lg overflow-hidden border border-cyberdark-700">
                    <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Code className="h-16 w-16 text-white" />
                    </div>
                    <div className="p-6">
                      <Badge className="mb-2 bg-blue-500/20 text-blue-400 border-blue-500/30">Веб-безопасность</Badge>
                      <h3 className="text-xl font-bold text-white mb-2">Веб-уязвимости от А до Я</h3>
                      <p className="text-gray-300 mb-4">
                        Полный курс по веб-уязвимостям, от основ до продвинутых техник эксплуатации.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">12 уроков • 6 часов</div>
                        <Link to="/knowledge/course/web-vulnerabilities">
                          <Button variant="outline" size="sm">
                            Подробнее
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* CTA section */}
          <div className="mt-16 bg-gradient-to-r from-cyberdark-800 to-cyberdark-700 rounded-lg overflow-hidden border border-cyberdark-700">
            <div className="md:flex">
              <div className="p-8 md:w-2/3">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Готовы начать свой путь в кибербезопасности?
                </h2>
                <p className="text-gray-300 mb-6">
                  Зарегистрируйтесь на платформе CyberWhale и получите доступ ко всем материалам базы знаний,
                  включая эксклюзивные курсы, лабораторные работы и сертификаты.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button className="bg-cyberblue-500 hover:bg-cyberblue-600">
                      Зарегистрироваться
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/knowledge/roadmap">
                    <Button variant="outline">
                      Карта обучения
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3 bg-cyberdark-700 flex items-center justify-center p-8">
                <div className="w-24 h-24 rounded-full bg-cyberblue-500/20 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-cyberblue-500" />
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
