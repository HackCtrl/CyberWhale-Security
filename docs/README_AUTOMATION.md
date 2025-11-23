# Automation — краткая документация

Файлы и назначение:

- `TASKS_DB.json` — machine-readable база задач (source of truth).
- `ROADMAP.md` — живой roadmap, генерируется из DB.
- `tasks/active/` — папка с активными задачами (один markdown-файл на задачу).
- `tasks/archive/` — архив завершённых задач (переносите вручную или скриптом после завершения).
- `scripts/automation/sync_gantt.py` — синхронизация с `Диаграмма Ганта (1).xlsx`.
- `scripts/automation/take_task.py` — пометить задачу как взятую вручную.
- `scripts/automation/complete_today.ps1` — сделать zip-резервную копию и закоммитить изменения.

Начало работы:

1. Установите зависимости: `powershell -File ./scripts/automation/install_requirements.ps1`
2. Запустите: `python ./scripts/automation/sync_gantt.py`
