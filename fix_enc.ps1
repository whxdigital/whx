$files = Get-ChildItem -Path "w:\PT WHX" -Filter "*.html" -Recurse
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $old = $c
    $c = $c.Replace("â€¢", "•")
    $c = $c.Replace("â€™", "’")
    $c = $c.Replace("â€œ", "“")
    $c = $c.Replace("â€", "”")
    $c = $c.Replace("â†’", "→")
    $c = $c.Replace("→", "→")
    $c = $c.Replace([char]0xFFFD, "")
    $c = $c.Replace("?", "")
    if ($old -ne $c) {
        Write-Host "Fixed mojibake in $($f.Name)"
        [System.IO.File]::WriteAllText($f.FullName, $c, [System.Text.Encoding]::UTF8)
    }
}
