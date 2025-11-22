param(
    [string]$backupName = $(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')
)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$proj = Join-Path $root ".." | Resolve-Path
$proj = Join-Path $root ".."

$backupDir = Join-Path $proj "backups"
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
$archivePath = Join-Path $backupDir ("${backupName}.zip")
Compress-Archive -Path (Join-Path $proj '*') -DestinationPath $archivePath -Force
Write-Host "Backup created: $archivePath"

Push-Location $proj
try {
    git add .
    git commit -m "chore: backup $backupName"
    git push
} catch {
    Write-Host "Commit/push failed or no changes"
}
Pop-Location
