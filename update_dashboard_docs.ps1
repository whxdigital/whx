# Read dashboard.html
$path = "w:\PT WHX\dashboard.html"
$html = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# 1. Update Rail
$oldRail = '<div class="benchmark-rail-item" onclick="switchTab(''tab-citations'')"'
$newRail = '<div class="benchmark-rail-item" onclick="switchTab(''tab-citations'')" title="Citation Building"><i class="fa-solid fa-map-pin" style="color: #a855f7;"></i></div>' + "`n" + '        <div class="benchmark-rail-item" onclick="switchTab(''tab-docs'')" title="Product Manual & Architecture"><i class="fa-solid fa-book-bookmark" style="color: #f5a623;"></i></div>'

# Check if tab-docs already exists in rail
if (-not $html.Contains("switchTab('tab-docs')")) {
    $html = $html.Replace('<div class="benchmark-rail-item" onclick="switchTab(''tab-citations'')" title="Citation Building">`n          <i class="fa-solid fa-map-pin" style="color: #a855f7;"></i>`n        </div>', '<div class="benchmark-rail-item" onclick="switchTab(''tab-citations'')" title="Citation Building">`n          <i class="fa-solid fa-map-pin" style="color: #a855f7;"></i>`n        </div>`n        <div class="benchmark-rail-item" onclick="switchTab(''tab-docs'')" title="Product Manual & Architecture">`n          <i class="fa-solid fa-book-bookmark" style="color: #f5a623;"></i>`n        </div>')
}

# 2. Update Sidebar Nav
if (-not $html.Contains('data-tab="tab-docs"')) {
    $html = $html.Replace('<li><a href="#" data-tab="tab-citations">Citation Building</a></li>', '<li><a href="#" data-tab="tab-citations">Citation Building</a></li>`n            <li><a href="#" data-tab="tab-docs">Product Manual</a></li>')
}

# 3. Update Capabilities Track
if (-not $html.Contains('data-tab-target="tab-docs"')) {
    $html = $html.Replace('<button class="benchmark-btn-secondary" data-tab-target="tab-citations"><i class="fa-solid fa-map-pin" style="color: #a855f7;"></i> Citations</button>', '<button class="benchmark-btn-secondary" data-tab-target="tab-citations"><i class="fa-solid fa-map-pin" style="color: #a855f7;"></i> Citations</button>`n              <button class="benchmark-btn-secondary" data-tab-target="tab-docs"><i class="fa-solid fa-book-bookmark" style="color: #f5a623;"></i> Product Manual</button>')
}

