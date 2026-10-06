$rootDir = "w:\PT WHX"
$htmlFiles = Get-ChildItem -Path $rootDir -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content

    $content = $content.Replace("WhatsApp Direct (+351 928 350 275)", "WhatsApp Direct")
    $content = $content.Replace("WhatsApp (+351 928 350 275)", "WhatsApp Direct")
    $content = $content.Replace("+351 928 350 275", "WhatsApp Direct")

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated $($file.FullName)"
    }
}

# Update SyncComponents.cs
$scPath = "$rootDir\SyncComponents.cs"
if (Test-Path $scPath) {
    $sc = [System.IO.File]::ReadAllText($scPath, [System.Text.Encoding]::UTF8)
    $sc = $sc.Replace("WhatsApp Direct (+351 928 350 275)", "WhatsApp Direct")
    [System.IO.File]::WriteAllText($scPath, $sc, [System.Text.Encoding]::UTF8)
    Write-Host "Updated SyncComponents.cs"
}

# Update script.js if any text mentions it
$jsPath = "$rootDir\script.js"
if (Test-Path $jsPath) {
    $js = [System.IO.File]::ReadAllText($jsPath, [System.Text.Encoding]::UTF8)
    $js = $js.Replace("WhatsApp Direct (+351 928 350 275)", "WhatsApp Direct")
    $js = $js.Replace("+351 928 350 275", "WhatsApp Direct")
    [System.IO.File]::WriteAllText($jsPath, $js, [System.Text.Encoding]::UTF8)
    Write-Host "Updated script.js"
}
