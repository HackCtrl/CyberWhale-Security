// Временное хранилище для разработки без базы данных

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  points: number;
  level: number;
  createdAt: string;
}

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

class DevStorage {
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@cyberwhale.ru',
      password: '$2a$10$rOzZJZzQZzQZzQZzQZzQZ.zQZzQZzQZzQZzQZzQZzQZzQZzQZzQ', // password: 301062Ki
      role: 'admin',
      points: 1500,
      level: 10,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      username: 'user123',
      email: 'user123@mail.ru',
      password: '$2a$10$rOzZJZzQZzQZzQZzQZzQZ.zQZzQZzQZzQZzQZzQZzQZzQZzQZzQ',
      role: 'user',
      points: 750,
      level: 5,
      createdAt: '2024-02-20'
    }
  ];

  private challenges: Challenge[] = [
    {
      id: 1,
      title: 'SQL Injection в форме входа',
      description: 'Найдите способ обойти аутентификацию используя SQL injection',
      category: 'web',
      difficulty: 'beginner',
      points: 100,
      flag: 'cyberwhale{sql_bypass_admin}',
      hints: ['Попробуйте ввести \' OR 1=1--', 'Обратите внимание на поле пароля'],
      isActive: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ];

  // User methods
  async getUser(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const newUser = {
      ...userData,
      id: Math.max(...this.users.map(u => u.id)) + 1
    };
    this.users.push(newUser);
    return newUser;
  }

  // Challenge methods
  async getChallenges(): Promise<Challenge[]> {
    return this.challenges;
  }

  async getChallenge(id: number): Promise<Challenge | null> {
    return this.challenges.find(challenge => challenge.id === id) || null;
  }

  async createChallenge(challengeData: Omit<Challenge, 'id'>): Promise<Challenge> {
    const newChallenge = {
      ...challengeData,
      id: Math.max(...this.challenges.map(c => c.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.challenges.push(newChallenge);
    return newChallenge;
  }

  async updateChallenge(id: number, challengeData: Partial<Challenge>): Promise<Challenge | null> {
    const index = this.challenges.findIndex(challenge => challenge.id === id);
    if (index === -1) return null;
    
    this.challenges[index] = {
      ...this.challenges[index],
      ...challengeData,
      updatedAt: new Date().toISOString()
    };
    return this.challenges[index];
  }

  async deleteChallenge(id: number): Promise<boolean> {
    const index = this.challenges.findIndex(challenge => challenge.id === id);
    if (index === -1) return false;
    
    this.challenges.splice(index, 1);
    return true;
  }
}

export const devStorage = new DevStorage();