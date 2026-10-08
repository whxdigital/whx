$htmlFiles = Get-ChildItem -Path "w:\PT WHX" -Filter "*.html" -Recurse | Where-Object { $_.FullName -notmatch '\\(node_modules|\.git|dist|build)\\' }

$inlineScript = @"
    <script>
      window.toggleMobileNav = function(btn) {
        var header = (btn && btn.closest('.site-header')) || document.querySelector('.site-header');
        var nav = header ? header.querySelector('.main-nav') : document.querySelector('.main-nav');
        var toggle = btn || (header ? header.querySelector('.menu-toggle') : document.querySelector('.menu-toggle'));
        if (!nav || !toggle) return;
        var isExpanded = toggle.getAttribute('aria-expanded') === 'true' || nav.classList.contains('open') || nav.classList.contains('nav-open');
        if (isExpanded) {
          nav.classList.remove('open', 'nav-open');
          toggle.setAttribute('aria-expanded', 'false');
          var icon = toggle.querySelector('i');
          if (icon) { icon.className = 'fa-solid fa-bars'; }
        } else {
          nav.classList.add('open', 'nav-open');
          toggle.setAttribute('aria-expanded', 'true');
          var icon = toggle.querySelector('i');
          if (icon) { icon.className = 'fa-solid fa-xmark'; }
        }
      };
    </script>
"@

$count = 0
foreach ($file in $htmlFiles) {
  $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
  $modified = $false

  # 1. Update .menu-toggle button to have onclick="window.toggleMobileNav(this)"
  if ($content -match '<button class="menu-toggle"[^>]*>') {
    # Replace without duplicating onclick
    $newContent = [System.Text.RegularExpressions.Regex]::Replace(
      $content,
      '<button class="menu-toggle"(?: type="button")?(?: aria-label="Open menu")?(?: aria-expanded="false")?(?: onclick="[^"]*")?>',
      '<button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" onclick="window.toggleMobileNav(this)">'
    )
    if ($newContent -ne $content) {
      $content = $newContent
      $modified = $true
    }
  }

  # 2. Add inline helper script if not already in head
  if (-not $content.Contains("window.toggleMobileNav = function")) {
    if ($content.Contains("</head>")) {
      $content = $content.Replace("</head>", "$inlineScript`r`n  </head>")
      $modified = $true
    }
  }

  if ($modified) {
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    $count++
  }
}

Write-Host "Successfully updated $count HTML files with bulletproof mobile menu triggers."
