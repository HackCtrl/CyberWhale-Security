import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  RefreshCw,
  BookOpen,
  Upload,
  Download,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  points: number;
  flag: string;
  hints: string[];
  fileUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  { value: 'web', label: 'Web Security' },
  { value: 'crypto', label: 'Криптография' },
  { value: 'osint', label: 'OSINT' },
  { value: 'steganography', label: 'Стеганография' },
  { value: 'reverse-engineering', label: 'Реверс-инжиниринг' },
  { value: 'forensics', label: 'Форензика' },
  { value: 'pwn', label: 'PWN' },
  { value: 'programming', label: 'Программирование' },
  { value: 'network', label: 'Сетевая безопасность' }
];

const difficulties = [
  { value: 'beginner', label: 'Начинающий', color: 'bg-green-500' },
  { value: 'intermediate', label: 'Средний', color: 'bg-yellow-500' },
  { value: 'advanced', label: 'Продвинутый', color: 'bg-orange-500' },
  { value: 'expert', label: 'Эксперт', color: 'bg-red-500' }
];

export default function FinalAdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('challenges');
  const { toast } = useToast();

  const [challengeForm, setChallengeForm] = useState({
    title: '',
    description: '',
    category: 'web',
    difficulty: 'beginner' as Challenge['difficulty'],
    points: 100,
    flag: '',
    hints: [''],
    fileUrl: ''
  });

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        setPassword('');
        await loadChallenges();
        toast({
          title: "Доступ разрешен",
          description: "Добро пожаловать в админ панель"
        });
      } else {
        toast({
          title: "Ошибка доступа",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось проверить пароль",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadChallenges = async () => {
    try {
      const response = await fetch('/api/challenges');
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки заданий:', error);
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/challenges', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...challengeForm,
          hints: challengeForm.hints.filter(hint => hint.trim() !== '')
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Задание создано",
          description: "CTF задание успешно добавлено в базу"
        });
        
        setShowCreateForm(false);
        resetForm();
        await loadChallenges();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Ошибка создания",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateChallenge = async (id: number) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/challenges/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...challengeForm,
          hints: challengeForm.hints.filter(hint => hint.trim() !== '')
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Задание обновлено",
          description: "Изменения сохранены успешно"
        });
        
        setEditingChallenge(null);
        resetForm();
        await loadChallenges();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Ошибка обновления",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChallenge = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить это задание?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/challenges/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Задание удалено",
          description: "CTF задание убрано из базы"
        });
        await loadChallenges();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Ошибка удаления",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setChallengeForm({
      title: '',
      description: '',
      category: 'web',
      difficulty: 'beginner',
      points: 100,
      flag: '',
      hints: [''],
      fileUrl: ''
    });
  };

  const startEditing = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setChallengeForm({
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      difficulty: challenge.difficulty,
      points: challenge.points,
      flag: challenge.flag,
      hints: challenge.hints.length > 0 ? challenge.hints : [''],
      fileUrl: challenge.fileUrl || ''
    });
  };

  const addHint = () => {
    setChallengeForm({
      ...challengeForm,
      hints: [...challengeForm.hints, '']
    });
  };

  const removeHint = (index: number) => {
    setChallengeForm({
      ...challengeForm,
      hints: challengeForm.hints.filter((_, i) => i !== index)
    });
  };

  const updateHint = (index: number, value: string) => {
    const newHints = [...challengeForm.hints];
    newHints[index] = value;
    setChallengeForm({
      ...challengeForm,
      hints: newHints
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cyberdark-950 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-cyberdark-900 border-cyberdark-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-red-400" />
            </div>
            <CardTitle className="text-white">Админ панель CyberWhale</CardTitle>
            <CardDescription className="text-gray-400">
              Панель управления CTF платформой
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-gray-300">Пароль администратора</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-cyberdark-800 border-cyberdark-600 text-white"
                  placeholder="Введите пароль"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                Войти в панель
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyberdark-950 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-400" />
                Админ панель CyberWhale
              </h1>
              <p className="text-gray-400 mt-2">Управление CTF платформой и заданиями</p>
            </div>
            <Badge variant="outline" className="text-green-400 border-green-400">
              Панель активна
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-cyberdark-800">
            <TabsTrigger value="challenges" className="data-[state=active]:bg-cyberdark-700 text-white">
              CTF Задания
            </TabsTrigger>
            <TabsTrigger value="guide" className="data-[state=active]:bg-cyberdark-700 text-white">
              Инструкция
            </TabsTrigger>
            <TabsTrigger value="import" className="data-[state=active]:bg-cyberdark-700 text-white">
              Импорт/Экспорт
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Управление заданиями</h2>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать задание
              </Button>
            </div>

            {(showCreateForm || editingChallenge) && (
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingChallenge ? 'Редактирование задания' : 'Создание нового задания'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingChallenge ? 
                    (e: React.FormEvent) => { e.preventDefault(); handleUpdateChallenge(editingChallenge.id); } : 
                    handleCreateChallenge} 
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Название задания</Label>
                        <Input
                          value={challengeForm.title}
                          onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                          className="bg-cyberdark-800 border-cyberdark-600 text-white"
                          placeholder="Например: SQL Injection Basic"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label className="text-gray-300">Категория</Label>
                        <Select value={challengeForm.category} onValueChange={(value) => setChallengeForm({ ...challengeForm, category: value })}>
                          <SelectTrigger className="bg-cyberdark-800 border-cyberdark-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-cyberdark-800 border-cyberdark-600">
                            {categories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-cyberdark-700">
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-gray-300">Сложность</Label>
                        <Select value={challengeForm.difficulty} onValueChange={(value) => setChallengeForm({ ...challengeForm, difficulty: value as Challenge['difficulty'] })}>
                          <SelectTrigger className="bg-cyberdark-800 border-cyberdark-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-cyberdark-800 border-cyberdark-600">
                            {difficulties.map(diff => (
                              <SelectItem key={diff.value} value={diff.value} className="text-white hover:bg-cyberdark-700">
                                {diff.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-gray-300">Очки за решение</Label>
                        <Input
                          type="number"
                          value={challengeForm.points}
                          onChange={(e) => setChallengeForm({ ...challengeForm, points: parseInt(e.target.value) || 100 })}
                          className="bg-cyberdark-800 border-cyberdark-600 text-white"
                          min="10"
                          max="1000"
                          step="10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Описание задания</Label>
                      <textarea
                        value={challengeForm.description}
                        onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                        className="w-full min-h-24 p-3 bg-cyberdark-800 border border-cyberdark-600 text-white rounded-md"
                        placeholder="Подробное описание задания и цели..."
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Флаг (ответ)</Label>
                      <Input
                        value={challengeForm.flag}
                        onChange={(e) => setChallengeForm({ ...challengeForm, flag: e.target.value })}
                        className="bg-cyberdark-800 border-cyberdark-600 text-white"
                        placeholder="cyberwhale{example_flag}"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Ссылка на файлы (опционально)</Label>
                      <Input
                        value={challengeForm.fileUrl}
                        onChange={(e) => setChallengeForm({ ...challengeForm, fileUrl: e.target.value })}
                        className="bg-cyberdark-800 border-cyberdark-600 text-white"
                        placeholder="https://example.com/challenge-files.zip"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-gray-300">Подсказки</Label>
                        <Button type="button" onClick={addHint} variant="outline" size="sm">
                          <Plus className="w-3 h-3 mr-1" />
                          Добавить
                        </Button>
                      </div>
                      {challengeForm.hints.map((hint, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={hint}
                            onChange={(e) => updateHint(index, e.target.value)}
                            className="bg-cyberdark-800 border-cyberdark-600 text-white"
                            placeholder={`Подсказка ${index + 1}`}
                          />
                          {challengeForm.hints.length > 1 && (
                            <Button type="button" onClick={() => removeHint(index)} variant="outline" size="sm">
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {editingChallenge ? 'Сохранить изменения' : 'Создать задание'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowCreateForm(false);
                          setEditingChallenge(null);
                          resetForm();
                        }}
                      >
                        Отмена
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="bg-cyberdark-900 border-cyberdark-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                          <Badge className={difficulties.find(d => d.value === challenge.difficulty)?.color}>
                            {difficulties.find(d => d.value === challenge.difficulty)?.label}
                          </Badge>
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            {categories.find(c => c.value === challenge.category)?.label}
                          </Badge>
                          <span className="text-yellow-400 font-medium">{challenge.points} pts</span>
                        </div>
                        <p className="text-gray-400 mb-2">{challenge.description}</p>
                        <div className="text-sm text-gray-500">
                          Флаг: <code className="bg-cyberdark-800 px-2 py-1 rounded">{challenge.flag}</code>
                        </div>
                        {challenge.hints.length > 0 && (
                          <div className="text-sm text-gray-500 mt-1">
                            Подсказки: {challenge.hints.length} шт.
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => startEditing(challenge)}
                          variant="outline" 
                          size="sm"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteChallenge(challenge.id)}
                          variant="outline" 
                          size="sm"
                          className="text-red-400 border-red-400 hover:bg-red-950"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {challenges.length === 0 && (
                <Card className="bg-cyberdark-900 border-cyberdark-700">
                  <CardContent className="p-8 text-center">
                    <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Пока нет созданных заданий</p>
                    <p className="text-gray-500 text-sm">Создайте первое CTF задание</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Полная инструкция по использованию админ панели
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Доступ к панели</h3>
                  <p className="mb-2">Пароль для входа: <code className="bg-cyberdark-800 px-2 py-1 rounded text-yellow-400">301062Ki</code></p>
                  <p>Панель доступна по ссылке в футере сайта</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Создание CTF заданий</h3>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Нажмите "Создать задание"</li>
                    <li>Заполните название и выберите категорию</li>
                    <li>Выберите сложность и количество очков</li>
                    <li>Напишите подробное описание задания</li>
                    <li>Укажите правильный флаг</li>
                    <li>Добавьте подсказки при необходимости</li>
                    <li>Нажмите "Создать задание"</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Рекомендации</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Тестируйте задания перед публикацией</li>
                    <li>Используйте понятные описания</li>
                    <li>Флаги в формате cyberwhale с фигурными скобками</li>
                    <li>Добавляйте подсказки для сложных заданий</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-white">Импорт и экспорт заданий</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-950 border border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-1">Функции в разработке</h4>
                      <p className="text-yellow-200 text-sm">
                        Импорт и экспорт заданий находятся в процессе разработки. 
                        Пока используйте форму создания заданий вручную.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}