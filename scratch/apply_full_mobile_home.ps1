$cssPath = "w:\PT WHX\style.css"
$minCssPath = "w:\PT WHX\style.min.css"
$cssContent = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)

# Find marker for mobile nav system
$marker = "/* ============================================================`r`n   ULTRA-RESPONSIVE MOBILE NAVIGATION & COMPLETE MOBILE OS (<= 992px)"
if (-not $cssContent.Contains($marker)) {
  $marker = "/* ============================================================`n   ULTRA-RESPONSIVE MOBILE NAVIGATION & COMPLETE MOBILE OS (<= 992px)"
}
if (-not $cssContent.Contains($marker)) {
  $marker = "/* ============================================================`r`n   ULTRA-RESPONSIVE MOBILE NAVIGATION & HEADER SYSTEM"
}
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

@keyframes pulseGlowSoft {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.03); }
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
  /* ==========================================
     GLOBAL MOBILE RESETS & VIEWPORT GOVERNANCE
     ========================================== */
  html, body {
    overflow-x: hidden !important;
    max-width: 100vw !important;
    width: 100% !important;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
  }

  * {
    -webkit-tap-highlight-color: rgba(124, 58, 237, 0.1);
    box-sizing: border-box !important;
  }

  main, section, .section, .container, .site-header, .site-footer {
    max-width: 100vw !important;
    overflow-x: hidden !important;
  }

  /* ==========================================
     1. FLOATING HEADER & MOBILE NAVIGATION DRAWER
     ========================================== */
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
    max-height: 30px !important;
    width: auto !important;
  }

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
    margin-top: 2px !important;
  }

  /* ==========================================
     2. HERO SECTION & DUAL-ENGINE HEADINGS
     ========================================== */
  .hero,
  .subpage-hero {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    padding-top: 78px !important;
    padding-bottom: 24px !important;
    padding-left: 14px !important;
    padding-right: 14px !important;
    gap: 20px !important;
    min-height: auto !important;
    width: 100% !important;
  }

  .hero::before {
    display: none !important;
  }

  .hero-copy,
  .subpage-hero-copy {
    width: 100% !important;
    max-width: 100% !important;
    text-align: left !important;
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
  }

  .eyebrow {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    gap: 8px !important;
    font-size: 0.7rem !important;
    margin: 10px 0 !important;
    color: #334155 !important;
  }

  .system-online-indicator {
    font-size: 0.65rem !important;
    padding: 2px 8px !important;
    border-radius: 999px !important;
  }

  .hero-copy h1,
  .subpage-hero-copy h1,
  h1 {
    font-size: clamp(1.85rem, 7.2vw, 2.45rem) !important;
    line-height: 1.14 !important;
    letter-spacing: -0.04em !important;
    margin: 0 0 10px !important;
    word-break: break-word !important;
    color: #0f172a !important;
    font-weight: 800 !important;
  }

  .whx-rotating-services {
    display: inline-flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    font-size: 0.8rem !important;
    padding: 6px 10px !important;
    border-radius: 8px !important;
    background: rgba(124, 58, 237, 0.06) !important;
    border: 1px solid rgba(124, 58, 237, 0.16) !important;
    color: #7c3aed !important;
    font-weight: 700 !important;
    margin-bottom: 10px !important;
    width: 100% !important;
  }

  .lead {
    font-size: 0.94rem !important;
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
  .button.button-primary,
  .button.button-secondary {
    display: flex !important;
    width: 100% !important;
    justify-content: center !important;
    text-align: center !important;
    padding: 13px 18px !important;
    min-height: 48px !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    border-radius: 12px !important;
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
  }

  .hero-visual {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .ai-core-visual {
    width: 100% !important;
    max-width: 330px !important;
    aspect-ratio: 1 / 0.88 !important;
    border-radius: 18px !important;
    padding: 8px !important;
    margin: 0 auto !important;
    background: rgba(255, 255, 255, 0.82) !important;
    border: 1px solid rgba(124, 58, 237, 0.18) !important;
    box-shadow: 0 12px 32px rgba(91, 33, 182, 0.08) !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .core-node {
    padding: 5px 8px !important;
    border-radius: 8px !important;
    font-size: 0.6rem !important;
    gap: 2px !important;
  }

  .ai-core-center {
    min-width: 116px !important;
    min-height: 70px !important;
    padding: 6px 8px !important;
    border-radius: 12px !important;
  }

  .hero-micro-stats {
    grid-column: 1 / -1 !important;
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 8px !important;
    width: 100% !important;
    margin-top: 10px !important;
    padding-top: 12px !important;
    border-top: 1px solid rgba(124, 58, 237, 0.12) !important;
  }

  .hero-micro-stats div {
    padding: 10px 10px !important;
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid rgba(124, 58, 237, 0.14) !important;
    border-radius: 12px !important;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03) !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 2px !important;
  }

  /* ==========================================
     3. ANSWER-FIRST & DUAL-ENGINE NAV SWITCHER
     ========================================== */
  .answer-first {
    padding: 22px 14px !important;
    margin: 18px 0 !important;
    border-radius: 16px !important;
  }

  .answer-first h2 {
    font-size: 1.4rem !important;
    line-height: 1.25 !important;
    margin-bottom: 8px !important;
  }

  .dual-engine-nav-bar {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    width: 100% !important;
    margin: 18px 0 22px !important;
  }

  .engine-nav-tab {
    width: 100% !important;
    padding: 12px 14px !important;
    border-radius: 12px !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
  }

  /* ==========================================
     4. PRIORITY SEARCH SERVICES CARDS (01 - 04)
     ========================================== */
  .search-services-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 16px !important;
    width: 100% !important;
  }

  .search-service-card {
    padding: 20px 16px !important;
    border-radius: 18px !important;
    width: 100% !important;
  }

  .search-card-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
  }

  .card-telemetry-strip {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    margin: 10px 0 !important;
  }

  .search-feature-list {
    padding: 0 !important;
    margin: 14px 0 !important;
    list-style: none !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
  }

  .search-feature-list li {
    font-size: 0.86rem !important;
    line-height: 1.45 !important;
    display: flex !important;
    align-items: flex-start !important;
    gap: 8px !important;
  }

  .search-card-footer {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    margin-top: 14px !important;
    padding-top: 14px !important;
    border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
  }

  .search-card-cta {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
    padding: 12px 16px !important;
    min-height: 46px !important;
    border-radius: 10px !important;
    text-align: center !important;
  }

  /* ==========================================
     5. 25KM GEO-GRID PROXIMITY RADAR SIMULATOR
     ========================================== */
  .gmp-interactive-mockup-wrapper {
    padding: 16px 12px !important;
    border-radius: 18px !important;
    margin-bottom: 22px !important;
    width: 100% !important;
  }

  .mockup-header-strip {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
  }

  .mockup-status-tag {
    font-size: 0.68rem !important;
    padding: 4px 10px !important;
    width: 100% !important;
    text-align: center !important;
    justify-content: center !important;
  }

  .mockup-presets-bar {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
    width: 100% !important;
    overflow: hidden !important;
  }

  .preset-chips-scroll {
    display: flex !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    width: 100% !important;
    gap: 6px !important;
    padding-bottom: 4px !important;
  }

  .preset-chip {
    flex-shrink: 0 !important;
    font-size: 0.74rem !important;
    padding: 6px 12px !important;
    min-height: 38px !important;
  }

  .mockup-body-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 18px !important;
    width: 100% !important;
  }

  .mockup-search-bar {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    padding: 10px !important;
    border-radius: 12px !important;
  }

  #mockup-search-input {
    width: 100% !important;
    min-height: 42px !important;
    font-size: 0.88rem !important;
  }

  #mockup-search-btn {
    width: 100% !important;
    min-height: 42px !important;
    justify-content: center !important;
  }

  .search-tag-local {
    width: 100% !important;
    font-size: 0.72rem !important;
    text-align: center !important;
    justify-content: center !important;
  }

  .mockup-3pack-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    width: 100% !important;
  }

  .pack-item {
    padding: 12px 10px !important;
    border-radius: 12px !important;
    gap: 8px !important;
  }

  .pack-actions-row {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    margin-top: 6px !important;
  }

  .mockup-radar-col {
    width: 100% !important;
  }

  .geogrid-radar-map {
    width: 100% !important;
    max-width: 320px !important;
    height: 300px !important;
    margin: 10px auto !important;
    position: relative !important;
  }

  .grid-node-pin {
    width: 36px !important;
    height: 36px !important;
    font-size: 0.65rem !important;
  }

  .radar-node-telemetry {
    padding: 12px !important;
    border-radius: 12px !important;
    width: 100% !important;
  }

  .telemetry-pills {
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
  }

  .tele-pill {
    width: 100% !important;
    font-size: 0.75rem !important;
    padding: 6px 10px !important;
  }

  /* ==========================================
     6. GEO & AIO CITATION ENGINE SIMULATOR
     ========================================== */
  .aio-geo-wrapper {
    padding: 16px 12px !important;
    border-radius: 18px !important;
    margin-bottom: 22px !important;
  }

  .aio-body-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 16px !important;
    padding: 12px 8px !important;
  }

  .aio-geo-copy h3 {
    font-size: 1.35rem !important;
  }

  .aio-engine-tags {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    margin: 10px 0 !important;
  }

  .aio-engine-tags span {
    font-size: 0.72rem !important;
    padding: 4px 10px !important;
  }

  .aio-stats-summary-row {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 6px !important;
    width: 100% !important;
  }

  .aio-mini-metric {
    padding: 8px 4px !important;
    font-size: 0.68rem !important;
    text-align: center !important;
  }

  .aio-mini-metric strong {
    font-size: 1.1rem !important;
  }

  .aio-terminal-simulator {
    width: 100% !important;
    border-radius: 14px !important;
    overflow: hidden !important;
  }

  .aio-terminal-header {
    padding: 8px 10px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
  }

  .aio-terminal-tabs {
    display: flex !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    width: 100% !important;
    gap: 4px !important;
  }

  .aio-tab {
    flex-shrink: 0 !important;
    font-size: 0.72rem !important;
    padding: 6px 10px !important;
    min-height: 36px !important;
  }

  .aio-prompt-bubble {
    padding: 10px !important;
    gap: 8px !important;
  }

  .aio-query-interactive-row {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    width: 100% !important;
  }

  .aio-rerun-btn {
    width: 100% !important;
    min-height: 40px !important;
    justify-content: center !important;
  }

  .aio-reasoning-flow {
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
    width: 100% !important;
    margin: 8px 0 !important;
  }

  .reasoning-step-badge {
    font-size: 0.72rem !important;
    padding: 4px 8px !important;
    width: 100% !important;
  }

  .aio-response-box {
    padding: 12px 10px !important;
  }

  #aio-answer-text {
    font-size: 0.86rem !important;
    line-height: 1.55 !important;
  }

  .aio-citations-row {
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
    width: 100% !important;
  }

  .cite-chip {
    width: 100% !important;
    font-size: 0.72rem !important;
    padding: 5px 8px !important;
  }

  /* ==========================================
     7. GROWTH REVENUE & ROI CALCULATOR
     ========================================== */
  .roi-calculator-wrapper {
    padding: 16px 12px !important;
    border-radius: 18px !important;
    margin-bottom: 22px !important;
  }

  .roi-body-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 16px !important;
    padding: 12px 8px !important;
  }

  .roi-input-group {
    padding: 12px 10px !important;
    border-radius: 12px !important;
    margin-bottom: 10px !important;
  }

  .roi-label-row {
    display: flex !important;
    flex-direction: column !important;
    gap: 2px !important;
    align-items: flex-start !important;
    margin-bottom: 8px !important;
  }

  .roi-slider {
    width: 100% !important;
    min-height: 38px !important;
  }

  .slider-marks {
    font-size: 0.64rem !important;
    display: flex !important;
    justify-content: space-between !important;
    margin-top: 4px !important;
  }

  .roi-outputs-col {
    width: 100% !important;
  }

  .roi-output-card {
    padding: 14px 12px !important;
    border-radius: 14px !important;
    width: 100% !important;
  }

  .roi-output-item {
    padding: 10px 8px !important;
    font-size: 0.82rem !important;
  }

  .roi-output-item strong {
    font-size: 1.15rem !important;
  }

  .roi-leakage-prevented-pill {
    font-size: 0.74rem !important;
    padding: 8px 10px !important;
    line-height: 1.4 !important;
  }

  .roi-action-btn {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
    padding: 13px 16px !important;
    min-height: 48px !important;
    font-size: 0.95rem !important;
    border-radius: 10px !important;
    text-align: center !important;
  }

  /* ==========================================
     8. SEARCH GROWTH BANNER & INTELLIGENT PIPELINE
     ========================================== */
  .search-growth-banner {
    padding: 22px 14px !important;
    border-radius: 16px !important;
    margin: 22px 0 !important;
  }

  .search-growth-banner h3 {
    font-size: 1.35rem !important;
    line-height: 1.25 !important;
  }

  .growth-banner-actions {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    width: 100% !important;
  }

  .growth-banner-actions .button {
    width: 100% !important;
    min-height: 46px !important;
    justify-content: center !important;
    text-align: center !important;
  }

  .intelligent-pipeline {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    padding: 14px !important;
    border-radius: 16px !important;
    width: 100% !important;
  }

  .intelligent-pipeline span,
  .intelligent-pipeline strong {
    width: 100% !important;
    padding: 10px 14px !important;
    border-radius: 10px !important;
  }

  .intelligent-pipeline .pipeline-arrow {
    display: flex !important;
    justify-content: center !important;
    transform: rotate(90deg) !important;
    margin: 2px 0 !important;
  }

  /* ==========================================
     9. AI SYSTEMS & MULTI-AGENT WORKFORCE
     ========================================== */
  .build-systems-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 14px !important;
    width: 100% !important;
  }

  .build-systems-grid article {
    padding: 18px 14px !important;
    border-radius: 16px !important;
    width: 100% !important;
  }

  .integration-preview {
    display: flex !important;
    flex-direction: column !important;
    gap: 14px !important;
    padding: 20px 14px !important;
    border-radius: 16px !important;
    text-align: left !important;
  }

  .integration-preview .button {
    width: 100% !important;
    justify-content: center !important;
    min-height: 46px !important;
  }

  .system-process-diagram {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    width: 100% !important;
  }

  .process-node {
    width: 100% !important;
    padding: 10px 14px !important;
    border-radius: 10px !important;
  }

  .process-arrow {
    display: flex !important;
    justify-content: center !important;
    transform: rotate(90deg) !important;
    margin: 2px 0 !important;
  }

  .multi-agent-architecture {
    width: 100% !important;
    padding: 14px 10px !important;
    border-radius: 16px !important;
  }

  .workforce-agent-row {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 6px !important;
    width: 100% !important;
  }

  .workforce-agent-row article {
    padding: 8px 4px !important;
    font-size: 0.68rem !important;
    text-align: center !important;
  }

  .collaboration-list,
  .agent-handoff {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    width: 100% !important;
  }

  /* ==========================================
     10. REVIEWS, INSIGHTS & FAQ ACCORDION
     ========================================== */
  .reviews-grid,
  .insights-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 14px !important;
    width: 100% !important;
  }

  .review-card,
  .insights-card {
    padding: 18px 14px !important;
    border-radius: 16px !important;
    width: 100% !important;
  }

  .faq-section {
    padding: 2.5rem 0 !important;
  }

  .faq-filters-bar {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    justify-content: flex-start !important;
    margin: 16px 0 20px !important;
  }

  .faq-filter-chip {
    font-size: 0.76rem !important;
    padding: 6px 12px !important;
    border-radius: 999px !important;
  }

  .faq-accordion-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    width: 100% !important;
  }

  .faq-item {
    border-radius: 14px !important;
    width: 100% !important;
  }

  .faq-question {
    padding: 14px !important;
    gap: 10px !important;
    min-height: 48px !important;
  }

  .faq-question-text {
    font-size: 0.88rem !important;
    line-height: 1.4 !important;
  }

  .faq-answer-inner {
    padding: 0 14px 14px 14px !important;
    font-size: 0.85rem !important;
    line-height: 1.6 !important;
  }

  .faq-expand-btn {
    width: 100% !important;
    max-width: 280px !important;
    min-height: 46px !important;
    justify-content: center !important;
  }

  /* ==========================================
     11. FINAL CTA PANEL & FOOTER
     ========================================== */
  .final-cta {
    padding: 24px 16px !important;
    border-radius: 18px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
    width: 100% !important;
    text-align: left !important;
  }

  .final-cta-copy h3 {
    font-size: 1.45rem !important;
    line-height: 1.25 !important;
  }

  .final-cta-actions {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    width: 100% !important;
  }

  .final-cta-actions .button {
    width: 100% !important;
    min-height: 48px !important;
    justify-content: center !important;
    text-align: center !important;
  }

  .site-footer {
    padding: 36px 14px 24px !important;
    width: 100% !important;
  }

  .site-footer-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 24px !important;
    width: 100% !important;
  }

  .site-footer-col {
    width: 100% !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    padding-bottom: 18px !important;
  }

  .site-footer-col:last-child {
    border-bottom: none !important;
    padding-bottom: 0 !important;
  }

  .site-footer-col ul {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    padding: 0 !important;
    margin: 0 !important;
    list-style: none !important;
  }

  .site-footer-col ul li a {
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    min-height: 38px !important;
    font-size: 0.88rem !important;
    color: #cbd5e1 !important;
  }

  .footer-badges {
    width: 100% !important;
    max-width: 100% !important;
  }

  .site-footer-bottom {
    display: flex !important;
    flex-direction: column !important;
    gap: 14px !important;
    align-items: center !important;
    text-align: center !important;
    padding-top: 18px !important;
    margin-top: 18px !important;
    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
  }

  .legal-links {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 10px !important;
    justify-content: center !important;
  }

  /* ==========================================
     12. FLOATING AI CHATBOT & MODALS ON MOBILE
     ========================================== */
  .ai-chat-toggle {
    bottom: 16px !important;
    right: 16px !important;
    width: 50px !important;
    height: 50px !important;
    border-radius: 50% !important;
    z-index: 99999 !important;
    font-size: 1.2rem !important;
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.35) !important;
  }

  .ai-chat-window {
    bottom: 74px !important;
    right: 12px !important;
    width: min(calc(100vw - 24px), 380px) !important;
    height: min(calc(100vh - 120px), 540px) !important;
    max-height: min(calc(100vh - 120px), 540px) !important;
    border-radius: 18px !important;
    z-index: 99999 !important;
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.3) !important;
  }

  .ai-chat-input {
    font-size: 16px !important;
    min-height: 42px !important;
  }

  .ai-chat-chips {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 5px !important;
    margin-top: 8px !important;
  }

  .ai-chat-chip {
    font-size: 0.72rem !important;
    padding: 5px 8px !important;
    border-radius: 6px !important;
  }
}

@media (max-width: 480px) {
  .hero {
    padding-left: 10px !important;
    padding-right: 10px !important;
    gap: 16px !important;
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
    padding: 8px 8px !important;
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
Write-Host "Updated style.css and style.min.css with complete mobile home optimization."
