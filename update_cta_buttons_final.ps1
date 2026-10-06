$rootDir = "w:\PT WHX"

# Target CTA block
$newCtaBlock = @'
          <div class="final-cta-actions-wrapper" style="display:flex; flex-direction:column; gap:16px;">
            <div class="final-cta-actions" style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-top:4px;">
              <a class="button button-primary whatsapp-cta-btn" href="https://wa.me/351928350275" target="_blank" rel="noopener noreferrer" style="background:#22c55e; border-color:#16a34a; color:#ffffff; font-weight:700; display:inline-flex; align-items:center; gap:10px; padding:12px 22px; min-height:48px; border-radius:10px; box-shadow:0 8px 24px rgba(34, 197, 94, 0.28); text-decoration:none;">
                <i class="fa-brands fa-whatsapp" style="font-size:1.25rem;"></i> WhatsApp <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </a>
              <a class="button button-secondary" href="contact.html" style="font-weight:600; display:inline-flex; align-items:center; gap:10px; padding:12px 22px; min-height:48px; border-radius:10px; text-decoration:none;">
                <i class="fa-solid fa-calendar-check" style="font-size:1rem; color:#f5a623;"></i> Book Strategy Session <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
          </div>
'@

# Find all html files
$htmlFiles = Get-ChildItem -Path $rootDir -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content

    # Replace CTA wrapper
    if ($content -match '(?s)<div class="final-cta-actions-wrapper".*?</div>\s*</div>\s*</div>\s*</section>') {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?s)<div class="final-cta-actions-wrapper".*?</div>\s*</div>\s*</div>\s*</section>', $newCtaBlock + "`n        </div>`n      </section>")
    }

    # Also update footer links to say "WhatsApp"
    $content = $content.Replace('WhatsApp Direct', 'WhatsApp')

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated $($file.FullName)"
    }
}

# Update SyncComponents.cs
$scPath = "$rootDir\SyncComponents.cs"
if (Test-Path $scPath) {
    $sc = [System.IO.File]::ReadAllText($scPath, [System.Text.Encoding]::UTF8)
    $sc = $sc.Replace("WhatsApp Direct", "WhatsApp")
    [System.IO.File]::WriteAllText($scPath, $sc, [System.Text.Encoding]::UTF8)
    Write-Host "Updated SyncComponents.cs"
}
