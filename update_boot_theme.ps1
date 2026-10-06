$path = "w:\PT WHX\style.min.css"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# 1. Background radial gradient
$content = $content.Replace("background:radial-gradient(circle at center,#1b0f36 0%,#080414 100%);color:#a78bfa;", "background:radial-gradient(circle at 50% 40%,#17171c 0%,#0b0b0d 100%);color:#e2e8f0;")

# 2. Before grid pattern
$content = $content.Replace("linear-gradient(135deg,rgba(0,240,255,0.1) 0%,transparent 50%,rgba(124,58,237,0.1) 100%)", "linear-gradient(to right,rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:36px 36px")

# 3. Cyber boot panel
$content = $content.Replace("background:rgba(15,23,42,0.94);border:1px solid rgba(167,139,250,0.35);border-radius:14px;box-shadow:0 0 40px rgba(124,58,237,0.28),inset 0 0 20px rgba(124,58,237,0.12);", "background:rgba(18,18,23,0.96);border:1px solid #27272d;border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,0.8),0 0 30px rgba(245,166,35,0.12),inset 0 1px 0 rgba(255,255,255,0.08);")

# 4. Code lines
$content = $content.Replace(".code-line:nth-child(1){animation-delay:0.05s;color:#c4b5fd}", ".code-line:nth-child(1){animation-delay:0.05s;color:#94a3b8}")
$content = $content.Replace(".code-line:nth-child(4){animation-delay:0.62s;color:#f472b6}", ".code-line:nth-child(4){animation-delay:0.62s;color:#f5a623}")

# 5. Progress fill
$content = $content.Replace("background:linear-gradient(90deg,#7c3aed,#10b981);box-shadow:0 0 10px #10b981;", "background:linear-gradient(90deg,#f5a623,#10b981);box-shadow:0 0 12px rgba(16,185,129,0.5);")

[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Host "style.min.css updated successfully"

# Also update style.css
$cssPath = "w:\PT WHX\style.css"
if (Test-Path $cssPath) {
    $cssContent = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)
    $cssContent = $cssContent.Replace("radial-gradient(circle at center, #1b0f36 0%, #080414 100%)", "radial-gradient(circle at 50% 40%, #17171c 0%, #0b0b0d 100%)")
    $cssContent = $cssContent.Replace("color: #a78bfa;", "color: #e2e8f0;")
    $cssContent = $cssContent.Replace("linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, transparent 50%, rgba(124, 58, 237, 0.1) 100%)", "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 36px 36px")
    $cssContent = $cssContent.Replace("rgba(15, 23, 42, 0.94)", "rgba(18, 18, 23, 0.96)")
    $cssContent = $cssContent.Replace("rgba(167, 139, 250, 0.35)", "#27272d")
    $cssContent = $cssContent.Replace("0 0 40px rgba(124, 58, 237, 0.28), inset 0 0 20px rgba(124, 58, 237, 0.12)", "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 166, 35, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08)")
    $cssContent = $cssContent.Replace("linear-gradient(90deg, #7c3aed, #10b981)", "linear-gradient(90deg, #f5a623, #10b981)")
    $cssContent = $cssContent.Replace("box-shadow: 0 0 10px #10b981;", "box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);")
    $cssContent = $cssContent.Replace("color: #c4b5fd;", "color: #94a3b8;")
    $cssContent = $cssContent.Replace("color: #f472b6;", "color: #f5a623;")
    [System.IO.File]::WriteAllText($cssPath, $cssContent, [System.Text.Encoding]::UTF8)
    Write-Host "style.css updated successfully"
}
