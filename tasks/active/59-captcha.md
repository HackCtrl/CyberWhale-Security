---
local_id: "59"
title: "Captcha: reCAPTCHA backend + frontend integration"
status: done
percent: 100
completed: "2025-11-23"
assignee: ""
created: "2025-11-23"
tags:
  - backend
  - frontend
  - security
---

Цель: реализовать проверку reCAPTCHA на сервере и интегрировать её в форму регистрации на фронтенде.

Критерии приемки:
- Серверный модуль `verifyCaptcha(token)` использует `process.env.RECAPTCHA_SECRET_KEY`.
- Endpont регистрации `/api/auth/register` проверяет капчу и отклоняет запрос при провале.
- Фронтенд отправляет `captchaToken` при регистрации и обрабатывает ошибки капчи в UI.
- Создана ветка `work/59-captcha`, изменения закоммичены и запушены.

Шаги:
1. Перенести секретный ключ в `.env` (см. `.env.example`).
2. Обновить `server/captcha.ts` (сделано).
3. Проверить интеграцию с `client/src/components/ui/captcha.tsx` и `RegisterForm.tsx`.
4. Протестировать регистрацию вручную локально (в development можно включить `RECAPTCHA_BYPASS=1`).
5. Закоммитить и закрыть задачу (обновлено `TASKS_DB.json` и помечено как выполнено).

Примечания:
- В проде нужно установить `RECAPTCHA_SECRET_KEY` в окружение.
