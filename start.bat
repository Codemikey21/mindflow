@echo off
title MindFlow - Iniciando...
color 0A

echo.
echo  ================================
echo       MINDFLOW - INICIANDO
echo  ================================
echo.

echo [1/3] Iniciando Backend Django...
start cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

timeout /t 3 /nobreak > nul

echo [2/3] Iniciando Frontend React...
start cmd /k "cd frontend && npm start"

timeout /t 3 /nobreak > nul

echo [3/3] Abriendo navegador...
start http://localhost:3000

echo.
echo  ================================
echo    MindFlow corriendo en:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo    Swagger:  http://localhost:8000/api/docs
echo  ================================
echo.
pause