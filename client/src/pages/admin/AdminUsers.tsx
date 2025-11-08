import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Shield, UserX, UserCheck, RefreshCw } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  points: number;
  level: number;
  createdAt: string;
  isActive: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Временные данные для демонстрации
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@cyberwhale.ru',
          role: 'admin',
          points: 1500,
          level: 10,
          createdAt: '2024-01-15',
          isActive: true
        },
        {
          id: 2,
          username: 'user123',
          email: 'user123@mail.ru',
          role: 'user',
          points: 750,
          level: 5,
          createdAt: '2024-02-20',
          isActive: true
        },
        {
          id: 3,
          username: 'hacker_pro',
          email: 'hacker@pro.com',
          role: 'user',
          points: 1200,
          level: 8,
          createdAt: '2024-01-30',
          isActive: false
        }
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список пользователей",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      );
      setUsers(updatedUsers);
      
      toast({
        title: "Успех",
        description: `Статус пользователя ${user?.isActive ? 'деактивирован' : 'активирован'}`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус пользователя",
        variant: "destructive"
      });
    }
  };

  const changeUserRole = async (userId: number, newRole: 'user' | 'admin') => {
    try {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      
      toast({
        title: "Успех",
        description: `Роль пользователя изменена на ${newRole === 'admin' ? 'администратор' : 'пользователь'}`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить роль пользователя",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Управление пользователями
          </CardTitle>
          <CardDescription>
            Просмотр и управление пользователями системы
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={loadUsers} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Очки</TableHead>
                  <TableHead>Уровень</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата регистрации</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.points}</TableCell>
                    <TableCell>{user.level}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'destructive'}>
                        {user.isActive ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={user.isActive ? "destructive" : "default"}
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        {user.role === 'user' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => changeUserRole(user.id, 'admin')}
                          >
                            Сделать админом
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => changeUserRole(user.id, 'user')}
                          >
                            Убрать админа
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-muted-foreground">
            Всего пользователей: {filteredUsers.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}