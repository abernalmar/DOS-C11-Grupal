@echo off
echo Copiando el archivo .env.docker a .env...
copy /Y .env.docker .env


echo Iniciando docker
docker compose up -d

echo Iniciando npm install
start npm install

:: Obtén la ruta de PowerShell
FOR /F "tokens=*" %%i IN ('where powershell') DO SET POWERSHELL_PATH=%%i


echo  Configurando PowerShell como shell de script para npm
CALL npm config set script-shell "%POWERSHELL_PATH%"

echo Ejecutando PowerShell como administrador y habilitando la ejecución de scripts npm en powershell
powershell -Command "Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force"
