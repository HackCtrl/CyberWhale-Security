param(
    [string]$taskId
)

if (-not $taskId) {
    Write-Host "Usage: .\\complete-task.ps1 -taskId <ID or filename>"
    exit 1
}

Write-Host "Задача завершена! Запускаю автоматизацию..."

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$tasksFile = Join-Path $root "..\TASKS_DB.json"

$activeDir = Join-Path $root "..\tasks\active"
$archiveDir = Join-Path $root "..\tasks\archive"

# Move matching task file from active to archive
$taskFile = Get-ChildItem -Path $activeDir -Filter "*${taskId}*" -File -ErrorAction SilentlyContinue | Select-Object -First 1
if ($null -eq $taskFile) {
    Write-Host "Не найден файл задачи в tasks/active для идентификатора $taskId"
} else {
    $dest = Join-Path $archiveDir $taskFile.Name
    Move-Item -Path $taskFile.FullName -Destination $dest -Force
    Write-Host "Перемещён файл: $($taskFile.Name) -> archive"
}

# Update TASKS_DB.json: set status completed for taskId if present
if (Test-Path $tasksFile) {
    $json = Get-Content $tasksFile -Raw | ConvertFrom-Json
    $found = $false
    foreach ($t in $json.tasks) {
        if ($t.id -eq $taskId -or $t.gantt_id -eq $taskId) {
            $t.status = 'completed'
            $t.completed_at = (Get-Date).ToString('yyyy-MM-dd')
            $found = $true
        }
    }
    if ($found) {
        $json | ConvertTo-Json -Depth 6 | Set-Content $tasksFile -Encoding UTF8
        Write-Host "Обновлён TASKS_DB.json"
    } else {
        Write-Host "Запись не найдена в TASKS_DB.json; пропускаю обновление базы."
    }
} else {
    Write-Host "TASKS_DB.json не найден"
}

# Update ROADMAP.md: simple placeholder update (user can implement richer logic)
$road = Join-Path $root "..\ROADMAP.md"
if (Test-Path $road) {
    $text = Get-Content $road -Raw
    $lines = $text -split "`n"
    for ($i=0; $i -lt $lines.Length; $i++) {
        if ($lines[$i] -match "^\|\s*${taskId}\s*\|") {
            $parts = $lines[$i] -split "\|"
            if ($parts.Length -ge 6) {
                $parts[3] = ' completed '
                $parts[4] = ' 100% '
                $lines[$i] = ($parts -join '|')
            }
        }
    }
    $lines -join "`n" | Set-Content $road -Encoding UTF8
    Write-Host "Обновлён ROADMAP.md (наивная замена)."
}

# Git commit and push
Push-Location $root\..
try {
    git add .
    git commit -m "task($taskId): complete via automation"
    git push
    Write-Host "Коммит и push выполнены."
} catch {
    Write-Host "Git commit/push завершился с ошибкой: $_"
}
Pop-Location

# Generate a minimal report
$reportDir = Join-Path $root "..\reports"
if (-not (Test-Path $reportDir)) { New-Item -ItemType Directory -Path $reportDir | Out-Null }
$reportFile = Join-Path $reportDir ("report_$(Get-Date -Format yyyyMMdd_HHmmss).md")
@"
# Отчёт по завершению задачи $taskId

Дата: $(Get-Date -Format yyyy-MM-dd HH:mm:ss)

Задача: $taskId

Действия: файл перемещён в archive, обновлён TASKS_DB.json и ROADMAP.md, произведён git commit.
"@ | Set-Content $reportFile -Encoding UTF8
Write-Host "Сформирован отчёт: $reportFile"
