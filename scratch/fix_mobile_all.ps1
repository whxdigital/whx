# Update script.js with global fail-safe mobile navigation system
$scriptPath = "w:\PT WHX\script.js"
$scriptContent = [System.IO.File]::ReadAllText($scriptPath, [System.Text.Encoding]::UTF8)

$globalNavJs = @"
// ==========================================================================
// WHX DIGITAL INSTANT MOBILE NAVIGATION SYSTEM (FAIL-SAFE GLOBAL INITIALIZER)
// ==========================================================================
(function() {
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
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    } else {
      nav.classList.add('open', 'nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      var icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      }
    }
  };

  var initGlobalMenuHandlers = function() {
    document.addEventListener('click', function(e) {
      var toggle = e.target.closest('.menu-toggle');
      if (toggle) {
        e.preventDefault();
        e.stopPropagation();
        window.toggleMobileNav(toggle);
        return;
      }

      var navLink = e.target.closest('.main-nav a');
      if (navLink && window.innerWidth <= 992) {
        var header = navLink.closest('.site-header') || document.querySelector('.site-header');
        var nav = header ? header.querySelector('.main-nav') : document.querySelector('.main-nav');
        var btn = header ? header.querySelector('.menu-toggle') : document.querySelector('.menu-toggle');
        if (nav && btn) {
          nav.classList.remove('open', 'nav-open');
          btn.setAttribute('aria-expanded', 'false');
          var icon = btn.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
          }
        }
        return;
      }

      var openNav = document.querySelector('.main-nav.open, .main-nav.nav-open');
      if (openNav && !openNav.contains(e.target) && !e.target.closest('.menu-toggle')) {
        openNav.classList.remove('open', 'nav-open');
        var btn = document.querySelector('.menu-toggle[aria-expanded="true"]');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
          var icon = btn.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
          }
        }
      }
    }, true);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var openNav = document.querySelector('.main-nav.open, .main-nav.nav-open');
        if (openNav) {
          openNav.classList.remove('open', 'nav-open');
          var btn = document.querySelector('.menu-toggle[aria-expanded="true"]');
          if (btn) {
            btn.setAttribute('aria-expanded', 'false');
            var icon = btn.querySelector('i');
            if (icon) {
              icon.classList.remove('fa-xmark');
              icon.classList.add('fa-bars');
            }
          }
        }
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 992) {
        var openNav = document.querySelector('.main-nav.open, .main-nav.nav-open');
        if (openNav) {
          openNav.classList.remove('open', 'nav-open');
          var btn = document.querySelector('.menu-toggle[aria-expanded="true"]');
          if (btn) {
            btn.setAttribute('aria-expanded', 'false');
            var icon = btn.querySelector('i');
            if (icon) {
              icon.classList.remove('fa-xmark');
              icon.classList.add('fa-bars');
            }
          }
        }
      }
    }, { passive: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalMenuHandlers);
  } else {
    initGlobalMenuHandlers();
  }
})();

"@

# Remove any previous top-level globalNavJs if re-running
if (-not $scriptContent.StartsWith("// ==========================================================================`r`n// WHX DIGITAL INSTANT MOBILE NAVIGATION SYSTEM")) {
  $scriptContent = $globalNavJs + "`r`n" + $scriptContent
  [System.IO.File]::WriteAllText($scriptPath, $scriptContent, [System.Text.Encoding]::UTF8)
  Write-Host "Updated script.js with global instant mobile nav system."
} else {
  Write-Host "script.js already has global mobile nav."
}

# Update style.css & style.min.css with comprehensive mobile rules
$cssPath = "w:\PT WHX\style.css"
$minCssPath = "w:\PT WHX\style.min.css"
$cssContent = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)

# Find marker for mobile nav system
$marker = "/* ============================================================`r`n   ULTRA-RESPONSIVE MOBILE NAVIGATION & HEADER SYSTEM"
if (-not $cssContent.Contains($marker)) {
  $marker = "/* ============================================================`n   ULTRA-RESPONSIVE MOBILE NAVIGATION & HEADER SYSTEM"
}

