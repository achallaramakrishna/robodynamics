param(
    [string]$ControllerPath = "src/main/java/com/robodynamics/controller/RDAptiPathStudentController.java",
    [string]$SqlOut = "aptipath_phase4_career_catalog_2026_02_22.sql",
    [string]$CatalogJsonOut = "docs/data/aptipath_career_catalog_v4.json",
    [string]$AdjustmentJsonOut = "docs/data/aptipath_career_adjustments_v4.json",
    [string]$SummaryOut = "docs/APTIPATH_CAREER_DATASET_V4_2026-02-22.md"
)

$ErrorActionPreference = "Stop"

function Escape-Sql([string]$value) {
    if ($null -eq $value) {
        return ""
    }
    return $value.Replace("'", "''")
}

function Normalize-Code([string]$value) {
    if ([string]::IsNullOrWhiteSpace($value)) {
        return ""
    }
    return $value.Trim().ToUpperInvariant()
}

function Get-FitStrategy([string]$role) {
    $r = Normalize-Code $role
    if ($r.Contains("PILOT") -or $r.Contains("AIR TRAFFIC") -or $r.Contains("AEROSPACE")) {
        return "AVIATION_SPECIAL"
    }
    if ($r.Contains("LAWYER") -or $r.Contains("LEGAL") -or $r.Contains("JUDICIAL")) {
        return "LAW_SPECIAL"
    }
    if ($r.Contains("CHARTERED ACCOUNTANT") -or $r.Contains("ACTUARIAL") -or $r.Contains("EQUITY") -or $r.Contains("TREASURY")) {
        return "FINANCE_SPECIAL"
    }
    if ($r.Contains("JOURNALIST") -or $r.Contains("COPYWRITER") -or $r.Contains("LINGUIST")) {
        return "LANGUAGE_SPECIAL"
    }
    if ($r.Contains("PSYCHOLOGIST") -or $r.Contains("COUNSELOR") -or $r.Contains("TEACHER")) {
        return "EDUPSYCH_SPECIAL"
    }
    if ($r.Contains("ROBOTICS") -or $r.Contains("DRONE") -or $r.Contains("UAV")) {
        return "ROBOTICS_SPECIAL"
    }
    return "DEFAULT_CLUSTER_BASE"
}

function Get-ClusterPathwayHint([string]$cluster) {
    switch ($cluster) {
        "Medical & Clinical Pathways" { return "Focus on PCB depth, NEET pattern practice, and clinical exposure awareness." }
        "Aviation & Aerospace" { return "Track PCM readiness, medical fitness, and simulator plus flight pathway planning." }
        "Law, Policy & Governance" { return "Build reading, argumentation, legal reasoning, and current affairs consistency." }
        "Computer Science & AI" { return "Strengthen math-logic base, coding practice, and project portfolio execution." }
        "Robotics, Drones & Autonomous Systems" { return "Strengthen math-logic base, coding practice, and project portfolio execution." }
        "Economics, Finance & Accounting" { return "Develop quantitative fluency, commerce fundamentals, and exam-specific mock rhythm." }
        default { return "Use a 90-day milestone plan with practice targets, mentor review, and evidence tracking." }
    }
}

function Get-ClusterExamHint([string]$cluster) {
    switch ($cluster) {
        "Engineering & Core Technology" { return "Exam route: JEE Main, JEE Advanced, state CETs, institute-specific entrance tests." }
        "Computer Science & AI" { return "Exam route: JEE Main, JEE Advanced, state CETs, institute-specific entrance tests." }
        "Robotics, Drones & Autonomous Systems" { return "Exam route: JEE Main, JEE Advanced, state CETs, institute-specific entrance tests." }
        "Medical & Clinical Pathways" { return "Exam route: NEET UG, state health admissions, allied-health specific programs." }
        "Allied Health & Care" { return "Exam route: NEET UG, state health admissions, allied-health specific programs." }
        "Law, Policy & Governance" { return "Exam route: CLAT, AILET, LSAT India, state law entrance tracks." }
        "Business, Commerce & Management" { return "Exam route: CUET UG, IPMAT, NPAT, university-specific commerce and management tests." }
        "Economics, Finance & Accounting" { return "Exam route: CUET UG, IPMAT, NPAT, university-specific commerce and management tests." }
        "Aviation & Aerospace" { return "Exam route: DGCA-linked tracks, AME CET pathways, institute-level aviation screening." }
        default { return "Exam route: combine national/state entrances, portfolio/interview tracks, and institute criteria." }
    }
}

