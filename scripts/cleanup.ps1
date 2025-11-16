param([switch]$Run)

# Простая и надёжная версия скрипта очистки
# Определить корень репозитория (родитель папки scripts)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$root = Split-Path -Parent $scriptDir

# Перемещения: source -> destination
$moves = @(
    @{ src = Join-Path $root 'attached_assets'; dest = Join-Path $root 'docs\attached_assets' }
)

# Удаления
$deletes = @(
    Join-Path $root 'client\public\test-challenge.json'
)

Write-Output 'Project cleanup script — dry-run mode'
Write-Output ''
Write-Output 'Planned moves:'
foreach ($m in $moves) { Write-Output (" - Move: " + $m.src + " -> " + $m.dest) }
Write-Output ''
Write-Output 'Planned deletions:'
foreach ($f in $deletes) { Write-Output (" - Delete: " + $f) }

if (-not $Run) {
    Write-Output ''
    Write-Output 'Dry-run only. To perform changes run:'
    Write-Output '    .\scripts\cleanup.ps1 -Run'
    exit 0
}

Write-Output ''
Write-Output 'Running cleanup...'

$timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$backup = Join-Path $root ("cleanup_backup_$timestamp")
New-Item -Path $backup -ItemType Directory | Out-Null

foreach ($m in $moves) {
    if (Test-Path $m.src) {
        Write-Output ("Moving " + $m.src + " -> " + $m.dest)
        New-Item -ItemType Directory -Force -Path (Split-Path $m.dest) | Out-Null
        Move-Item -Path $m.src -Destination $m.dest -Force
        New-Item -ItemType Directory -Force -Path (Join-Path $backup (Split-Path $m.src -Leaf)) | Out-Null
    } else {
        Write-Output ("Skip move (not found): " + $m.src)
    }
}

foreach ($f in $deletes) {
    if (Test-Path $f) {
        Write-Output ("Backing up and deleting " + $f)
        Copy-Item -Path $f -Destination $backup -Force
        Remove-Item -Path $f -Force
    } else {
        Write-Output ("Skip delete (not found): " + $f)
    }
}

Write-Output ("Cleanup complete. Backup created at: " + $backup)
