export interface RoadmapTask {
  id: string
  title: string
  epic: string
  month: number // 1..4
  sprint: number // 1..8
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
  percent: number
  estimate_days: number
  assignee?: string
  description?: string
  acceptance?: string[]
}

const tasks: RoadmapTask[] = [
  // Month 1 — infra & auth
  {
    id: '01',
    title: 'Настройка репозитория: lint, CI, скрипты',
    epic: 'Инфраструктура',
    month: 1,
    sprint: 1,
    status: 'done',
    percent: 100,
    estimate_days: 2,
    description: 'Привести репозиторий в порядок: ESLint, Prettier, Husky и базовый CI для проверки.',
    acceptance: ['CI запускается по push', 'линтеры настроены', 'документирован `npm run dev`']
  },
  {
    id: '02',
    title: 'SQLite: схема и миграции (users, tasks, challenges)',
    epic: 'Инфраструктура',
    month: 1,
    sprint: 1,
    status: 'todo',
    percent: 0,
    estimate_days: 2,
    description: 'Добавить лёгкую БД и скрипты миграций для основных сущностей.',
    acceptance: ['Файл `data/tasks.sqlite` создан', 'миграции запускаются', 'есть простой DB-хэлпер']
  },
  {
    id: '03',
    title: 'Аутентификация + email-подтверждение (6-значный код)',
    epic: 'Auth',
    month: 1,
    sprint: 1,
    status: 'in-progress',
    percent: 40,
    estimate_days: 3,
    description: 'Серверные и клиентские флоу для регистрации, входа и подтверждения почты.',
    acceptance: ['Пользователь регистрируется и получает код (dev-fallback)', 'endpoint верификации помечает пользователя']
  },
  {
    id: '04',
    title: 'Создание минимального профиля «Кит» при регистрации',
    epic: 'Auth',
    month: 1,
    sprint: 2,
    status: 'todo',
    percent: 0,
    estimate_days: 3,
    description: 'Генерировать минимальный профиль (аватар, шаблон характера) при первом входе.',
    acceptance: ['Объект профиля существует', 'плейсхолдер аватара отображается на странице профиля']
  },

  // Month 1 — tasks panel
  {
    id: '05',
    title: 'Панель задач: статическая визуализация (только чтение)',
    epic: 'Задачи',
    month: 1,
    sprint: 2,
    status: 'todo',
    percent: 0,
    estimate_days: 4,
    description: 'Фронтенд-страница с 4-месячной дорожной картой, карточками и прогрессом.',
    acceptance: ['Страница `/tasks/roadmap` доступна', 'карточки содержат заголовок, эпик, прогресс и краткие критерии']
  },

  // Month 2 — knowledge + AI basics
  {
    id: '06',
    title: 'База знаний: статьи в markdown + редактор',
    epic: 'Контент',
    month: 2,
    sprint: 3,
    status: 'todo',
    percent: 0,
    estimate_days: 6,
    description: 'Поддержка создания и просмотра статей в markdown.',
    acceptance: ['Список статей + просмотрщик', 'форма создания/редактирования сохраняет контент']
  },
  {
    id: '07',
    title: 'AI-ассистент: базовый чат (проксирование)',
    epic: 'AI',
    month: 2,
    sprint: 4,
    status: 'todo',
    percent: 0,
    estimate_days: 6,
    description: 'Простая чат-оболочка, проксирующая запросы к LLM (dev-ключ).',
    acceptance: ['Чат UI работает', 'на сервере есть proxy-эндпоинт', 'рекомендации по rate-limit']
  },

  // Month 3 — CTF basics
  {
    id: '08',
    title: 'CTF: список задач + статический раннер',
    epic: 'CTF',
    month: 3,
    sprint: 5,
    status: 'todo',
    percent: 0,
    estimate_days: 6,
    description: 'Минимальный UI для задач с проверкой флагов на статических проверках.',
    acceptance: ['Список задач', 'эндпоинт для отправки флага', 'обновление очков']
  },
  {
    id: '09',
    title: 'Система очков и отслеживание прогресса',
    epic: 'CTF',
    month: 3,
    sprint: 6,
    status: 'todo',
    percent: 0,
    estimate_days: 4,
    description: 'Лидерборд и профиль с прогрессом по задачам.',
    acceptance: ['Лидерборд работает', 'профиль показывает очки']
  },

  // Month 4 — polish & deploy
  {
    id: '10',
    title: 'Docker + pipeline деплоя',
    epic: 'Ops',
    month: 4,
    sprint: 7,
    status: 'todo',
    percent: 0,
    estimate_days: 6,
    description: 'Контейнеризация приложения и добавление CI/CD для деплоя.',
    acceptance: ['Есть Dockerfile', 'описан скрипт деплоя']
  },
  {
    id: '11',
    title: 'Продакшн-почта + инструкция по DKIM/SPF',
    epic: 'Ops',
    month: 4,
    sprint: 8,
    status: 'todo',
    percent: 0,
    estimate_days: 3,
    description: 'Настроить SendGrid/Postmark и задокументировать требования DNS.',
    acceptance: ['Пример использования `SENDGRID_API_KEY`', 'документы по SPF/DKIM']
  }
]

export default tasks;
