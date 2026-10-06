$languages = @('en', 'es', 'pt', 'ar', 'fr', 'de', 'it', 'nl')
$rootPath = "w:\PT WHX"

# Generate hreflang tags block
$hreflangTags = "`r`n    <link rel=`"alternate`" hreflang=`"x-default`" href=`"https://whxdigital.com/`" />"
foreach ($lang in $languages) {
    $path = if ($lang -eq 'en') { "" } else { "$lang/" }
    $hreflangTags += "`r`n    <link rel=`"alternate`" hreflang=`"$lang`" href=`"https://whxdigital.com/$path`" />"
}

# Find all HTML files in root
$htmlFiles = Get-ChildItem -Path $rootPath -Filter "*.html" -File

foreach ($lang in $languages) {
    if ($lang -eq 'en') { continue }
    
    $langPath = Join-Path $rootPath $lang
    if (-not (Test-Path $langPath)) {
        New-Item -ItemType Directory -Path $langPath | Out-Null
    }

    foreach ($file in $htmlFiles) {
        $destFile = Join-Path $langPath $file.Name
        Copy-Item -Path $file.FullName -Destination $destFile -Force
        
        # Modify lang attribute and inject hreflang
        $content = Get-Content $destFile -Raw -Encoding UTF8
        
        # Replace <html lang="en"> with appropriate lang
        if ($lang -eq 'ar') {
            $content = $content -replace '<html lang="en">', '<html lang="ar" dir="rtl">'
        } else {
            $content = $content -replace '<html lang="en">', "<html lang=`"$lang`">"
        }
        
        # Inject hreflang before </head> if not exists
        if ($content -notmatch 'hreflang="x-default"') {
            $content = $content -replace '</head>', "$hreflangTags`r`n  </head>"
        }
        
        # Self canonicalize
        $originalCanonical = '<link rel="canonical" href="https://whxdigital.com/" />'
        $newCanonical = "<link rel=`"canonical`" href=`"https://whxdigital.com/$lang/`" />"
        $content = $content -replace [regex]::Escape($originalCanonical), $newCanonical

        # Re-fix paths for assets (since we are in a subfolder)
        # We need to prepend ../ to relative assets, but since it's a simple script, 
        # many assets are absolute or we might need to adjust.
        # For this PoC, we will rely on absolute paths or base tag.
        if ($content -notmatch '<base href="/" />') {
            $content = $content -replace '<head>', "<head>`r`n    <base href=`"/`" />"
        }
        
        [IO.File]::WriteAllText($destFile, $content, [Text.Encoding]::UTF8)
    }
}

# Also inject hreflang to EN root files
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    if ($content -notmatch 'hreflang="x-default"') {
        $content = $content -replace '</head>', "$hreflangTags`r`n  </head>"
        [IO.File]::WriteAllText($file.FullName, $content, [Text.Encoding]::UTF8)
    }
}

Write-Host "Multilingual build completed."
