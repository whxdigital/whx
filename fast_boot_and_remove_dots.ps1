$rootDir = "w:\PT WHX"

# 1. Update script.js for ultra-fast boot sequence (< 350ms total)
$jsPath = "$rootDir\script.js"
if (Test-Path $jsPath) {
    $js = [System.IO.File]::ReadAllText($jsPath, [System.Text.Encoding]::UTF8)
    
    $oldSeq = @"
      } else {
        setTimeout(() => showLine(0), 100);
        setTimeout(() => { showLine(1); setProgress(25); }, 400);
        setTimeout(() => { showLine(2); setProgress(50); }, 700);
        setTimeout(() => { showLine(3); setProgress(75); }, 1000);
        setTimeout(() => { showLine(4); setProgress(100); }, 1300);
        setTimeout(() => { 
          showLine(5);
        }, 1600);
        setTimeout(() => { 
          if (panel) panel.style.transform = "scale(0.96) translateY(-8px)";
          whxBoot.style.opacity = "0";
          whxBoot.style.pointerEvents = "none";
        }, 2200);
        setTimeout(() => { whxBoot.style.display = "none"; }, 2500);
      }
"@

    $newSeq = @"
      } else {
        lines.forEach(l => { if(l) l.style.opacity = "1"; });
        setProgress(100);
        setTimeout(() => { 
          if (panel) panel.style.transform = "scale(0.98) translateY(-4px)";
          whxBoot.style.opacity = "0";
          whxBoot.style.pointerEvents = "none";
        }, 250);
        setTimeout(() => { whxBoot.style.display = "none"; }, 400);
      }
"@

    $js = $js.Replace($oldSeq, $newSeq)
    [System.IO.File]::WriteAllText($jsPath, $js, [System.Text.Encoding]::UTF8)
    Write-Host "script.js ultra-fast boot timing updated"
}

# 2. Update all index.html files (remove red/yellow/green dots and update inline fast timeout)
$htmlFiles = Get-ChildItem -Path $rootDir -Filter "index.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content

    # Remove dots block
    $content = $content.Replace('<span class="cyber-dot red"></span>', '')
    $content = $content.Replace('<span class="cyber-dot yellow"></span>', '')
    $content = $content.Replace('<span class="cyber-dot green"></span>', '')
    $content = $content.Replace('<span class="cyber-title">WHX_CORE // INITIALIZING</span>', '<span class="cyber-title" style="margin-left:0; color:#f5a623;"><i class="fa-solid fa-terminal" style="font-size:0.75rem; margin-right:6px;"></i>WHX_CORE // INITIALIZING</span>')

    # Update inline timeout from 750 to 300ms
    $content = $content.Replace('}, 750);', '}, 300);')

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated dots & fast timing in $($file.FullName)"
    }
}