$mobileCssBlock = @"
/* ============================================================
   ULTRA-RESPONSIVE MOBILE NAVIGATION & COMPLETE MOBILE OS (<= 992px)
   ============================================================ */

@keyframes mobileNavSlideDown {
  0% {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (min-width: 993px) {
  .site-header .menu-toggle {
    display: none !important;
  }
  .site-header .main-nav {
    display: flex !important;
  }
}

@media (max-width: 992px) {
  /* Prevent horizontal overflow globally on mobile */
  html, body {
    overflow-x: hidden !important;
    max-width: 100vw !important;
    width: 100% !important;
  }

  * {
    -webkit-tap-highlight-color: rgba(124, 58, 237, 0.1);
  }

  /* 1. ULTRA-COMPACT FLOATING HEADER */
  .site-header {
    width: min(calc(100vw - 20px), 1200px) !important;
    height: 54px !important;
    min-height: 54px !important;
    padding: 0 14px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    justify-content: space-between !important;
    border-radius: 9999px !important;
    position: fixed !important;
    top: 10px !important;
    z-index: 999999 !important;
    background: rgba(255, 255, 255, 0.96) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(124, 58, 237, 0.16) !important;
    box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08) !important;
    display: flex !important;
    align-items: center !important;
    overflow: visible !important;
    box-sizing: border-box !important;
  }

  .site-header .logo,
  .site-header .logo-wrap {
    display: flex !important;
    align-items: center !important;
    max-height: 38px !important;
    overflow: visible !important;
  }

  .site-header .logo svg,
  .site-header .logo-wrap svg,
  .site-header .agent-nexus-header-svg {
    max-height: 32px !important;
    width: auto !important;
  }

  /* Hamburger Toggle Button */
  .site-header .menu-toggle {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    min-height: 40px !important;
    border-radius: 10px !important;
    background: #f1f5f9 !important;
    border: 1px solid rgba(124, 58, 237, 0.2) !important;
    color: #0f172a !important;
    font-size: 1.15rem !important;
    cursor: pointer !important;
    touch-action: manipulation !important;
    margin-left: auto !important;
    padding: 0 !important;
    outline: none !important;
    flex-shrink: 0 !important;
    z-index: 1000000 !important;
    transition: all 0.2s ease !important;
  }

  .site-header .menu-toggle:hover,
  .site-header .menu-toggle:active,
  .site-header .menu-toggle[aria-expanded="true"] {
    background: rgba(124, 58, 237, 0.12) !important;
    border-color: rgba(124, 58, 237, 0.35) !important;
    color: #7c3aed !important;
    transform: scale(0.96) !important;
  }

  /* Dropdown Mobile Nav Drawer */
  .site-header .main-nav {
    position: absolute !important;
    top: calc(100% + 8px) !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: #ffffff !important;
    border: 1px solid rgba(124, 58, 237, 0.2) !important;
    border-radius: 18px !important;
    box-shadow: 0 20px 48px -8px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(124, 58, 237, 0.08) !important;
    padding: 12px !important;
    flex-direction: column !important;
    display: none !important;
    z-index: 999999 !important;
    max-height: calc(85vh - 70px) !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }

  .site-header .main-nav.open,
  .site-header .main-nav.nav-open {
    display: flex !important;
    animation: mobileNavSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
  }

  .site-header .main-nav .nav-links {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    gap: 5px !important;
    margin: 0 !important;
    padding: 0 !important;
    list-style: none !important;
  }

  .site-header .main-nav .nav-links li {
    display: block !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .site-header .main-nav .nav-links a {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    min-height: 44px !important;
    padding: 10px 14px !important;
    font-size: 0.95rem !important;
    font-weight: 600 !important;
    color: #0f172a !important;
    background: #f8fafc !important;
    border: 1px solid rgba(0, 0, 0, 0.04) !important;
    border-radius: 10px !important;
    text-decoration: none !important;
    transition: all 0.2s ease !important;
    box-sizing: border-box !important;
  }

  .site-header .main-nav .nav-links a:hover,
  .site-header .main-nav .nav-links a:active,
  .site-header .main-nav .nav-links a:focus-visible {
    background: rgba(124, 58, 237, 0.08) !important;
    color: #7c3aed !important;
    border-color: rgba(124, 58, 237, 0.25) !important;
    transform: translateX(3px) !important;
  }

  .site-header .main-nav .nav-item-dashboard {
    margin-left: 0 !important;
    margin-top: 6px !important;
    width: 100% !important;
    border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
    padding-top: 8px !important;
  }

  .site-header .main-nav .nav-dashboard-btn {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    min-height: 46px !important;
    padding: 12px 16px !important;
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 10px !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3) !important;
    text-decoration: none !important;
    box-sizing: border-box !important;
    margin-top: 2px !important;
  }

  .site-header .main-nav .nav-dashboard-btn i {
    color: #ffffff !important;
  }

  /* 2. UNIVERSAL MOBILE HERO & SECTION LAYOUTS */
  .hero,
  .knowledge-hero,
  .voice-hero,
  .case-study-hero,
  .subpage-hero,
  .architecture-hero,
  .article-hero,
  .automation-hero {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    padding-top: 80px !important;
    padding-bottom: 24px !important;
    padding-left: 14px !important;
    padding-right: 14px !important;
    gap: 22px !important;
    min-height: auto !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .hero::before {
    display: none !important;
  }

  .hero-copy,
  .subpage-hero-copy {
    width: 100% !important;
    max-width: 100% !important;
    text-align: left !important;
    box-sizing: border-box !important;
  }

  .saas-hero-badge {
    display: inline-flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    gap: 6px !important;
    font-size: 0.68rem !important;
    padding: 5px 12px !important;
    border-radius: 9999px !important;
    background: rgba(124, 58, 237, 0.08) !important;
    border: 1px solid rgba(124, 58, 237, 0.22) !important;
    color: #7c3aed !important;
    font-weight: 700 !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  .hero-copy h1,
  .subpage-hero-copy h1,
  h1 {
    font-size: clamp(1.85rem, 7vw, 2.5rem) !important;
    line-height: 1.14 !important;
    letter-spacing: -0.04em !important;
    margin: 0 0 10px !important;
    word-break: break-word !important;
    color: #0f172a !important;
    font-weight: 800 !important;
  }

  .lead,
  .subpage-hero-lead {
    font-size: 0.95rem !important;
    line-height: 1.6 !important;
    margin: 0 0 14px !important;
    color: #475569 !important;
  }

  .hero-cta-actions-row {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    width: 100% !important;
    margin-top: 6px !important;
  }

  .hero-cta-actions {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    width: 100% !important;
  }

  .hero-cta-actions .button,
  .button.primary-btn,
  .button.secondary-btn {
    display: flex !important;
    width: 100% !important;
    justify-content: center !important;
    text-align: center !important;
    padding: 13px 18px !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    border-radius: 12px !important;
    box-sizing: border-box !important;
  }

  .hero-trust-proof {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    padding: 10px 12px !important;
    background: rgba(255, 255, 255, 0.85) !important;
    border: 1px solid rgba(124, 58, 237, 0.12) !important;
    border-radius: 12px !important;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04) !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  /* Micro Stats 2x2 Grid */
  .hero-micro-stats {
    grid-column: 1 / -1 !important;
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 8px !important;
    width: 100% !important;
    margin-top: 12px !important;
    padding-top: 12px !important;
    border-top: 1px solid rgba(124, 58, 237, 0.12) !important;
    box-sizing: border-box !important;
  }

  .hero-micro-stats div {
    padding: 10px 12px !important;
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid rgba(124, 58, 237, 0.14) !important;
    border-radius: 12px !important;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03) !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 2px !important;
    box-sizing: border-box !important;
  }

  .hero-micro-stats strong {
    font-size: 0.68rem !important;
    color: #0f172a !important;
    font-weight: 700 !important;
  }

  .hero-micro-stats span {
    font-size: 0.64rem !important;
    color: #64748b !important;
  }

  /* 3. AI CORE & VISUAL NODES */
  .hero-visual {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .ai-core-visual {
    width: 100% !important;
    max-width: 340px !important;
    aspect-ratio: 1 / 0.88 !important;
    border-radius: 18px !important;
    padding: 8px !important;
    margin: 0 auto !important;
    background: rgba(255, 255, 255, 0.82) !important;
    border: 1px solid rgba(124, 58, 237, 0.18) !important;
    box-shadow: 0 12px 32px rgba(91, 33, 182, 0.08) !important;
    position: relative !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }

  .core-node {
    padding: 5px 8px !important;
    border-radius: 8px !important;
    font-size: 0.6rem !important;
    gap: 2px !important;
  }

  .ai-core-center {
    min-width: 118px !important;
    min-height: 72px !important;
    padding: 6px 8px !important;
    border-radius: 12px !important;
  }

  /* 4. GRIDS & CARDS ACROSS ALL PAGES */
  .container,
  .section,
  main {
    max-width: 100vw !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
  }

  .search-grid,
  .build-systems-grid,
  .solutions-grid,
  .insights-grid,
  .services-grid,
  .cards-grid,
  .reviews-grid,
  .faq-grid {
    grid-template-columns: 1fr !important;
    gap: 14px !important;
    width: 100% !important;
  }

  .search-card,
  .service-card,
  .solution-card,
  .case-study-card,
  .systems-faq-card {
    padding: 20px 16px !important;
    border-radius: 16px !important;
    box-sizing: border-box !important;
  }

  .search-radar-card,
  .revenue-calc-shell,
  .aio-geo-shell,
  .intelligent-pipeline {
    padding: 18px 14px !important;
    border-radius: 16px !important;
    margin-bottom: 20px !important;
    box-sizing: border-box !important;
    width: 100% !important;
  }

  .intelligent-pipeline {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
  }

  .intelligent-pipeline .pipeline-arrow {
    display: flex !important;
    justify-content: center !important;
    transform: rotate(90deg) !important;
    margin: 2px 0 !important;
  }

  /* 5. FORMS, MODALS & INPUT CONTROLS */
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"],
  input[type="url"],
  select,
  textarea {
    font-size: 16px !important; /* Prevents iOS auto-zoom */
    min-height: 44px !important;
    border-radius: 10px !important;
    box-sizing: border-box !important;
  }

  .client-auth-modal,
  .profile-switcher-modal,
  .contact-modal {
    width: min(calc(100vw - 20px), 480px) !important;
    margin: 12px auto !important;
    padding: 20px 16px !important;
    border-radius: 18px !important;
    max-height: 90vh !important;
    overflow-y: auto !important;
    box-sizing: border-box !important;
  }

  /* 6. RESPONSIVE TABLES & CODE BLOCKS */
  table,
  .comparison-table-wrapper,
  .table-responsive,
  pre,
  code {
    max-width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }

  /* 7. FOOTER STACK */
  .site-footer {
    padding: 36px 16px 24px !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 20px !important;
  }
}

@media (max-width: 480px) {
  .hero {
    padding-left: 10px !important;
    padding-right: 10px !important;
    gap: 18px !important;
  }

  .hero-copy h1 {
    font-size: 1.85rem !important;
    line-height: 1.15 !important;
  }

  .hero-micro-stats {
    grid-template-columns: 1fr 1fr !important;
    gap: 6px !important;
  }

  .hero-micro-stats div {
    padding: 8px 10px !important;
  }
}
"@

# Replace from marker to end of file in style.css
$idx = $cssContent.IndexOf($marker)
if ($idx -ge 0) {
  $newCss = $cssContent.Substring(0, $idx) + $mobileCssBlock
} else {
  $newCss = $cssContent + "`r`n" + $mobileCssBlock
}

[System.IO.File]::WriteAllText($cssPath, $newCss, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($minCssPath, $newCss, [System.Text.Encoding]::UTF8)
Write-Host "Updated style.css and style.min.css with complete mobile design system."
