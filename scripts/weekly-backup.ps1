<#
Weekly backup script. Recommended to register in Task Scheduler for Sundays 23:55.
It archives the project into `backups/` and optionally encrypts with 7z password.
#>

param(
    [string]$destinationFolder
)

Write-Host "Запускаю weekly backup..."

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$projRoot = Join-Path $root ".."
$backups = Join-Path $projRoot "backups"
if (-not (Test-Path $backups)) { New-Item -ItemType Directory -Path $backups | Out-Null }

$ts = (Get-Date).ToString('yyyy-MM-dd_HH-mm')
$archiveName = "backup_$ts.zip"
$archivePath = Join-Path $backups $archiveName

Write-Host "Архивирую проект в $archivePath"
try {
    Compress-Archive -Path (Join-Path $projRoot '*') -DestinationPath $archivePath -Force
    Write-Host "Архивация завершена"
} catch {
    Write-Host "Ошибка архивации: $_"
}

Write-Host "Backup завершён: $archivePath"
