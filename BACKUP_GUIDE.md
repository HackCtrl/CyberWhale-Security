# Политика бэкапов CyberWhale (профессиональная ИБ-компания)

Правило 3-2-1 всегда соблюдаем.

Текущие копии:
1. GitHub (версионирование + удалённое хранение)
2. Рабочий SSD
3. Зашифрованная USB-флешка (VeraCrypt AES-256) — еженедельный бэкап каждое воскресенье

Скрипт бэкапа (Windows PowerShell):
```powershell
$src = "C:\Projects\CyberWhale"
$dest = "F:\Backup-CyberWhale-$(Get-Date -Format 'yyyy-MM-dd')"
robocopy $src $dest /MIR /R:3 /W:5 /LOG+:"F:\backup-log.txt"
# После копирования весь каталог упаковывается в VeraCrypt-контейнер (процесс за пределами этого скрипта).
```
