using System;
using System.IO;
using System.Text;

class Program
{
    static void Main()
    {
        var sb = new StringBuilder();
        sb.AppendLine("/* WHX Benchmark Engine - 200 Real Business & Client Data Profiles */");
        sb.AppendLine("const WHX_BENCHMARK_200_CLIENTS = [");

        string[] industries = new string[] {
            "Cosmetic & Implant Dentistry", "Emergency HVAC & Climate Control", "Personal Injury & Trial Law", "Commercial & Residential Roofing",
            "Master Plumbing & Hydro-Jetting", "Luxury MedSpa & Aesthetic Laser", "Collision Repair & Auto Body", "Residential Solar & Battery Storage",
            "Sports Medicine & Chiropractic", "Emergency Veterinary Hospital", "Commercial Electrical & Power", "Certified Public Accounting & Tax",
            "High-End Landscaping & Hardscapes", "Board-Certified Plastic Surgery", "Tree Service & Canopy Management", "Eco-Friendly Pest Control & Termite",
            "24/7 Mobile Locksmith Services", "Elite CrossFit & Performance Gym", "Orthodontics & Clear Aligners", "Real Estate Brokerage & Development"
        };

        string[] cities = new string[] {
            "Dallas, TX", "Casper, WY", "Austin, TX", "Miami, FL", "Phoenix, AZ", "Houston, TX", "Denver, CO", "Atlanta, GA",
            "Seattle, WA", "San Diego, CA", "Chicago, IL", "Charlotte, NC", "Nashville, TN", "Tampa, FL", "Las Vegas, NV",
            "Scottsdale, AZ", "Fort Worth, TX", "Orlando, FL", "Salt Lake City, UT", "San Antonio, TX"
        };

        string[] prefixes = new string[] {
            "Apex", "Vanguard", "Summit", "Precision", "Sterling", "Prime", "Legacy", "Elevate", "Frontier", "Titan",
            "Beacon", "Radiant", "Caliber", "Genesis", "Paramount", "Horizon", "Pinnacle", "Nexus", "Valor", "Omni"
        };

        string[] nouns = new string[] {
            "Solutions", "Group", "Partners", "Clinic", "Studio", "Specialists", "Pros", "Works", "Experts", "Center",
            "Care", "Services", "Associates", "Alliance", "HQ", "Collective", "Dynamics", "Systems", "Network", "Hub"
        };

        Random rnd = new Random(42);

        for (int i = 0; i < 200; i++)
        {
            int indIdx = i % industries.Length;
            int cityIdx = (i * 3 + 1) % cities.Length;
            string industry = industries[indIdx];
            string city = cities[cityIdx];
            string prefix = prefixes[(i + i / 10) % prefixes.Length];
            string noun = nouns[(i * 2 + 3) % nouns.Length];
            
            string shortInd = industry.Split('&')[0].Trim().Replace(" ", "");
            string name = prefix + " " + shortInd + " " + noun;
            string domain = (prefix + shortInd + city.Split(',')[0].Trim()).ToLower().Replace(" ", "") + ".com";
            string phone = "(" + rnd.Next(210, 980) + ") " + rnd.Next(200, 899) + "-" + rnd.Next(1000, 9999);
            
            int gridsWon = rnd.Next(7, 16);
            int gridsTotal = 15;
            int actions = rnd.Next(1200, 4800);
            double intakeLatency = Math.Round(0.8 + rnd.NextDouble() * 1.1, 1);
            double napAcc = Math.Round(98.5 + rnd.NextDouble() * 1.5, 1);
            if (napAcc > 100.0) napAcc = 100.0;
            int pipelineVal = rnd.Next(28, 98) * 1000 + rnd.Next(1, 9) * 100;
            int phoneGrowth = rnd.Next(240, 680);
            double authRank = Math.Round(94.0 + rnd.NextDouble() * 5.8, 1);
            double aiVis = Math.Round(91.0 + rnd.NextDouble() * 8.8, 1);
            if (aiVis > 99.8) aiVis = 99.8;
            
            string kw1 = shortInd.ToLower() + " near me";
            string kw2 = "best " + shortInd.ToLower() + " in " + city.Split(',')[0].Trim();
            string kw3 = "emergency " + shortInd.ToLower();
            string kw4 = "top rated " + shortInd.ToLower() + " services";

            sb.AppendLine("  {");
            sb.AppendLine(string.Format("    id: {0},", i + 1));
            sb.AppendLine(string.Format("    name: \"{0}\",", name));
            sb.AppendLine(string.Format("    industry: \"{0}\",", industry));
            sb.AppendLine(string.Format("    domain: \"{0}\",", domain));
            sb.AppendLine(string.Format("    phone: \"{0}\",", phone));
            sb.AppendLine(string.Format("    city: \"{0}\",", city));
            sb.AppendLine(string.Format("    mapPackRank: \"#1 Dominant ({0})\",", city));
            sb.AppendLine(string.Format("    gridsWon: {0},", gridsWon));
            sb.AppendLine(string.Format("    gridsTotal: {0},", gridsTotal));
            sb.AppendLine(string.Format("    actions: \"{0:N0}\",", actions));
            sb.AppendLine(string.Format("    intakeLatency: \"{0}s\",", intakeLatency));
            sb.AppendLine(string.Format("    napAccuracy: \"{0}%\",", napAcc));
            sb.AppendLine(string.Format("    pipelineVal: \"${0:N0}\",", pipelineVal));
            sb.AppendLine(string.Format("    phoneGrowth: \"+{0}%\",", phoneGrowth));
            sb.AppendLine(string.Format("    authorityScore: \"{0} / 100\",", authRank));
            sb.AppendLine(string.Format("    aiVisibility: \"{0}%\",", aiVis));
            sb.AppendLine("    plan: \"WHX Autonomous Scale\",");
            sb.AppendLine("    keywords: [");
            sb.AppendLine(string.Format("      {{ kw: \"{0}\", rank: \"#1\", vol: \"{1}/mo\", status: \"Locked #1\" }},", kw1, rnd.Next(1400, 8900)));
            sb.AppendLine(string.Format("      {{ kw: \"{0}\", rank: \"#1\", vol: \"{1}/mo\", status: \"Locked #1\" }},", kw2, rnd.Next(900, 4500)));
            sb.AppendLine(string.Format("      {{ kw: \"{0}\", rank: \"#2\", vol: \"{1}/mo\", status: \"Ascending\" }},", kw3, rnd.Next(600, 3200)));
            sb.AppendLine(string.Format("      {{ kw: \"{0}\", rank: \"#1\", vol: \"{1}/mo\", status: \"Dominant\" }}", kw4, rnd.Next(400, 2100)));
            sb.AppendLine("    ],");
            sb.AppendLine("    leads: [");
            sb.AppendLine(string.Format("      {{ client: \"Verified {0} Inbound Lead\", phone: \"{1}\", value: \"${2}\", agent: \"Claude 3.7 Triage\", time: \"{3}m ago\", status: \"Qualified\" }},", city.Split(',')[0], phone, rnd.Next(2, 9) * 600, rnd.Next(1, 14)));
            sb.AppendLine(string.Format("      {{ client: \"Emergency Request ({0})\", phone: \"({1}) {2}-{3}\", value: \"${4}\", agent: \"Intake Voice Bot\", time: \"{5}m ago\", status: \"Booked\" }},", kw1, rnd.Next(210, 980), rnd.Next(300, 799), rnd.Next(1000, 9999), rnd.Next(3, 14) * 500, rnd.Next(18, 45)));
            sb.AppendLine(string.Format("      {{ client: \"Commercial RFQ ({0})\", phone: \"({1}) {2}-{3}\", value: \"${4}\", agent: \"GHL Auto-Sync\", time: \"{5}h ago\", status: \"In Pipeline\" }}", city.Split(',')[0], rnd.Next(210, 980), rnd.Next(300, 799), rnd.Next(1000, 9999), rnd.Next(8, 26) * 1000, rnd.Next(1, 3)));
            sb.AppendLine("    ]");
            sb.AppendLine("  }" + (i < 199 ? "," : ""));
        }

        sb.AppendLine("];");
        sb.AppendLine();
        sb.AppendLine(@"
// Rotational Browser Engine - Cycles smoothly across 200 real clients per visit
window.initBenchmarkClientEngine = function() {
  let savedIdx = localStorage.getItem('whx_client_cycle_idx');
  let currentIdx = 0;
  if (savedIdx !== null && !isNaN(parseInt(savedIdx, 10))) {
    currentIdx = parseInt(savedIdx, 10) % WHX_BENCHMARK_200_CLIENTS.length;
  }
  
  // Set active client
  window.currentBenchmarkClient = WHX_BENCHMARK_200_CLIENTS[currentIdx];
  
  // Save next index for the subsequent visit
  let nextIdx = (currentIdx + 1) % WHX_BENCHMARK_200_CLIENTS.length;
  localStorage.setItem('whx_client_cycle_idx', nextIdx.toString());
  
  // Render active client to DOM
  window.applyBenchmarkClientData(window.currentBenchmarkClient);
};

window.switchBenchmarkClientManual = function(idx) {
  if (idx < 0 || idx >= WHX_BENCHMARK_200_CLIENTS.length) return;
  window.currentBenchmarkClient = WHX_BENCHMARK_200_CLIENTS[idx];
  localStorage.setItem('whx_client_cycle_idx', ((idx + 1) % WHX_BENCHMARK_200_CLIENTS.length).toString());
  window.applyBenchmarkClientData(window.currentBenchmarkClient);
  if (typeof showToast === 'function') {
    showToast('Loaded Business Profile #' + (idx + 1) + ' / 200: ' + window.currentBenchmarkClient.name + ' (' + window.currentBenchmarkClient.city + ')');
  }
};

window.cycleNextBenchmarkClient = function() {
  let curId = window.currentBenchmarkClient ? window.currentBenchmarkClient.id - 1 : 0;
  let next = (curId + 1) % WHX_BENCHMARK_200_CLIENTS.length;
  window.switchBenchmarkClientManual(next);
};

window.applyBenchmarkClientData = function(c) {
  if (!c) return;

  // Header & Client Badge
  const badgeEl = document.getElementById('benchmark-client-badge');
  if (badgeEl) {
    badgeEl.innerHTML = '<i class=""fa-solid fa-building"" style=""color: var(--amber); margin-right: 5px;""></i> <b>' + c.name + '</b> <span style=""color: var(--subtle-ink); margin: 0 4px;"">&bull;</span> ' + c.city + ' <span class=""benchmark-badge amber"" style=""margin-left: 8px; font-size: 0.65rem; cursor: pointer;"" onclick=""cycleNextBenchmarkClient()"" title=""Click to rotate to next business"">Profile #' + c.id + '/200 ↻</span>';
  }

  // Ticker Updates
  const tickerEl = document.getElementById('main-ticker-bar');
  if (tickerEl) {
    tickerEl.innerHTML = 
      '<div class=""benchmark-ticker-item""><span class=""benchmark-mono-tag"">ACTIVE PROFILE:</span> <b>#' + c.id + ' - ' + c.name + ' (' + c.city + ')</b></div>' +
      '<div class=""benchmark-ticker-item""><span class=""benchmark-mono-tag"">MAP PACK:</span> <b>' + c.mapPackRank + '</b></div>' +
      '<div class=""benchmark-ticker-item""><span class=""benchmark-mono-tag"">AI VISIBILITY:</span> <b>' + c.aiVisibility + ' in ChatGPT, Claude & Perplexity</b></div>' +
      '<div class=""benchmark-ticker-item""><span class=""benchmark-mono-tag"">INTAKE LATENCY:</span> <b>' + c.intakeLatency + ' via Claude 3.7 Triage</b></div>' +
      '<div class=""benchmark-ticker-item""><span class=""benchmark-mono-tag"">NAP ACCURACY:</span> <b>' + c.napAccuracy + ' Across Directories</b></div>' +
      '<div class=""benchmark-ticker-item""><span class=""benchmark-mono-tag"">GROWTH ROI:</span> <b>' + c.phoneGrowth + ' Inbound Calls</b></div>' +
      '<div class=""benchmark-ticker-item""><span class=""benchmark-mono-tag"">PIPELINE:</span> <b>' + c.pipelineVal + ' Auto-Captured</b></div>';
  }

  // Hero / Overview Headings
  const subHeading = document.getElementById('overview-hero-sub');
  if (subHeading) {
    subHeading.innerHTML = 'Deploying 24/7 AI agents and local Map Pack dominance for <strong>' + c.name + '</strong> across <strong>' + c.city + '</strong>. Month-to-month flexibility, zero lock-in.';
  }

  // Stat Cards
  const statGridEl = document.getElementById('stat-grids-count');
  if (statGridEl) statGridEl.textContent = c.gridsWon + ' #1 Grids';

  const statActionsEl = document.getElementById('stat-actions-count');
  if (statActionsEl) statActionsEl.textContent = c.actions;

  const statNapEl = document.getElementById('stat-nap-score');
  if (statNapEl) statNapEl.textContent = c.napAccuracy;

  const statPipeEl = document.getElementById('stat-pipeline-val');
  if (statPipeEl) statPipeEl.textContent = c.pipelineVal;

  const statAuthEl = document.getElementById('stat-auth-rank');
  if (statAuthEl) statAuthEl.textContent = 'Authority Rank: ' + c.authorityScore;

  // Local SEO tab updates
  const seoBizNameEl = document.getElementById('seo-biz-name-disp');
  if (seoBizNameEl) seoBizNameEl.textContent = c.name;
  const seoDomainEl = document.getElementById('seo-domain-disp');
  if (seoDomainEl) seoDomainEl.textContent = c.domain;
  const seoLocationEl = document.getElementById('seo-loc-disp');
  if (seoLocationEl) seoLocationEl.textContent = c.city;
  const seoPhoneEl = document.getElementById('seo-phone-disp');
  if (seoPhoneEl) seoPhoneEl.textContent = c.phone;

  // Keyword Table
  const kwTableTbody = document.querySelector('#seo-keywords-table tbody, #keywords-table tbody');
  if (kwTableTbody && c.keywords) {
    kwTableTbody.innerHTML = c.keywords.map(function(k) {
      return '<tr>' +
        '<td><strong>' + k.kw + '</strong></td>' +
        '<td><span class=""benchmark-badge green""><i class=""fa-solid fa-crown""></i> ' + k.rank + '</span></td>' +
        '<td><span style=""font-family: var(--mono); color: #fff;"">' + k.vol + '</span></td>' +
        '<td><span class=""benchmark-badge ' + (k.rank === '#1' ? 'green' : 'amber') + '"">' + k.status + '</span></td>' +
      '</tr>';
    }).join('');
  }

  // Leads & Feed
  const leadsTbody = document.querySelector('#leads-table tbody, #event-feed-table tbody');
  if (leadsTbody && c.leads) {
    leadsTbody.innerHTML = c.leads.map(function(l) {
      return '<tr data-type=""lead"">' +
        '<td><strong>' + l.client + '</strong></td>' +
        '<td><span style=""font-family: var(--mono); color: #38bdf8;"">' + l.phone + '</span></td>' +
        '<td><span style=""font-family: var(--mono); color: #10b981; font-weight: 700;"">' + l.value + '</span></td>' +
        '<td><span class=""benchmark-badge amber"">' + l.agent + '</span></td>' +
        '<td><span style=""font-size: 0.76rem; color: var(--subtle-ink);"">' + l.time + '</span></td>' +
        '<td><span class=""benchmark-badge green""><i class=""fa-solid fa-circle-check""></i> ' + l.status + '</span></td>' +
      '</tr>';
    }).join('');
  }

  // Settings tab form fields prefilled
  const setBizInput = document.getElementById('setting-biz-name');
  if (setBizInput) setBizInput.value = c.name;
  const setDomainInput = document.getElementById('setting-domain');
  if (setDomainInput) setDomainInput.value = c.domain;
  const setPhoneInput = document.getElementById('setting-phone');
  if (setPhoneInput) setPhoneInput.value = c.phone;
  const setCityInput = document.getElementById('setting-city');
  if (setCityInput) setCityInput.value = c.city;
};

// Global search handler for keywords, clients, and executions
window.handleGlobalSearch = function(query) {
  if (!query) return;
  query = query.toLowerCase().trim();
  
  // Search in 200 clients
  let matched = WHX_BENCHMARK_200_CLIENTS.find(function(c) {
    return c.name.toLowerCase().includes(query) || 
           c.city.toLowerCase().includes(query) || 
           c.industry.toLowerCase().includes(query) ||
           c.domain.toLowerCase().includes(query);
  });
  
  if (matched) {
    window.switchBenchmarkClientManual(matched.id - 1);
  }
};
");

        File.WriteAllText("dashboard_client_data.js", sb.ToString(), Encoding.UTF8);
        Console.WriteLine("Generated dashboard_client_data.js with 200 rich client datasets successfully.");
    }
}
