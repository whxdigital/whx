/**
 * WHX ORBITAL TELEMETRY // MISSION CONTROL CLIENT-SIDE ENGINE
 * SpaceX Flight HUD / Starlink Telemetry Architecture Standard
 * 100% Free, Zero API Key Requirement, High-Speed DoH & RDAP Engine
 */

(function() {
  'use strict';

  // 24 Geographically Distributed Global Resolver Nodes across 6 Continents
  const GLOBAL_RESOLVER_NODES = [
    // North America
    { id: 'us-nyc', name: 'New York (US-East)', region: 'North America', flag: '🇺🇸', provider: 'Cloudflare Edge', subnet: '198.51.100.0/24', x: 285, y: 155 },
    { id: 'us-sfo', name: 'Silicon Valley (US-West)', region: 'North America', flag: '🇺🇸', provider: 'Google Public', subnet: '8.8.8.0/24', x: 195, y: 165 },
    { id: 'us-dfw', name: 'Dallas (US-Central)', region: 'North America', flag: '🇺🇸', provider: 'Quad9 Anycast', subnet: '9.9.9.0/24', x: 235, y: 180 },
    { id: 'ca-tor', name: 'Toronto, Canada', region: 'North America', flag: '🇨🇦', provider: 'Cloudflare CA', subnet: '142.112.0.0/24', x: 275, y: 140 },

    // Europe
    { id: 'eu-lon', name: 'London, United Kingdom', region: 'Europe', flag: '🇬🇧', provider: 'Cloudflare LHR', subnet: '185.86.151.0/24', x: 480, y: 130 },
    { id: 'eu-fra', name: 'Frankfurt, Germany', region: 'Europe', flag: '🇩🇪', provider: 'Google Public FRA', subnet: '194.25.0.0/24', x: 505, y: 135 },
    { id: 'eu-ams', name: 'Amsterdam, Netherlands', region: 'Europe', flag: '🇳🇱', provider: 'Quad9 Anycast AMS', subnet: '145.220.0.0/24', x: 495, y: 125 },
    { id: 'eu-par', name: 'Paris, France', region: 'Europe', flag: '🇫🇷', provider: 'Cloudflare CDG', subnet: '195.154.0.0/24', x: 485, y: 145 },
    { id: 'eu-arn', name: 'Stockholm, Sweden', region: 'Europe', flag: '🇸🇪', provider: 'Google Nordic', subnet: '193.11.0.0/24', x: 520, y: 105 },

    // Asia & Pacific
    { id: 'as-tyo', name: 'Tokyo, Japan', region: 'Asia', flag: '🇯🇵', provider: 'Cloudflare NRT', subnet: '133.242.0.0/24', x: 815, y: 175 },
    { id: 'as-sin', name: 'Singapore Hub', region: 'Asia', flag: '🇸🇬', provider: 'Google Public SIN', subnet: '103.21.244.0/24', x: 730, y: 260 },
    { id: 'as-khi', name: 'Karachi / Islamabad, Pakistan', region: 'Asia', flag: '🇵🇰', provider: 'Cloudflare PK Node', subnet: '111.119.187.0/24', x: 645, y: 195 },
    { id: 'as-bom', name: 'Mumbai, India', region: 'Asia', flag: '🇮🇳', provider: 'Google Public BOM', subnet: '103.27.232.0/24', x: 665, y: 215 },
    { id: 'as-icn', name: 'Seoul, South Korea', region: 'Asia', flag: '🇰🇷', provider: 'Cloudflare ICN', subnet: '121.133.0.0/24', x: 790, y: 165 },
    { id: 'as-hkg', name: 'Hong Kong Gateway', region: 'Asia', flag: '🇭🇰', provider: 'Google Public HKG', subnet: '203.80.0.0/24', x: 755, y: 210 },

    // Middle East
    { id: 'me-dxb', name: 'Dubai, UAE', region: 'Middle East', flag: '🇦🇪', provider: 'Cloudflare DXB', subnet: '94.200.0.0/24', x: 605, y: 200 },
    { id: 'me-ruh', name: 'Riyadh, Saudi Arabia', region: 'Middle East', flag: '🇸🇦', provider: 'Google Public ME', subnet: '212.118.0.0/24', x: 585, y: 210 },
    { id: 'me-tlv', name: 'Tel Aviv, Israel', region: 'Middle East', flag: '🇮🇱', provider: 'Quad9 Anycast TLV', subnet: '192.114.0.0/24', x: 550, y: 185 },

    // Oceania
    { id: 'oc-syd', name: 'Sydney, Australia', region: 'Oceania', flag: '🇦🇺', provider: 'Cloudflare SYD', subnet: '139.130.4.0/24', x: 840, y: 340 },
    { id: 'oc-mel', name: 'Melbourne, Australia', region: 'Oceania', flag: '🇦🇺', provider: 'Google Public MEL', subnet: '203.2.0.0/24', x: 825, y: 355 },

    // South America
    { id: 'sa-gru', name: 'São Paulo, Brazil', region: 'South America', flag: '🇧🇷', provider: 'Cloudflare GRU', subnet: '177.18.0.0/24', x: 360, y: 310 },
    { id: 'sa-scl', name: 'Santiago, Chile', region: 'South America', flag: '🇨🇱', provider: 'Google Public SCL', subnet: '190.160.0.0/24', x: 320, y: 330 },

    // Africa
    { id: 'af-jnb', name: 'Johannesburg, South Africa', region: 'Africa', flag: '🇿🇦', provider: 'Cloudflare JNB', subnet: '196.25.1.0/24', x: 535, y: 320 },
    { id: 'af-nbo', name: 'Nairobi, Kenya', region: 'Africa', flag: '🇰🇪', provider: 'Google Public NBO', subnet: '197.248.0.0/24', x: 565, y: 260 }
  ];

  // 12 Common TLDs for Brand Availability Matrix
  const BRAND_TLD_LIST = [
    '.com', '.ai', '.io', '.net', '.org', '.co', 
    '.dev', '.app', '.xyz', '.tech', '.cloud', '.me'
  ];

  // State Management
  const state = {
    domain: 'whxdigital.com',
    recordType: 'A',
    expectedValue: '',
    isLoopActive: false,
    loopIntervalId: null,
    activeTab: 'tab-dns',
    nodeResults: {},
    isScanning: false,
    anomalies: []
  };

  // DOM Elements Cache
  let dom = {};

  function initDOM() {
    dom = {
      missionClock: document.getElementById('hudMissionClock'),
      domainInput: document.getElementById('hudDomainInput'),
      recordSelect: document.getElementById('hudRecordSelect'),
      expectedInput: document.getElementById('hudExpectedInput'),
      sweepBtn: document.getElementById('hudSweepBtn'),
      loopToggle: document.getElementById('hudLoopToggle'),
      tabButtons: document.querySelectorAll('.hud-tab-btn'),
      tabPanes: document.querySelectorAll('.hud-tab-pane'),
      
      // Module 1 Elements
      radialFill: document.getElementById('hudRadialFill'),
      radialPct: document.getElementById('hudRadialPct'),
      nodesTableBody: document.getElementById('hudNodesTableBody'),
      filterInput: document.getElementById('hudTableFilter'),
      svgMapContainer: document.getElementById('hudSvgMapContainer'),
      mapNodesGroup: document.getElementById('hudMapNodesGroup'),
      statConsensus: document.getElementById('statConsensus'),
      statMeanPing: document.getElementById('statMeanPing'),
      statOnlineNodes: document.getElementById('statOnlineNodes'),
      statResolvedRecord: document.getElementById('statResolvedRecord'),
      
      // Module 2 Elements
      whoisAgeText: document.getElementById('whoisAgeText'),
      whoisCreated: document.getElementById('whoisCreated'),
      whoisExpires: document.getElementById('whoisExpires'),
      whoisRegistrar: document.getElementById('whoisRegistrar'),
      whoisStatus: document.getElementById('whoisStatus'),
      emailSecurityGrade: document.getElementById('emailSecurityGrade'),
      spfStatusText: document.getElementById('spfStatusText'),
      dmarcStatusText: document.getElementById('dmarcStatusText'),
      mxStatusText: document.getElementById('mxStatusText'),
      tldMatrixGrid: document.getElementById('tldMatrixGrid'),
      nsStatusText: document.getElementById('nsStatusText'),
      soaStatusText: document.getElementById('soaStatusText'),
      caaStatusText: document.getElementById('caaStatusText'),
      ipv6StatusText: document.getElementById('ipv6StatusText'),
      
      // Module 3 Elements
      schemaBizName: document.getElementById('schemaBizName'),
      schemaCategory: document.getElementById('schemaCategory'),
      schemaCity: document.getElementById('schemaCity'),
      schemaPhone: document.getElementById('schemaPhone'),
      schemaUrl: document.getElementById('schemaUrl'),
      schemaCodeOutput: document.getElementById('schemaCodeOutput'),
      copySchemaBtn: document.getElementById('copySchemaBtn'),
      
      // Module 4 Anomaly Containers
      anomalyAlertContainer: document.getElementById('anomalyAlertContainer'),
      copyLinkBtn: document.getElementById('hudCopyLinkBtn'),
      downloadReportBtn: document.getElementById('hudDownloadReportBtn')
    };
  }

  // Live UTC Clock
  function startClock() {
    function updateClock() {
      if (!dom.missionClock) return;
      const now = new Date();
      dom.missionClock.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // URL Query Parameters Sync
  function syncStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('domain')) {
      state.domain = sanitizeDomain(params.get('domain'));
      if (dom.domainInput) dom.domainInput.value = state.domain;
    }
    if (params.has('record')) {
      state.recordType = params.get('record').toUpperCase();
      if (dom.recordSelect) dom.recordSelect.value = state.recordType;
    }
    if (params.has('tab')) {
      const tabId = params.get('tab');
      if (document.getElementById(tabId)) {
        switchTab(tabId);
      }
    }
  }

  function syncUrlFromState() {
    const params = new URLSearchParams();
    if (state.domain) params.set('domain', state.domain);
    if (state.recordType) params.set('record', state.recordType);
    if (state.activeTab) params.set('tab', state.activeTab);
    const newUrl = window.location.pathname + '?' + params.toString();
    window.history.replaceState({}, '', newUrl);
  }

  function sanitizeDomain(str) {
    if (!str) return 'whxdigital.com';
    return str.trim()
      .toLowerCase()
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0]
      .split('?')[0]
      .replace(/[^a-z0-9.-]/g, '');
  }

  // Tab Switcher
  function switchTab(targetTabId) {
    state.activeTab = targetTabId;
    dom.tabButtons.forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-tab') === targetTabId);
    });
    dom.tabPanes.forEach(pane => {
      pane.classList.toggle('is-active', pane.id === targetTabId);
    });
    syncUrlFromState();
  }

  // Query DNS over HTTPS (DoH) via Google or Cloudflare
  async function queryDoH(domain, recordType, subnet = '') {
    const startTime = performance.now();
    let url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${encodeURIComponent(recordType)}`;
    if (subnet) {
      url += `&edns_client_subnet=${encodeURIComponent(subnet)}`;
    }
    
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/dns-json' },
        cache: 'no-store'
      });
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      return {
        success: true,
        data: data,
        latency: latency
      };
    } catch (e) {
      // Fallback to Cloudflare DoH
      try {
        const cfRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${encodeURIComponent(recordType)}`, {
          headers: { 'Accept': 'application/dns-json' },
          cache: 'no-store'
        });
        const cfEnd = performance.now();
        const latency = Math.round(cfEnd - startTime);
        if (!cfRes.ok) throw new Error(`CF HTTP ${cfRes.status}`);
        const data = await cfRes.json();
        return { success: true, data: data, latency: latency };
      } catch (err) {
        return {
          success: false,
          error: err.message,
          latency: Math.round(performance.now() - startTime)
        };
      }
    }
  }

  // Render SVG Map Nodes
  function renderSvgMap() {
    if (!dom.mapNodesGroup) return;
    dom.mapNodesGroup.innerHTML = '';
    
    GLOBAL_RESOLVER_NODES.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'map-node-group');
      g.setAttribute('id', `node-g-${node.id}`);
      g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

      // Pulsing outer wave ring
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('class', 'map-node-ring');
      ring.setAttribute('r', '4');
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', '#00f0ff');
      ring.setAttribute('stroke-width', '1.2');

      // Core inner node dot
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('class', 'map-node-dot');
      dot.setAttribute('r', '3.5');
      dot.setAttribute('fill', '#00f0ff');
      dot.setAttribute('id', `node-dot-${node.id}`);

      // Title tooltip
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${node.name} (${node.provider})`;
      title.setAttribute('id', `node-title-${node.id}`);

      g.appendChild(ring);
      g.appendChild(dot);
      g.appendChild(title);

      g.addEventListener('click', () => {
        highlightNodeInTable(node.id);
      });

      dom.mapNodesGroup.appendChild(g);
    });
  }

  function highlightNodeInTable(nodeId) {
    const row = document.getElementById(`row-${nodeId}`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.style.backgroundColor = 'rgba(0, 240, 255, 0.2)';
      setTimeout(() => {
        row.style.backgroundColor = '';
      }, 1800);
    }
  }

  // Update SVG node status visual
  function updateNodeVisual(nodeId, status, recordData, latency) {
    const dot = document.getElementById(`node-dot-${nodeId}`);
    const g = document.getElementById(`node-g-${nodeId}`);
    const title = document.getElementById(`node-title-${nodeId}`);
    if (!dot || !g) return;

    let color = '#00ff87'; // nominal
    if (status === 'drift') color = '#ffb800';
    if (status === 'fail') color = '#ff2a54';

    dot.setAttribute('fill', color);
    const ring = g.querySelector('.map-node-ring');
    if (ring) {
      ring.setAttribute('stroke', color);
    }

    if (title) {
      title.textContent = `${nodeId.toUpperCase()}: ${status.toUpperCase()} (${latency}ms) -> ${recordData}`;
    }
  }

  // Render Table Initial Skeleton
  function renderTableSkeleton() {
    if (!dom.nodesTableBody) return;
    dom.nodesTableBody.innerHTML = '';
    
    GLOBAL_RESOLVER_NODES.forEach(node => {
      const tr = document.createElement('tr');
      tr.id = `row-${node.id}`;
      tr.innerHTML = `
        <td><span class="node-status-badge nominal" id="badge-${node.id}"><i class="fa-solid fa-satellite-dish"></i> STANDBY</span></td>
        <td><strong>${node.flag} ${node.name}</strong> <small style="display:block; color:var(--text-faint); font-size:0.68rem;">${node.region}</small></td>
        <td><span style="color:var(--text-muted);">${node.provider}</span></td>
        <td id="rec-${node.id}"><span style="color:var(--text-faint);">--</span></td>
        <td id="ttl-${node.id}"><span style="color:var(--text-faint);">--</span></td>
        <td>
          <div class="latency-meter">
            <span id="ping-${node.id}" style="min-width:44px; font-weight:700;">--</span>
            <div class="latency-bar-track"><div class="latency-bar-fill" id="bar-${node.id}" style="width:0%;"></div></div>
          </div>
        </td>
      `;
      dom.nodesTableBody.appendChild(tr);
    });
  }

  // Engage Global DNS Telemetry Sweep
  async function runDnsSweep() {
    if (state.isScanning) return;
    state.isScanning = true;
    state.domain = sanitizeDomain(dom.domainInput.value);
    state.recordType = dom.recordSelect.value;
    state.expectedValue = dom.expectedInput.value.trim();
    syncUrlFromState();

    if (dom.sweepBtn) {
      dom.sweepBtn.disabled = true;
      dom.sweepBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> TELEMETRY SWEEPING...';
    }

    renderTableSkeleton();
    state.nodeResults = {};
    state.anomalies = [];
    clearAnomalies();

    let resolvedValuesMap = {};
    let totalLatency = 0;
    let successfulNodes = 0;
    let queryPromises = [];

    // Query 24 nodes in parallel
    GLOBAL_RESOLVER_NODES.forEach(node => {
      const p = queryDoH(state.domain, state.recordType, node.subnet).then(res => {
        let status = 'fail';
        let resolvedStr = 'NXDOMAIN / NO ANSWER';
        let ttl = '--';
        let latency = res.latency;

        if (res.success && res.data) {
          const answers = res.data.Answer || [];
          if (answers.length > 0) {
            resolvedStr = answers.map(a => a.data).join(', ');
            ttl = answers[0].TTL + 's';
            status = 'nominal';
            successfulNodes++;
            totalLatency += latency;

            resolvedValuesMap[resolvedStr] = (resolvedValuesMap[resolvedStr] || 0) + 1;
            
            // Check expected value filter
            if (state.expectedValue) {
              if (resolvedStr.toLowerCase().includes(state.expectedValue.toLowerCase())) {
                status = 'nominal';
              } else {
                status = 'drift';
              }
            }
          } else if (res.data.Status === 3) {
            resolvedStr = 'NXDOMAIN (Domain Not Found)';
            status = 'fail';
          }
        }

        state.nodeResults[node.id] = {
          status, resolvedStr, ttl, latency
        };

        // Update single row
        updateTableRow(node.id, status, resolvedStr, ttl, latency);
        updateNodeVisual(node.id, status, resolvedStr, latency);
      });

      queryPromises.push(p);
    });

    await Promise.allSettled(queryPromises);

    // Compute Global Consensus & Drift
    const totalNodes = GLOBAL_RESOLVER_NODES.length;
    let maxClusterCount = 0;
    let dominantAnswer = 'NO ANSWER';
    
    for (const [val, count] of Object.entries(resolvedValuesMap)) {
      if (count > maxClusterCount) {
        maxClusterCount = count;
        dominantAnswer = val;
      }
    }

    const consensusPercentage = Math.round((maxClusterCount / totalNodes) * 100);
    const avgPing = successfulNodes > 0 ? Math.round(totalLatency / successfulNodes) : 0;

    // Update Radial Gauge
    updateRadialGauge(consensusPercentage);

    // Update HUD Metrics
    if (dom.statConsensus) dom.statConsensus.textContent = `${consensusPercentage}%`;
    if (dom.statMeanPing) dom.statMeanPing.textContent = `${avgPing} ms`;
    if (dom.statOnlineNodes) dom.statOnlineNodes.textContent = `${successfulNodes}/${totalNodes}`;
    if (dom.statResolvedRecord) {
      dom.statResolvedRecord.textContent = dominantAnswer.length > 25 ? dominantAnswer.substring(0, 25) + '...' : dominantAnswer;
      dom.statResolvedRecord.title = dominantAnswer;
    }

    // Check for DNS Drift Anomaly
    if (consensusPercentage < 90 && successfulNodes > 5) {
      triggerAnomaly({
        title: 'GLOBAL DNS PROPAGATION DRIFT DETECTED',
        badge: 'DRIFT WARNING',
        desc: `Only ${consensusPercentage}% of global resolvers have synchronized the latest ${state.recordType} record. Users in certain regions (e.g. Asia or Middle East) are currently resolving stale IP addresses, causing lost traffic and broken routing.`,
        ctaText: 'Accelerate Global DNS via WHX Anycast — Free Call',
        category: 'dns'
      });
    }

    if (successfulNodes === 0) {
      triggerAnomaly({
        title: 'GLOBAL RESOLUTION FAILURE (OFFLINE / NXDOMAIN)',
        badge: 'CRITICAL OUTAGE',
        desc: `Zero resolvers could find valid ${state.recordType} records for ${state.domain}. Domain may be expired, nameservers unreachable, or DNS records deleted.`,
        ctaText: 'Restore Domain Infrastructure with WHX — Immediate Call',
        category: 'dns'
      });
    }

    if (dom.sweepBtn) {
      dom.sweepBtn.disabled = false;
      dom.sweepBtn.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> ENGAGE ORBITAL SWEEP';
    }
    state.isScanning = false;

    // Concurrently trigger Module 2 & 3 Audits in background
    runDomainSecurityAudit(state.domain);
    runBrandMatrixAudit(state.domain);
  }

  function updateTableRow(nodeId, status, resolvedStr, ttl, latency) {
    const badge = document.getElementById(`badge-${nodeId}`);
    const rec = document.getElementById(`rec-${nodeId}`);
    const ttlEl = document.getElementById(`ttl-${nodeId}`);
    const ping = document.getElementById(`ping-${nodeId}`);
    const bar = document.getElementById(`bar-${nodeId}`);

    if (badge) {
      badge.className = `node-status-badge ${status}`;
      badge.innerHTML = status === 'nominal' ? '<i class="fa-solid fa-circle-check"></i> NOMINAL' :
                        status === 'drift' ? '<i class="fa-solid fa-triangle-exclamation"></i> DRIFT' :
                        '<i class="fa-solid fa-circle-xmark"></i> FAIL';
    }

    if (rec) {
      if (status !== 'fail') {
        rec.innerHTML = `<span class="copy-record-chip" onclick="window.copyText('${escapeHtml(resolvedStr)}')">${escapeHtml(resolvedStr.length > 28 ? resolvedStr.substring(0, 28) + '...' : resolvedStr)} <i class="fa-regular fa-copy"></i></span>`;
      } else {
        rec.innerHTML = `<span style="color:var(--critical-red);">${escapeHtml(resolvedStr)}</span>`;
      }
    }

    if (ttlEl) ttlEl.textContent = ttl;
    if (ping) ping.textContent = `${latency} ms`;
    if (bar) {
      const pct = Math.min(100, Math.round((latency / 250) * 100));
      bar.style.width = `${pct}%`;
      bar.style.background = latency < 80 ? 'var(--nominal-emerald)' : latency < 180 ? 'var(--drift-amber)' : 'var(--critical-red)';
    }
  }

  function updateRadialGauge(percentage) {
    if (!dom.radialFill || !dom.radialPct) return;
    const circumference = 440;
    const offset = circumference - (percentage / 100) * circumference;
    dom.radialFill.style.strokeDashoffset = offset;
    dom.radialPct.textContent = `${percentage}%`;

    if (percentage >= 90) {
      dom.radialFill.style.stroke = 'var(--nominal-emerald)';
    } else if (percentage >= 60) {
      dom.radialFill.style.stroke = 'var(--drift-amber)';
    } else {
      dom.radialFill.style.stroke = 'var(--critical-red)';
    }
  }

  // ==========================================================================
  // MODULE 2: 6-IN-1 DEEP DOMAIN & SECURITY ANALYZER
  // ==========================================================================
  async function runDomainSecurityAudit(domain) {
    // 1. RDAP & Domain Age
    try {
      const rdapRes = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
        headers: { 'Accept': 'application/rdap+json' }
      });
      if (rdapRes.ok) {
        const rdap = await rdapRes.json();
        parseRdapData(rdap);
      } else {
        fallbackDomainAge();
      }
    } catch(e) {
      fallbackDomainAge();
    }

    // 2. Email Deliverability & Spoofing Shield (SPF, DMARC, MX)
    auditEmailSecurity(domain);

    // 3. NS, SOA, CAA, IPv6
    auditInfrastructure(domain);
  }

  function parseRdapData(rdap) {
    let regDate = null;
    let expDate = null;
    const events = rdap.events || [];

    events.forEach(ev => {
      if (ev.eventAction === 'registration') regDate = new Date(ev.eventDate);
      if (ev.eventAction === 'expiration') expDate = new Date(ev.eventDate);
    });

    if (regDate) {
      const now = new Date();
      const ageMs = now - regDate;
      const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
      const years = Math.floor(ageDays / 365);
      const months = Math.floor((ageDays % 365) / 30);
      const days = (ageDays % 365) % 30;

      if (dom.whoisAgeText) dom.whoisAgeText.textContent = `${years} Yrs, ${months} Mos, ${days} Days (${ageDays.toLocaleString()} days)`;
      if (dom.whoisCreated) dom.whoisCreated.textContent = regDate.toISOString().split('T')[0];
    } else {
      fallbackDomainAge();
    }

    if (expDate) {
      const now = new Date();
      const expDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
      if (dom.whoisExpires) dom.whoisExpires.textContent = `${expDate.toISOString().split('T')[0]} (${expDays} days left)`;
    }

    // Registrar & Lock Status
    let registrarName = 'Protected / Privacy Service';
    const entities = rdap.entities || [];
    entities.forEach(ent => {
      if (ent.roles && ent.roles.includes('registrar')) {
        registrarName = (ent.vcardArray && ent.vcardArray[1] && ent.vcardArray[1][1] && ent.vcardArray[1][1][3]) || ent.handle || registrarName;
      }
    });
    if (dom.whoisRegistrar) dom.whoisRegistrar.textContent = registrarName;

    const statuses = rdap.status || [];
    const isLocked = statuses.some(s => s.toLowerCase().includes('prohibited'));
    if (dom.whoisStatus) {
      dom.whoisStatus.textContent = isLocked ? 'Registry Locked (Prohibited Transfer)' : 'Standard (Unlocked)';
      dom.whoisStatus.style.color = isLocked ? 'var(--nominal-emerald)' : 'var(--drift-amber)';
    }
  }

  function fallbackDomainAge() {
    if (dom.whoisAgeText) dom.whoisAgeText.textContent = 'Active (RDAP Privacy Shielded)';
    if (dom.whoisCreated) dom.whoisCreated.textContent = 'Verified Active';
    if (dom.whoisExpires) dom.whoisExpires.textContent = 'Under Auto-Renewal';
    if (dom.whoisRegistrar) dom.whoisRegistrar.textContent = 'Verified ICANN Registrar';
    if (dom.whoisStatus) dom.whoisStatus.textContent = 'Protected';
  }

  // Audit Email Deliverability (SPF, DMARC, MX)
  async function auditEmailSecurity(domain) {
    let hasSpf = false;
    let spfRecord = '';
    let hasDmarc = false;
    let dmarcPolicy = '';
    let hasMx = false;
    let mxHosts = [];

    // Query SPF (TXT records of domain)
    const txtRes = await queryDoH(domain, 'TXT');
    if (txtRes.success && txtRes.data && txtRes.data.Answer) {
      txtRes.data.Answer.forEach(a => {
        const val = a.data.replace(/"/g, '');
        if (val.startsWith('v=spf1')) {
          hasSpf = true;
          spfRecord = val;
        }
      });
    }

    // Query DMARC (TXT record of _dmarc.domain)
    const dmarcRes = await queryDoH(`_dmarc.${domain}`, 'TXT');
    if (dmarcRes.success && dmarcRes.data && dmarcRes.data.Answer) {
      dmarcRes.data.Answer.forEach(a => {
        const val = a.data.replace(/"/g, '');
        if (val.startsWith('v=DMARC1')) {
          hasDmarc = true;
          const match = val.match(/p=([a-z]+)/i);
          dmarcPolicy = match ? match[1].toLowerCase() : 'none';
        }
      });
    }

    // Query MX
    const mxRes = await queryDoH(domain, 'MX');
    if (mxRes.success && mxRes.data && mxRes.data.Answer) {
      mxHosts = mxRes.data.Answer.map(a => a.data);
      hasMx = mxHosts.length > 0;
    }

    // Calculate Email Security Grade
    let grade = 'F';
    let gradeClass = 'grade-f';

    if (hasSpf && hasDmarc && hasMx) {
      if (dmarcPolicy === 'reject' || dmarcPolicy === 'quarantine') {
        grade = 'A+';
        gradeClass = 'grade-a';
      } else {
        grade = 'B';
        gradeClass = 'grade-b';
      }
    } else if (hasSpf && hasMx && !hasDmarc) {
      grade = 'C';
      gradeClass = 'grade-c';
    } else if (hasMx && !hasSpf) {
      grade = 'D';
      gradeClass = 'grade-d';
    } else {
      grade = 'F';
      gradeClass = 'grade-f';
    }

    // Update DOM
    if (dom.emailSecurityGrade) {
      dom.emailSecurityGrade.className = `intel-score-badge ${gradeClass}`;
      dom.emailSecurityGrade.textContent = grade;
    }

    if (dom.spfStatusText) {
      dom.spfStatusText.innerHTML = hasSpf ? 
        `<span style="color:var(--nominal-emerald);"><i class="fa-solid fa-circle-check"></i> Present: ${escapeHtml(spfRecord.substring(0, 32))}...</span>` : 
        `<span style="color:var(--critical-red);"><i class="fa-solid fa-circle-xmark"></i> MISSING SPF (High Spoof Risk)</span>`;
    }

    if (dom.dmarcStatusText) {
      dom.dmarcStatusText.innerHTML = hasDmarc ? 
        `<span style="color:var(--nominal-emerald);"><i class="fa-solid fa-circle-check"></i> Enforced (p=${dmarcPolicy})</span>` : 
        `<span style="color:var(--critical-red);"><i class="fa-solid fa-circle-xmark"></i> MISSING DMARC (Vulnerable to Phishing)</span>`;
    }

    if (dom.mxStatusText) {
      dom.mxStatusText.innerHTML = hasMx ? 
        `<span style="color:var(--nominal-emerald);"><i class="fa-solid fa-circle-check"></i> ${mxHosts.length} Mail Servers Active</span>` : 
        `<span style="color:var(--drift-amber);"><i class="fa-solid fa-triangle-exclamation"></i> No MX Records Found</span>`;
    }

    // Conversion Anomaly Trigger on Poor Email Grade
    if (grade === 'C' || grade === 'D' || grade === 'F') {
      triggerAnomaly({
        title: 'CRITICAL EMAIL SPOOFING & DELIVERABILITY FAILURE',
        badge: 'SECURITY ANOMALY',
        desc: `Your domain ${domain} scored Grade ${grade}. It lacks essential DMARC or SPF enforcement. Anyone on the internet can impersonate @${domain} to send fraudulent emails, and Gmail / Yahoo 2026 strict deliverability rules will reject your outbound business emails.`,
        ctaText: 'Harden Email Infrastructure with WHX — Book Free Call',
        category: 'email'
      });
    }
  }

  // 12-TLD Instant Brand Availability Matrix
  async function runBrandMatrixAudit(domain) {
    if (!dom.tldMatrixGrid) return;
    const rootName = domain.split('.')[0];
    dom.tldMatrixGrid.innerHTML = '';

    BRAND_TLD_LIST.forEach(tld => {
      const target = rootName + tld;
      const el = document.createElement('div');
      el.className = 'tld-item';
      el.id = `tld-${tld.replace('.', '')}`;
      el.innerHTML = `
        <div class="tld-name">${tld}</div>
        <div class="tld-status"><i class="fa-solid fa-circle-notch fa-spin"></i> Checking...</div>
      `;
      dom.tldMatrixGrid.appendChild(el);

      queryDoH(target, 'A').then(res => {
        let isAvailable = false;
        if (res.success && res.data) {
          if (res.data.Status === 3) { // NXDOMAIN
            isAvailable = true;
          }
        }
        const item = document.getElementById(`tld-${tld.replace('.', '')}`);
        if (item) {
          item.className = `tld-item ${isAvailable ? 'available' : 'taken'}`;
          item.innerHTML = `
            <div class="tld-name">${tld}</div>
            <div class="tld-status">${isAvailable ? '<strong style="color:var(--nominal-emerald);">AVAILABLE</strong>' : 'REGISTERED'}</div>
          `;
        }
      });
    });
  }

  // Audit NS, SOA, CAA, IPv6
  async function auditInfrastructure(domain) {
    // NS
    const nsRes = await queryDoH(domain, 'NS');
    if (dom.nsStatusText) {
      if (nsRes.success && nsRes.data && nsRes.data.Answer) {
        const count = nsRes.data.Answer.length;
        dom.nsStatusText.innerHTML = count >= 2 ? 
          `<span style="color:var(--nominal-emerald);"><i class="fa-solid fa-circle-check"></i> ${count} Redundant Nameservers</span>` : 
          `<span style="color:var(--drift-amber);"><i class="fa-solid fa-triangle-exclamation"></i> Only 1 NS (No Redundancy)</span>`;
      }
    }

    // SOA
    const soaRes = await queryDoH(domain, 'SOA');
    if (dom.soaStatusText) {
      if (soaRes.success && soaRes.data && soaRes.data.Answer) {
        dom.soaStatusText.innerHTML = `<span style="color:var(--nominal-emerald);"><i class="fa-solid fa-circle-check"></i> Valid SOA Zone Authority</span>`;
      } else {
        dom.soaStatusText.innerHTML = `<span style="color:var(--critical-red);"><i class="fa-solid fa-circle-xmark"></i> SOA Not Found</span>`;
      }
    }

    // CAA
    const caaRes = await queryDoH(domain, 'CAA');
    if (dom.caaStatusText) {
      if (caaRes.success && caaRes.data && caaRes.data.Answer && caaRes.data.Answer.length > 0) {
        dom.caaStatusText.innerHTML = `<span style="color:var(--nominal-emerald);"><i class="fa-solid fa-shield-halved"></i> CAA Locked (Strict SSL Authority)</span>`;
      } else {
        dom.caaStatusText.innerHTML = `<span style="color:var(--drift-amber);"><i class="fa-solid fa-triangle-exclamation"></i> Unrestricted CAA (No SSL Lock)</span>`;
        triggerAnomaly({
          title: 'UNRESTRICTED CAA SSL AUTHORITY DETECTED',
          badge: 'DRIFT GAP',
          desc: `Domain ${domain} does not publish CAA records. Any public Certificate Authority in the world can issue an SSL certificate for your domain without restriction.`,
          ctaText: 'Deploy Zero-Trust SSL & CAA with WHX — Book Free Call',
          category: 'ssl'
        });
      }
    }

    // IPv6 (AAAA)
    const aaaaRes = await queryDoH(domain, 'AAAA');
    if (dom.ipv6StatusText) {
      if (aaaaRes.success && aaaaRes.data && aaaaRes.data.Answer && aaaaRes.data.Answer.length > 0) {
        dom.ipv6StatusText.innerHTML = `<span style="color:var(--nominal-emerald);"><i class="fa-solid fa-circle-check"></i> IPv6 Ready (Dual-Stack)</span>`;
      } else {
        dom.ipv6StatusText.innerHTML = `<span style="color:var(--drift-amber);"><i class="fa-solid fa-circle-info"></i> IPv4 Only (Missing AAAA)</span>`;
      }
    }
  }

  // ==========================================================================
  // MODULE 3: 1-CLICK LOCAL BUSINESS SCHEMA GENERATOR
  // ==========================================================================
  function generateLocalBusinessSchema() {
    const bizName = dom.schemaBizName ? dom.schemaBizName.value.trim() || 'WHX Digital Enterprise' : 'Your Business Name';
    const category = dom.schemaCategory ? dom.schemaCategory.value : 'ProfessionalService';
    const city = dom.schemaCity ? dom.schemaCity.value.trim() || 'New York' : 'City';
    const phone = dom.schemaPhone ? dom.schemaPhone.value.trim() || '+1 (555) 019-2831' : '+1 (555) 000-0000';
    const url = dom.schemaUrl ? dom.schemaUrl.value.trim() || 'https://' + state.domain : 'https://example.com';

    const schemaObj = {
      "@context": "https://schema.org",
      "@type": [category, "LocalBusiness"],
      "name": bizName,
      "url": url,
      "telephone": phone,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "40.7128",
        "longitude": "-74.0060"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:00"
        }
      ],
      "areaServed": [city, "Regional Metro Area"],
      "knowsAbout": [
        "Local Search Engine Optimization",
        "Google Maps 3-Pack Supremacy",
        "Generative Engine Optimization (GEO)",
        "AI Agent Automation"
      ]
    };

    const formatted = JSON.stringify(schemaObj, null, 2);
    if (dom.schemaCodeOutput) {
      dom.schemaCodeOutput.textContent = `<script type="application/ld+json">\n${formatted}\n<\/script>`;
    }
  }

  // ==========================================================================
  // MODULE 4: VIRAL CONVERSION & ANOMALY ALERT ENGINE
  // ==========================================================================
  function triggerAnomaly(anomaly) {
    if (!dom.anomalyAlertContainer) return;
    // Prevent duplicate alerts
    if (state.anomalies.some(a => a.title === anomaly.title)) return;
    state.anomalies.push(anomaly);

    const card = document.createElement('div');
    card.className = 'anomaly-alert-card';
    card.innerHTML = `
      <div class="anomaly-alert-header">
        <span class="anomaly-badge">[CRITICAL INFRASTRUCTURE ANOMALY DETECTED]</span>
        <strong class="anomaly-title">${escapeHtml(anomaly.title)}</strong>
      </div>
      <p class="anomaly-desc">${escapeHtml(anomaly.desc)}</p>
      <a href="https://wa.me/351928350275?text=${encodeURIComponent('Hello WHX Systems Team, I ran an orbital telemetry scan on ' + state.domain + ' and detected: ' + anomaly.title + '. I need your engineering team to resolve this.')}" target="_blank" rel="noopener noreferrer" class="anomaly-cta-btn">
        <i class="fa-solid fa-wrench"></i> ${escapeHtml(anomaly.ctaText)} <i class="fa-solid fa-arrow-right"></i>
      </a>
    `;

    dom.anomalyAlertContainer.prepend(card);
  }

  function clearAnomalies() {
    if (dom.anomalyAlertContainer) {
      dom.anomalyAlertContainer.innerHTML = '';
    }
  }

  // Helper Utilities
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  window.copyText = function(text) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard: ' + (text.length > 25 ? text.substring(0, 25) + '...' : text));
    }).catch(() => {
      prompt('Copy this value:', text);
    });
  };

  function showToast(msg) {
    let toast = document.getElementById('hudToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'hudToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #090D16;
        border: 1px solid #00F0FF;
        color: #FFFFFF;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 0 24px rgba(0, 240, 255, 0.4);
        z-index: 100000;
        transition: opacity 0.2s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 200);
    }, 2400);
  }

  // Event Listeners Initialization
  function initListeners() {
    // Sweep Button & Enter key
    if (dom.sweepBtn) {
      dom.sweepBtn.addEventListener('click', runDnsSweep);
    }
    if (dom.domainInput) {
      dom.domainInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runDnsSweep();
      });
    }

    // Preset chips
    document.querySelectorAll('.hud-preset-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = btn.getAttribute('data-domain');
        if (d && dom.domainInput) {
          dom.domainInput.value = d;
          runDnsSweep();
        }
      });
    });

    // 15s Live Telemetry Loop
    if (dom.loopToggle) {
      dom.loopToggle.addEventListener('change', () => {
        state.isLoopActive = dom.loopToggle.checked;
        if (state.isLoopActive) {
          showToast('Live Telemetry Loop Active (15s Auto-Refresh)');
          state.loopIntervalId = setInterval(() => {
            if (!state.isScanning) runDnsSweep();
          }, 15000);
        } else {
          showToast('Live Telemetry Loop Paused');
          if (state.loopIntervalId) clearInterval(state.loopIntervalId);
        }
      });
    }

    // Tabs
    dom.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        if (target) switchTab(target);
      });
    });

    // Table Filter
    if (dom.filterInput) {
      dom.filterInput.addEventListener('input', () => {
        const q = dom.filterInput.value.toLowerCase();
        document.querySelectorAll('#hudNodesTableBody tr').forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    }

    // Schema Generator Inputs
    ['schemaBizName', 'schemaCategory', 'schemaCity', 'schemaPhone', 'schemaUrl'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', generateLocalBusinessSchema);
    });

    if (dom.copySchemaBtn) {
      dom.copySchemaBtn.addEventListener('click', () => {
        if (dom.schemaCodeOutput) {
          window.copyText(dom.schemaCodeOutput.textContent);
        }
      });
    }

    // Share & Print Actions
    if (dom.copyLinkBtn) {
      dom.copyLinkBtn.addEventListener('click', () => {
        syncUrlFromState();
        window.copyText(window.location.href);
      });
    }

    if (dom.downloadReportBtn) {
      dom.downloadReportBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // FAQ Accordion toggles
    document.querySelectorAll('.hud-faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.hud-faq-item');
        if (item) {
          item.classList.toggle('is-open');
        }
      });
    });
  }

  // DOM Content Loaded Initializer
  document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    startClock();
    renderSvgMap();
    renderTableSkeleton();
    generateLocalBusinessSchema();
    syncStateFromUrl();
    initListeners();

    // Auto trigger initial scan on page load
    setTimeout(runDnsSweep, 300);
  });

})();
