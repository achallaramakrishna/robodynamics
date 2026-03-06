$ErrorActionPreference='Stop'

function Normalize-Title([string]$s) {
  $t = $s -replace '\s+', ' '
  $t = $t.Trim()
  $t = $t.Replace([char]0x2018, "'")
  $t = $t.Replace([char]0x2019, "'")
  $t = $t.Replace([char]0x2013, "-")
  $t = $t.Replace([char]0x2014, "-")
  return $t
}

function SqlEscape([string]$s) {
  return ($s -replace "'", "''")
}

function Get-TitlesFromStandardContents([string]$psPath, [int]$need) {
  $text = & "C:\poppler\Library\bin\pdftotext.exe" -layout $psPath -
  $lines = $text -split "`n"
  $start = -1
  for($i=0; $i -lt $lines.Length; $i++) {
    if($lines[$i] -match '^\s*Contents\s*$') { $start = $i; break }
  }
  if($start -lt 0) { return @() }

  $titles = New-Object System.Collections.Generic.List[string]
  for($i=$start+1; $i -lt [Math]::Min($lines.Length, $start + 900); $i++) {
    $l = ($lines[$i] -replace '\f','').Trim()
    if([string]::IsNullOrWhiteSpace($l)) { continue }
    if($l -match '^(Foreword|Preface|Rationalisation|Answers/Hints|Answers|Appendix|Appendices|Bibliography|Constitution of India)\b') { continue }

    $m = [regex]::Match($l,'^(\d{1,2})\.\s+(.+?)\s+(\d{1,4})\s*$')
    if(!$m.Success) { $m = [regex]::Match($l,'^Chapter\s+(\d{1,2})\s+(.+?)\s+(\d{1,4})\s*$',[System.Text.RegularExpressions.RegexOptions]::IgnoreCase) }
    if(!$m.Success) { $m = [regex]::Match($l,'^Unit\s+(\d{1,2})\s+(.+?)\s+(\d{1,4})\s*$',[System.Text.RegularExpressions.RegexOptions]::IgnoreCase) }

    if($m.Success) {
      $title = Normalize-Title $m.Groups[2].Value
      if($title -match '^\d+\.') { continue }
      if($title -match '^Summary$') { continue }
      $titles.Add($title)
      if($titles.Count -ge $need) { break }
    }
  }
  return $titles
}

function Get-TitlesFromPhysicsContents([string]$psPath, [int]$need) {
  $text = & "C:\poppler\Library\bin\pdftotext.exe" -layout $psPath -
  $lines = $text -split "`n"
  $start = -1
  for($i=0; $i -lt $lines.Length; $i++) {
    if($lines[$i] -match '^\s*CONTENTS\s*$') { $start = $i; break }
  }
  if($start -lt 0) { return @() }

  $ti = (Get-Culture).TextInfo
  $titles = New-Object System.Collections.Generic.List[string]
  for($i=$start+1; $i -lt [Math]::Min($lines.Length, $start + 1200); $i++) {
    $l = ($lines[$i] -replace '\f','').Trim()
    if($l -match '^CHAPTER\s+(ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN|ELEVEN|TWELVE|THIRTEEN|FOURTEEN|FIFTEEN|SIXTEEN)\s*$') {
      for($j=$i+1; $j -lt [Math]::Min($lines.Length, $i+8); $j++) {
        $cand = ($lines[$j] -replace '\f','').Trim()
        if([string]::IsNullOrWhiteSpace($cand)) { continue }
        if($cand -match '^(\d+\.\d+|FOREWORD|RATIONALISATION|PREFACE|ANSWERS|APPENDICES|BIBLIOGRAPHY)') { continue }
        if($cand -match '^(CHAPTER\s+|Reprint)') { continue }
        $title = Normalize-Title ($ti.ToTitleCase($cand.ToLowerInvariant()))
        $titles.Add($title)
        break
      }
      if($titles.Count -ge $need) { break }
    }
  }
  return $titles
}

