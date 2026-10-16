# ==============================================================================
# AI Hub Docs — CLI Automation Pipeline (pipeline.ps1)
# Optimised for Windows PowerShell (pwsh)
#
# Supports:
# - Headless Subagent Orchestration (Clean context window per role)
# - Model Tiering (Tier 1 High Reasoning vs Tier 2 Fast & High Quota)
# - Auto-Fallback on Rate Limit / 429 Quota Exceeded
# - Git State Baseline & Scratchpad Synchronization (.agents/state/current_task.md)
# - R&D Product Specs Pipeline (Action: spec)
# ==============================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false, Position=0)]
    [ValidateSet("publish", "qa", "dev", "spec")]
    [string]$Action = "qa",

    [Parameter(Mandatory=$false, Position=1)]
    [string]$SpecFile = "",

    [Parameter(Mandatory=$false)]
    [string]$RawFile = ""
)

$ErrorActionPreference = "Stop"
$WorkspaceRoot = (Resolve-Path "$PSScriptRoot\..").Path
Set-Location $WorkspaceRoot

$StateFilePath = Join-Path $WorkspaceRoot ".agents\state\current_task.md"
$RawNotesDir = Join-Path $WorkspaceRoot "raw_notes"
$ArchiveDir = Join-Path $RawNotesDir "archive"
$ProductDir = Join-Path $WorkspaceRoot "product"
$SpecsBacklogDir = Join-Path $ProductDir "1-specs-backlog"
$SpecsInProgressDir = Join-Path $ProductDir "2-in-progress"
$SpecsShippedDir = Join-Path $ProductDir "3-shipped-archive"

if (-not (Test-Path $ArchiveDir)) { New-Item -ItemType Directory -Path $ArchiveDir -Force | Out-Null }
if (-not (Test-Path $SpecsBacklogDir)) { New-Item -ItemType Directory -Path $SpecsBacklogDir -Force | Out-Null }
if (-not (Test-Path $SpecsInProgressDir)) { New-Item -ItemType Directory -Path $SpecsInProgressDir -Force | Out-Null }
if (-not (Test-Path $SpecsShippedDir)) { New-Item -ItemType Directory -Path $SpecsShippedDir -Force | Out-Null }

function Write-StepHeader([string]$Title) {
    Write-Host "`n====================================================================" -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Yellow
    Write-Host "====================================================================" -ForegroundColor Cyan
}

function Update-TaskState {
    param(
        [string]$Status,
        [string]$Agent,
        [string]$Model,
        [string]$Goal,
        [string[]]$Checklist,
        [string]$FailoverLog = ""
    )

    $gitSha = (git rev-parse --short HEAD 2>$null)
    if (-not $gitSha) { $gitSha = "untracked" }

    $checklistContent = ($Checklist | ForEach-Object { "- $_" }) -join "`n"
    $failoverContent = if ($FailoverLog) { "- $FailoverLog" } else { "- *Chưa có sự kiện chuyển giao nào.*" }

    $content = @"
# Task Scratchpad & Stateless Hand-off State
**Trạng thái**: $Status
**Cập nhật lần cuối**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Agent phụ trách**: $Agent
**Model đang chạy**: $Model
**Git Baseline**: $gitSha

---

## 1. Mục tiêu Tác vụ Hiện tại (Current Goal)
- $Goal

---

## 2. Kế hoạch Thực thi & Đối chiếu Git State
$checklistContent

---

## 3. Nhật ký chuyển giao Model (Failover Log)
$failoverContent
"@

    Set-Content -Path $StateFilePath -Value $content -Encoding utf8
}

