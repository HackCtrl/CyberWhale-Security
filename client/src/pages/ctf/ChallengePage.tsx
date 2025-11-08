import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Trophy, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Flag,
  Users,
  ShieldAlert,
  Lightbulb,
  Download
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import ChatAssistant from '@/components/layout/ChatAssistant';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { mockChallenges } from '@/data/challenges';

const challengeHints: Record<string, string[]> = {
  '1': [
    'Изучите документацию по JWT и его структуре (header.payload.signature)',
    'Обратите внимание на алгоритм подписи JWT токена',
    'Попробуйте использовать jwt_tool или jwt.io для анализа и манипуляции с токеном',
    'Слабый секрет может быть уязвим к брутфорс-атаке или словарной атаке'
  ],
  '2': [
    'Изучите метаданные изображения с помощью специальных инструментов',
    'Проверьте наличие скрытой информации в младших битах изображения (LSB стеганография)',
    'Попробуйте изменить контрастность или цветовые каналы изображения'
  ],
  '3': [
    'Обратите внимание на подсказку о "названии команды" (CyberWhale) и цикличности алфавита',
    'Подсчитайте сумму позиций букв в названии CyberWhale в английском алфавите',
    'Помните, что шифр Цезаря использует циклический сдвиг букв алфавита'
  ],
  '4': [
    'Используйте декомпилятор для анализа бинарного файла',
    'Обратите внимание на строковые константы в коде',
    'Проверьте функции проверки ввода пользователя'
  ],
  '5': [
    'Используйте Wireshark для анализа pcap-файла',
    'Обратите внимание на необычные HTTP-запросы',
    'Проверьте заголовки пакетов на наличие скрытой информации'
  ],
  '6': [
    'Проанализируйте входные данные, которые приводят к переполнению буфера',
    'Найдите адрес возврата функции в памяти',
    'Подготовьте payload с шеллкодом для выполнения'
  ],
  '7': [
    'Внимательно изучите подсказку в файле hint.txt о комбинации названия компании и цифры',
    'Для вычисления ASCII-значений букв можно использовать таблицу ASCII или функции языков программирования',
    'После распаковки архива, обратите внимание на формат зашифрованных данных - это может быть Base64 с AES-шифрованием'
  ],
  '8': [
    'Начните с анализа заметок в notes.txt, они могут содержать ключи или подсказки',
    'Проверьте сетевой трафик с помощью Wireshark, ищите необычные пакеты или закономерности',
    'Для работы с зашифрованным изображением может потребоваться использовать инструменты стеганографии'
  ],
  '9': [
    'Проанализируйте, как формируется SQL-запрос к базе данных при поиске сотрудников',
    'Попробуйте разные символы, которые могут нарушить структуру SQL-запроса (например, одинарная кавычка)',
    'Изучите, как можно использовать оператор UNION для объединения результатов нескольких запросов',
    'Подумайте, где может храниться структура базы данных в SQLite'
  ]
};