function Get-ClusterRequirement([string]$cluster) {
    $default = @{
        required_subjects_csv = "Math,Language"
        entrance_exams_csv = "CUET UG,Institute Entrance"
        prerequisite_summary = "Baseline readiness across relevant subjects and consistent study discipline is recommended."
        min_math_level = 2
        min_physics_level = 1
        min_chemistry_level = 1
        min_biology_level = 1
        min_language_level = 2
        target_phase = "POST_12"
    }
    switch ($cluster) {
        "Engineering & Core Technology" {
            return @{
                required_subjects_csv = "Math,Physics,Chemistry"
                entrance_exams_csv = "JEE Main,JEE Advanced,State CET"
                prerequisite_summary = "Strong PCM fundamentals, numerical reasoning, and regular timed practice are expected."
                min_math_level = 4; min_physics_level = 4; min_chemistry_level = 3; min_biology_level = 1; min_language_level = 2
                target_phase = "POST_12"
            }
        }
        "Medical & Clinical Pathways" {
            return @{
                required_subjects_csv = "Biology,Chemistry,Physics"
                entrance_exams_csv = "NEET UG,State Health Admission"
                prerequisite_summary = "Strong PCB mastery, high retention, and disciplined long-cycle preparation are expected."
                min_math_level = 2; min_physics_level = 3; min_chemistry_level = 4; min_biology_level = 4; min_language_level = 2
                target_phase = "POST_12"
            }
        }
        "Allied Health & Care" {
            return @{
                required_subjects_csv = "Biology,Chemistry,Physics"
                entrance_exams_csv = "NEET UG,Allied Health Admission"
                prerequisite_summary = "Solid biology and chemistry understanding with empathy and consistent practical focus are expected."
                min_math_level = 2; min_physics_level = 2; min_chemistry_level = 3; min_biology_level = 4; min_language_level = 2
                target_phase = "POST_12"
            }
        }
        "Biotech & Life Sciences" {
            return @{
                required_subjects_csv = "Biology,Chemistry,Physics,Math"
                entrance_exams_csv = "CUET UG,Institute Entrance"
                prerequisite_summary = "Balanced PCB + analytical skill readiness and curiosity for research pathways are expected."
                min_math_level = 3; min_physics_level = 3; min_chemistry_level = 4; min_biology_level = 4; min_language_level = 2
                target_phase = "POST_12"
            }
        }
        "Computer Science & AI" {
            return @{
                required_subjects_csv = "Math,Physics,Language"
                entrance_exams_csv = "JEE Main,State CET,CUET UG"
                prerequisite_summary = "High math logic, coding orientation, and strong debugging persistence are expected."
                min_math_level = 4; min_physics_level = 3; min_chemistry_level = 2; min_biology_level = 1; min_language_level = 3
                target_phase = "POST_12"
            }
        }
        "Data, Analytics & FinTech" {
            return @{
                required_subjects_csv = "Math,Language"
                entrance_exams_csv = "CUET UG,IPMAT,Institute Entrance"
                prerequisite_summary = "Strong numeracy, data interpretation, and structured decision-making are expected."
                min_math_level = 4; min_physics_level = 2; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 3
                target_phase = "POST_12"
            }
        }
        "Cybersecurity & Digital Trust" {
            return @{
                required_subjects_csv = "Math,Language,Physics"
                entrance_exams_csv = "JEE Main,CUET UG,Institute Entrance"
                prerequisite_summary = "Analytical rigor, pattern spotting, and disciplined problem solving are expected."
                min_math_level = 4; min_physics_level = 2; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 3
                target_phase = "POST_12"
            }
        }
        "Design, UX & Creative Technology" {
            return @{
                required_subjects_csv = "Language,Art/Design Foundations"
                entrance_exams_csv = "NID DAT,UCEED,NIFT,Portfolio Review"
                prerequisite_summary = "Strong communication, visual reasoning, and design thinking ability are expected."
                min_math_level = 2; min_physics_level = 1; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 4
                target_phase = "POST_12"
            }
        }
        "Architecture & Built Environment" {
            return @{
                required_subjects_csv = "Math,Physics,Design Aptitude"
                entrance_exams_csv = "NATA,JEE B.Arch"
                prerequisite_summary = "High spatial ability, math readiness, and design sensitivity are expected."
                min_math_level = 4; min_physics_level = 3; min_chemistry_level = 2; min_biology_level = 1; min_language_level = 3
                target_phase = "POST_12"
            }
        }
        "Law, Policy & Governance" {
            return @{
                required_subjects_csv = "Language,General Awareness,Logical Reasoning"
                entrance_exams_csv = "CLAT,AILET,LSAT India"
                prerequisite_summary = "Strong language, argumentation, and long-form reading discipline are expected."
                min_math_level = 2; min_physics_level = 1; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 4
                target_phase = "POST_12"
            }
        }
        "Business, Commerce & Management" {
            return @{
                required_subjects_csv = "Math,Language,Commerce Basics"
                entrance_exams_csv = "CUET UG,IPMAT,NPAT"
                prerequisite_summary = "Business reasoning, numeracy, and communication clarity are expected."
                min_math_level = 3; min_physics_level = 1; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 4
                target_phase = "POST_12"
            }
        }
        "Economics, Finance & Accounting" {
            return @{
                required_subjects_csv = "Math,Language,Accountancy/Commerce"
                entrance_exams_csv = "CUET UG,CA Foundation,IPMAT"
                prerequisite_summary = "High math comfort, careful accuracy, and disciplined analytical thinking are expected."
                min_math_level = 4; min_physics_level = 1; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 3
                target_phase = "POST_12"
            }
        }
        "Marketing, Media & Communication" {
            return @{
                required_subjects_csv = "Language,Social Science,Business Awareness"
                entrance_exams_csv = "CUET UG,Institute Entrance"
                prerequisite_summary = "High language fluency, storytelling quality, and audience understanding are expected."
                min_math_level = 2; min_physics_level = 1; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 4
                target_phase = "POST_12"
            }
        }
        "Education, Psychology & Guidance" {
            return @{
                required_subjects_csv = "Language,Biology/Social Science"
                entrance_exams_csv = "CUET UG,University Entrance"
                prerequisite_summary = "Communication, empathy, and reflective learning discipline are expected."
                min_math_level = 2; min_physics_level = 1; min_chemistry_level = 1; min_biology_level = 2; min_language_level = 4
                target_phase = "POST_12"
            }
        }
        "Humanities, Languages & Social Impact" {
            return @{
                required_subjects_csv = "Language,Social Science"
                entrance_exams_csv = "CUET UG,University Entrance"
                prerequisite_summary = "Strong reading comprehension, expression, and contextual analysis are expected."
                min_math_level = 1; min_physics_level = 1; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 4
                target_phase = "POST_12"
            }
        }
        "Aviation & Aerospace" {
            return @{
                required_subjects_csv = "Math,Physics,Language"
                entrance_exams_csv = "DGCA CPL Exams,AME CET,Institute Screening"
                prerequisite_summary = "High PCM readiness, situational awareness, and medical fitness discipline are expected."
                min_math_level = 4; min_physics_level = 4; min_chemistry_level = 2; min_biology_level = 1; min_language_level = 3
                target_phase = "POST_12"
            }
        }
        "Defense & Public Safety" {
            return @{
                required_subjects_csv = "Math,Physics,Language,General Awareness"
                entrance_exams_csv = "NDA,CDS,AFCAT,State Public Safety Exams"
                prerequisite_summary = "Strong discipline, resilience, aptitude, and communication stability are expected."
                min_math_level = 3; min_physics_level = 3; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 3
                target_phase = "POST_12"
            }
        }
        "Agriculture & Food Systems" {
            return @{
                required_subjects_csv = "Biology,Chemistry,Math/Physics"
                entrance_exams_csv = "ICAR AIEEA,State Agriculture CET"
                prerequisite_summary = "Applied science interest, field orientation, and practical execution mindset are expected."
                min_math_level = 2; min_physics_level = 2; min_chemistry_level = 3; min_biology_level = 3; min_language_level = 2
                target_phase = "POST_12"
            }
        }
        "Environmental & Climate Systems" {
            return @{
                required_subjects_csv = "Math,Physics,Chemistry,Environmental Science"
                entrance_exams_csv = "CUET UG,Institute Entrance"
                prerequisite_summary = "Interdisciplinary science base with systems thinking and sustainability orientation is expected."
                min_math_level = 3; min_physics_level = 3; min_chemistry_level = 3; min_biology_level = 2; min_language_level = 3
                target_phase = "POST_12"
            }
        }
        "Hospitality, Travel & Service" {
            return @{
                required_subjects_csv = "Language,Service Aptitude"
                entrance_exams_csv = "NCHM JEE,CUET UG,Institute Entrance"
                prerequisite_summary = "Communication quality, service mindset, and consistency under pressure are expected."
                min_math_level = 1; min_physics_level = 1; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 3
                target_phase = "POST_12"
            }
        }
        "Logistics & Supply Chain" {
            return @{
                required_subjects_csv = "Math,Language,Operations Reasoning"
                entrance_exams_csv = "CUET UG,Institute Entrance"
                prerequisite_summary = "Quantitative planning, execution discipline, and systems coordination are expected."
                min_math_level = 3; min_physics_level = 1; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 3
                target_phase = "POST_12"
            }
        }
        "Entrepreneurship & Venture" {
            return @{
                required_subjects_csv = "Math,Language,Business Awareness"
                entrance_exams_csv = "CUET UG,IPMAT,Institute Incubation Screening"
                prerequisite_summary = "Opportunity recognition, communication, and execution stamina are expected."
                min_math_level = 3; min_physics_level = 1; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 3
                target_phase = "POST_12"
            }
        }
        "Skilled Trades & Applied Vocational" {
            return @{
                required_subjects_csv = "Math,Physics,Applied Technical Skills"
                entrance_exams_csv = "ITI Entrance,NSDC/SSC Assessment,Apprenticeship Screening"
                prerequisite_summary = "Hands-on technical ability, practical discipline, and safety compliance are expected."
                min_math_level = 2; min_physics_level = 2; min_chemistry_level = 1; min_biology_level = 1; min_language_level = 2
                target_phase = "POST_10_TO_POST12"
            }
        }
        "Sports, Fitness & Wellness" {
            return @{
                required_subjects_csv = "Biology,Physical Education,Language"
                entrance_exams_csv = "SAI Trials,Sports Quota Trials,Institute Entrance"
                prerequisite_summary = "Physical readiness, sustained discipline, and coaching responsiveness are expected."
                min_math_level = 1; min_physics_level = 2; min_chemistry_level = 1; min_biology_level = 2; min_language_level = 2
                target_phase = "POST_10_TO_POST12"
            }
        }
        "Robotics, Drones & Autonomous Systems" {
            return @{
                required_subjects_csv = "Math,Physics,Computer Fundamentals"
                entrance_exams_csv = "JEE Main,State CET,Institute Entrance"
                prerequisite_summary = "High math-physics readiness, coding aptitude, and systems debugging mindset are expected."
                min_math_level = 4; min_physics_level = 4; min_chemistry_level = 2; min_biology_level = 1; min_language_level = 2
                target_phase = "POST_12"
            }
        }
        default { return $default }
    }
}

