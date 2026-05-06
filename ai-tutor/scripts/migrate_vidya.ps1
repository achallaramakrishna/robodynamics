$base = "C:\roboworkspace\robodynamics\ai-tutor"
$vidyaApp = "$base\apps\vidya-tutor"
$vaaniApp = "$base\apps\vaani-tutor"

# Create directories
New-Item -ItemType Directory -Force -Path $vidyaApp | Out-Null
New-Item -ItemType Directory -Force -Path "$vidyaApp\app" | Out-Null
New-Item -ItemType Directory -Force -Path "$vidyaApp\components" | Out-Null
New-Item -ItemType Directory -Force -Path "$vidyaApp\lib" | Out-Null
New-Item -ItemType Directory -Force -Path "$vidyaApp\hooks" | Out-Null
New-Item -ItemType Directory -Force -Path "$vidyaApp\app\api" | Out-Null

# Copy boilerplate from vaani-tutor
Copy-Item -Path "$vaaniApp\package.json" -Destination $vidyaApp
Copy-Item -Path "$vaaniApp\tsconfig.json" -Destination $vidyaApp
Copy-Item -Path "$vaaniApp\tailwind.config.ts" -Destination $vidyaApp
Copy-Item -Path "$vaaniApp\postcss.config.js" -Destination $vidyaApp
Copy-Item -Path "$vaaniApp\next.config.mjs" -Destination $vidyaApp
Copy-Item -Path "$vaaniApp\next-env.d.ts" -Destination $vidyaApp

# Update package.json name and port
$pkg = Get-Content "$vidyaApp\package.json" -Raw
$pkg = $pkg -replace 'vaani-tutor', 'vidya-tutor'
$pkg = $pkg -replace '3001', '3002'
Set-Content -Path "$vidyaApp\package.json" -Value $pkg

# Update tsconfig.json to allow falling back to web/ for @/lib/db etc
$tsc = Get-Content "$vidyaApp\tsconfig.json" -Raw
$tsc = $tsc -replace '"@/\*": \["\./\*"\]', '"@/*": ["./*", "../../web/*"]'
Set-Content -Path "$vidyaApp\tsconfig.json" -Value $tsc

# MOVE the vidya domains (preventing duplicates in web)
Move-Item -Path "$base\web\components\vidya" -Destination "$vidyaApp\components\" -Force
Move-Item -Path "$base\web\app\vidya" -Destination "$vidyaApp\app\" -Force
Move-Item -Path "$base\web\app\api\vidya" -Destination "$vidyaApp\app\api\" -Force
Move-Item -Path "$base\web\hooks\usePyodide.ts" -Destination "$vidyaApp\hooks\" -Force
Get-ChildItem -Path "$base\web\lib" -Filter "vidya*.ts" | Move-Item -Destination "$vidyaApp\lib\" -Force

Write-Output "Migration complete."
