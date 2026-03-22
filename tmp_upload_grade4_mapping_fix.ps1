$ErrorActionPreference = "Stop"
$pw = if ($env:PROD_SSH_PASS) { $env:PROD_SSH_PASS } else { "Jatni@752050" }
$hostName = "168.231.123.108"
$user = "root"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\web\lib\mindsutraCatalog.ts" "$user@${hostName}:/tmp/ms_mindsutraCatalog.ts"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: mindsutraCatalog.ts" }
& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapters.json" "$user@${hostName}:/tmp/ms_g4_chapters.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: grade_4 chapters.json" }
& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L1_FAST_ADDITION.json" "$user@${hostName}:/tmp/ms_VM_G4_L1_FAST_ADDITION.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: VM_G4_L1_FAST_ADDITION.json" }
