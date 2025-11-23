# Создаёт zip-архив текущего репозитория (без node_modules), сохраняет в backups/, делает git commit и push.
Param(
    [string]$Message = "chore: daily backup and progress snapshot"
)

$root = Resolve-Path -Path "..\..\"
Set-Location $root

$ts = Get-Date -Format "yyyyMMdd_HHmmss"
$dest = Join-Path -Path "$PWD\backups" -ChildPath "backup_$ts.zip"
if (-not (Test-Path "$PWD\backups")) { New-Item -ItemType Directory -Path "$PWD\backups" | Out-Null }

# Исключаем node_modules и .git
$exclude = @('node_modules','dist','.git')
$temp = Join-Path $env:TEMP "cw_filelist_$ts.txt"
Get-ChildItem -Recurse -File | Where-Object { $exclude -notcontains $_.Directory.Name } | ForEach-Object { $_.FullName } | Set-Content -Path $temp

Compress-Archive -Path (Get-ChildItem -Recurse | Where-Object { $exclude -notcontains $_.Directory.Name }) -DestinationPath $dest -Force

Write-Host "Backup created: $dest"

# Git add/commit/push
git add -A
git commit -m $Message
git push