if (-not (Test-Path $ControllerPath)) {
    throw "Controller not found: $ControllerPath"
}

$controllerRaw = Get-Content $ControllerPath -Raw
$clusterPattern = 'clusterRoles\.put\("(?<cluster>[^"]+)",\s*List\.of\((?<roles>.*?)\)\);'
$clusterMatches = [regex]::Matches($controllerRaw, $clusterPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)

if ($clusterMatches.Count -eq 0) {
    throw "No clusterRoles.put blocks found in $ControllerPath"
}

$clusterRoleMap = [ordered]@{}
foreach ($clusterMatch in $clusterMatches) {
    $clusterName = $clusterMatch.Groups["cluster"].Value.Trim()
    $rolesRaw = $clusterMatch.Groups["roles"].Value
    $roleMatches = [regex]::Matches($rolesRaw, '"([^"]+)"')
    $baseRoles = @()
    foreach ($roleMatch in $roleMatches) {
        $roleName = $roleMatch.Groups[1].Value.Trim()
        if (-not [string]::IsNullOrWhiteSpace($roleName)) {
            $baseRoles += $roleName
        }
    }
    $clusterRoleMap[$clusterName] = $baseRoles
}

$clusterExtraRoles = [ordered]@{
    "Engineering & Core Technology" = @(
        "Manufacturing Engineer", "Thermal Systems Engineer", "Power Systems Engineer", "Metallurgical Engineer", "Reliability Engineer",
        "Quality Control Engineer", "Process Design Engineer", "CAD/CAM Engineer", "Embedded Hardware Engineer", "Industrial Automation Engineer")
    "Medical & Clinical Pathways" = @(
        "General Physician", "Medical Officer", "Pathology Specialist (Long-term Track)", "Cardiology Specialist (Long-term Track)", "Neurology Specialist (Long-term Track)",
        "Orthopedic Specialist (Long-term Track)", "Obstetrics and Gynecology Specialist", "Ophthalmology Specialist", "ENT Specialist", "Preventive Medicine Specialist")
    "Allied Health & Care" = @(
        "Emergency Medical Technician", "Operation Theatre Technologist", "Cardiac Care Technologist", "Respiratory Therapist", "Prosthetics and Orthotics Specialist",
        "Rehabilitation Therapist", "Critical Care Nurse", "Health Records Specialist", "Clinical Nutritionist", "Community Health Worker")
    "Biotech & Life Sciences" = @(
        "Immunology Research Associate", "Virology Scientist", "Bioprocess Engineer", "Clinical Data Manager", "Genomics Analyst",
        "Stem Cell Research Associate", "Regulatory Affairs Associate (Pharma)", "Medical Science Liaison", "Bioquality Assurance Specialist", "Biotech Product Associate")
    "Computer Science & AI" = @(
        "Frontend Engineer", "DevOps Engineer", "Site Reliability Engineer", "Data Engineer", "AI Research Engineer",
        "Prompt Engineer", "AI Safety Analyst", "Edge AI Engineer", "Blockchain Developer", "QA Automation Engineer")
    "Data, Analytics & FinTech" = @(
        "Data Visualization Specialist", "Decision Scientist", "Product Analytics Manager", "Fraud Analytics Specialist", "Credit Risk Modeler",
        "Revenue Analyst", "Operations Research Analyst", "Customer Insights Analyst", "Actuarial Modeling Analyst", "FinOps Analyst")
    "Cybersecurity & Digital Trust" = @(
        "Penetration Tester", "SOC Engineer", "Incident Response Specialist", "Application Security Engineer", "Security Architect",
        "Vulnerability Management Analyst", "Blue Team Analyst", "Red Team Analyst", "Security Awareness Specialist", "Cloud Compliance Analyst")
    "Design, UX & Creative Technology" = @(
        "Service Designer", "Visual Communication Designer", "Information Designer", "Digital Illustrator", "Experience Strategist",
        "Brand Identity Designer", "3D Designer", "UI Prototyping Specialist", "Game Experience Designer", "Accessibility Designer")
    "Architecture & Built Environment" = @(
        "Town Planner", "Green Building Architect", "Construction Estimator", "Infrastructure Planner", "Housing Design Architect",
        "Urban Mobility Planner", "Facade Design Specialist", "Site Planning Engineer", "Construction Safety Planner", "Smart Infrastructure Analyst")
    "Law, Policy & Governance" = @(
        "Legal Compliance Analyst", "Contract Management Specialist", "Arbitration Associate", "Tax Law Associate", "Intellectual Property Analyst",
        "Criminal Law Associate", "Constitutional Law Researcher", "Legal Operations Associate", "Public Administration Analyst", "Governance Advisory Associate")
    "Business, Commerce & Management" = @(
        "Strategy Associate", "Customer Success Manager", "Revenue Operations Specialist", "Category Manager", "Franchise Operations Manager",
        "Procurement Manager", "Enterprise Sales Associate", "Business Process Analyst", "Program Delivery Manager", "PMO Analyst")
    "Economics, Finance & Accounting" = @(
        "Financial Risk Manager", "Portfolio Analyst", "Credit Underwriter", "Banking Operations Analyst", "Wealth Management Advisor",
        "Insurance Analyst", "Treasury Operations Associate", "Corporate Finance Analyst", "Audit and Assurance Associate", "Derivatives Analyst")
    "Marketing, Media & Communication" = @(
        "SEO Specialist", "Performance Marketing Analyst", "Marketing Automation Specialist", "Influencer Marketing Manager", "Community Manager",
        "Corporate Communications Specialist", "Creative Content Producer", "Broadcast Media Associate", "Campaign Planner", "Public Affairs Associate")
    "Education, Psychology & Guidance" = @(
        "Education Psychologist", "Child Development Specialist", "Learning Support Specialist", "Assessment Designer", "EdTech Curriculum Specialist",
        "Academic Program Coordinator", "Student Success Coach", "Behavioral Therapist", "Guidance and Career Advisor", "Teacher Trainer")
    "Humanities, Languages & Social Impact" = @(
        "Political Analyst", "Public Affairs Researcher", "International Relations Specialist", "Development Communication Specialist", "Heritage Conservation Specialist",
        "Anthropology Research Associate", "Ethics and Society Researcher", "Social Policy Researcher", "Community Outreach Specialist", "Language Services Specialist")
    "Aviation & Aerospace" = @(
        "Flight Safety Analyst", "Aviation Meteorology Analyst", "Airport Ground Operations Lead", "Air Cargo Operations Specialist", "Cabin Services Trainer",
        "Flight Operations Controller", "Airline Network Planner", "Aviation Security Officer", "Aircraft Systems Inspector", "Airport Terminal Manager")
    "Defense & Public Safety" = @(
        "Defense Technology Analyst", "Cyber Defense Specialist", "Intelligence Field Officer", "Security Operations Commander", "Border Management Officer",
        "Strategic Affairs Analyst", "Homeland Preparedness Officer", "Tactical Communications Specialist", "Public Safety Planner", "Rescue Operations Specialist")
    "Agriculture & Food Systems" = @(
        "Agritech Analyst", "Farm Operations Manager", "Seed Technology Specialist", "Agricultural Extension Officer", "Organic Farming Specialist",
        "Livestock Management Specialist", "Irrigation Planner", "Agri Commodity Analyst", "Farm Machinery Specialist", "Post-Harvest Technology Specialist")
    "Environmental & Climate Systems" = @(
        "Environmental Compliance Officer", "Renewable Project Engineer", "Sustainability Reporting Specialist", "Climate Adaptation Planner", "Circular Economy Analyst",
        "Energy Efficiency Consultant", "Biodiversity Analyst", "Pollution Control Specialist", "Sustainability Program Manager", "Green Finance Analyst")
    "Hospitality, Travel & Service" = @(
        "Front Office Manager", "Food and Beverage Manager", "Hospitality Revenue Analyst", "Travel Experience Curator", "Cruise Hospitality Associate",
        "Restaurant Operations Manager", "Event Production Specialist", "Guest Relations Specialist", "Destination Manager", "Tourism Product Developer")
    "Logistics & Supply Chain" = @(
        "Fleet Operations Manager", "Supply Planning Analyst", "Demand Forecasting Analyst", "Last-Mile Delivery Manager", "Customs Documentation Specialist",
        "Procurement Operations Specialist", "Inventory Control Specialist", "Trade Compliance Analyst", "Cold Chain Specialist", "Port Operations Analyst")
    "Entrepreneurship & Venture" = @(
        "Startup Product Builder", "Venture Studio Associate", "Small Business Consultant", "Entrepreneurship Educator", "Innovation Catalyst",
        "Startup Finance Associate", "Growth Operations Associate", "New Market Expansion Associate", "Digital Business Owner", "Social Enterprise Founder")
    "Skilled Trades & Applied Vocational" = @(
        "Industrial Robotics Technician", "EV Battery Technician", "CNC Machine Operator", "Tool and Die Technician", "Industrial Maintenance Technician",
        "Refrigeration Technician", "Plumbing Specialist", "Smart Home Installation Technician", "3D Printing Technician", "Precision Assembly Technician")
    "Sports, Fitness & Wellness" = @(
        "Sports Event Manager", "Athletic Performance Coach", "Rehab and Recovery Specialist", "Sports Data Analyst", "Youth Development Coach",
        "Adventure Sports Instructor", "Fitness Content Creator", "Wellness Program Manager", "Physical Education Specialist", "Community Sports Coordinator")
    "Robotics, Drones & Autonomous Systems" = @(
        "Autonomous Robot Operator", "Drone Data Processing Specialist", "UAV Maintenance Engineer", "Robot Fleet Manager", "Industrial Automation Integrator",
        "Sensor Fusion Engineer", "Human-Robot Interaction Designer", "Drone Survey Specialist", "Autonomous Navigation Engineer", "Robotics QA Specialist")
}

