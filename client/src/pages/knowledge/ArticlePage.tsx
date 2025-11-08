import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  BookOpen, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Bookmark 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch article from API
    const fetchArticle = async () => {
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Получение статьи из мока
      const mockArticle = {
        id: id,
        title: 'Основы защиты веб-приложений от SQL-инъекций',
        content: `
          <h2>Что такое SQL-инъекции?</h2>
          <p>SQL-инъекция — это атака, при которой злоумышленник внедряет вредоносный SQL-код в запросы, отправляемые приложением к базе данных. Успешные атаки могут привести к несанкционированному доступу к конфиденциальной информации, изменению или удалению данных, а в некоторых случаях даже к выполнению административных операций на сервере базы данных.</p>
          
          <h2>Как работают SQL-инъекции?</h2>
          <p>SQL-инъекции обычно происходят, когда приложение принимает пользовательский ввод и включает его непосредственно в SQL-запрос без должной валидации или экранирования. Например, рассмотрим простой запрос для аутентификации пользователя:</p>
          
          <pre><code>SELECT * FROM users WHERE username = 'USERNAME' AND password = 'PASSWORD';</code></pre>
          
          <p>Если приложение просто подставляет пользовательский ввод в этот запрос, злоумышленник может ввести специально сформированный текст, который изменит логику запроса:</p>
          
          <pre><code>USERNAME: admin' --
PASSWORD: что угодно</code></pre>
          
          <p>Это приведет к запросу:</p>
          
          <pre><code>SELECT * FROM users WHERE username = 'admin' --' AND password = 'что угодно';</code></pre>
          
          <p>Комментарий <code>--</code> приводит к тому, что остальная часть запроса игнорируется, позволяя войти в систему без корректного пароля.</p>
          
          <h2>Методы защиты от SQL-инъекций</h2>
          
          <h3>1. Подготовленные выражения (Prepared Statements)</h3>
          <p>Использование подготовленных выражений с параметризованными запросами является наиболее эффективным способом защиты от SQL-инъекций. При этом подходе SQL-код и данные разделяются, и СУБД может различать их.</p>
          
          <pre><code>// Пример на Node.js с использованием подготовленных выражений
const stmt = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
const result = stmt.get(username, password);</code></pre>
          
          <h3>2. ORM (Object-Relational Mapping)</h3>
          <p>Использование ORM-библиотек помогает абстрагироваться от прямого составления SQL-запросов и автоматически применяет лучшие практики безопасности.</p>
          
          <pre><code>// Пример с использованием TypeORM
const user = await userRepository.findOne({
  where: {
    username: username,
    password: password
  }
});</code></pre>
          
          <h3>3. Валидация и санитизация ввода</h3>
          <p>Всегда проверяйте пользовательский ввод на соответствие ожидаемому формату и типу данных. Отклоняйте любой подозрительный ввод.</p>
          
          <h3>4. Принцип наименьших привилегий</h3>
          <p>Используйте учетные записи базы данных с минимально необходимыми привилегиями для работы приложения.</p>
          
          <h3>5. WAF (Web Application Firewall)</h3>
          <p>Реализуйте WAF для дополнительного уровня защиты, который может обнаруживать и блокировать попытки SQL-инъекций.</p>
          
          <h2>Практический пример защиты</h2>
          <p>Рассмотрим два подхода к реализации аутентификации:</p>
          
          <h3>Небезопасный подход:</h3>
          <pre><code>// НЕ ДЕЛАЙТЕ ТАК!
const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
const user = db.exec(query);</code></pre>
          
          <h3>Безопасный подход:</h3>
          <pre><code>// Правильный способ
const query = "SELECT * FROM users WHERE username = ? AND password = ?";
const user = db.prepare(query).get(username, password);</code></pre>
          
          <h2>Заключение</h2>
          <p>SQL-инъекции остаются одной из наиболее распространенных и опасных уязвимостей веб-приложений. Следуя описанным выше методам защиты и постоянно обновляя свои знания о безопасности, разработчики могут значительно снизить риск успешных атак на свои приложения.</p>
          
          <p>Важно помнить, что безопасность — это непрерывный процесс, требующий постоянного внимания и обновления методов защиты в соответствии с новыми угрозами.</p>
        `,
        author: {
          name: 'Александр Петров',
          avatar: '/avatar1.png',
        },
        date: '2023-11-15',
        readTime: 8,
        category: 'Безопасность веб-приложений',
        tags: ['sql-injection', 'web-security', 'database'],
        likes: 67,
        comments: 12,
      };
      
      setArticle(mockArticle);
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyberdark-900 flex flex-col">
        <div className="pt-20 flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-cyberdark-700 rounded w-64 mb-4"></div>
            <div className="h-6 bg-cyberdark-700 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-cyberdark-900 flex flex-col">
        <div className="pt-20 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Статья не найдена</h2>
            <p className="text-gray-400 mb-6">Статья с указанным идентификатором не существует.</p>
            <Link to="/knowledge">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к базе знаний
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyberdark-900 flex flex-col">
      <div className="pt-20 flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Link to="/knowledge" className="inline-flex items-center text-gray-400 hover:text-white transition">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Вернуться к базе знаний</span>
            </Link>
          </div>
          
          {/* Article header */}
          <div className="mb-8">
            <Badge variant="outline" className="bg-cyberdark-800 text-gray-300 mb-4">
              {article.category}
            </Badge>
            
            <h1 className="text-3xl font-bold text-white mb-6">{article.title}</h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <Avatar className="mr-3 h-10 w-10">
                  <AvatarImage src={article.author.avatar} alt={article.author.name} />
                  <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">{article.author.name}</p>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{article.date}</span>
                    <span className="mx-2">•</span>
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{article.readTime} мин. чтения</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <Bookmark className="mr-1 h-4 w-4" />
                  Сохранить
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-1 h-4 w-4" />
                  Поделиться
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="mb-8 bg-cyberdark-700" />
          
          {/* Article content */}
          <div 
            className="prose prose-invert max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* Article footer */}
          <div className="mt-10">
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="bg-cyberdark-800">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <Separator className="mb-6 bg-cyberdark-700" />
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Полезно ({article.likes})
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Комментарии ({article.comments})
                </Button>
              </div>
            </div>
          </div>
          
          {/* Related articles would go here */}
        </div>
      </div>
    </div>
  );
}
