# COPILOT — Инструкции для команды (рус.)

Короткая инструкция по работе с локальной системой задач и скриптами.

- `python ./scripts/automation/sync_gantt.py` — синхронизирует `Диаграмма Ганта (1).xlsx` с локальной БД и создаёт/обновляет задачи в `tasks/active`.
- `python ./scripts/automation/take_task.py <GANTT_ID>` — явно пометить задачу из Ганта как взятую (создаёт local ID и файл задачи).
- `powershell -ExecutionPolicy Bypass -File ./scripts/automation/complete_today.ps1` — архивирует проект в `backups/`, создаёт отчёт и коммитит изменения в git.

Рекомендации:
- Работаем только с `tasks/active` (одна активная задача у одного человека) — по завершении переносим в `tasks/archive` через git и скрипты.
- Локальные ID — двухзначные: `01`, `02`, ... (скрипты формируют автоматически).