$catalogRows = @()
$globalOrder = 1
$clusterOrder = 1
foreach ($clusterName in $clusterRoleMap.Keys) {
    $allRoles = New-Object System.Collections.Generic.List[string]
    foreach ($roleName in $clusterRoleMap[$clusterName]) {
        if (-not [string]::IsNullOrWhiteSpace($roleName)) {
            $allRoles.Add($roleName.Trim())
        }
    }
    if ($clusterExtraRoles.Contains($clusterName)) {
        foreach ($roleName in $clusterExtraRoles[$clusterName]) {
            if (-not [string]::IsNullOrWhiteSpace($roleName)) {
                $allRoles.Add($roleName.Trim())
            }
        }
    }

    $seen = New-Object System.Collections.Generic.HashSet[string]([System.StringComparer]::OrdinalIgnoreCase)
    $roleOrder = 1
    foreach ($roleName in $allRoles) {
        if (-not $seen.Add($roleName)) {
            continue
        }
        $req = Get-ClusterRequirement $clusterName
        $catalogRows += [pscustomobject]@{
            module_code = "APTIPATH"
            assessment_version = "v3"
            career_code = ("AP3_CAR_{0:D4}" -f $globalOrder)
            career_name = $roleName
            cluster_name = $clusterName
            fit_strategy = Get-FitStrategy $roleName
            pathway_hint = Get-ClusterPathwayHint $clusterName
            exam_hint = Get-ClusterExamHint $clusterName
            prerequisite_summary = $req.prerequisite_summary
            required_subjects_csv = $req.required_subjects_csv
            entrance_exams_csv = $req.entrance_exams_csv
            min_math_level = $req.min_math_level
            min_physics_level = $req.min_physics_level
            min_chemistry_level = $req.min_chemistry_level
            min_biology_level = $req.min_biology_level
            min_language_level = $req.min_language_level
            target_phase = $req.target_phase
            sort_order = $globalOrder
            cluster_order = $clusterOrder
            role_order = $roleOrder
            status = "ACTIVE"
        }
        $globalOrder += 1
        $roleOrder += 1
    }
    $clusterOrder += 1
}