# 4. Insert tab-docs pane before #zip-scan-modal
$docsHtml = @'
          <!-- =============================================================
               TAB 8: PRODUCT MANUAL & HOW WHX WORKS (SOLOOP-STYLE SHOWCASE)
               ============================================================= -->
          <div id="tab-docs" class="tab-pane" style="display: none;">
            
            <div style="display: grid; grid-template-columns: 240px 1fr 280px; gap: 20px; align-items: start;">
              
              <!-- Left Column: Guide Navigation -->
              <div class="benchmark-card" style="padding: 16px; position: sticky; top: 100px;">
                <div style="font-family: var(--mono); font-size: 0.72rem; font-weight: 700; color: var(--amber); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                  <span>GUIDE NAVIGATION</span>
                  <i class="fa-solid fa-compass"></i>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 4px;" id="docs-nav-list">
                  <a href="#" onclick="showDocSection('01'); return false;" class="docs-nav-link active" id="doc-nav-01"><span style="font-family: var(--mono); color: var(--amber); margin-right: 8px; font-size: 0.76rem;">01</span> Quickstart</a>
                  <a href="#" onclick="showDocSection('02'); return false;" class="docs-nav-link" id="doc-nav-02"><span style="font-family: var(--mono); color: var(--subtle-ink); margin-right: 8px; font-size: 0.76rem;">02</span> Result Locations</a>
                  <a href="#" onclick="showDocSection('03'); return false;" class="docs-nav-link" id="doc-nav-03"><span style="font-family: var(--mono); color: var(--subtle-ink); margin-right: 8px; font-size: 0.76rem;">03</span> Plans / Multi-Agent</a>
                  <a href="#" onclick="showDocSection('04'); return false;" class="docs-nav-link" id="doc-nav-04"><span style="font-family: var(--mono); color: var(--subtle-ink); margin-right: 8px; font-size: 0.76rem;">04</span> Tasks and Quotas</a>
                  <a href="#" onclick="showDocSection('05'); return false;" class="docs-nav-link" id="doc-nav-05"><span style="font-family: var(--mono); color: var(--subtle-ink); margin-right: 8px; font-size: 0.76rem;">05</span> Context & Memory</a>
                  <a href="#" onclick="showDocSection('06'); return false;" class="docs-nav-link" id="doc-nav-06"><span style="font-family: var(--mono); color: var(--subtle-ink); margin-right: 8px; font-size: 0.76rem;">06</span> Tasks You Can Run</a>
                  <a href="#" onclick="showDocSection('07'); return false;" class="docs-nav-link" id="doc-nav-07"><span style="font-family: var(--mono); color: var(--subtle-ink); margin-right: 8px; font-size: 0.76rem;">07</span> Integrations & Hooks</a>
                  <a href="#" onclick="showDocSection('08'); return false;" class="docs-nav-link" id="doc-nav-08"><span style="font-family: var(--mono); color: var(--subtle-ink); margin-right: 8px; font-size: 0.76rem;">08</span> Troubleshooting</a>
                </div>

                <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border);">
                  <button class="btn-amber" style="width: 100%; justify-content: center; font-size: 0.78rem;" onclick="switchTab('tab-overview'); showToast('Returned to main workspace');">
                    Open Workspace <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.72rem;"></i>
                  </button>
                </div>
              </div>

              <!-- Center Column: Main Interactive Documentation Content -->
              <div style="display: flex; flex-direction: column; gap: 20px;">
                
                <!-- Hero Box -->
                <div class="benchmark-card" style="background: linear-gradient(135deg, rgba(23, 23, 28, 0.95), rgba(11, 11, 13, 0.98)); border-color: var(--border); padding: 32px; position: relative; overflow: hidden;">
                  <div style="position: absolute; right: -20px; top: -20px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(245, 166, 35, 0.08) 0%, transparent 70%); pointer-events: none;"></div>
                  
                  <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: rgba(245, 166, 35, 0.1); border: 1px solid rgba(245, 166, 35, 0.25); color: var(--amber); font-family: var(--mono); font-size: 0.72rem; font-weight: 700; margin-bottom: 16px;">
                    <i class="fa-solid fa-shield-halved"></i> WHX ENTERPRISE SPECIFICATION 2026
                  </div>

                  <h2 style="font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0 0 10px 0; letter-spacing: -0.03em;">
                    How WHX works.
                  </h2>
                  <p style="font-size: 0.95rem; line-height: 1.6; color: var(--muted); margin: 0 0 24px 0; max-width: 650px;">
                    The operating guide for running autonomous Local SEO sweeps, 24/7 AI agent pipelines, and high-velocity citation distribution from one central Command Core.
                  </p>

                  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button class="btn-amber" onclick="switchTab('tab-overview'); showToast('Loaded live workspace metrics');">
                      Open workspace <i class="fa-solid fa-arrow-right"></i>
                    </button>
                    <button class="btn-light" onclick="showDocSection('01'); showToast('Jumped to Step 1: Quickstart');">
                      Start at step 1 <i class="fa-solid fa-play" style="font-size: 0.72rem;"></i>
                    </button>
                  </div>
                </div>

                <!-- Step Progression Rail (From Context to Results) -->
                <div class="benchmark-card" style="padding: 24px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
                    <div>
                      <div style="font-family: var(--mono); font-size: 0.7rem; font-weight: 700; color: var(--amber); letter-spacing: 0.1em; text-transform: uppercase;">HOW WORK MOVES</div>
                      <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin: 2px 0 0 0;">From Context to Results</h3>
                    </div>
                    <span class="benchmark-badge green"><i class="fa-solid fa-bolt"></i> Realtime Engine Active</span>
                  </div>

                  <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
                    <div style="background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; text-align: center; cursor: pointer; transition: all 0.2s;" onclick="showDocSection('01')" class="step-card-btn">
                      <div style="font-family: var(--mono); color: var(--amber); font-weight: 700; font-size: 0.85rem; margin-bottom: 4px;">01</div>
                      <strong style="display: block; font-size: 0.8rem; color: #fff;">Context</strong>
                      <small style="color: var(--muted); font-size: 0.68rem;">Business data</small>
                    </div>

                    <div style="background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; text-align: center; cursor: pointer; transition: all 0.2s;" onclick="showDocSection('03')" class="step-card-btn">
                      <div style="font-family: var(--mono); color: #3b82f6; font-weight: 700; font-size: 0.85rem; margin-bottom: 4px;">02</div>
                      <strong style="display: block; font-size: 0.8rem; color: #fff;">Plan</strong>
                      <small style="color: var(--muted); font-size: 0.68rem;">Multi-Agent spec</small>
                    </div>

                    <div style="background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; text-align: center; cursor: pointer; transition: all 0.2s;" onclick="showDocSection('04')" class="step-card-btn">
                      <div style="font-family: var(--mono); color: #10b981; font-weight: 700; font-size: 0.85rem; margin-bottom: 4px;">03</div>
                      <strong style="display: block; font-size: 0.8rem; color: #fff;">Run</strong>
                      <small style="color: var(--muted); font-size: 0.68rem;">24/7 background</small>
                    </div>

                    <div style="background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; text-align: center; cursor: pointer; transition: all 0.2s;" onclick="showDocSection('02')" class="step-card-btn">
                      <div style="font-family: var(--mono); color: #a855f7; font-weight: 700; font-size: 0.85rem; margin-bottom: 4px;">04</div>
                      <strong style="display: block; font-size: 0.8rem; color: #fff;">Result</strong>
                      <small style="color: var(--muted); font-size: 0.68rem;">Artifacts & CRM</small>
                    </div>

                    <div style="background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; text-align: center; cursor: pointer; transition: all 0.2s;" onclick="showDocSection('05')" class="step-card-btn">
                      <div style="font-family: var(--mono); color: #ec4899; font-weight: 700; font-size: 0.85rem; margin-bottom: 4px;">05</div>
                      <strong style="display: block; font-size: 0.8rem; color: #fff;">Continue</strong>
                      <small style="color: var(--muted); font-size: 0.68rem;">Next cycle loop</small>
                    </div>
                  </div>
                </div>

                <!-- Dynamic Content Display Panel -->
                <div class="benchmark-card" id="doc-content-panel" style="padding: 28px;">
                  <!-- Injected via JavaScript showDocSection() -->
                </div>

              </div>

              <!-- Right Column: Context Summary Cards -->
              <div style="display: flex; flex-direction: column; gap: 16px; position: sticky; top: 100px;">
                
                <!-- Card 1 -->
                <div class="benchmark-card" style="padding: 16px; border-left: 3px solid var(--amber);">
                  <div style="font-family: var(--mono); font-size: 0.7rem; font-weight: 700; color: var(--amber); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;">YOUR AI CO-FOUNDER</div>
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin: 0 0 6px 0;">Autonomous Execution</h4>
                  <p style="font-size: 0.78rem; color: var(--muted); line-height: 1.45; margin: 0;">
                    WHX runs continuous triage across local rankings, customer inquiries, and citation sync without requiring manual intervention.
                  </p>
                </div>

                <!-- Card 2 -->
                <div class="benchmark-card" style="padding: 16px; border-left: 3px solid #10b981;">
                  <div style="font-family: var(--mono); font-size: 0.7rem; font-weight: 700; color: #10b981; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;">AUTONOMOUS QUOTAS</div>
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin: 0 0 6px 0;">Unlimited Parallel Runs</h4>
                  <p style="font-size: 0.78rem; color: var(--muted); line-height: 1.45; margin: 0;">
                    Every plan includes automatic load balancing across Claude 3.7 Sonnet, ChatGPT 4.5, and Gemini 2.5 Flash.
                  </p>
                </div>

                <!-- Card 3 -->
                <div class="benchmark-card" style="padding: 16px; border-left: 3px solid #3b82f6;">
                  <div style="font-family: var(--mono); font-size: 0.7rem; font-weight: 700; color: #3b82f6; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;">TELEMETRY & RESULTS</div>
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin: 0 0 6px 0;">Verified 200 Client Data</h4>
                  <p style="font-size: 0.78rem; color: var(--muted); line-height: 1.45; margin: 0;">
                    Realtime simulation verifies 200 distinct enterprise accounts with continuous browser session rotation.
                  </p>
                </div>

                <!-- Card 4 -->
                <div class="benchmark-card" style="padding: 16px; border-left: 3px solid #a855f7;">
                  <div style="font-family: var(--mono); font-size: 0.7rem; font-weight: 700; color: #a855f7; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;">LIVE SUPPORT & ASSISTANCE</div>
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin: 0 0 6px 0;">Dallas & Casper Core</h4>
                  <p style="font-size: 0.78rem; color: var(--muted); line-height: 1.45; margin: 0;">
                    Direct access to specialized automation architects. Response time SLA is under 4 minutes.
                  </p>
                </div>

              </div>

            </div>

          </div> <!-- End Tab 8: Product Manual -->