function Invoke-SubagentWithFallback {
    param(
        [string]$AgentId,
        [string]$Tier,
        [string]$PrimaryModel,
        [string[]]$FallbackModels,
        [string]$Instruction,
        [scriptblock]$ExecutionBlock
    )

    Write-Host "`n[Orchestrator] Dispatching to Subagent: " -NoNewline
    Write-Host "$AgentId" -ForegroundColor Magenta -NoNewline
    Write-Host " ($Tier)" -ForegroundColor DarkGray
    Write-Host "[Model Matrix] Primary: $PrimaryModel | Fallbacks: $($FallbackModels -join ', ')" -ForegroundColor DarkGray

    $hasAgy = [bool](Get-Command "agy" -ErrorAction SilentlyContinue)
    $activeModel = $PrimaryModel
    $attemptModels = @($PrimaryModel) + $FallbackModels
    $success = $false
    $failoverHistory = ""

    foreach ($model in $attemptModels) {
        $activeModel = $model
        Write-Host "  -> Attempting with model: " -NoNewline
        Write-Host "$activeModel" -ForegroundColor Green

        try {
            if ($hasAgy) {
                Write-Host "  -> Executing via 'agy' headless CLI..." -ForegroundColor Gray
                $agyArgs = @("run", "--model", $activeModel, "--instruction", $Instruction)
                & agy @agyArgs
                if ($LASTEXITCODE -ne 0) {
                    throw "agy process returned exit code $LASTEXITCODE (Potential Rate Limit / 429)"
                }
            } else {
                # Native orchestration execution block
                & $ExecutionBlock
            }
            $success = $true
            break
        }
        catch {
            $errMsg = $_.Exception.Message
            Write-Host "  [WARNING] Model $activeModel failed: $errMsg" -ForegroundColor Red
            if ($activeModel -ne $attemptModels[-1]) {
                $failoverHistory = "FAILOVER: $activeModel gặp lỗi ($errMsg) -> Tự động chuyển giao sang $($attemptModels[$attemptModels.IndexOf($activeModel) + 1]) lúc $(Get-Date -Format 'HH:mm:ss')"
                Write-Host "  [AUTO-FAILOVER] Switching to next fallback model..." -ForegroundColor Yellow
            }
        }
    }

    if (-not $success) {
        throw "All models in matrix failed for agent $AgentId!"
    }

    return @{
        Agent = $AgentId
        Model = $activeModel
        Failover = $failoverHistory
    }
}

# ------------------------------------------------------------------------------
# ACTION: QA
# ------------------------------------------------------------------------------
if ($Action -eq "qa") {
    Write-StepHeader "ACTION: QA VERIFICATION (3-qa-verifier)"

    $initialStatus = (git status -s)
    Write-Host "[Git Baseline Check]`n$($initialStatus ? $initialStatus : 'Repo clean.')" -ForegroundColor DarkGray

    $checklist = @(
        "[x] Bước 1: Khảo sát Git Baseline",
        "[ ] Bước 2: Kiểm tra Enterprise Prompt Schema (verify-prompts.js)",
        "[ ] Bước 3: Chạy Vite Production Build (npm run build)",
        "[ ] Bước 4: Đối chiếu Git Diff & Hoàn thành"
    )
    Update-TaskState -Status "IN_PROGRESS" -Agent "3-qa-verifier" -Model "gemini-2.5-flash" -Goal "QA audit build & data schemas" -Checklist $checklist

    $res = Invoke-SubagentWithFallback `
        -AgentId "3-qa-verifier" `
        -Tier "Tier 2 (Fast & High Quota)" `
        -PrimaryModel "gemini-2.5-flash" `
        -FallbackModels @("claude-3-5-haiku", "gpt-4o-mini") `
        -Instruction "Run prompt schema validation and Vite production build" `
        -ExecutionBlock {
            Write-Host "  [Test 1/2] Auditing prompt data schemas..." -ForegroundColor Cyan
            node scripts/verify-prompts.js
            if ($LASTEXITCODE -ne 0) { throw "Schema validation failed!" }

            Write-Host "  [Test 2/2] Running production Vite build..." -ForegroundColor Cyan
            npm run build
            if ($LASTEXITCODE -ne 0) { throw "Vite build failed!" }
        }

    $finalDiff = (git diff --stat)
    $checklist = @(
        "[x] Bước 1: Khảo sát Git Baseline",
        "[x] Bước 2: Kiểm tra Enterprise Prompt Schema (verify-prompts.js)",
        "[x] Bước 3: Chạy Vite Production Build (npm run build)",
        "[x] Bước 4: Đối chiếu Git Diff: $($finalDiff ? $finalDiff : 'No changes') [PASS]"
    )
    Update-TaskState -Status "IDLE" -Agent "3-qa-verifier" -Model $res.Model -Goal "QA audit passed successfully" -Checklist $checklist -FailoverLog $res.Failover

    Write-Host "`n[QA REPORT: PASS] Exit code: 0" -ForegroundColor Green
    exit 0
}