$adjustmentRows = @()
$adjOrder = 1
function Add-Adjustment(
    [string]$signalType,
    [string]$signalCode,
    [string]$signalBand,
    [string]$clusterName,
    [double]$boostValue
) {
    $script:adjustmentRows += [pscustomobject]@{
        module_code = "APTIPATH"
        assessment_version = "v3"
        signal_type = $signalType
        signal_code = (Normalize-Code $signalCode)
        signal_band = (Normalize-Code $signalBand)
        cluster_name = $clusterName
        boost_value = [math]::Round($boostValue, 2)
        sort_order = $script:adjOrder
        status = "ACTIVE"
    }
    $script:adjOrder += 1
}

# Intent adjustments
$intentMap = [ordered]@{
    COMMERCIAL_PILOT = @(
        @{ cluster = "Aviation & Aerospace"; boost = 14 },
        @{ cluster = "Engineering & Core Technology"; boost = 4 },
        @{ cluster = "Defense & Public Safety"; boost = 3 }
    )
    LAW_POLICY = @(
        @{ cluster = "Law, Policy & Governance"; boost = 11 },
        @{ cluster = "Humanities, Languages & Social Impact"; boost = 6 }
    )
    MEDICAL_HEALTH = @(
        @{ cluster = "Medical & Clinical Pathways"; boost = 12 },
        @{ cluster = "Allied Health & Care"; boost = 8 },
        @{ cluster = "Biotech & Life Sciences"; boost = 6 }
    )
    CS_AI = @(
        @{ cluster = "Computer Science & AI"; boost = 12 },
        @{ cluster = "Data, Analytics & FinTech"; boost = 8 },
        @{ cluster = "Cybersecurity & Digital Trust"; boost = 7 }
    )
    ROBOTICS_DRONE = @(
        @{ cluster = "Robotics, Drones & Autonomous Systems"; boost = 13 },
        @{ cluster = "Engineering & Core Technology"; boost = 7 },
        @{ cluster = "Computer Science & AI"; boost = 5 }
    )
    DESIGN_CREATIVE = @(
        @{ cluster = "Design, UX & Creative Technology"; boost = 12 },
        @{ cluster = "Marketing, Media & Communication"; boost = 7 },
        @{ cluster = "Architecture & Built Environment"; boost = 5 }
    )
    BUSINESS_FINANCE = @(
        @{ cluster = "Business, Commerce & Management"; boost = 11 },
        @{ cluster = "Economics, Finance & Accounting"; boost = 11 }
    )
    CIVIL_SERVICES = @(
        @{ cluster = "Law, Policy & Governance"; boost = 8 },
        @{ cluster = "Humanities, Languages & Social Impact"; boost = 9 },
        @{ cluster = "Defense & Public Safety"; boost = 4 }
    )
    PSYCHOLOGY_EDU = @(
        @{ cluster = "Education, Psychology & Guidance"; boost = 12 },
        @{ cluster = "Humanities, Languages & Social Impact"; boost = 6 }
    )
    MEDIA_COMM = @(
        @{ cluster = "Marketing, Media & Communication"; boost = 12 },
        @{ cluster = "Humanities, Languages & Social Impact"; boost = 7 }
    )
    CORE_ENGINEERING = @(
        @{ cluster = "Engineering & Core Technology"; boost = 12 },
        @{ cluster = "Robotics, Drones & Autonomous Systems"; boost = 6 }
    )
    SKILLED_VOCATIONAL = @(
        @{ cluster = "Skilled Trades & Applied Vocational"; boost = 13 },
        @{ cluster = "Logistics & Supply Chain"; boost = 5 },
        @{ cluster = "Agriculture & Food Systems"; boost = 3 }
    )
}

