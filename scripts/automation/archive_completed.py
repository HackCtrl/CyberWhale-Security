#!/usr/bin/env python3
"""
Переносит завершённые задачи (status == 'done') из `tasks/active` в `tasks/archive`.
Обновляет `TASKS_DB.json` — помечает задачу как archived и сохраняет путь.

Запуск: python archive_completed.py
"""
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent.parent
DB_FILE = ROOT / "TASKS_DB.json"
ACTIVE = ROOT / "tasks" / "active"
ARCHIVE = ROOT / "tasks" / "archive"


def load_db():
    if not DB_FILE.exists():
        return {"schema_version": 1, "last_id": 0, "tasks": [], "local_mapping": {}}
    return json.loads(DB_FILE.read_text(encoding='utf-8'))


def save_db(db):
    DB_FILE.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding='utf-8')


def main():
    db = load_db()
    moved = []
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    for t in list(db.get('tasks', [])):
        if t.get('status') == 'done':
            local = t.get('local_id')
            # find corresponding file in active
            candidates = list(ACTIVE.glob(f"{local}-*.md"))
            for f in candidates:
                dest = ARCHIVE / f.name
                f.replace(dest)
                moved.append(str(dest))
            # mark task archived
            t['status'] = 'archived'
            t['archived_at'] = datetime.utcnow().isoformat()

    if moved:
        save_db(db)
        print(f"Moved {len(moved)} files to {ARCHIVE}")
    else:
        print("No tasks with status 'done' found to archive.")


if __name__ == '__main__':
    main()