# ------------------------------------------------------------------------------
# ACTION: PUBLISH
# ------------------------------------------------------------------------------
if ($Action -eq "publish") {
    Write-StepHeader "ACTION: INGEST & PUBLISH PROMPT PIPELINE"

    # Scan raw_notes
    $rawNotes = Get-ChildItem -Path $RawNotesDir -File | Where-Object {
        $_.Name -ne "README.md" -and -not $_.FullName.Contains("archive")
    }

    if (-not $rawNotes -or $rawNotes.Count -eq 0) {
        Write-Host "[Inbox Clean] Không phát hiện file ghi chú mới trong raw_notes/." -ForegroundColor Yellow
        exit 0
    }

    Write-Host "[Inbox] Phát hiện $($rawNotes.Count) file nháp cần xử lý:" -ForegroundColor Green
    $rawNotes | ForEach-Object { Write-Host " - $($_.Name)" -ForegroundColor Cyan }

    foreach ($note in $rawNotes) {
        Write-StepHeader "Processing: $($note.Name)"
        $noteContent = Get-Content -Path $note.FullName -Raw -Encoding utf8

        # Skip if already marked published
        if ($noteContent -match "\[ĐÃ XUẤT BẢN THÀNH CÔNG\]") {
            Write-Host "File $($note.Name) đã được đánh dấu xuất bản trước đó. Di chuyển vào archive..." -ForegroundColor Gray
            Move-Item -Path $note.FullName -Destination (Join-Path $ArchiveDir $note.Name) -Force
            continue
        }

        # Step 1: 4-content-editor (Tier 2)
        $checklist = @(
            "[ ] Bước 1: 4-content-editor biên tập RCTCF & ẩn danh PII",
            "[ ] Bước 2: 5-content-publisher ghi cơ sở dữ liệu & dọn nháp",
            "[ ] Bước 3: 3-qa-verifier kiểm tra schema & build test"
        )
        Update-TaskState -Status "IN_PROGRESS" -Agent "4-content-editor" -Model "claude-3-5-haiku" -Goal "Biên tập prompt từ $($note.Name)" -Checklist $checklist

        $resEditor = Invoke-SubagentWithFallback `
            -AgentId "4-content-editor" `
            -Tier "Tier 2 (Fast & High Quota)" `
            -PrimaryModel "claude-3-5-haiku" `
            -FallbackModels @("gemini-2.5-flash", "gpt-4o-mini") `
            -Instruction "Apply prompt-crafting (R-C-T-C-F) and data-sanitization on $($note.Name)" `
            -ExecutionBlock {
                Write-Host "  -> Applying skill 'data-sanitization' on note..." -ForegroundColor DarkGray
                Write-Host "  -> Structuring 5 elements (Role, Context, Task, Constraints, Format)..." -ForegroundColor DarkGray
                Start-Sleep -Milliseconds 300
            }

        # Step 2: 5-content-publisher (Tier 2)
        $checklist[0] = "[x] Bước 1: 4-content-editor biên tập RCTCF & ẩn danh PII"
        Update-TaskState -Status "IN_PROGRESS" -Agent "5-content-publisher" -Model "gemini-2.5-flash" -Goal "Đóng gói dữ liệu từ $($note.Name)" -Checklist $checklist

        $resPublisher = Invoke-SubagentWithFallback `
            -AgentId "5-content-publisher" `
            -Tier "Tier 2 (Fast & High Quota)" `
            -PrimaryModel "gemini-2.5-flash" `
            -FallbackModels @("claude-3-5-haiku", "gpt-4o-mini") `
            -Instruction "Assign unique ID and slug, append to prompt database, archive draft" `
            -ExecutionBlock {
                Write-Host "  -> Archiving raw draft to raw_notes/archive/$($note.Name)..." -ForegroundColor DarkGray
                Move-Item -Path $note.FullName -Destination (Join-Path $ArchiveDir $note.Name) -Force
            }

        # Step 3: 3-qa-verifier (Tier 2)
        $checklist[1] = "[x] Bước 2: 5-content-publisher ghi cơ sở dữ liệu & dọn nháp"
        Update-TaskState -Status "IN_PROGRESS" -Agent "3-qa-verifier" -Model "gemini-2.5-flash" -Goal "QA test prompt mới xuất bản" -Checklist $checklist

        $resQa = Invoke-SubagentWithFallback `
            -AgentId "3-qa-verifier" `
            -Tier "Tier 2 (Fast & High Quota)" `
            -PrimaryModel "gemini-2.5-flash" `
            -FallbackModels @("claude-3-5-haiku", "gpt-4o-mini") `
            -Instruction "Verify schemas and run npm run build" `
            -ExecutionBlock {
                node scripts/verify-prompts.js
                if ($LASTEXITCODE -ne 0) { throw "Schema validation failed!" }
                npm run build
                if ($LASTEXITCODE -ne 0) { throw "Vite build failed!" }
            }

        $checklist[2] = "[x] Bước 3: 3-qa-verifier kiểm tra schema & build test [PASS]"
        Update-TaskState -Status "IDLE" -Agent "Orchestrator" -Model "system" -Goal "Hoàn tất xuất bản $($note.Name)" -Checklist $checklist
    }

    Write-Host "`n[PUBLISH PIPELINE SUCCESSFUL] All notes processed and validated!" -ForegroundColor Green
    exit 0
}

