@echo off
REM Deploy L1 enrichment + no-repeat fix to prod
REM Server: 168.231.123.108 port 22
REM Usage: deploy_l1_fix.bat <username> <password>

set SERVER=168.231.123.108
set PORT=22
set PSCP="C:\Program Files\PuTTY\pscp.exe"
set PLINK="C:\Program Files\PuTTY\plink.exe"
set USER=%1
set PASS=%2

if "%USER%"=="" (
    set /p USER=Server username:
)
if "%PASS%"=="" (
    set /p PASS=Server password:
)

echo.
echo [1/5] Creating grade_4 content directory on server...
%PLINK% -ssh -P %PORT% -pw %PASS% %USER%@%SERVER% "mkdir -p /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter"

echo [2/5] Deploying VM_G4_L1_FAST_ADDITION.json (42 questions)...
%PSCP% -P %PORT% -pw %PASS% "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L1_FAST_ADDITION.json" %USER%@%SERVER%:/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/

echo [3/5] Deploying grade_4 chapters.json (course manifest)...
%PSCP% -P %PORT% -pw %PASS% "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapters.json" %USER%@%SERVER%:/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/

echo [4/5] Deploying backend fixes (no-repeat engine + questionPool fix)...
%PSCP% -P %PORT% -pw %PASS% "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\app\main.py" %USER%@%SERVER%:/opt/robodynamics/ai-tutor/tutor-api/app/
%PSCP% -P %PORT% -pw %PASS% "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\app\services\generic_course_engine.py" %USER%@%SERVER%:/opt/robodynamics/ai-tutor/tutor-api/app/services/

echo [5/5] Restarting tutor-api service...
%PLINK% -ssh -P %PORT% -pw %PASS% %USER%@%SERVER% "sudo systemctl restart tutor-api && sleep 3 && curl -s http://127.0.0.1:8091/ai-tutor-api/health | python3 -c 'import sys,json; h=json.load(sys.stdin); print(\"Health:\", h.get(\"ok\"), \"courses:\", len(h.get(\"courses\",[])))'  "

echo.
echo Done. Demo URL: https://robodynamics.in/vedic-math/grade-4
