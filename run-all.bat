@echo off
echo Starting RentEase PRO Full-Stack Ecosystem...
start "RentEase Backend API (Port 5000)" cmd /k "cd /d %~dp0server && npm start"
start "RentEase Client (Port 5173)" cmd /k "cd /d %~dp0client && npm run dev"
echo Both services launched in separate windows!
echo Customer Web: http://localhost:5173
echo Admin Panel:  http://localhost:5173/admin/login
echo Backend API:  http://localhost:5000/api/health