function Build-ImportSql {
  param(
    [string]$CourseName,
    [string]$ImportTag,
    [int]$CourseCategoryId,
    [string]$CourseDescription,
    [string]$ShortDescription,
    [string]$CourseLevel,
    [string]$GradeRange,
    [string]$Category,
    [System.Collections.Generic.List[object]]$Rows
  )

  $cn = SqlEscape $CourseName
  $it = SqlEscape $ImportTag
  $cd = SqlEscape $CourseDescription
  $sd = SqlEscape $ShortDescription
  $gr = SqlEscape $GradeRange
  $cat = SqlEscape $Category

  $sql = New-Object System.Collections.Generic.List[string]
  $sql.Add('USE robodynamics_db;')
  $sql.Add('SET SQL_SAFE_UPDATES=0;')
  $sql.Add('START TRANSACTION;')
  $sql.Add("SET @course_name='$cn';")
  $sql.Add("SET @import_tag='$it';")
  $sql.Add('INSERT INTO rd_courses (course_category_id,course_name,course_description,shortDescription,course_level,course_status,grade_range,category,is_featured,tier_level,tier_order,reviews_count,is_active)')
  $sql.Add("SELECT $CourseCategoryId,@course_name,'$cd','$sd','$CourseLevel','ACTIVE','$gr','$cat',0,'beginner',1,0,1")
  $sql.Add('WHERE NOT EXISTS (SELECT 1 FROM rd_courses WHERE course_name=@course_name);')
  $sql.Add('SET @course_id=(SELECT course_id FROM rd_courses WHERE course_name=@course_name ORDER BY course_id DESC LIMIT 1);')
  $sql.Add('DELETE d FROM rd_course_session_details d JOIN rd_course_sessions s ON s.course_session_id=d.course_session_id WHERE s.course_id=@course_id AND COALESCE(s.session_description,'''')=@import_tag;')
  $sql.Add('DELETE FROM rd_course_sessions WHERE course_id=@course_id AND COALESCE(session_description,'''')=@import_tag;')

  for($i=0; $i -lt $Rows.Count; $i++) {
    $sid = $i + 1
    $row = $Rows[$i]
    $fileSql = SqlEscape $row.File
    $sessionTitle = "Chapter ${sid}: $($row.Title)"
    $sessionTitleSql = SqlEscape $sessionTitle
    $sql.Add("INSERT INTO rd_course_sessions (course_id,session_id,session_title,creation_date,version,completed,progress,session_type,session_description,tier_level,tier_order) VALUES (@course_id,$sid,'$sessionTitleSql',CURDATE(),1,0,0.00,'session',@import_tag,'BEGINNER',$sid);")
    $sql.Add("SET @s$sid=LAST_INSERT_ID();")
    $sql.Add("INSERT INTO rd_course_session_details (topic,creation_date,version,course_id,course_session_id,type,file,session_detail_id,tier_level,tier_order,has_animation,assignment) VALUES ('$sessionTitleSql',CURDATE(),1,@course_id,@s$sid,'pdf','$fileSql',1,'BEGINNER',1,0,0);")
  }

  $sql.Add('COMMIT;')
  $sql.Add('SELECT @course_id AS course_id;')
  $sql.Add('SELECT COUNT(*) AS imported_sessions FROM rd_course_sessions WHERE course_id=@course_id AND COALESCE(session_description,'''')=@import_tag;')
  $sql.Add('SELECT COUNT(*) AS imported_pdf_details FROM rd_course_session_details d JOIN rd_course_sessions s ON s.course_session_id=d.course_session_id WHERE s.course_id=@course_id AND COALESCE(s.session_description,'''')=@import_tag AND LOWER(COALESCE(d.type,''''))=''pdf'';')
  $sql.Add('SELECT s.session_id,s.session_title,d.file FROM rd_course_sessions s LEFT JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id AND LOWER(COALESCE(d.type,''''))=''pdf'' WHERE s.course_id=@course_id AND COALESCE(s.session_description,'''')=@import_tag ORDER BY s.session_id;')

  return ($sql -join "`n")
}

$courses = @(
  @{ Folder='cbse_grade_10_maths'; Slug='cbse_grade_10_maths'; CourseName='CBSE Grade 10 Mathematics (NCERT)'; CategoryId=11; Category='Mathematics'; Level='10'; GradeRange='HIGH_SCHOOL_10_12'; Subject='Mathematics'; TocMode='standard' },
  @{ Folder='cbse_grade_10_science'; Slug='cbse_grade_10_science'; CourseName='CBSE Grade 10 Science (NCERT)'; CategoryId=15; Category='Science'; Level='10'; GradeRange='HIGH_SCHOOL_10_12'; Subject='Science'; TocMode='standard' },
  @{ Folder='cbse_grade_12_chemistry_part_1'; Slug='cbse_grade_12_chemistry_part_1'; CourseName='CBSE Grade 12 Chemistry (NCERT) - Part 1'; CategoryId=13; Category='Chemistry'; Level='12'; GradeRange='SENIOR_SECONDARY'; Subject='Chemistry'; TocMode='standard' },
  @{ Folder='cbse_grade_12_chemistry_part_2'; Slug='cbse_grade_12_chemistry_part_2'; CourseName='CBSE Grade 12 Chemistry (NCERT) - Part 2'; CategoryId=13; Category='Chemistry'; Level='12'; GradeRange='SENIOR_SECONDARY'; Subject='Chemistry'; TocMode='standard' },
  @{ Folder='cbse_grade_12_physics_part_1'; Slug='cbse_grade_12_physics_part_1'; CourseName='CBSE Grade 12 Physics (NCERT) - Part 1'; CategoryId=14; Category='Physics'; Level='12'; GradeRange='SENIOR_SECONDARY'; Subject='Physics'; TocMode='physics' },
  @{ Folder='cbse_grade_12_physics_part_2'; Slug='cbse_grade_12_physics_part_2'; CourseName='CBSE Grade 12 Physics (NCERT) - Part 2'; CategoryId=14; Category='Physics'; Level='12'; GradeRange='SENIOR_SECONDARY'; Subject='Physics'; TocMode='physics' }
)

foreach($c in $courses) {
  $folderPath = Join-Path '.\docs\course_materials' $c.Folder
  $ps = Get-ChildItem $folderPath -File | Where-Object { $_.Name -match 'ps\.pdf$' } | Select-Object -First 1
  if(-not $ps) { throw "Missing ps pdf for $($c.Folder)" }

  $chapterPdfs = Get-ChildItem $folderPath -File | Where-Object { $_.Name -match '\d{3}\.pdf$' } | Sort-Object Name
  if($chapterPdfs.Count -eq 0) { throw "No chapter PDFs in $($c.Folder)" }

  $titles = @()
  if($c.TocMode -eq 'physics') {
    $titles = Get-TitlesFromPhysicsContents $ps.FullName $chapterPdfs.Count
  } else {
    $titles = Get-TitlesFromStandardContents $ps.FullName $chapterPdfs.Count
  }

  if($titles.Count -ne $chapterPdfs.Count) {
    throw "Title count mismatch for $($c.Folder): titles=$($titles.Count), chapters=$($chapterPdfs.Count)"
  }

  $rows = New-Object System.Collections.Generic.List[object]
  for($i=0; $i -lt $chapterPdfs.Count; $i++) {
    $rows.Add([PSCustomObject]@{ Index = $i + 1; Title = $titles[$i]; File = $chapterPdfs[$i].Name })
  }

  $manifestPath = ".\tmp_course_import_$($c.Slug)_manifest.tsv"
  $rows | ForEach-Object { "{0}`t{1}`t{2}" -f $_.Index, $_.Title, $_.File } | Set-Content -Path $manifestPath -Encoding ascii

  $importTag = "import_$($c.Slug)_2026_03_04"
  $sqlPath = ".\tmp_course_import_$($c.Slug).sql"
  $courseDesc = "NCERT Class $($c.Level) $($c.Subject) chapters imported from docs/course_materials/$($c.Folder)."
  $shortDesc = "Auto-imported from $($ps.Name) table of contents and chapter PDFs."
  $sqlBody = Build-ImportSql -CourseName $c.CourseName -ImportTag $importTag -CourseCategoryId $c.CategoryId -CourseDescription $courseDesc -ShortDescription $shortDesc -CourseLevel $c.Level -GradeRange $c.GradeRange -Category $c.Category -Rows $rows
  Set-Content -Path $sqlPath -Value $sqlBody -Encoding ascii

  $payloadDir = ".\tmp_course_payload_$($c.Slug)"
  if(Test-Path $payloadDir) { Remove-Item $payloadDir -Recurse -Force }
  New-Item -ItemType Directory -Path $payloadDir | Out-Null
  Copy-Item -Path $sqlPath -Destination (Join-Path $payloadDir (Split-Path $sqlPath -Leaf)) -Force
  Get-ChildItem $folderPath -File -Filter '*.pdf' | Copy-Item -Destination $payloadDir -Force

  $remoteScriptPath = ".\tmp_remote_import_$($c.Slug).sh"
  $template = @"
set -e
TMP_DIR=__TMP_DIR__
COURSE_NAME='__COURSE_NAME__'
IMPORT_TAG='__IMPORT_TAG__'

mkdir -p \"`$TMP_DIR\"
mysql -uroot -pJatni@752050 robodynamics_db < \"`$TMP_DIR/__SQL_FILE__\"

course_id=`$(mysql -uroot -pJatni@752050 -Nse \"USE robodynamics_db; SELECT course_id FROM rd_courses WHERE course_name='`$`{COURSE_NAME`}' ORDER BY course_id DESC LIMIT 1;\")
if [ -z \"`$course_id\" ]; then
  echo \"ERROR: course_id not found for `$`{COURSE_NAME`}\" >&2
  exit 1
fi

dest=\"/opt/robodynamics/session_materials/`$`{course_id`}\"
mkdir -p \"`$dest\"
cp -f \"`$TMP_DIR\"/*.pdf \"`$dest/\"

session_count=`$(mysql -uroot -pJatni@752050 -Nse \"USE robodynamics_db; SELECT COUNT(*) FROM rd_course_sessions WHERE course_id=`$`{course_id`} AND COALESCE(session_description,'')='`$`{IMPORT_TAG`}';\")
detail_count=`$(mysql -uroot -pJatni@752050 -Nse \"USE robodynamics_db; SELECT COUNT(*) FROM rd_course_session_details d JOIN rd_course_sessions s ON s.course_session_id=d.course_session_id WHERE s.course_id=`$`{course_id`} AND COALESCE(s.session_description,'')='`$`{IMPORT_TAG`}' AND LOWER(COALESCE(d.type,''))='pdf';\")
file_count=`$(find \"`$dest\" -maxdepth 1 -type f -iname '*.pdf' | wc -l)

echo \"COURSE_ID=`$`{course_id`}\"
echo \"IMPORTED_SESSIONS=`$`{session_count`}\"
echo \"IMPORTED_PDF_DETAILS=`$`{detail_count`}\"
echo \"DEST_DIR=`$`{dest`}\"
echo \"DEST_PDF_COUNT=`$`{file_count`}\"

mysql -uroot -pJatni@752050 -Nse \"USE robodynamics_db; SELECT s.session_id,s.session_title,d.file FROM rd_course_sessions s LEFT JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id AND LOWER(COALESCE(d.type,''))='pdf' WHERE s.course_id=`$`{course_id`} AND COALESCE(s.session_description,'')='`$`{IMPORT_TAG`}' ORDER BY s.session_id;\"
"@

  $scriptContent = $template.Replace('__TMP_DIR__', "/tmp/rd_course_import_$($c.Slug)")
  $scriptContent = $scriptContent.Replace('__COURSE_NAME__', $c.CourseName)
  $scriptContent = $scriptContent.Replace('__IMPORT_TAG__', $importTag)
  $scriptContent = $scriptContent.Replace('__SQL_FILE__', (Split-Path $sqlPath -Leaf))
  Set-Content -Path $remoteScriptPath -Value $scriptContent -Encoding ascii

  "GENERATED $($c.Slug): chapters=$($chapterPdfs.Count)"
}

