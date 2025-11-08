import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Upload, 
  Download, 
  Plus, 
  FileJson, 
  Settings,
  Users,
  Database,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Newspaper,
  Calendar,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Challenge, Article } from '@/types';
import { mockChallenges } from '@/data/challenges';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('challenges');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [articles, setArticles] = useState<Article[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Проверка пароля
  const handlePasswordSubmit = () => {
    if (password === '301062Ki') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      toast({
        title: 'Успешный вход',
        description: 'Добро пожаловать в админ-панель CyberWhale',
      });
    } else {
      toast({
        title: 'Неверный пароль',
        description: 'Введите правильный пароль для доступа к админ-панели',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPassword('');
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cyberdark-900 flex items-center justify-center">
        <Card className="bg-cyberdark-800 border-cyberdark-700 w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-cyberblue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Админ-панель CyberWhale</CardTitle>
            <CardDescription className="text-gray-400">
              Введите пароль для доступа к панели управления
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Пароль администратора"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="bg-cyberdark-700 border-cyberdark-600 text-white"
              />
              <Button onClick={handlePasswordSubmit} className="w-full bg-cyberblue-600 hover:bg-cyberblue-700">
                <Shield className="w-4 h-4 mr-2" />
                Войти в панель
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          if (activeTab === 'challenges' && Array.isArray(data.challenges)) {
            setChallenges([...challenges, ...data.challenges]);
            toast({
              title: 'Успешно',
              description: `Импортировано ${data.challenges.length} заданий`,
            });
          } else if (activeTab === 'articles' && Array.isArray(data.articles)) {
            setArticles([...articles, ...data.articles]);
            toast({
              title: 'Успешно',
              description: `Импортировано ${data.articles.length} статей`,
            });
          }
        } catch (error) {
          toast({
            title: 'Ошибка',
            description: 'Неверный формат файла',
            variant: 'destructive',
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const data = {
      challenges: challenges,
      articles: articles,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberwhale-content-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Экспорт завершен',
      description: 'Контент сохранен в файл',
    });
  };

  const handleDelete = (id: string, type: 'challenge' | 'article') => {
    if (type === 'challenge') {
      setChallenges(challenges.filter(c => c.id !== id));
    } else {
      setArticles(articles.filter(a => a.id !== id));
    }
    toast({
      title: 'Удалено',
      description: `${type === 'challenge' ? 'Задание' : 'Статья'} успешно удалено`,
    });
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || challenge.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = articles.filter(article => {
    return article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           article.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-cyberdark-900 text-white">
      {/* Header */}
      <div className="bg-cyberdark-800 border-b border-cyberdark-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-cyberblue-500" />
              <h1 className="text-2xl font-bold">Админ-панель CyberWhale</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-400 border-green-400">
              Авторизован
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-cyberdark-800">
            <TabsTrigger value="challenges" className="data-[state=active]:bg-cyberblue-600">
              <Database className="w-4 h-4 mr-2" />
              CTF Задания
            </TabsTrigger>
            <TabsTrigger value="articles" className="data-[state=active]:bg-cyberblue-600">
              <FileText className="w-4 h-4 mr-2" />
              Статьи
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-cyberblue-600">
              <Users className="w-4 h-4 mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyberblue-600">
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          {/* Controls Bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-cyberdark-800 border-cyberdark-600"
                />
              </div>
              {activeTab === 'challenges' && (
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48 bg-cyberdark-800 border-cyberdark-600">
                    <SelectValue placeholder="Категория" />
                  </SelectTrigger>
                  <SelectContent className="bg-cyberdark-800 border-cyberdark-600">
                    <SelectItem value="all">Все категории</SelectItem>
                    <SelectItem value="web">Web Security</SelectItem>
                    <SelectItem value="crypto">Cryptography</SelectItem>
                    <SelectItem value="osint">OSINT</SelectItem>
                    <SelectItem value="steganography">Steganography</SelectItem>
                    <SelectItem value="reverse-engineering">Reverse Engineering</SelectItem>
                    <SelectItem value="forensics">Forensics</SelectItem>
                    <SelectItem value="pwn">PWN</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
              <Button asChild>
                <label className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Импорт
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </Button>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Создать
              </Button>
            </div>
          </div>

          {/* CTF Challenges Tab */}
          <TabsContent value="challenges" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChallenges.map((challenge) => (
                <Card key={challenge.id} className="bg-cyberdark-800 border-cyberdark-700 hover:border-cyberblue-500 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{challenge.title}</CardTitle>
                      <Badge variant="outline" className={`
                        ${challenge.difficulty === 'beginner' ? 'text-green-400 border-green-400' : ''}
                        ${challenge.difficulty === 'intermediate' ? 'text-yellow-400 border-yellow-400' : ''}
                        ${challenge.difficulty === 'advanced' ? 'text-orange-400 border-orange-400' : ''}
                        ${challenge.difficulty === 'expert' ? 'text-red-400 border-red-400' : ''}
                      `}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      {challenge.description.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Категория:</span>
                        <Badge variant="secondary">{challenge.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Очки:</span>
                        <span className="text-cyberblue-400 font-semibold">{challenge.points}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Решено:</span>
                        <span className="text-green-400">{challenge.solvedBy} раз</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setEditingItem(challenge)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Редактировать
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(challenge.id, 'challenge')}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Удалить
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="bg-cyberdark-800 border-cyberdark-700 hover:border-cyberblue-500 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{article.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {article.description.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Категория:</span>
                        <Badge variant="secondary">{article.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Уровень:</span>
                        <Badge variant="outline">{article.level}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Время чтения:</span>
                        <span className="text-cyberblue-400">{article.readTime} мин</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setEditingItem(article)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Редактировать
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id, 'article')}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Удалить
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="bg-cyberdark-800 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-white">Управление пользователями</CardTitle>
                <CardDescription className="text-gray-400">
                  Скоро будет добавлено управление пользователями
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-cyberdark-800 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-white">Настройки системы</CardTitle>
                <CardDescription className="text-gray-400">
                  Скоро будут добавлены настройки платформы
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}