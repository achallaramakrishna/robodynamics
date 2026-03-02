param(
    [string]$BaseUrl = "http://127.0.0.1:8080",
    [string]$ParentUser = "",
    [string]$ParentPassword = "",
    [string]$StudentUser = "",
    [string]$StudentPassword = "",
    [string]$OutputDir = "artifacts/aptipath-automation",
    [int]$TimeoutSec = 25
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function New-WebSession {
    return New-Object Microsoft.PowerShell.Commands.WebRequestSession
}

function Invoke-HttpRaw {
    param(
        [Parameter(Mandatory = $true)][string]$Method,
        [Parameter(Mandatory = $true)][string]$Url,
        [string]$Body = "",
        [Microsoft.PowerShell.Commands.WebRequestSession]$WebSession = $null
    )

    $result = [ordered]@{
        StatusCode = 0
        Location = ""
        Body = ""
        Headers = @{}
        Error = ""
        DurationMs = 0
    }

    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    try {
        $uri = [System.Uri]$Url
        $request = [System.Net.HttpWebRequest]::Create($uri)
        $request.Method = $Method.ToUpperInvariant()
        $request.AllowAutoRedirect = $false
        $request.Timeout = $TimeoutSec * 1000
        $request.ReadWriteTimeout = $TimeoutSec * 1000
        $request.UserAgent = "AptiPathAutomation/1.0"

        if ($WebSession -ne $null -and $WebSession.Cookies -ne $null) {
            $request.CookieContainer = $WebSession.Cookies
        } else {
            $request.CookieContainer = New-Object System.Net.CookieContainer
        }

        if ($Body -ne "") {
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($Body)
            $request.ContentType = "application/x-www-form-urlencoded"
            $request.ContentLength = $bytes.Length
            $stream = $request.GetRequestStream()
            $stream.Write($bytes, 0, $bytes.Length)
            $stream.Close()
        }

        $response = $null
        try {
            $response = [System.Net.HttpWebResponse]$request.GetResponse()
        } catch [System.Net.WebException] {
            if ($_.Exception.Response -ne $null) {
                $response = [System.Net.HttpWebResponse]$_.Exception.Response
            } else {
                throw
            }
        }

        if ($response -ne $null) {
            $result.StatusCode = [int]$response.StatusCode
            $result.Location = [string]$response.Headers["Location"]
            $result.Headers = $response.Headers

            $respStream = $response.GetResponseStream()
            if ($respStream -ne $null) {
                $reader = New-Object System.IO.StreamReader($respStream)
                $result.Body = [string]$reader.ReadToEnd()
                $reader.Dispose()
            }
            $response.Close()
        }
    } catch {
        $result.Error = [string]$_.Exception.Message
    } finally {
        $sw.Stop()
        $result.DurationMs = [int]$sw.ElapsedMilliseconds
    }

    return [pscustomobject]$result
}

function Is-LoginGated {
    param(
        [Parameter(Mandatory = $true)]$HttpResult
    )
    $status = [int]$HttpResult.StatusCode
    $location = [string]$HttpResult.Location
    $body = [string]$HttpResult.Body
    $redirectHint = ($location -match "/login") -or ($body -match "/login") -or ($body -match "redirect-url=['`"]?/login")
    return (($status -in @(302, 303, 401, 403)) -and $redirectHint)
}

function Validate-Scenario {
    param(
        [Parameter(Mandatory = $true)]$Scenario,
        [Parameter(Mandatory = $true)]$HttpResult
    )
    $passed = $true
    $notes = New-Object System.Collections.Generic.List[string]

    if ($Scenario.ExpectStatuses.Count -gt 0 -and ($Scenario.ExpectStatuses -notcontains [int]$HttpResult.StatusCode)) {
        $passed = $false
        $notes.Add("Unexpected status $($HttpResult.StatusCode). Expected: $($Scenario.ExpectStatuses -join ',').")
    }

    if ($Scenario.RequireLoginGate -eq $true -and (-not (Is-LoginGated -HttpResult $HttpResult))) {
        $passed = $false
        $notes.Add("Route is not login-gated as expected.")
    }

    if ($Scenario.MustContain.Count -gt 0) {
        foreach ($needle in $Scenario.MustContain) {
            if ([string]::IsNullOrWhiteSpace($needle)) { continue }
            if (-not ([string]$HttpResult.Body).Contains($needle)) {
                $passed = $false
                $notes.Add("Body missing text: '$needle'.")
            }
        }
    }

    if ($Scenario.MustContainAny.Count -gt 0) {
        $matched = $false
        foreach ($needle in $Scenario.MustContainAny) {
            if ([string]::IsNullOrWhiteSpace($needle)) { continue }
            if (([string]$HttpResult.Body).Contains($needle)) {
                $matched = $true
                break
            }
        }
        if (-not $matched) {
            $passed = $false
            $notes.Add("Body missing all expected markers: $($Scenario.MustContainAny -join ' | ').")
        }
    }

    if (-not [string]::IsNullOrWhiteSpace($HttpResult.Error)) {
        $passed = $false
        $notes.Add("Request error: $($HttpResult.Error)")
    }

    return [pscustomobject]@{
        Passed = $passed
        Notes = ($notes -join " ")
    }
}

function Add-Scenario {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Path,
        [int[]]$ExpectStatuses,
        [bool]$RequireLoginGate = $false,
        [string[]]$MustContain = @(),
        [string[]]$MustContainAny = @()
    )
    return [pscustomobject]@{
        Name = $Name
        Method = $Method
        Path = $Path
        ExpectStatuses = $ExpectStatuses
        RequireLoginGate = $RequireLoginGate
        MustContain = $MustContain
        MustContainAny = $MustContainAny
    }
}

