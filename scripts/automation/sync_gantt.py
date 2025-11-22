#!/usr/bin/env python3
"""Sync script: читает 'Диаграмма Ганта (1).xlsx', сопоставляет строки с Gantt ID,
создаёт локальные задачи (01, 02...) в `tasks/active`, обновляет `TASKS_DB.json` и `ROADMAP.md`.

Запуск: py -3 scripts/automation/sync_gantt.py
Требует: openpyxl
"""
from pathlib import Path
import json
from datetime import datetime

try:
    import openpyxl
except Exception:
    print('Требуется пакет openpyxl: py -3 -m pip install --user openpyxl')
    raise

ROOT = Path(__file__).resolve().parents[2]
GANTT = ROOT / 'Диаграмма Ганта (1).xlsx'
DB = ROOT / 'TASKS_DB.json'
TASKS_ACTIVE = ROOT / 'tasks' / 'active'
ROADMAP = ROOT / 'ROADMAP.md'


def load_db():
    if DB.exists():
        try:
            return json.loads(DB.read_text(encoding='utf-8'))
        except Exception as e:
            print('Ошибка чтения TASKS_DB.json:', e)
            return { 'schema_version':1, 'last_id':0, 'tasks':[], 'gantt_mapping':{}, 'local_mapping':{} }
    return { 'schema_version':1, 'last_id':0, 'tasks':[], 'gantt_mapping':{}, 'local_mapping':{} }


def save_db(j):
    DB.write_text(json.dumps(j, ensure_ascii=False, indent=2), encoding='utf-8')


def gen_local_id(n):
    return f"{n:02d}"


def slugify(s: str) -> str:
    s = s.lower()
    res = ''.join(c if c.isalnum() or c in '-_' else '-' for c in s)
    return res.strip('-')[:80]


def build_task_content(local_id, gantt_id, name, pct):
    lines = []
    lines.append(f"# ТЗ-{local_id}: {name}")
    lines.append("")
    lines.append(f"**Gantt ID**: {gantt_id}")
    lines.append(f"**Локальный ID**: {local_id}")
    lines.append(f"**Статус**: todo")
    lines.append(f"**% готовности**: {pct or 0}")
    lines.append("")
    lines.append("**Требования ИБ**: OWASP Top-10, HTTPS only, защита от brute-force, логирование попыток")
    lines.append("")
    lines.append("### Архитектура")
    lines.append("")
    lines.append("### API / DB изменения")
    lines.append("")
    lines.append("### Тесты (не менее 80% покрытия)")
    lines.append("")
    lines.append("### Критерии приёмки (Done-Definition)")
    return '\n'.join(lines)


def update_roadmap(db):
    # regenerate ROADMAP.md from db.tasks (simple table)
    lines = []
    lines.append('# Живая ROADMAP CyberWhale (автоматически синхронизируется)')
    lines.append('')
    lines.append('| Локальный ID | Gantt ID | Задача | Статус | % | Исполнитель | Дата завершения |')
    lines.append('|--------------:|:--------:|:------|:------:|---:|:-----------:|:---------------:|')
    for t in db.get('tasks', []):
        lines.append(f"| {t.get('local_id')} | {t.get('gantt_id') or ''} | {t.get('name')} | {t.get('status','todo')} | {int((t.get('percent') or 0)*100) if isinstance(t.get('percent'), float) else (t.get('percent') or 0)}% | {t.get('assignee','')} | {t.get('completed_at','')} |")
    ROADMAP.write_text('\n'.join(lines), encoding='utf-8')


def main():
    if not GANTT.exists():
        print('Excel файл не найден:', GANTT)
        return
    wb = openpyxl.load_workbook(GANTT, data_only=True)
    sheet = wb['Диаграмма Ганта'] if 'Диаграмма Ганта' in wb.sheetnames else wb.active

    db = load_db()
    last = db.get('last_id', 0)

    header_row = 8
    # iterate rows after header_row
    for row in sheet.iter_rows(min_row=header_row+1):
        # try columns: B - GANTT ID, C - name, H - percent
        try:
            gid = row[1].value if len(row) > 1 else None
            name = row[2].value if len(row) > 2 else None
            pct = row[7].value if len(row) > 7 else None
        except Exception:
            continue
        if not name:
            continue
        name = str(name).strip()
        gid_s = str(gid).strip() if gid is not None else None

        local_map = db.setdefault('local_mapping', {})
        local_id = None
        if gid_s and gid_s in local_map:
            local_id = local_map[gid_s]
        else:
            last += 1
            local_id = gen_local_id(last)
            if gid_s:
                local_map[gid_s] = local_id
            else:
                local_map[name] = local_id

        # ensure task file
        TASKS_ACTIVE.mkdir(parents=True, exist_ok=True)
        filename = TASKS_ACTIVE / f"{local_id}-{slugify(name)}.md"
        if not filename.exists():
            content = build_task_content(local_id, gid_s, name, pct)
            filename.write_text(content, encoding='utf-8')
            print('Created task file:', filename.name)

        # update db.tasks
        found = False
        for t in db.get('tasks', []):
            if t.get('local_id') == local_id:
                t.update({ 'gantt_id': gid_s, 'name': name, 'percent': pct or 0 })
                found = True
                break
        if not found:
            db.setdefault('tasks', []).append({ 'local_id': local_id, 'gantt_id': gid_s, 'name': name, 'percent': pct or 0, 'status':'todo' })

    db['last_id'] = last
    save_db(db)
    update_roadmap(db)
    print('Sync complete. last_id=', last)

if __name__ == '__main__':
    main()
