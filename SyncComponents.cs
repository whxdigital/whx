using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Linq;

public class SyncComponents
{
    public static void Main()
    {
        string rootDir = @"w:\PT WHX";
        var files = Directory.GetFiles(rootDir, "*.html", SearchOption.AllDirectories);

        string headerHtml = @"<header class=""site-header"" id=""top"">
      <div class=""logo"">
        <a href=""/index.html#top"" class=""logo-link"" aria-label=""WHX Digital home"">
          <svg class=""logo-icon-svg"" viewBox=""0 0 32 32"" fill=""currentColor"" aria-hidden=""true"">
            <rect x=""6"" y=""8"" width=""14"" height=""18"" rx=""2"" fill=""currentColor"" opacity=""0.9""></rect>
            <rect x=""9"" y=""6"" width=""14"" height=""18"" rx=""2"" fill=""currentColor"" opacity=""0.7""></rect>
            <rect x=""12"" y=""4"" width=""14"" height=""18"" rx=""2"" fill=""currentColor"" opacity=""0.5""></rect>
            <path d=""M19 12 L20 15 L23 15 L20.5 17 L21.5 20 L19 18 L16.5 20 L17.5 17 L15 15 L18 15 Z"" fill=""currentColor"" opacity=""0.3""></path>
          </svg>
        </a>
      </div>
      <button class=""menu-toggle"" type=""button"" aria-label=""Open menu"" aria-expanded=""false""><i class=""fa-solid fa-bars""></i></button>
      <nav class=""main-nav"" aria-label=""Main navigation"">
        <ul class=""nav-links"">
          <li><a href=""/index.html"">Home</a></li>
          <li><a href=""/index.html#search-services"">Search &amp; Local SEO</a></li>
          <li><a href=""/services.html"" data-i18n=""nav.services"">AI Automation</a></li>
          <li><a href=""/architecture.html"">AI Agents</a></li>
          <li><a href=""/insights/index.html"" data-i18n=""nav.insights"">Insights</a></li>
          <li><a href=""/reviews.html"">Reviews</a></li>
          <li><a href=""/contact.html"">Contact</a></li>
          <li class=""nav-item-dashboard"" style=""margin-left: 8px;"">
            <a href=""/dashboard.html"" class=""nav-dashboard-btn"" style=""padding: 6px 14px; border-radius: 9999px; font-size: 0.84rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.05); color: #0f172a; border: 1px solid rgba(0,0,0,0.08); text-decoration: none;"">Dashboard <i class=""fa-solid fa-arrow-right"" style=""font-size: 0.72rem; color: #64748b;""></i></a>
          </li>
        </ul>
      </nav>
    </header>";

        string footerHtml = @"<footer class=""site-footer"">
      <div class=""site-footer-inner"">
        <div class=""site-footer-grid"">
          <!-- Col 1: Brand & Authority -->
          <div class=""site-footer-col footer-brand-col"">
            <strong class=""footer-name"">WHX Digital</strong>
            <p class=""footer-tagline"">Dual-engine digital growth: Dominant Local SEO &amp; Google Maps rankings powered by 24/7 AI business automation.</p>
            <div class=""footer-badges"">
              <span class=""footer-badge""><i class=""fa-solid fa-location-dot""></i> Google 3-Pack Specialist</span>
              <span class=""footer-badge""><i class=""fa-solid fa-shield-halved""></i> Reliable Automation</span>
              <span class=""footer-badge""><i class=""fa-solid fa-hand-paper""></i> HITL Guardrails</span>
            </div>
          </div>

          <!-- Col 2: Search & Local Dominance -->
          <div class=""site-footer-col"">
            <h4>Search &amp; Local SEO</h4>
            <ul>
              <li><a href=""/index.html#search-services"">Local SEO Domination</a></li>
              <li><a href=""/index.html#search-services"">Google Maps (GMP) 3-Pack</a></li>
              <li><a href=""/index.html#search-services"">Citation Building &amp; Sync</a></li>
              <li><a href=""/index.html#search-services"">Authority Link Building</a></li>
              <li><a href=""/tools/website-audit/index.html"">Free Website Audit</a></li>
              <li><a href=""/reviews.html"">Client Success Proof</a></li>
            </ul>
          </div>

