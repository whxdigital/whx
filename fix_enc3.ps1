$files = Get-ChildItem -Path "w:\PT WHX" -Filter "*.html" -Recurse
foreach ($file in $files) {
    # Read as UTF-8
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    $orig = $content
    
    # Replace the literal ' ? '
    $content = $content -replace ' \? ', ' &middot; '
    
    # Replace &#8594; with a CSS icon
    # Sometimes it's next to text, so add a space if needed, but in the HTML it's usually: 'Read insight &#8594;'
    # Let's replace '&#8594;' with '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>'
    $content = $content -replace '&#8594;', '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>'
    
    if ($content -cne $orig) {
        Write-Host "Fixed issues in $($file.FullName)"
        # Write back without BOM
        $utf8NoBom = New-Object System.Text.UTF8Encoding($False)
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
    }
}
