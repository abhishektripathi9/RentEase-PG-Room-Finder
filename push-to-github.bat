@echo off
echo ========================================================
echo   RentEase - Pushing project to GitHub repository
echo ========================================================
git push -u origin main
if %ERRORLEVEL% equ 0 (
    echo.
    echo [SUCCESS] Code successfully pushed to GitHub:
    echo   https://github.com/abhishektripathi9/RentEase-PG-Room-Finder
) else (
    echo.
    echo [NOTICE] If you haven't created the repository yet:
    echo   1. Visit: https://github.com/new
    echo   2. Repository name: RentEase-PG-Room-Finder
    echo   3. Leave it empty (do not initialize with README/.gitignore)
    echo   4. Click "Create repository"
    echo   5. Re-run this script!
)
echo.
pause