foreach ($intent in $intentMap.Keys) {
    foreach ($row in $intentMap[$intent]) {
        Add-Adjustment "INTENT" $intent "ANY" $row.cluster $row.boost
    }
}

# Self signal adjustments
$selfSignalMap = @(
    @{ code = "numeric"; band = "HIGH"; rows = @(
        @{ cluster = "Engineering & Core Technology"; boost = 4 },
        @{ cluster = "Computer Science & AI"; boost = 4 },
        @{ cluster = "Economics, Finance & Accounting"; boost = 4 },
        @{ cluster = "Data, Analytics & FinTech"; boost = 3 }) },
    @{ code = "numeric"; band = "LOW"; rows = @(
        @{ cluster = "Engineering & Core Technology"; boost = -6 },
        @{ cluster = "Economics, Finance & Accounting"; boost = -5 },
        @{ cluster = "Data, Analytics & FinTech"; boost = -4 },
        @{ cluster = "Computer Science & AI"; boost = -3 }) },
    @{ code = "language"; band = "HIGH"; rows = @(
        @{ cluster = "Law, Policy & Governance"; boost = 5 },
        @{ cluster = "Marketing, Media & Communication"; boost = 5 },
        @{ cluster = "Humanities, Languages & Social Impact"; boost = 4 },
        @{ cluster = "Education, Psychology & Guidance"; boost = 3 }) },
    @{ code = "language"; band = "LOW"; rows = @(
        @{ cluster = "Law, Policy & Governance"; boost = -3 },
        @{ cluster = "Marketing, Media & Communication"; boost = -3 },
        @{ cluster = "Humanities, Languages & Social Impact"; boost = -2 }) },
    @{ code = "discipline"; band = "HIGH"; rows = @(
        @{ cluster = "Medical & Clinical Pathways"; boost = 4 },
        @{ cluster = "Engineering & Core Technology"; boost = 3 },
        @{ cluster = "Law, Policy & Governance"; boost = 3 },
        @{ cluster = "Aviation & Aerospace"; boost = 4 }) },
    @{ code = "discipline"; band = "LOW"; rows = @(
        @{ cluster = "Medical & Clinical Pathways"; boost = -5 },
        @{ cluster = "Engineering & Core Technology"; boost = -3 },
        @{ cluster = "Aviation & Aerospace"; boost = -4 },
        @{ cluster = "Hospitality, Travel & Service"; boost = 2 },
        @{ cluster = "Design, UX & Creative Technology"; boost = 2 }) },
    @{ code = "spatial"; band = "HIGH"; rows = @(
        @{ cluster = "Aviation & Aerospace"; boost = 6 },
        @{ cluster = "Architecture & Built Environment"; boost = 5 },
        @{ cluster = "Robotics, Drones & Autonomous Systems"; boost = 4 },
        @{ cluster = "Engineering & Core Technology"; boost = 3 }) },
    @{ code = "spatial"; band = "LOW"; rows = @(
        @{ cluster = "Aviation & Aerospace"; boost = -4 },
        @{ cluster = "Architecture & Built Environment"; boost = -3 },
        @{ cluster = "Robotics, Drones & Autonomous Systems"; boost = -2 }) }
)

foreach ($entry in $selfSignalMap) {
    foreach ($row in $entry.rows) {
        Add-Adjustment "SELF_SIGNAL" $entry.code $entry.band $row.cluster $row.boost
    }
}

# Self composite
$selfCompositeRows = @(
    @{ cluster = "Law, Policy & Governance"; boost = 4 },
    @{ cluster = "Marketing, Media & Communication"; boost = 4 },
    @{ cluster = "Humanities, Languages & Social Impact"; boost = 5 },
    @{ cluster = "Education, Psychology & Guidance"; boost = 3 },
    @{ cluster = "Engineering & Core Technology"; boost = -5 }
)
foreach ($row in $selfCompositeRows) {
    Add-Adjustment "SELF_COMPOSITE" "NUMERIC_LOW_LANGUAGE_HIGH" "ANY" $row.cluster $row.boost
}

