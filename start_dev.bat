@echo off
echo Starting Django + Vue Development Environment
echo.

echo Starting Django Backend...
cd backend
start cmd /k "python manage.py runserver"

echo.
echo Starting Vue Frontend...
cd ../fronted
start cmd /k "npm run dev"

echo.
echo Development servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
pause