const challengeFlags: Record<string, string> = {
  '1': 'CTF{Ph4nt0m_V4u1t_Expl01t_MASTER}',
  '2': 'CW{H1dd3n_1n_pl41n_s1ght}',
  '3': 'CW{SecretFound}',
  '4': 'CW{R3v3rs1ng_Ch4mp}',
  '5': 'CW{P4ck3t_4n4lyst}',
  '6': 'CW{Buff3r_0v3rfl0w_pr0}',
  '7': 'CW{HiddenInPlainSight}',
  '8': 'CW{Caesar_AES_Stego}',
  '9': 'CW{HR_Leak_Protection_Fail}',
};

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [flagInput, setFlagInput] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [solved, setSolved] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const challenge = mockChallenges.find(c => c.id === id);
  
  const hints = id ? challengeHints[id] || [] : [];

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Требуется авторизация",
        description: "Для доступа к заданиям необходимо войти в систему",
        variant: "destructive",
      });
      navigate('/login?returnUrl=/ctf/challenge/' + id);
    }
  }, [user, isLoading, navigate, id]);

  useEffect(() => {
    if (user && !startTime && !solved) {
      const now = new Date();
      setStartTime(now);
      
      const interval = setInterval(() => {
        const currentTime = new Date();
        const elapsed = Math.floor((currentTime.getTime() - now.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
      
      setTimerInterval(interval);
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [user, startTime, solved, timerInterval]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmitFlag = () => {
    if (!flagInput.trim()) {
      toast({
        title: "Пустое поле",
        description: "Введите флаг перед отправкой",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    setTimeout(() => {
      const correctFlag = id ? challengeFlags[id] : '';
      
      if (flagInput.trim() === correctFlag) {
        if (timerInterval) {
          clearInterval(timerInterval);
        }
        
        setSolved(true);
        toast({
          title: "Поздравляем!",
          description: "Вы успешно решили задание!",
          variant: "default",
        });
      } else {
        toast({
          title: "Неверный флаг",
          description: "Попробуйте еще раз",
          variant: "destructive",
        });
      }
      
      setSubmitting(false);
    }, 1000);
  };

  const handleNextHint = () => {
    if (currentHint < hints.length - 1) {
      setCurrentHint(prev => prev + 1);
      
      toast({
        title: "Новая подсказка",
        description: "Подсказка разблокирована!",
      });
    } else {
      toast({
        title: "Подсказки исчерпаны",
        description: "Больше подсказок нет, попробуйте решить задание",
        variant: "default",
      });
    }
  };

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
    return null;
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-cyberdark-900 flex flex-col">
        <Navbar />
        <div className="pt-20 flex-grow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">Задание не найдено</h1>
            <p className="text-gray-300 mb-8">Запрашиваемое задание не существует или было удалено</p>
            <Link to="/ctf">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Вернуться на CTF платформу
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyberdark-900 flex flex-col">
      <Navbar />
      
      <div className="pt-20 flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Link to={`/ctf/category/${challenge.category}`} className="text-cyberblue-400 hover:text-cyberblue-300 flex items-center">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Назад к кейсам
            </Link>
          </div>
          
          <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-cyberdark-700 text-cyberblue-400 text-xs font-medium px-2.5 py-0.5 rounded">
                    Кейс #{challenge.id}
                  </div>
                  <div className="bg-cyberdark-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded">
                    {challenge.category === 'web' && 'Веб-безопасность'}
                    {challenge.category === 'crypto' && 'Криптография'}
                    {challenge.category === 'osint' && 'OSINT'}
                    {challenge.category === 'steganography' && 'Стеганография'}
                    {challenge.category === 'reverse-engineering' && 'Реверс-инжиниринг'}
                    {challenge.category === 'forensics' && 'Форензика'}
                    {challenge.category === 'pwn' && 'PWN'}
                    {challenge.category === 'programming' && 'Программирование'}
                    {challenge.category === 'network' && 'Сетевая безопасность'}
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">{challenge.solvedBy} решили</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Trophy className="w-4 h-4 mr-1" />
                    <span className="text-sm">{challenge.points} очков</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`text-xs font-medium px-2 py-1 rounded-full border
                    ${challenge.difficulty === 'beginner' ? 'bg-green-500/20 text-green-500 border-green-500/30' : ''}
                    ${challenge.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : ''}
                    ${challenge.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : ''}
                    ${challenge.difficulty === 'expert' ? 'bg-red-500/20 text-red-500 border-red-500/30' : ''}
                  `}>
                    {challenge.difficulty === 'beginner' && 'Начальный'}
                    {challenge.difficulty === 'intermediate' && 'Средний'}
                    {challenge.difficulty === 'advanced' && 'Продвинутый'}
                    {challenge.difficulty === 'expert' && 'Эксперт'}
                  </div>
                  
                  <div className="bg-cyberdark-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(elapsedTime)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              {challenge.tags.map((tag) => (
                <span key={tag} className="inline-block bg-cyberdark-700 text-gray-300 text-xs px-2.5 py-0.5 rounded mr-2 mb-2">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="bg-cyberdark-700 p-4 rounded-md mb-6 text-gray-300">
              <p>{challenge.description}</p>
              
              {challenge.id === '1' && (
                <>
                  <p className="mt-4">Формат флага: CTF{"{...}"}</p>
                </>
              )}
              
              {(challenge.id === '3' || challenge.id === '7' || challenge.id === '8' || challenge.id === '9') && (
                <>
                  <p className="mt-4">Формат флага: CW{"{...}"}</p>
                </>
              )}
            </div>
            
            {solved && (
              <div className="bg-green-900/20 border border-green-700 rounded-md p-4 mb-6 flex items-start">
                <CheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-green-500 font-semibold mb-1">Задание выполнено!</h3>
                  <p className="text-gray-300">Поздравляем! Вы успешно решили задание и получили {challenge.points} очков.</p>
                  <p className="text-gray-400 text-sm mt-2">Время решения: {formatTime(elapsedTime)}</p>
                </div>
              </div>
            )}
            
            {!solved && (
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Введите флаг (например, CTF{fl4g_h3r3} или CW{fl4g_h3r3})"
                    className="bg-cyberdark-700 border-cyberdark-600 pl-10"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitFlag();
                      }
                    }}
                  />
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <Button 
                  disabled={submitting}
                  onClick={handleSubmitFlag}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Проверка...
                    </>
                  ) : (
                    "Отправить флаг"
                  )}
                </Button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700 mb-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <ShieldAlert className="w-5 h-5 mr-2 text-cyberblue-400" />
                  Задание
                </h2>
                
                <div className="bg-cyberdark-700 p-4 rounded-md text-gray-300">
                  {/* Для веб-задания (Phantom Vault) */}
                  {challenge.id === '1' && (
                    <>
                      <p className="mb-4">Это задание требует эксплуатации уязвимости в реализации JWT веб-приложения Phantom Vault.</p>
                      
                      <p className="mb-4">Ваши задачи:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Проанализировать механизм аутентификации приложения</li>
                        <li>Выявить уязвимости в реализации JWT</li>
                        <li>Использовать уязвимость для получения доступа администратора</li>
                        <li>Извлечь флаг из панели администратора</li>
                      </ul>
                      
                      <div className="mt-6 p-4 bg-cyberdark-800 rounded-md">
                        <p className="font-medium mb-2">Функции приложения Phantom Vault:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Система входа и регистрации пользователей</li>
                          <li>Защищенная панель пользователя</li>
                          <li>Панель администратора с доступом к конфиденциальной информации</li>
                        </ul>
                      </div>
                      
                      <p className="mt-4">Найдите уязвимость в реализации JWT и используйте ее для доступа к панели администратора.</p>

                      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                          href="https://cloud.mail.ru/public/ip9t/ajXd2ZLbp" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center px-4 py-2 bg-cyberblue-600 text-white rounded-md hover:bg-cyberblue-700 transition-colors w-full sm:w-auto justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Скачать архив
                        </a>
                      </div>
                    </>
                  )}
                  
                  {/* Для первого задания криптографии (Утечка данных CyberWhale: Тайна зашифрованного чата) */}
                  {challenge.id === '3' && (
                    <>
                      <p className="mb-4">Ваша команда по кибербезопасности расследует утечку данных из компании CyberWhale. Вам удалось перехватить логи чата, который, предположительно, содержит информацию об утечке. Сообщения в чате зашифрованы.</p>
                      
                      <p className="mb-4">В зашифрованных сообщениях один из участников оставил подсказку: "Ключ — в нашей команде, точнее, в её имени. Помни, что алфавит цикличен."</p>
                      
                      <div className="bg-cyberdark-800 p-4 rounded-md mb-4">
                        <p className="text-sm text-gray-400 mb-1">Перехваченное сообщение:</p>
                        <p className="text-cyberblue-400 font-mono">Khoor#Zruog#43#Fkdw#lv#khuh1#Fkhuv2#CW{"SecretFound"}</p>
                      </div>
                      
                      <p className="mb-4">Цель: Расшифровать перехваченное сообщение, используя подсказку, и найти флаг в формате CW{"{...}"}.</p>
                    </>
                  )}
                  
                  {/* Для второго задания криптографии (Утечка данных CyberWhale: Зашифрованный архив) */}
                  {challenge.id === '7' && (
                    <>
                      <p className="mb-4">Ваша команда получила доступ к зашифрованному архиву, который предположительно содержит важную информацию о деятельности компании CyberWhale. Архив был найден на компрометированном сервере, и его содержимое защищено паролем.</p>
                      
                      <p className="mb-4">Анализируя метаданные архива, вы обнаружили следующее:</p>
                      <ol className="list-decimal pl-5 mb-4 space-y-1">
                        <li>Архив содержит один файл с названием secret.txt.</li>
                        <li>Пароль для распаковки архива был сгенерирован на основе фразы, связанной с компанией CyberWhale.</li>
                        <li>Вместе с архивом был найден текстовый файл hint.txt, содержащий подсказку.</li>
                      </ol>
                      
                      <div className="bg-cyberdark-800 p-4 rounded-md mb-4">
                        <p className="text-sm text-gray-400 mb-1">Содержимое файла hint.txt:</p>
                        <p>Пароль представляет собой комбинацию названия компании и цифры.</p>
                        <p>Цифра представляет собой сумму значений в формате ASCII первых трех букв названия компании.</p>
                      </div>
                      
                      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                          href="https://cloud.mail.ru/public/DMbD/FVSq8QsaK" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center px-4 py-2 bg-cyberblue-600 text-white rounded-md hover:bg-cyberblue-700 transition-colors w-full sm:w-auto justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Скачать архив
                        </a>
                      </div>
                      
                      <p className="mt-4">Цель: Расшифруйте архив, извлеките содержимое файла secret.txt и найдите флаг в формате CW{"{...}"}.</p>
                    </>
                  )}
                  
                  {/* Для третьего задания криптографии (Эхо Прошлого: Завещание в Битах) */}
                  {challenge.id === '8' && (
                    <>
                      <p className="mb-4">Вы - команда исследователей, получившая доступ к старому жесткому диску, принадлежавшему эксцентричному криптографу, недавно покинувшему этот мир. По слухам, он спрятал свое состояние, зашифровав информацию о его местонахождении в своих исследованиях. На диске обнаружены файлы с обрывками заметок и подозрительным сетевым трафиком. Ваша задача - собрать воедино все улики, расшифровать сообщения и найти спрятанное завещание.</p>
                      
                      <p className="mb-4">Формат флага: CW{"{...}"}</p>
                      <p className="mb-4">Сложность: Продвинутый</p>
                      
                      <p className="mb-4">Навыки: Анализ сетевого трафика (Wireshark), криптография (AES, шифр Цезаря), стеганография, base64, работа с командной строкой.</p>
                      
                      <div className="bg-cyberdark-800 p-4 rounded-md mb-4">
                        <p className="font-medium mb-2">Предоставляемые файлы:</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>notes.txt: Текстовый файл с обрывками заметок.</li>
                          <li>encrypted_image.png: Зашифрованное изображение.</li>
                          <li>traffic.pcapng: Дамп сетевого трафика Wireshark.</li>
                        </ol>
                      </div>
                      
                      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                          href="https://cloud.mail.ru/public/cFib/6dkAnZzfo" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center px-4 py-2 bg-cyberblue-600 text-white rounded-md hover:bg-cyberblue-700 transition-colors w-full sm:w-auto justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Скачать архив
                        </a>
                      </div>
                    </>
                  )}

                  {/* Для веб-задания - HR-портал CyberWolf Corp: SQL-инъекция */}
                  {challenge.id === '9' && (
                    <>
                      <p className="mb-4">Вы получили доступ к внутреннему HR-порталу компании CyberWolf Corp. Система позволяет искать сотрудников по имени, но администраторы уверены, что в ней есть критическая уязвимость, позволяющая получить доступ к конфиденциальным данным.</p>
                      
                      <p className="mb-4">Ваши задачи:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Проанализировать механизм поиска сотрудников</li>
                        <li>Выявить уязвимости в обработке входных данных</li>
                        <li>Использовать уязвимость для доступа к конфиденциальной информации</li>
                        <li>Найти скрытый флаг в системе</li>
                      </ul>
                      
                      <div className="mt-6 p-4 bg-cyberdark-800 rounded-md">
                        <p className="font-medium mb-2">Функции HR-портала:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Поиск сотрудников по имени</li>
                          <li>Отображение основной информации о сотрудниках</li>
                          <li>База данных с конфиденциальной информацией</li>
                        </ul>
                      </div>
                      
                      <div className="mt-6 p-4 bg-cyberdark-800 rounded-md">
                        <p className="font-medium mb-2">Инструкция по запуску:</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Распакуйте архив в удобное место</li>
                          <li>Перейдите в распакованную папку</li>
                          <li>Запустите веб-сервер командой: <code className="bg-cyberdark-900 px-2 py-1 rounded">php -S 0.0.0.0:8000</code></li>
                          <li>Откройте в браузере: <code className="bg-cyberdark-900 px-2 py-1 rounded">http://localhost:8000</code></li>
                        </ol>
                      </div>

                      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                          href="https://cloud.mail.ru/public/NGcQ/FGdbzMBa9" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center px-4 py-2 bg-cyberblue-600 text-white rounded-md hover:bg-cyberblue-700 transition-colors w-full sm:w-auto justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Скачать архив
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Инструкция для веб-задания (Phantom Vault) */}
              {challenge.id === '1' && (
                <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700">
                  <h2 className="text-xl font-bold text-white mb-4">Инструкция по развертыванию</h2>
                  
                  <div className="bg-cyberdark-700 p-4 rounded-md text-gray-300">
                    <h3 className="font-semibold text-lg mb-2">1. Подготовка системы (Kali Linux / Ubuntu):</h3>
                    <p className="mb-2">Убедитесь, что установлены Docker и Python3:</p>
                    
                    <div className="bg-cyberdark-800 p-3 rounded-md mb-4 font-mono text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">bash</span>
                      </div>
                      <code className="text-cyan-400">sudo apt update && sudo apt install -y docker.io python3 python3-pip</code>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">2. Запуск CTF-окружения:</h3>
                    <ol className="list-decimal pl-5 space-y-3">
                      <li>
                        <p>Распакуйте архив (phantom_vault.zip):</p>
                        <div className="bg-cyberdark-800 p-3 rounded-md my-2 font-mono text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">bash</span>
                          </div>
                          <code className="text-cyan-400">unzip phantom_vault.zip -d ~/phantom_vault && cd ~/phantom_vault</code>
                        </div>
                      </li>
                      <li>
                        <p>Запустите Docker-контейнер:</p>
                        <div className="bg-cyberdark-800 p-3 rounded-md my-2 font-mono text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">bash</span>
                          </div>
                          <code className="text-cyan-400">docker-compose up -d --build</code>
                        </div>
                      </li>
                      <li>
                        <p>Проверьте, что сервер работает:</p>
                        <p className="mb-2">Откройте в браузере:</p>
                        <div className="bg-cyberdark-800 p-3 rounded-md my-2 font-mono text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">url</span>
                          </div>
                          <code className="text-cyan-400">http://localhost:5000</code>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              )}
              
              {/* Дополнительные ресурсы для веб-задания */}
              {challenge.id === '1' && (
                <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700 mt-6">
                  <h2 className="text-xl font-bold text-white mb-4">Дополнительные ресурсы</h2>
                  
                  <div className="bg-cyberdark-700 p-4 rounded-md text-gray-300">
                    <p>Вот несколько полезных ресурсов для работы с JWT:</p>
                    <ul className="list-disc pl-5 mt-3 space-y-2">
                      <li>
                        <a href="https://jwt.io" target="_blank" rel="noopener noreferrer" className="text-cyberblue-400 hover:text-cyberblue-300">JWT.io</a> - JWT декодер и отладчик
                      </li>
                      <li>
                        <a href="https://github.com/ticarpi/jwt_tool" target="_blank" rel="noopener noreferrer" className="text-cyberblue-400 hover:text-cyberblue-300">jwt_tool</a> - Инструмент для тестирования, подделки и манипуляции JWT
                      </li>
                      <li>
                        <a href="https://ctf.web.jwtdecoder" target="_blank" rel="noopener noreferrer" className="text-cyberblue-400 hover:text-cyberblue-300">jwt-decode</a> - ctf.web.jwtDecoder
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Дополнительные ресурсы для SQL-инъекции */}
              {challenge.id === '9' && (
                <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700 mt-6">
                  <h2 className="text-xl font-bold text-white mb-4">Дополнительные ресурсы</h2>
                  
                  <div className="bg-cyberdark-700 p-4 rounded-md text-gray-300">
                    <p>Вот несколько полезных ресурсов для работы с SQL-инъекциями:</p>
                    <ul className="list-disc pl-5 mt-3 space-y-2">
                      <li>
                        <a href="https://portswigger.net/web-security/sql-injection" target="_blank" rel="noopener noreferrer" className="text-cyberblue-400 hover:text-cyberblue-300">Portswigger SQL Injection</a> - Подробное руководство по SQL-инъекциям
                      </li>
                      <li>
                        <a href="https://owasp.org/www-community/attacks/SQL_Injection" target="_blank" rel="noopener noreferrer" className="text-cyberblue-400 hover:text-cyberblue-300">OWASP SQL Injection</a> - Описание атаки и методов защиты
                      </li>
                      <li>
                        <a href="https://www.sqlite.org/lang_expr.html" target="_blank" rel="noopener noreferrer" className="text-cyberblue-400 hover:text-cyberblue-300">SQLite Документация</a> - Справочник по SQLite, используемому в задании
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-cyberdark-800 rounded-lg p-6 border border-cyberdark-700 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Подсказки
                </h2>
                
                {!showHints ? (
                  <div className="text-center py-6">
                    <p className="text-gray-400 mb-4">Подсказки могут помочь вам в решении задания, но использование подсказок уменьшает количество получаемых очков.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowHints(true)}
                    >
                      Показать подсказки
                    </Button>
                  </div>
                ) : (
                  <div>
                    {hints.slice(0, currentHint + 1).map((hint, index) => (
                      <div 
                        key={index}
                        className="bg-cyberdark-700 p-3 rounded-md mb-3 text-gray-300 text-sm"
                      >
                        <p className="text-xs text-gray-400 mb-1">Подсказка {index + 1}</p>
                        <p>{hint}</p>
                      </div>
                    ))}
                    
                    {currentHint < hints.length - 1 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={handleNextHint}
                      >
                        Следующая подсказка
                      </Button>
                    )}
                    
                    {currentHint === hints.length - 1 && hints.length > 0 && (
                      <p className="text-xs text-gray-400 text-center mt-2">Больше подсказок нет</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatAssistant />
    </div>
  );
}
