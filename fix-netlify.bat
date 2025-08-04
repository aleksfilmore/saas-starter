@echo off
echo Deleting problematic files...

del /f "babel.config.js" 2>nul
if not exist "babel.config.js" echo Successfully deleted babel.config.js

rmdir /s /q "app\(marketing)" 2>nul
if not exist "app\(marketing)" echo Successfully deleted marketing directory

echo.
echo Running git commands...
git add -A
git commit -m "FORCE DELETE: Remove babel.config.js and marketing pages - Netlify fix"
git push origin main

echo.
echo Done! Check Netlify for new build.
pause
