param (
    [switch]$Watch
)

function Sync-Git {
    $status = git status --porcelain
    if ($status) {
        $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Write-Host "[$timestamp] Changes detected. Staging and committing..." -ForegroundColor Cyan
        git add -A
        git commit -m "Auto update: $timestamp"
        Write-Host "[$timestamp] Pushing to GitHub (origin/main)..." -ForegroundColor Yellow
        git push origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] Successfully pushed to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "[$timestamp] Push failed. Make sure you are authenticated with GitHub (e.g. run 'gh auth login')." -ForegroundColor Red
        }
    } else {
        Write-Host "Working tree is clean. Nothing to commit." -ForegroundColor Gray
    }
}

if ($Watch) {
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host " Starting Auto-Push Watcher in: $(Get-Location)" -ForegroundColor Green
    Write-Host " Every saved file will automatically be pushed!" -ForegroundColor Green
    Write-Host " Press Ctrl+C to stop." -ForegroundColor Yellow
    Write-Host "==================================================" -ForegroundColor Green

    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = (Get-Location).Path
    $watcher.IncludeSubdirectories = $true
    $watcher.EnableRaisingEvents = $true

    $lastPush = [DateTime]::MinValue
    $debounceSeconds = 4

    while ($true) {
        $result = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 2000)
        if (-not $result.TimedOut) {
            if ($result.Name -notlike ".git\*") {
                if (([DateTime]::Now - $lastPush).TotalSeconds -ge $debounceSeconds) {
                    Start-Sleep -Seconds 2
                    Sync-Git
                    $lastPush = [DateTime]::Now
                }
            }
        }
    }
} else {
    Sync-Git
}