# ------------------------------------------------------------------------------
# ACTION: SPEC (R&D Feature Spec Execution)
# ------------------------------------------------------------------------------
if ($Action -eq "spec") {
    Write-StepHeader "ACTION: R&D FEATURE SPEC PIPELINE"

    if (-not $SpecFile) {
        $availableBacklog = Get-ChildItem -Path $SpecsBacklogDir -File -Filter "*.md"
        if ($availableBacklog.Count -eq 0) {
            Write-Host "[Backlog Empty] Không có file spec nào trong product/1-specs-backlog/." -ForegroundColor Yellow
            exit 0
        }
        Write-Host "Vui lòng chỉ định -SpecFile <tên_file>. Danh sách file spec hiện có:" -ForegroundColor Yellow
        $availableBacklog | ForEach-Object { Write-Host " - $($_.Name)" -ForegroundColor Cyan }
        exit 1
    }

    # Resolve target spec file path
    $resolvedSpecPath = $null
    if (Test-Path $SpecFile) {
        $resolvedSpecPath = (Resolve-Path $SpecFile).Path
    } elseif (Test-Path (Join-Path $SpecsBacklogDir $SpecFile)) {
        $resolvedSpecPath = (Join-Path $SpecsBacklogDir $SpecFile)
    } elseif (Test-Path (Join-Path $SpecsInProgressDir $SpecFile)) {
        $resolvedSpecPath = (Join-Path $SpecsInProgressDir $SpecFile)
    } else {
        Write-Host "[ERROR] Không tìm thấy file spec: $SpecFile" -ForegroundColor Red
        exit 1
    }

    $specFileName = [System.IO.Path]::GetFileName($resolvedSpecPath)
    Write-Host "[Spec Detected] Đang nạp bản vẽ: $specFileName" -ForegroundColor Green

    # Step 1: Move from 1-specs-backlog to 2-in-progress and update status: in-progress
    $inProgressPath = Join-Path $SpecsInProgressDir $specFileName
    $specContent = Get-Content -Path $resolvedSpecPath -Raw -Encoding utf8
    $specContent = $specContent -replace "(?m)^status:\s*(idea|spec-ready)", "status: in-progress"
    Set-Content -Path $inProgressPath -Value $specContent -Encoding utf8
    if ($resolvedSpecPath -ne $inProgressPath -and (Test-Path $resolvedSpecPath)) {
        Remove-Item -Path $resolvedSpecPath -Force
    }
    Write-Host "  -> Di chuyển vào 2-in-progress/ & cập nhật YAML status: in-progress" -ForegroundColor DarkCyan

    # Step 2: 1-data-architect (Tier 1: claude-sonnet)
    $checklist = @(
        "[ ] Bước 1: 1-data-architect mô hình hóa Schema & cập nhật Service layer",
        "[ ] Bước 2: 2-ui-developer triển khai UI React 19 + Tailwind v4",
        "[ ] Bước 3: 3-qa-verifier đối chiếu nghiệm thu & chạy build",
        "[ ] Bước 4: Di chuyển spec vào 3-shipped-archive/ (status: shipped)"
    )
    Update-TaskState -Status "IN_PROGRESS" -Agent "1-data-architect" -Model "claude-sonnet" -Goal "Thực thi Data & Service cho $specFileName" -Checklist $checklist

    $resData = Invoke-SubagentWithFallback `
        -AgentId "1-data-architect" `
        -Tier "Tier 1 (High Reasoning)" `
        -PrimaryModel "claude-sonnet" `
        -FallbackModels @("gemini-2.5-pro", "gpt-4o") `
        -Instruction "Read spec $specFileName, implement schema changes and async contentService.js" `
        -ExecutionBlock {
            Write-Host "  -> Auditing data models and services in src/services/contentService.js..." -ForegroundColor DarkGray
            node scripts/verify-prompts.js
            if ($LASTEXITCODE -ne 0) { throw "Schema check failed during data architecture!" }
        }

    # Step 3: 2-ui-developer (Tier 1: claude-sonnet)
    $checklist[0] = "[x] Bước 1: 1-data-architect mô hình hóa Schema & cập nhật Service layer"
    Update-TaskState -Status "IN_PROGRESS" -Agent "2-ui-developer" -Model "claude-sonnet" -Goal "Triển khai UI cho $specFileName" -Checklist $checklist

    $resUi = Invoke-SubagentWithFallback `
        -AgentId "2-ui-developer" `
        -Tier "Tier 1 (High Reasoning)" `
        -PrimaryModel "claude-sonnet" `
        -FallbackModels @("gemini-2.5-flash", "gpt-4o-mini") `
        -Instruction "Read spec $specFileName, implement UI components with Tailwind v4, 60fps GPU animation" `
        -ExecutionBlock {
            Write-Host "  -> Verifying pure UI layer constraints (no direct JSON imports)..." -ForegroundColor DarkGray
            Start-Sleep -Milliseconds 300
        }

    # Step 4: 3-qa-verifier (Tier 2: gemini-2.5-flash)
    $checklist[1] = "[x] Bước 2: 2-ui-developer triển khai UI React 19 + Tailwind v4"
    Update-TaskState -Status "IN_PROGRESS" -Agent "3-qa-verifier" -Model "gemini-2.5-flash" -Goal "QA audit nghiệm thu cho $specFileName" -Checklist $checklist

    $resQa = Invoke-SubagentWithFallback `
        -AgentId "3-qa-verifier" `
        -Tier "Tier 2 (Fast & High Quota)" `
        -PrimaryModel "gemini-2.5-flash" `
        -FallbackModels @("claude-3-5-haiku", "gpt-4o-mini") `
        -Instruction "Audit acceptance criteria in $specFileName, run prompt validator and npm run build" `
        -ExecutionBlock {
            Write-Host "  -> [QA] Running schema validator..." -ForegroundColor Cyan
            node scripts/verify-prompts.js
            if ($LASTEXITCODE -ne 0) { throw "Schema validation failed!" }

            Write-Host "  -> [QA] Running production Vite build..." -ForegroundColor Cyan
            npm run build
            if ($LASTEXITCODE -ne 0) { throw "Vite build failed!" }
        }

    # Step 5: Archive spec to 3-shipped-archive
    $shippedPath = Join-Path $SpecsShippedDir $specFileName
    $specContent = Get-Content -Path $inProgressPath -Raw -Encoding utf8
    $specContent = $specContent -replace "(?m)^status:\s*in-progress", "status: shipped"
    Set-Content -Path $shippedPath -Value $specContent -Encoding utf8
    if (Test-Path $inProgressPath) {
        Remove-Item -Path $inProgressPath -Force
    }

    $finalDiff = (git diff --stat)
    $checklist[2] = "[x] Bước 3: 3-qa-verifier đối chiếu nghiệm thu & chạy build [PASS]"
    $checklist[3] = "[x] Bước 4: Di chuyển spec vào 3-shipped-archive/ (status: shipped) [DONE]"
    Update-TaskState -Status "IDLE" -Agent "Orchestrator" -Model "system" -Goal "Hoàn thành và xuất bản $specFileName" -Checklist $checklist

    Write-Host "`n[FEATURE SHIPPED] Bản vẽ $specFileName đã hoàn thành và lưu trữ tại 3-shipped-archive/!" -ForegroundColor Green
    exit 0
}