# Subject adjustments
$subjectSignalMap = @(
    @{ code = "math"; band = "HIGH"; rows = @(
        @{ cluster = "Engineering & Core Technology"; boost = 5 },
        @{ cluster = "Computer Science & AI"; boost = 4 },
        @{ cluster = "Data, Analytics & FinTech"; boost = 4 },
        @{ cluster = "Economics, Finance & Accounting"; boost = 3 }) },
    @{ code = "math"; band = "LOW"; rows = @(
        @{ cluster = "Engineering & Core Technology"; boost = -7 },
        @{ cluster = "Computer Science & AI"; boost = -5 },
        @{ cluster = "Data, Analytics & FinTech"; boost = -4 },
        @{ cluster = "Economics, Finance & Accounting"; boost = -3 },
        @{ cluster = "Marketing, Media & Communication"; boost = 2 },
        @{ cluster = "Law, Policy & Governance"; boost = 2 }) },
    @{ code = "physics"; band = "HIGH"; rows = @(
        @{ cluster = "Aviation & Aerospace"; boost = 5 },
        @{ cluster = "Engineering & Core Technology"; boost = 3 },
        @{ cluster = "Robotics, Drones & Autonomous Systems"; boost = 3 }) },
    @{ code = "physics"; band = "LOW"; rows = @(
        @{ cluster = "Aviation & Aerospace"; boost = -5 },
        @{ cluster = "Engineering & Core Technology"; boost = -3 },
        @{ cluster = "Robotics, Drones & Autonomous Systems"; boost = -2 }) },
    @{ code = "chemistry"; band = "HIGH"; rows = @(
        @{ cluster = "Medical & Clinical Pathways"; boost = 2 },
        @{ cluster = "Biotech & Life Sciences"; boost = 3 },
        @{ cluster = "Engineering & Core Technology"; boost = 2 }) },
    @{ code = "chemistry"; band = "LOW"; rows = @(
        @{ cluster = "Medical & Clinical Pathways"; boost = -2 },
        @{ cluster = "Biotech & Life Sciences"; boost = -3 }) },
    @{ code = "biology"; band = "HIGH"; rows = @(
        @{ cluster = "Medical & Clinical Pathways"; boost = 8 },
        @{ cluster = "Allied Health & Care"; boost = 5 },
        @{ cluster = "Biotech & Life Sciences"; boost = 4 }) },
    @{ code = "biology"; band = "LOW"; rows = @(
        @{ cluster = "Medical & Clinical Pathways"; boost = -9 },
        @{ cluster = "Allied Health & Care"; boost = -4 },
        @{ cluster = "Biotech & Life Sciences"; boost = -4 },
        @{ cluster = "Business, Commerce & Management"; boost = 2 },
        @{ cluster = "Design, UX & Creative Technology"; boost = 2 }) },
    @{ code = "language"; band = "HIGH"; rows = @(
        @{ cluster = "Law, Policy & Governance"; boost = 5 },
        @{ cluster = "Marketing, Media & Communication"; boost = 5 },
        @{ cluster = "Humanities, Languages & Social Impact"; boost = 4 },
        @{ cluster = "Education, Psychology & Guidance"; boost = 3 }) },
    @{ code = "language"; band = "LOW"; rows = @(
        @{ cluster = "Law, Policy & Governance"; boost = -3 },
        @{ cluster = "Marketing, Media & Communication"; boost = -3 },
        @{ cluster = "Humanities, Languages & Social Impact"; boost = -2 }) }
)

foreach ($entry in $subjectSignalMap) {
    foreach ($row in $entry.rows) {
        Add-Adjustment "SUBJECT_SIGNAL" $entry.code $entry.band $row.cluster $row.boost
    }
}

New-Item -ItemType Directory -Path (Split-Path -Parent $CatalogJsonOut) -Force | Out-Null
New-Item -ItemType Directory -Path (Split-Path -Parent $AdjustmentJsonOut) -Force | Out-Null

$catalogRows | ConvertTo-Json -Depth 6 | Out-File -FilePath $CatalogJsonOut -Encoding utf8
$adjustmentRows | ConvertTo-Json -Depth 6 | Out-File -FilePath $AdjustmentJsonOut -Encoding utf8

