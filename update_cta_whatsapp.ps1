# PowerShell script to update CTA buttons, WhatsApp, remove email duplication, and tighten spacing

$rootDir = "w:\PT WHX"

# 1. Update style.min.css & style.css for tighter, faster-loading spacing
$minCss = [System.IO.File]::ReadAllText("$rootDir\style.min.css", [System.Text.Encoding]::UTF8)
$minCss = $minCss.Replace("min-height:920px;padding:70px 0 30px;", "min-height:auto;padding:36px 0 20px;")
$minCss = $minCss.Replace("--space-section:132px;padding-top:var(--space-section);padding-bottom:var(--space-section)", "--space-section:52px;padding-top:var(--space-section);padding-bottom:var(--space-section)")
$minCss = $minCss.Replace("--space-section:82px;", "--space-section:48px;")
[System.IO.File]::WriteAllText("$rootDir\style.min.css", $minCss, [System.Text.Encoding]::UTF8)

$css = [System.IO.File]::ReadAllText("$rootDir\style.css", [System.Text.Encoding]::UTF8)
$css = $css.Replace("min-height: 920px;", "min-height: auto;")
$css = $css.Replace("padding: 70px 0 30px;", "padding: 36px 0 20px;")
$css = $css.Replace("--space-section: 132px;", "--space-section: 52px;")
$css = $css.Replace("--space-section: 82px;", "--space-section: 48px;")
[System.IO.File]::WriteAllText("$rootDir\style.css", $css, [System.Text.Encoding]::UTF8)
Write-Host "Spacing tightened in CSS files."

# 2. Target replacement for final-cta-actions-wrapper
$newCtaBlock = @'
          <div class="final-cta-actions-wrapper" style="display:flex; flex-direction:column; gap:14px;">
            <div class="final-cta-actions" style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
              <a class="button button-primary whatsapp-cta-btn" href="https://wa.me/351928350275" target="_blank" rel="noopener noreferrer" style="background:#22c55e; border-color:#16a34a; color:#ffffff; font-weight:700; display:inline-flex; align-items:center; gap:8px; box-shadow: 0 8px 24px rgba(34, 197, 94, 0.28); text-decoration:none;">
                <i class="fa-brands fa-whatsapp" style="font-size:1.25rem;"></i> WhatsApp Direct (+351 928 350 275) <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </a>
              <a class="button button-secondary" href="contact.html" style="font-weight:600; text-decoration:none;">
                Book Strategy Session <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
              </a>
            </div>
          </div>
'@

# Find all html files in rootDir and subdirectories
$htmlFiles = Get-ChildItem -Path $rootDir -Filter "*.html" -Recurse

$pattern = '(?s)<div class="final-cta-actions-wrapper".*?</div>\s*</div>\s*</div>\s*</section>'

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content

    # Regex replace for final-cta-actions-wrapper
    if ($content -match '(?s)<div class="final-cta-actions-wrapper".*?</div>\s*</div>\s*</div>\s*</section>') {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?s)<div class="final-cta-actions-wrapper".*?</div>\s*</div>\s*</div>\s*</section>', $newCtaBlock + "`n        </div>`n      </section>")
    }

    # Also update any LinkedIn / Upwork profile link in footers to include WhatsApp
    if ($content.Contains('Verified Upwork Profile') -or $content.Contains('LinkedIn Profile')) {
        $content = $content.Replace('<li><a href="https://www.upwork.com/freelancers/~0187ee99ef01623869?mp_source=share" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-upwork brand-icon brand-upwork" style="color:#14a800 !important;"></i> Verified Upwork Profile</a></li>', '<li><a href="https://wa.me/351928350275" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp brand-icon brand-whatsapp" style="color:#22c55e !important;"></i> WhatsApp Direct (+351 928 350 275)</a></li>')
        $content = $content.Replace('<li><a href="https://www.linkedin.com/in/whxdigital/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-linkedin brand-icon brand-linkedin" style="color:#0a66c2 !important;"></i> LinkedIn Profile</a></li>', '')
    }

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated CTA & WhatsApp in: $($file.FullName)"
    }
}

# 3. Update SyncComponents.cs as well
$syncCompPath = "$rootDir\SyncComponents.cs"
if (Test-Path $syncCompPath) {
    $sc = [System.IO.File]::ReadAllText($syncCompPath, [System.Text.Encoding]::UTF8)
    $sc = $sc.Replace('<li><a href=""https://www.upwork.com/freelancers/~0187ee99ef01623869?mp_source=share"" target=""_blank"" rel=""noopener noreferrer""><i class=""fa-brands fa-upwork brand-icon brand-upwork"" style=""color:#14a800 !important;""></i> Verified Upwork Profile</a></li>', '<li><a href=""https://wa.me/351928350275"" target=""_blank"" rel=""noopener noreferrer""><i class=""fa-brands fa-whatsapp brand-icon brand-whatsapp"" style=""color:#22c55e !important;""></i> WhatsApp Direct (+351 928 350 275)</a></li>')
    $sc = $sc.Replace('<li><a href=""https://www.linkedin.com/in/whxdigital/"" target=""_blank"" rel=""noopener noreferrer""><i class=""fa-brands fa-linkedin brand-icon brand-linkedin"" style=""color:#0a66c2 !important;""></i> LinkedIn Profile</a></li>', '')
    [System.IO.File]::WriteAllText($syncCompPath, $sc, [System.Text.Encoding]::UTF8)
    Write-Host "Updated SyncComponents.cs"
}
