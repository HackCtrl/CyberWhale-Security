#!/bin/bash
if [ -z "$1" ]; then
  echo "Usage: ./complete-task.sh <taskId>"
  exit 1
fi
TASKID=$1
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ACTIVE_DIR="$ROOT_DIR/tasks/active"
ARCHIVE_DIR="$ROOT_DIR/tasks/archive"

echo "Задача завершена! Запускаю автоматизацию..."

TASKFILE=$(ls "$ACTIVE_DIR" | grep "$TASKID" | head -n1)
if [ -n "$TASKFILE" ]; then
  mv "$ACTIVE_DIR/$TASKFILE" "$ARCHIVE_DIR/"
  echo "Перемещён файл: $TASKFILE -> archive"
else
  echo "Не найден файл задачи в tasks/active для идентификатора $TASKID"
fi

TASKS_DB="$ROOT_DIR/TASKS_DB.json"
if [ -f "$TASKS_DB" ]; then
  python3 - <<PY
import json,sys
f='''$TASKS_DB'''
with open(f,'r',encoding='utf-8') as fh:
    j=json.load(fh)
for t in j.get('tasks',[]):
    if str(t.get('id'))==str('$TASKID') or str(t.get('gantt_id'))==str('$TASKID'):
        t['status']='completed'
        t['completed_at']=''"$(date +%F)"''
        break
with open(f,'w',encoding='utf-8') as fh:
    json.dump(j,fh,ensure_ascii=False,indent=2)
print('Updated TASKS_DB.json')
PY
fi

cd "$ROOT_DIR"
git add .
git commit -m "task($TASKID): complete via automation" || echo "commit skipped"
git push || echo "push skipped"

REPORTS_DIR="$ROOT_DIR/reports"
mkdir -p "$REPORTS_DIR"
REPORT_FILE="$REPORTS_DIR/report_$(date +%Y%m%d_%H%M%S).md"
cat > "$REPORT_FILE" <<EOF
# Отчёт по завершению задачи $TASKID

Дата: $(date '+%Y-%m-%d %H:%M:%S')

Задача: $TASKID

Действия: файл перемещён в archive, обновлён TASKS_DB.json (наивно), произведён git commit (если доступен).
EOF

echo "Сформирован отчёт: $REPORT_FILE"