function Run-ScenarioSet {
    param(
        [string]$SetName,
        [System.Collections.IEnumerable]$Scenarios,
        [Microsoft.PowerShell.Commands.WebRequestSession]$WebSession = $null
    )
    $rows = New-Object System.Collections.Generic.List[object]
    foreach ($scenario in $Scenarios) {
        $url = ($BaseUrl.TrimEnd("/") + $scenario.Path)
        $http = Invoke-HttpRaw -Method $scenario.Method -Url $url -WebSession $WebSession
        $validation = Validate-Scenario -Scenario $scenario -HttpResult $http
        $rows.Add([pscustomobject]@{
            Set = $SetName
            Scenario = $scenario.Name
            Method = $scenario.Method
            Path = $scenario.Path
            Status = $http.StatusCode
            Passed = $validation.Passed
            DurationMs = $http.DurationMs
            Location = $http.Location
            Notes = $validation.Notes
        })
    }
    return $rows
}

function UrlEncode {
    param([string]$Value)
    return [System.Uri]::EscapeDataString($Value)
}

function Login-Session {
    param(
        [Parameter(Mandatory = $true)][string]$UserName,
        [Parameter(Mandatory = $true)][string]$Password
    )
    $session = New-WebSession
    [void](Invoke-HttpRaw -Method "GET" -Url ($BaseUrl.TrimEnd("/") + "/login") -WebSession $session)
    $payload = "userName=$(UrlEncode $UserName)&password=$(UrlEncode $Password)"
    $loginResp = Invoke-HttpRaw -Method "POST" -Url ($BaseUrl.TrimEnd("/") + "/login") -Body $payload -WebSession $session

    $ok = $false
    if ($loginResp.StatusCode -in @(302, 303)) {
        $ok = $true
    } elseif ($loginResp.StatusCode -eq 200) {
        $body = [string]$loginResp.Body
        $ok = -not ($body.Contains("Incorrect password") -or $body.Contains("No account found") -or $body.Contains("inactive"))
    }

    return [pscustomobject]@{
        Success = $ok
        Session = $session
        Status = $loginResp.StatusCode
        Location = $loginResp.Location
        Body = $loginResp.Body
    }
}

if (-not (Test-Path $OutputDir)) {
    New-Item -Path $OutputDir -ItemType Directory | Out-Null
}

$publicScenarios = @(
    (Add-Scenario -Name "Login page loads" -Method "GET" -Path "/login" -ExpectStatuses @(200) -MustContainAny @("Login", "User Name")),
    (Add-Scenario -Name "Parent home is gated for guest" -Method "GET" -Path "/aptipath/parent/home" -ExpectStatuses @(302,303,401,403) -RequireLoginGate $true),
    (Add-Scenario -Name "Student home is gated for guest" -Method "GET" -Path "/aptipath/student/home" -ExpectStatuses @(302,303,401,403) -RequireLoginGate $true),
    (Add-Scenario -Name "Student intake is gated for guest" -Method "GET" -Path "/aptipath/student/intake" -ExpectStatuses @(302,303,401,403) -RequireLoginGate $true),
    (Add-Scenario -Name "Student test is gated for guest" -Method "GET" -Path "/aptipath/student/test" -ExpectStatuses @(302,303,401,403) -RequireLoginGate $true),
    (Add-Scenario -Name "Checkout route responds" -Method "GET" -Path "/plans/checkout?plan=career-premium" -ExpectStatuses @(200,302,303,401,403)),
    (Add-Scenario -Name "Parent registration route responds" -Method "GET" -Path "/registerParentChild?plan=career-premium" -ExpectStatuses @(200,302,303,401,403)),
    (Add-Scenario -Name "VidaPath careers API responds" -Method "GET" -Path "/vidapath/api/future-careers" -ExpectStatuses @(200,302,303,401,403))
)

$allRows = New-Object System.Collections.Generic.List[object]
$allRows.AddRange((Run-ScenarioSet -SetName "guest" -Scenarios $publicScenarios))

