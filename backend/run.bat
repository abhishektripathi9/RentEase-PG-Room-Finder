@echo off
setlocal

if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Java\jdk-22" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-22"
    ) else if exist "C:\Program Files\Java\jdk-21" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-21"
    )
)

echo [RentEase] Using JAVA_HOME: %JAVA_HOME%
echo [RentEase] Starting Spring Boot REST API on http://localhost:8080 ...

if exist "%~dp0target\rentease-api-1.0.0.jar" (
    "%JAVA_HOME%\bin\java.exe" -jar "%~dp0target\rentease-api-1.0.0.jar" %*
) else (
    "%~dp0\.maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run %*
)
