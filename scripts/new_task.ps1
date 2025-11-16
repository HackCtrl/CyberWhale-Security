param(
  [string]$code = "",
  [string]$title = "new-task",
  [string]$assignee = "",
  [string]$start = "",
  [string]$end = ""
)

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Definition)
$indexPath = Join-Path $root "tasks\index.json"

if (-not (Test-Path $indexPath)) {
  Write-Error "tasks/index.json not found"
  exit 1
}

$index = Get-Content $indexPath -Raw | ConvertFrom-Json
$id = $index.nextId
$idStr = $id.ToString("D3")

$fileName = "${idStr}-${($title -replace "[^a-zA-Z0-9\-]","-").ToLower()}.md"
$filePath = Join-Path $root (Join-Path "tasks" $fileName)

$taskObj = [PSCustomObject]@{
  id = $idStr
  code = $code
  title = $title
  status = 'open'
  assignee = $assignee
  start = $start
  end = $end
  progress = 0
  tags = @()
}

$index.tasks += $taskObj
$index.nextId = $id + 1

$index | ConvertTo-Json -Depth 5 | Set-Content $indexPath -Encoding UTF8

@"
# $idStr — $title

- Код задачи (GANTT): `$code`
- ID (локальный): `$idStr`
- Статус: `open`
- Приоритет: `medium`
- Исполнитель: `$assignee`
- Дата начала: `$start`
- Дата окончания: `$end`

## Описание

Добавьте подробное описание задачи здесь.
"@ | Set-Content $filePath -Encoding UTF8

Write-Output "Created task: $filePath and updated index.json"