if (-not [string]::IsNullOrWhiteSpace($ParentUser) -and -not [string]::IsNullOrWhiteSpace($ParentPassword)) {
    $parentLogin = Login-Session -UserName $ParentUser -Password $ParentPassword
    $allRows.Add([pscustomobject]@{
        Set = "auth-parent"
        Scenario = "Parent login"
        Method = "POST"
        Path = "/login"
        Status = $parentLogin.Status
        Passed = $parentLogin.Success
        DurationMs = 0
        Location = $parentLogin.Location
        Notes = if ($parentLogin.Success) { "Login success" } else { "Login failed" }
    })
    if ($parentLogin.Success) {
        $parentScenarios = @(
            (Add-Scenario -Name "Parent AptiPath home opens" -Method "GET" -Path "/aptipath/parent/home" -ExpectStatuses @(200)),
            (Add-Scenario -Name "Checkout opens for parent session" -Method "GET" -Path "/plans/checkout?plan=career-premium" -ExpectStatuses @(200,302,303))
        )
        $allRows.AddRange((Run-ScenarioSet -SetName "auth-parent" -Scenarios $parentScenarios -WebSession $parentLogin.Session))
    }
}

if (-not [string]::IsNullOrWhiteSpace($StudentUser) -and -not [string]::IsNullOrWhiteSpace($StudentPassword)) {
    $studentLogin = Login-Session -UserName $StudentUser -Password $StudentPassword
    $allRows.Add([pscustomobject]@{
        Set = "auth-student"
        Scenario = "Student login"
        Method = "POST"
        Path = "/login"
        Status = $studentLogin.Status
        Passed = $studentLogin.Success
        DurationMs = 0
        Location = $studentLogin.Location
        Notes = if ($studentLogin.Success) { "Login success" } else { "Login failed" }
    })
    if ($studentLogin.Success) {
        $studentScenarios = @(
            (Add-Scenario -Name "Student AptiPath home opens" -Method "GET" -Path "/aptipath/student/home" -ExpectStatuses @(200)),
            (Add-Scenario -Name "Student intake opens" -Method "GET" -Path "/aptipath/student/intake" -ExpectStatuses @(200,302,303)),
            (Add-Scenario -Name "Student test screen route responds" -Method "GET" -Path "/aptipath/student/test" -ExpectStatuses @(200,302,303))
        )
        $allRows.AddRange((Run-ScenarioSet -SetName "auth-student" -Scenarios $studentScenarios -WebSession $studentLogin.Session))
    }
}

$total = $allRows.Count
$passed = ($allRows | Where-Object { $_.Passed }).Count
$failed = $total - $passed
$runAt = Get-Date
$runId = $runAt.ToString("yyyyMMdd_HHmmss")

$jsonPath = Join-Path $OutputDir ("aptipath_automation_" + $runId + ".json")
$mdPath = Join-Path $OutputDir ("aptipath_automation_" + $runId + ".md")

$report = [ordered]@{
    runId = $runId
    runAt = $runAt.ToString("s")
    baseUrl = $BaseUrl
    summary = [ordered]@{
        total = $total
        passed = $passed
        failed = $failed
        passRatePercent = if ($total -gt 0) { [math]::Round(($passed * 100.0) / $total, 1) } else { 0.0 }
    }
    scenarios = $allRows
}
$report | ConvertTo-Json -Depth 8 | Out-File -FilePath $jsonPath -Encoding utf8

$md = New-Object System.Text.StringBuilder
[void]$md.AppendLine("# AptiPath Automation Report")
[void]$md.AppendLine("")
[void]$md.AppendLine("- Run ID: $runId")
[void]$md.AppendLine("- Run At: $($runAt.ToString("yyyy-MM-dd HH:mm:ss"))")
[void]$md.AppendLine("- Base URL: $BaseUrl")
[void]$md.AppendLine("- Summary: Passed **$passed/$total**, Failed **$failed**")
[void]$md.AppendLine("")
[void]$md.AppendLine("| Set | Scenario | Method | Path | Status | Result | Notes |")
[void]$md.AppendLine("|---|---|---|---|---:|---|---|")
foreach ($row in $allRows) {
    $resultLabel = if ($row.Passed) { "PASS" } else { "FAIL" }
    $notes = ([string]$row.Notes).Replace("|", "/")
    [void]$md.AppendLine("| $($row.Set) | $($row.Scenario) | $($row.Method) | $($row.Path) | $($row.Status) | $resultLabel | $notes |")
}
$md.ToString() | Out-File -FilePath $mdPath -Encoding utf8

Write-Host "AptiPath automation complete."
Write-Host "Summary: Passed $passed / $total, Failed $failed"
Write-Host "JSON report: $jsonPath"
Write-Host "Markdown report: $mdPath"

if ($failed -gt 0) {
    exit 1
}
exit 0