'@

if (-not $html.Contains('id="tab-docs"')) {
    $html = $html.Replace('</div> <!-- End dashboard-content -->', $docsHtml + "`n        </div> <!-- End dashboard-content -->")
}

# 5. Update switchTab mapping in JavaScript
$oldMapping = "'tab-billing': 5,`n          'tab-settings': 6"
$newMapping = "'tab-docs': 4,`n          'tab-analytics': 5,`n          'tab-billing': 6,`n          'tab-settings': 7"

$html = $html.Replace("'tab-billing': 5,", "'tab-docs': 4,`n          'tab-analytics': 5,`n          'tab-billing': 6,`n          'tab-settings': 7")

# 6. Add showDocSection function before </script>
$docJs = @'
      // ===================================================================
      // PRODUCT MANUAL / SOLOOP-STYLE DOCUMENTATION CONTROLLER
      // ===================================================================
      const docSectionsData = {
        '01': {
          title: '01 Quickstart',
          tag: 'GETTING STARTED',
          desc: 'Get your local business or enterprise workspace connected to the WHX Autonomous Network in under 3 minutes.',
          content: `
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <p style="color: var(--subtle-ink); font-size: 0.9rem; line-height: 1.6; margin: 0;">
                WHX operates as an intelligent supervisory layer over your local SEO, review management, inbound customer calls, and citation ecosystems. Follow these three immediate actions to launch:
              </p>
              
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 8px 0;">
                <div style="background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px;">
                  <span style="font-family: var(--mono); color: var(--amber); font-weight: 700; font-size: 0.8rem; display: block; margin-bottom: 4px;">STEP 1</span>
                  <strong style="color: #fff; font-size: 0.85rem; display: block; margin-bottom: 4px;">Connect GBP</strong>
                  <p style="color: var(--muted); font-size: 0.74rem; margin: 0; line-height: 1.4;">Authorize Google Business Profile via Workspace Settings.</p>
                </div>
                <div style="background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px;">
                  <span style="font-family: var(--mono); color: #10b981; font-weight: 700; font-size: 0.8rem; display: block; margin-bottom: 4px;">STEP 2</span>
                  <strong style="color: #fff; font-size: 0.85rem; display: block; margin-bottom: 4px;">Define 50 Zips</strong>
                  <p style="color: var(--muted); font-size: 0.74rem; margin: 0; line-height: 1.4;">Set target municipal zip codes for Map Pack dominance.</p>
                </div>
                <div style="background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px;">
                  <span style="font-family: var(--mono); color: #3b82f6; font-weight: 700; font-size: 0.8rem; display: block; margin-bottom: 4px;">STEP 3</span>
                  <strong style="color: #fff; font-size: 0.85rem; display: block; margin-bottom: 4px;">Enable Agents</strong>
                  <p style="color: var(--muted); font-size: 0.74rem; margin: 0; line-height: 1.4;">Turn on 24/7 autonomous review and intake dispatchers.</p>
                </div>
              </div>

              <div class="cyber-terminal-box">
                <div class="cyber-terminal-header">
                  <span>TERMINAL // WHX_AGENT_INIT</span>
                  <span style="color: #10b981;"><i class="fa-solid fa-circle" style="font-size: 6px;"></i> READY</span>
                </div>
                <div class="cyber-terminal-body">
                  <div class="code-stream-row"><span style="color: #64748b;">$</span> whx-core connect --workspace="default" --profile="canonical_nap"</div>
                  <div class="code-stream-row" style="color: #10b981;">[OK] Connected to Google Business Profile API v4.9 (Authorized)</div>
                  <div class="code-stream-row" style="color: #f5a623;">[INFO] Initialized 25 Geo-Grid Scan Coordinates across target zone</div>
                  <div class="code-stream-row" style="color: #38bdf8;">[AUTONOMOUS] Claude 3.7 + GoHighLevel Webhook Listener: ONLINE</div>
                </div>
              </div>
            </div>
          `
        },
        '02': {
          title: '02 Result Locations',
          tag: 'ARTIFACTS & STORAGE',
          desc: 'Where verified rankings, AI audit logs, and client deliverables are automatically saved and accessed.',
          content: `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <p style="color: var(--subtle-ink); font-size: 0.9rem; line-height: 1.6; margin: 0;">
                All autonomous runs store their permanent trace and structured outputs in three synchronized storage layers:
              </p>
              <table class="benchmark-table" style="font-size: 0.82rem;">
                <thead>
                  <tr><th>Storage Layer</th><th>Output Format</th><th>Sync Frequency</th><th>Accessibility</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Geo-Grid Cache</strong></td><td>GeoJSON Coordinates</td><td>Real-time / 15m</td><td><span class="benchmark-badge green">Live API</span></td></tr>
                  <tr><td><strong>Citation Ledger</strong></td><td>Canonical NAP Diff</td><td>Daily 02:00 UTC</td><td><span class="benchmark-badge blue">CSV / Webhook</span></td></tr>
                  <tr><td><strong>AI Run Traces</strong></td><td>JSONL Telemetry</td><td>Instantaneous</td><td><span class="benchmark-badge amber">Superadmin</span></td></tr>
                </tbody>
              </table>
            </div>
          `
        },
        '03': {
          title: '03 Plans & Multi-Agent Architecture',
          tag: 'INTELLIGENT REASONING',
          desc: 'How the tri-model orchestration between Claude 3.7, ChatGPT 4.5, and Gemini handles complex tasks.',
          content: `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <p style="color: var(--subtle-ink); font-size: 0.9rem; line-height: 1.6; margin: 0;">
                WHX employs specialized model allocation depending on the workload characteristics:
              </p>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                <div style="background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px;">
                  <strong style="color: #d97706; font-size: 0.88rem; display: block; margin-bottom: 4px;">Claude 3.7 Sonnet</strong>
                  <p style="color: var(--muted); font-size: 0.74rem; margin: 0; line-height: 1.4;">Used for high-intent intake triage, complex schema generation, and natural voice review replies.</p>
                </div>
                <div style="background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px;">
                  <strong style="color: #10a37f; font-size: 0.88rem; display: block; margin-bottom: 4px;">ChatGPT 4.5</strong>
                  <p style="color: var(--muted); font-size: 0.74rem; margin: 0; line-height: 1.4;">Handles deep data extraction, business intelligence aggregation, and citation profile verification.</p>
                </div>
                <div style="background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px;">
                  <strong style="color: #38bdf8; font-size: 0.88rem; display: block; margin-bottom: 4px;">Gemini 2.5 Flash</strong>
                  <p style="color: var(--muted); font-size: 0.74rem; margin: 0; line-height: 1.4;">Powers sub-second streaming audio parsing, live telemetry health checks, and rapid scan runs.</p>
                </div>
              </div>
            </div>
          `
        },
        '04': {
          title: '04 Tasks and Quotas',
          tag: 'COMPUTE ALLOCATION',
          desc: 'Understanding automated queue prioritization, concurrency limits, and auto-scaling rules.',
          content: `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <p style="color: var(--subtle-ink); font-size: 0.9rem; line-height: 1.6; margin: 0;">
                Workspaces are allocated dedicated execution workers. If incoming leads spike simultaneously, WHX automatically spins up ephemeral compute nodes to prevent queue latency.
              </p>
              <div style="display: flex; gap: 12px; align-items: center; background: #0b0b0d; padding: 14px; border: 1px solid var(--border); border-radius: var(--radius-sm);">
                <i class="fa-solid fa-server" style="font-size: 1.5rem; color: var(--amber);"></i>
                <div>
                  <strong style="color: #fff; font-size: 0.85rem; display: block;">Zero Rate-Limit SLA</strong>
                  <span style="color: var(--muted); font-size: 0.75rem;">Enterprise tier includes dedicated IP proxies for uninterrupted Google Maps and citation scraping.</span>
                </div>
              </div>
            </div>
          `
        },
        '05': {
          title: '05 Context & Memory',
          tag: 'KNOWLEDGE RETRIEVAL',
          desc: 'How WHX preserves historical ranking trajectory and business tone across multi-turn workflows.',
          content: `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <p style="color: var(--subtle-ink); font-size: 0.9rem; line-height: 1.6; margin: 0;">
                The context layer maintains continuous embeddings of your core services, target municipal service areas, client pricing packages, and past review responses.
              </p>
            </div>
          `
        },
        '06': {
          title: '06 Tasks You Can Run',
          tag: 'TASK CATALOG',
          desc: 'Complete overview of one-click and autonomous scheduled tasks available in the Command Core.',
          content: `
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm);">
                <div><strong style="color: #fff; font-size: 0.84rem;">50 Zip Code Rapid Audit</strong><span style="color: var(--muted); font-size: 0.74rem; display: block;">Sweeps municipal radius for 3-pack positions</span></div>
                <button class="btn-amber" style="padding: 4px 10px; font-size: 0.74rem;" onclick="openZipScanModal()">Run Now</button>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm);">
                <div><strong style="color: #fff; font-size: 0.84rem;">Autonomous Review Reply Sprint</strong><span style="color: var(--muted); font-size: 0.74rem; display: block;">Generates customized responses to pending Google reviews</span></div>
                <button class="btn-light" style="padding: 4px 10px; font-size: 0.74rem;" onclick="switchTab('tab-seo')">Configure</button>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #0b0b0d; border: 1px solid var(--border); border-radius: var(--radius-sm);">
                <div><strong style="color: #fff; font-size: 0.84rem;">Canonical NAP Discrepancy Fixer</strong><span style="color: var(--muted); font-size: 0.74rem; display: block;">Detects phone/address formatting mismatches on Yelp & YellowPages</span></div>
                <button class="btn-light" style="padding: 4px 10px; font-size: 0.74rem;" onclick="switchTab('tab-citations')">Inspect</button>
              </div>
            </div>
          `
        },
        '07': {
          title: '07 Integrations & Webhooks',
          tag: 'CRM & API CONNECTIONS',
          desc: 'Plug WHX directly into GoHighLevel, HubSpot, Zapier, Make, and custom REST endpoints.',
          content: `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <p style="color: var(--subtle-ink); font-size: 0.9rem; line-height: 1.6; margin: 0;">
                Inbound and outbound webhooks support HMAC-SHA256 signatures with automated retry backoff.
              </p>
              <div class="cyber-terminal-box">
                <div class="cyber-terminal-header"><span>POST /api/v1/lead-triage</span><span>HTTP 200 OK</span></div>
                <div class="cyber-terminal-body">
                  <div class="code-stream-row" style="color: #38bdf8;">{"event": "lead.qualified", "score": 98, "assigned_rep": "Dr. Vance", "status": "CALENDAR_BOOKED"}</div>
                </div>
              </div>
            </div>
          `
        },
        '08': {
          title: '08 Troubleshooting & Diagnostics',
          tag: 'SYSTEM RECOVERY',
          desc: 'Resolving connection timeouts, key rotations, and Google API verification challenges.',
          content: `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <p style="color: var(--subtle-ink); font-size: 0.9rem; line-height: 1.6; margin: 0;">
                If any external API encounters a rate limit or credential error, WHX immediately falls back to secondary authenticated proxies and dispatches an alert to your dashboard notification stream.
              </p>
            </div>
          `
        }
      };

      window.showDocSection = function(sectionId) {
        // Update nav links
        document.querySelectorAll('#docs-nav-list a').forEach(a => a.classList.remove('active'));
        const navEl = document.getElementById(`doc-nav-${sectionId}`);
        if (navEl) navEl.classList.add('active');

        // Render content
        const data = docSectionsData[sectionId] || docSectionsData['01'];
        const panel = document.getElementById('doc-content-panel');
        if (panel) {
          panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
              <div>
                <span style="font-family: var(--mono); font-size: 0.72rem; font-weight: 700; color: var(--amber); letter-spacing: 0.08em; text-transform: uppercase;">${data.tag}</span>
                <h3 style="font-size: 1.35rem; font-weight: 700; color: #fff; margin: 4px 0 0 0;">${data.title}</h3>
              </div>
              <span class="benchmark-badge green"><i class="fa-solid fa-circle-check"></i> Verified Spec</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--muted); margin: 0 0 20px 0; line-height: 1.5;">${data.desc}</p>
            ${data.content}
          `;
        }
      };

      // Initialize Doc Section 01 on DOM ready
      document.addEventListener('DOMContentLoaded', () => {
        if (typeof showDocSection === 'function') {
          showDocSection('01');
        }
      });
'@

if (-not $html.Contains('showDocSection')) {
    $html = $html.Replace('</script>', $docJs + "`n    </script>")
}

[System.IO.File]::WriteAllText($path, $html, [System.Text.Encoding]::UTF8)
Write-Host "dashboard.html successfully updated with Product Manual and Docs showcase!"
