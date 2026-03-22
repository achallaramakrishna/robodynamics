$ErrorActionPreference = "Stop"
$pw = if ($env:PROD_SSH_PASS) { $env:PROD_SSH_PASS } else { "Jatni@752050" }
$hostName = "168.231.123.108"
$user = "root"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\web\app\ai-tutor\tutor\TutorClient.tsx" "$user@${hostName}:/tmp/TutorClient.tsx"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: TutorClient.tsx" }
& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L1_FAST_ADDITION.json" "$user@${hostName}:/tmp/VM_G4_L1_FAST_ADDITION.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: VM_G4_L1_FAST_ADDITION.json" }
& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\tmp_remote_ai_tutor_flow_and_l1_visuals_deploy.sh" "$user@${hostName}:/tmp/remote_ai_tutor_flow_and_l1_visuals_deploy.sh"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: remote deploy script" }