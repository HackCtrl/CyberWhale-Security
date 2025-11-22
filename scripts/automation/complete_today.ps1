param(
    [string]$commitMessage = "chore: daily: automatic daily backup and report"
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$proj = Join-Path $root ".." | Resolve-Path
$proj = Join-Path $root ".."

Write-Host "[automation] Запуск ежедневного завершения: отчёт, бэкап, commit+push"

$timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$backupDir = Join-Path $proj "backups"
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }

$archivePath = Join-Path $backupDir ("backup_$timestamp.zip")
Write-Host "Архивация проекта в $archivePath"
try {
    Compress-Archive -Path (Join-Path $proj '*') -DestinationPath $archivePath -Force
    Write-Host "Архивация прошла успешно"
} catch {
    Write-Host "Ошибка архивации: $_"
}

# Генерация простого отчёта
$reports = Join-Path $proj "reports"
if (-not (Test-Path $reports)) { New-Item -ItemType Directory -Path $reports | Out-Null }
$reportFile = Join-Path $reports ("daily_report_$timestamp.md")
@"
# Ежедневный отчёт автоматом

Дата: $(Get-Date -Format yyyy-MM-dd HH:mm:ss)

Действия: архив проекта -> $archivePath
"@ | Set-Content $reportFile -Encoding UTF8
Write-Host "Создан отчёт: $reportFile"

# Git commit and push
Push-Location $proj
try {
    git add .
    git commit -m $commitMessage
    git push
    Write-Host "Коммит и push выполнены"
} catch {
    Write-Host "Git commit/push завершился с ошибкой или нет изменений: $_"
}
Pop-Location

Write-Host "Ежедневное завершение выполнено."