$timestamp = "2026-02-22 00:00:00"
$sqlLines = New-Object System.Collections.Generic.List[string]
$sqlLines.Add("-- AptiPath v3 DB-driven career catalog and adjustments")
$sqlLines.Add("-- Generated by tools/generate-aptipath-career-dataset.ps1")
$sqlLines.Add("")
$sqlLines.Add("DROP TABLE IF EXISTS rd_ci_career_adjustment;")
$sqlLines.Add("DROP TABLE IF EXISTS rd_ci_career_catalog;")
$sqlLines.Add("")
$sqlLines.Add("CREATE TABLE IF NOT EXISTS rd_ci_career_catalog (")
$sqlLines.Add("  ci_career_catalog_id BIGINT NOT NULL AUTO_INCREMENT,")
$sqlLines.Add("  module_code VARCHAR(40) NOT NULL,")
$sqlLines.Add("  assessment_version VARCHAR(20) NOT NULL,")
$sqlLines.Add("  career_code VARCHAR(80) NOT NULL,")
$sqlLines.Add("  career_name VARCHAR(190) NOT NULL,")
$sqlLines.Add("  cluster_name VARCHAR(190) NOT NULL,")
$sqlLines.Add("  fit_strategy VARCHAR(40) DEFAULT NULL,")
$sqlLines.Add("  pathway_hint VARCHAR(500) DEFAULT NULL,")
$sqlLines.Add("  exam_hint VARCHAR(500) DEFAULT NULL,")
$sqlLines.Add("  prerequisite_summary VARCHAR(600) DEFAULT NULL,")
$sqlLines.Add("  required_subjects_csv VARCHAR(255) DEFAULT NULL,")
$sqlLines.Add("  entrance_exams_csv VARCHAR(255) DEFAULT NULL,")
$sqlLines.Add("  min_math_level TINYINT DEFAULT NULL,")
$sqlLines.Add("  min_physics_level TINYINT DEFAULT NULL,")
$sqlLines.Add("  min_chemistry_level TINYINT DEFAULT NULL,")
$sqlLines.Add("  min_biology_level TINYINT DEFAULT NULL,")
$sqlLines.Add("  min_language_level TINYINT DEFAULT NULL,")
$sqlLines.Add("  target_phase VARCHAR(40) DEFAULT NULL,")
$sqlLines.Add("  sort_order INT NOT NULL DEFAULT 0,")
$sqlLines.Add("  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',")
$sqlLines.Add("  created_at DATETIME NOT NULL,")
$sqlLines.Add("  updated_at DATETIME NOT NULL,")
$sqlLines.Add("  PRIMARY KEY (ci_career_catalog_id),")
$sqlLines.Add("  UNIQUE KEY uq_rd_ci_career_catalog_code (module_code, assessment_version, career_code),")
$sqlLines.Add("  KEY idx_rd_ci_career_catalog_cluster (module_code, assessment_version, cluster_name, status)")
$sqlLines.Add(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;")
$sqlLines.Add("")
$sqlLines.Add("CREATE TABLE IF NOT EXISTS rd_ci_career_adjustment (")
$sqlLines.Add("  ci_career_adjustment_id BIGINT NOT NULL AUTO_INCREMENT,")
$sqlLines.Add("  module_code VARCHAR(40) NOT NULL,")
$sqlLines.Add("  assessment_version VARCHAR(20) NOT NULL,")
$sqlLines.Add("  signal_type VARCHAR(40) NOT NULL,")
$sqlLines.Add("  signal_code VARCHAR(80) NOT NULL,")
$sqlLines.Add("  signal_band VARCHAR(20) NOT NULL DEFAULT 'ANY',")
$sqlLines.Add("  cluster_name VARCHAR(190) NOT NULL,")
$sqlLines.Add("  boost_value DECIMAL(6,2) NOT NULL,")
$sqlLines.Add("  sort_order INT NOT NULL DEFAULT 0,")
$sqlLines.Add("  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',")
$sqlLines.Add("  created_at DATETIME NOT NULL,")
$sqlLines.Add("  updated_at DATETIME NOT NULL,")
$sqlLines.Add("  PRIMARY KEY (ci_career_adjustment_id),")
$sqlLines.Add("  UNIQUE KEY uq_rd_ci_career_adjustment (module_code, assessment_version, signal_type, signal_code, signal_band, cluster_name),")
$sqlLines.Add("  KEY idx_rd_ci_career_adjustment_lookup (module_code, assessment_version, signal_type, signal_code, signal_band, status)")
$sqlLines.Add(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;")
$sqlLines.Add("")
$sqlLines.Add("DELETE FROM rd_ci_career_adjustment WHERE module_code = 'APTIPATH' AND assessment_version = 'v3';")
$sqlLines.Add("DELETE FROM rd_ci_career_catalog WHERE module_code = 'APTIPATH' AND assessment_version = 'v3';")
$sqlLines.Add("")

foreach ($row in $catalogRows) {
    $sqlLines.Add(
        ("INSERT INTO rd_ci_career_catalog (module_code, assessment_version, career_code, career_name, cluster_name, fit_strategy, pathway_hint, exam_hint, prerequisite_summary, required_subjects_csv, entrance_exams_csv, min_math_level, min_physics_level, min_chemistry_level, min_biology_level, min_language_level, target_phase, sort_order, status, created_at, updated_at) VALUES ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}',{11},{12},{13},{14},{15},'{16}',{17},'{18}','{19}','{19}');" -f
            (Escape-Sql $row.module_code),
            (Escape-Sql $row.assessment_version),
            (Escape-Sql $row.career_code),
            (Escape-Sql $row.career_name),
            (Escape-Sql $row.cluster_name),
            (Escape-Sql $row.fit_strategy),
            (Escape-Sql $row.pathway_hint),
            (Escape-Sql $row.exam_hint),
            (Escape-Sql $row.prerequisite_summary),
            (Escape-Sql $row.required_subjects_csv),
            (Escape-Sql $row.entrance_exams_csv),
            $row.min_math_level,
            $row.min_physics_level,
            $row.min_chemistry_level,
            $row.min_biology_level,
            $row.min_language_level,
            (Escape-Sql $row.target_phase),
            $row.sort_order,
            (Escape-Sql $row.status),
            $timestamp))
}
$sqlLines.Add("")

foreach ($row in $adjustmentRows) {
    $sqlLines.Add(
        ("INSERT INTO rd_ci_career_adjustment (module_code, assessment_version, signal_type, signal_code, signal_band, cluster_name, boost_value, sort_order, status, created_at, updated_at) VALUES ('{0}','{1}','{2}','{3}','{4}','{5}',{6},{7},'{8}','{9}','{9}');" -f
            (Escape-Sql $row.module_code),
            (Escape-Sql $row.assessment_version),
            (Escape-Sql $row.signal_type),
            (Escape-Sql $row.signal_code),
            (Escape-Sql $row.signal_band),
            (Escape-Sql $row.cluster_name),
            $row.boost_value,
            $row.sort_order,
            (Escape-Sql $row.status),
            $timestamp))
}
$sqlLines.Add("")

$clusterCounts = $catalogRows | Group-Object cluster_name | Sort-Object Name
$sqlLines.Add("-- Cluster counts")
foreach ($grp in $clusterCounts) {
    $sqlLines.Add("-- " + $grp.Name + ": " + $grp.Count)
}

$sqlLines | Out-File -FilePath $SqlOut -Encoding utf8

$summaryLines = @()
$summaryLines += "# AptiPath Career Dataset v4"
$summaryLines += ""
$summaryLines += "- Generated on: 2026-02-22"
$summaryLines += "- Career rows: $($catalogRows.Count)"
$summaryLines += "- Career clusters: $($clusterCounts.Count)"
$summaryLines += "- Adjustment rows: $($adjustmentRows.Count)"
$summaryLines += "- Source for role list: RDAptiPathStudentController.clusterRoles fallback map"
$summaryLines += "- Mapping mode: DB-first (rd_ci_career_catalog + rd_ci_career_adjustment), hardcoded fallback retained for safety"
$summaryLines += "- Includes per-career prerequisite summary and subject cutoffs (math/physics/chemistry/biology/language)."
$summaryLines += ""
$summaryLines += "## Cluster Distribution"
$summaryLines += ""
foreach ($grp in $clusterCounts) {
    $summaryLines += "- $($grp.Name): $($grp.Count)"
}
$summaryLines += ""
$summaryLines += "## Files"
$summaryLines += ""
$summaryLines += "- SQL seed: $SqlOut"
$summaryLines += "- Catalog JSON: $CatalogJsonOut"
$summaryLines += "- Adjustment JSON: $AdjustmentJsonOut"

$summaryLines | Out-File -FilePath $SummaryOut -Encoding utf8

Write-Output ("CAREER_ROWS={0}" -f $catalogRows.Count)
Write-Output ("CLUSTER_ROWS={0}" -f $clusterCounts.Count)
Write-Output ("ADJUSTMENT_ROWS={0}" -f $adjustmentRows.Count)
Write-Output ("SQL_OUT={0}" -f $SqlOut)
Write-Output ("SUMMARY_OUT={0}" -f $SummaryOut)
