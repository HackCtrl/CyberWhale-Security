# Tracker Spec — Professional Task Tracker for CyberWhale

Цель: построить профессиональную систему управления задачами и контроля качества, которая позволит управлять разработкой продукта, отслеживать прогресс, фиксировать доказательства завершения работы и вести прозрачную историю изменений.

---

## 1. Ключевые принципы
- End-to-end управление задачей: каждая задача — от идеи до архива с обязательным отчётом при закрытии.
- Роли и права: Admin, Manager, Developer, QA.
- Валидация и доказательства: нельзя закрыть задачу без отчёта и доказательств (ссылки / скриншоты / файлы).
- История и прозрачность: полный audit log всех действий.

---

## 2. Основные сущности (Data model)

- Task
  - id: string (локальный двузначный формат, например `01`)
  - title: string
  - description: markdown
  - epic: string
  - priority: enum (low, medium, high, critical)
  - status: enum (backlog, todo, in-progress, review, accepted, done, archived)
  - percent_complete: number (0-100)
  - estimate_days: number
  - assignee: userId | null
  - reporter: userId
  - tags: string[]
  - created_at, updated_at, due_date
  - git_branch: string (suggested branch name)
  - related_pr: string | null

- Report (обязателен для перехода в accepted/done)
  - id
  - task_id
  - author (userId)
  - summary: markdown
  - checklist: [{ id, text, done, assignee? }]
  - evidence_links: string[] (URL)
  - attachments: [file meta]
  - time_spent_hours: number
  - metrics: key/value (например perf/coverage)
  - created_at

- User
  - id, name, email, role

- AuditLog
  - id, entity (task/report), action, userId, before, after, timestamp

---

## 3. Workflow (recommended)

1. Создание задачи (Backlog)
2. Планирование → перевод в To Do (назначение, estimate)
3. Взять в работу → In Progress (assignee начинает работу)
4. Готово для проверки → Review (assignee заполняет Report и прикрепляет доказательства)
5. QA/Reviewer проверяет Report:
   - Accept → Accepted (или автоматически переводится в Done по правилам)
   - Request Changes → возвращается в In Progress с комментариями
6. После Accepted менеджер архивирует/закрывает задачу (Archived)

Правило: нельзя перевести задачу в Accepted/Done без созданного Report (валидация на бэкенде).

---

## 4. UI / UX — основные экраны и поведение

- Board (Kanban)
  - Колонки: Backlog, To Do, In Progress, Review, Accepted/Done, Archived
  - Drag&drop карточек с сохранением статуса
  - Быстрый фильтр по epic, assignee, priority, tags

- Task modal / page
  - Полный markdown‑редактор описания
  - Чеклист задач (встроенный, с возможностью назначать пункты)
  - Поля: estimate, due_date, assignee, priority, git_branch
  - Кнопки: Create branch, Link PR, Export to Markdown

- Report modal (формирование доказательства готовности)
  - Шаблон отчёта: summary, checklist, ссылки на PR/демо, загрузка файлов (скриншотов), поле для времени
  - Валидация: обязательно хотя бы одно доказательство (ссылка или файл) и заполненный summary
  - Поддержка drag&drop файлов и preview изображений

- Review panel
  - Просмотр отчёта, комментарии, кнопки Accept / Request changes
  - При accept — опционально выбрать «close PR» / «create release note»

- Audit / Activity feed
  - Хронологический журнал по задаче: изменения статусов, отчёты, комментарии

---

## 5. Backend API (high level)

- POST /api/tasks
- GET /api/tasks[?filter]
- GET /api/tasks/:id
- PUT /api/tasks/:id
- POST /api/tasks/:id/report
- GET /api/tasks/:id/reports
- POST /api/tasks/:id/attachments
- POST /api/tasks/:id/move (для drag&drop, перевод статуса)
- GET /api/activity?entity=task&id=:id

Все изменения логируются в AuditLog.

---

## 6. Validation & Security

- Авторизация: role‑based (Admin/Manager/Developer/QA)
- Backend‑валидация: нельзя закрыть задачу без Report
- Attachments: лимиты размеров и список допустимых типов (jpg,png,pdf,zip)
- E2E проверка: smoke тесты на create→report→review→accept

---

## 7. Acceptance Criteria (MVP трекера)

1. Board отображает задачи, drag&drop работает и сохраняет статусы.
2. Можно создать задачу, назначить исполнителя и estimate.
3. Исполнитель не может пометить задачу как Done без заполненного отчёта с доказательством.
4. Reviewer может принимать или запрашивать доработки, и история действий сохраняется.
5. Файлы можно загружать и просматривать, ссылки сохраняются.
6. Есть экспорт задач в Markdown/CSV.

---

## 8. Roadmap реализации (приблизительно)

- Week 1: Spec final, DB schema, backend scaffold, simple API (tasks CRUD)
- Week 2: Attachments, Report model, validation, unit tests
- Week 3: Frontend Kanban, Task modal, Report modal (local state save)
- Week 4: Review workflow, Audit log, export, E2E tests, Dockerfile, deploy

---

## 9. Notes & next steps
- Решить: локальное хранение файлов vs S3 (для MVP — локально в `storage/tasks/`)
- Решить: интеграция уведомлений (Telegram/email) в фазе 2
- После согласования спеков — приступаем к реализации API и фронтенда

---

Файл с этим документом будет жить в `docs/TRACKER_SPEC.md`. В следующем коммите подготовлю начальную миграцию и skeleton `server/tasks.ts`.
