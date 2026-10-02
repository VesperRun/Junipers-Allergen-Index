@echo off
cd /d "%~dp0"
echo Serving Juniper's Allergen Index at http://localhost:8080/
python -m http.server 8080
