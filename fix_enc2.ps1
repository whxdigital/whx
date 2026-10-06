$files = Get-ChildItem -Path "w:\PT WHX" -Filter "*.html" -Recurse
$utf8NoBom = New-Object System.Text.UTF8Encoding($False)
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, $utf8NoBom)
    
    $orig = $content
    
    $content = $content -replace 'â€¢', '&#8226;'
    $content = $content -replace 'â€™', '&#8217;'
    $content = $content -replace 'â€œ', '&#8220;'
    $content = $content -replace 'â€', '&#8221;'
    $content = $content -replace 'â†’', '&#8594;'
    $content = $content -replace ' \? ', ' &middot; '
    
    if ($content -cne $orig) {
        Write-Host "Fixed encodings in $($file.FullName)"
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
    }
}
