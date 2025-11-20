Write-Host "Запускаю начальный коммит и push (если репозиторий настроен)"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location (Join-Path $root "..")
try {
    git add .
    git commit -m "chore: full professional automation system initialized (tasks db, roadmap, reports, backups, auto-commits)"
    git push
    Write-Host "Initial commit & push executed."
} catch {
    Write-Host "Git commit/push failed or skipped: $_"
}
Pop-Location