          <!-- Col 3: Autonomous AI Systems -->
          <div class=""site-footer-col"">
            <h4>AI Systems &amp; Ops</h4>
            <ul>
              <li><a href=""/architecture.html"">AI Agent Systems</a></li>
              <li><a href=""/multi-agent.html"">Multi-Agent Workforce</a></li>
              <li><a href=""/ai-crm-automation.html"">AI CRM Automation</a></li>
              <li><a href=""/n8n-automation.html"">n8n Workflow Engines</a></li>
              <li><a href=""/voice.html"">Real-Time Voice AI</a></li>
              <li><a href=""/knowledge.html"">RAG Knowledge Systems</a></li>
            </ul>
          </div>

          <!-- Col 4: Connect & Support -->
          <div class=""site-footer-col footer-contact-col"">
            <h4>Connect &amp; Company</h4>
            <ul class=""footer-contact-links"">
              <li><a href=""/about.html""><i class=""fa-solid fa-building""></i> About WHX Digital</a></li>
              <li><a href=""/contact.html""><i class=""fa-solid fa-calendar-check""></i> Book Strategy Session</a></li>
              <li><a href=""https://wa.me/351928350275"" target=""_blank"" rel=""noopener noreferrer""><i class=""fa-brands fa-whatsapp brand-icon brand-whatsapp"" style=""color:#22c55e !important;""></i> WhatsApp</a></li>
              
              <li><a href=""mailto:info@whxdigital.com""><i class=""fa-solid fa-envelope""></i> info@whxdigital.com</a></li>
              <li><a href=""mailto:whxdigital@gmail.com""><i class=""fa-solid fa-paper-plane"" style=""color:#38bdf8;""></i> whxdigital@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div class=""site-footer-bottom"">
          <div class=""footer-legal"">
            <span>&copy; 2026 WHX Digital. All rights reserved.</span>
            <div class=""legal-links"">
              <a href=""/privacy.html"">Privacy Policy</a>
              <a href=""/terms.html"">Terms of Service</a>
              <a href=""/security.html"">Security</a>
              <a href=""/trust-center.html"">Trust Center</a>
            </div>
          </div>
          <div class=""footer-social"">
            <a href=""#"" aria-label=""Twitter""><i class=""fa-brands fa-x-twitter""></i></a>
            <a href=""https://www.linkedin.com/in/whxdigital/"" aria-label=""LinkedIn""><i class=""fa-brands fa-linkedin""></i></a>
            <a href=""https://github.com/"" aria-label=""GitHub""><i class=""fa-brands fa-github""></i></a>
          </div>
        </div>
      </div>
    </footer>";

        int count = 0;
        foreach (var file in files)
        {
            string html = File.ReadAllText(file);
            bool changed = false;

            string oldHeader = Regex.Match(html, @"<header class=""site-header"".*?</header>", RegexOptions.Singleline).Value;
            if (!string.IsNullOrEmpty(oldHeader) && oldHeader != headerHtml)
            {
                html = html.Replace(oldHeader, headerHtml);
                changed = true;
            }

            string oldFooter = Regex.Match(html, @"<footer class=""site-footer"".*?</footer>", RegexOptions.Singleline).Value;
            if (!string.IsNullOrEmpty(oldFooter) && oldFooter != footerHtml)
            {
                html = html.Replace(oldFooter, footerHtml);
                changed = true;
            }

            if (changed)
            {
                File.WriteAllText(file, html);
                count++;
                Console.WriteLine("Updated " + file);
            }
        }
        Console.WriteLine("Updated " + count + " files total.");
    }
}
