#!/usr/bin/env python3
"""
Явно пометить задачу из Ганта как взятую: создать local ID и файл задачи.
Usage: python take_task.py <GANTT_ID> [--title "Optional title override"]
"""
import sys
from pathlib import Path
import json
from datetime import datetime
import argparse
import re

ROOT = Path(__file__).resolve().parent.parent.parent
DB_FILE = ROOT / "TASKS_DB.json"
TASKS_DIR = ROOT / "tasks" / "active"
TEMPLATE_FILE = ROOT / "tasks" / "TASK_TEMPLATE.md"


def load_db():
    if not DB_FILE.exists():
        return {"schema_version": 1, "last_id": 0, "tasks": [], "local_mapping": {}}
    return json.loads(DB_FILE.read_text(encoding='utf-8'))


def save_db(db):
    DB_FILE.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding='utf-8')


def slugify(s: str):
    s = s.lower()
    s = re.sub(r"[^a-z0-9а-яё]+", "-", s)
    s = re.sub(r"-+", "-", s)
    return s.strip("-")


def create_task_file(local_id, gantt_id, title, percent=0):
    TASKS_DIR.mkdir(parents=True, exist_ok=True)
    slug = slugify(title)[:40]
    filename = TASKS_DIR / f"{local_id}-{slug}.md"
    created = datetime.utcnow().isoformat()
    if TEMPLATE_FILE.exists():
        tmpl = TEMPLATE_FILE.read_text(encoding='utf-8')
        content = tmpl.format(title=title, local_id=local_id, gantt_id=gantt_id or "", percent=percent or 0, created=created)
    else:
        content = f"---\ntitle: \"{title}\"\nlocal_id: {local_id}\ngantt_id: {gantt_id}\npercent: {percent}\ncreated: {created}\n---\n\n# {title}\n"
    filename.write_text(content, encoding='utf-8')
    return filename


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument('gantt_id')
    parser.add_argument('--title', default=None)
    args = parser.parse_args(argv)

    db = load_db()
    gid = str(args.gantt_id)
    if gid in db.get('local_mapping', {}):
        print(f"Gantt ID {gid} уже замаплен на local {db['local_mapping'][gid]}")
        return
    db['last_id'] = db.get('last_id', 0) + 1
    local = f"{db['last_id']:02d}"
    title = args.title or f"Задача {gid}"
    task = {"local_id": local, "gantt_id": gid, "title": title, "status": "todo", "percent": 0, "assignee": ""}
    db.setdefault('tasks', []).append(task)
    db.setdefault('local_mapping', {})[gid] = local
    save_db(db)
    file = create_task_file(local, gid, title, 0)
    print(f"Created task {file} with local id {local}")


if __name__ == '__main__':
    main()
