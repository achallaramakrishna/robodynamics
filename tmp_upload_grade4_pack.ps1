$ErrorActionPreference = "Stop"
$pw = if ($env:PROD_SSH_PASS) { $env:PROD_SSH_PASS } else { "Jatni@752050" }
$hostName = "168.231.123.108"
$user = "root"
$pscp = "C:\Program Files\PuTTY\pscp.exe"

& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapters.json" "$user@${hostName}:/tmp/ms_g4_chapters.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: grade_4 chapters.json" }

& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L1_FAST_ADDITION.json" "$user@${hostName}:/tmp/ms_VM_G4_L1_FAST_ADDITION.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: VM_G4_L1_FAST_ADDITION.json" }

& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L2_TABLES_11_TO_19.json" "$user@${hostName}:/tmp/ms_VM_G4_L2_TABLES_11_TO_19.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: VM_G4_L2_TABLES_11_TO_19.json" }

& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L3_DOUBLING_HALVING.json" "$user@${hostName}:/tmp/ms_VM_G4_L3_DOUBLING_HALVING.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: VM_G4_L3_DOUBLING_HALVING.json" }

& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L4_MULT_BY_11.json" "$user@${hostName}:/tmp/ms_VM_G4_L4_MULT_BY_11.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: VM_G4_L4_MULT_BY_11.json" }

& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L5_SUBT_BORROW_FREE.json" "$user@${hostName}:/tmp/ms_VM_G4_L5_SUBT_BORROW_FREE.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: VM_G4_L5_SUBT_BORROW_FREE.json" }

& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L6_MULT_BY_5_25.json" "$user@${hostName}:/tmp/ms_VM_G4_L6_MULT_BY_5_25.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: VM_G4_L6_MULT_BY_5_25.json" }

& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L7_NEAR_100.json" "$user@${hostName}:/tmp/ms_VM_G4_L7_NEAR_100.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: VM_G4_L7_NEAR_100.json" }

& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L8_CRISS_CROSS_2DIG.json" "$user@${hostName}:/tmp/ms_VM_G4_L8_CRISS_CROSS_2DIG.json"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: VM_G4_L8_CRISS_CROSS_2DIG.json" }

& $pscp -batch -pw $pw "C:\roboworkspace\robodynamics\tmp_remote_grade4_pack_install.sh" "$user@${hostName}:/tmp/tmp_remote_grade4_pack_install.sh"
if ($LASTEXITCODE -ne 0) { throw "Upload failed: tmp_remote_grade4_pack_install.sh" }
