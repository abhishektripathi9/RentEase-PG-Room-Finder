$ErrorActionPreference = "Stop"

# Auto-detect JAVA_HOME if not already set
if (-not $env:JAVA_HOME) {
    if (Test-Path "C:\Program Files\Java\jdk-22") {
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-22"
    } elseif (Test-Path "C:\Program Files\Java\jdk-21") {
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
    } else {
        $javaCmd = (Get-Command java -ErrorAction SilentlyContinue)
        if ($javaCmd) {
            $javaBin = Split-Path (Split-Path $javaCmd.Source)
            $env:JAVA_HOME = $javaBin
        }
    }
}

Write-Host "☕ Using JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host "🚀 Launching RentEase Spring Boot API on http://localhost:8080..." -ForegroundColor Green

& "$PSScriptRoot\.maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run $args
