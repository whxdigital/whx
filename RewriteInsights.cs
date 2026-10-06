using System;
using System.IO;
using System.Text.RegularExpressions;

public class InsightsRewriter
{
    public static void Rewrite(string filePath)
    {
        string html = File.ReadAllText(filePath);
        
        // Extract title and lead
        string titleMatch = Regex.Match(html, @"<h1>(.*?)</h1>").Groups[1].Value;
        string leadMatch = Regex.Match(html, @"<p class=""article-intro-lead"">(.*?)</p>").Groups[1].Value;
        
        if (string.IsNullOrEmpty(titleMatch)) return;

        // The boilerplate to replace starts after </nav> (Table of Contents) and ends before <section class="article-related-section">
        string pattern = @"<article class=""article-body"">.*?</article>";
        
        string newBody = $@"<article class=""article-body"">
        <h2 id=""section-1"">1. Core Concepts</h2>
        <p>When implementing systems for <strong>{titleMatch.ToLower()}</strong>, the primary objective is to align operational logic with your specific business requirements. {leadMatch}</p>

        <h2 id=""section-2"">2. Execution &amp; Integration</h2>
        <p>A standard deployment phase typically involves:</p>
        <ul>
          <li><strong>Assessment:</strong> Evaluating the current workflow and data availability.</li>
          <li><strong>Integration:</strong> Connecting the necessary APIs and establishing data pipelines.</li>
          <li><strong>Testing:</strong> Verifying outputs against expected business logic.</li>
          <li><strong>Deployment:</strong> Rolling out the solution with monitoring enabled.</li>
        </ul>

        <div class=""insights-workflow"">
          <div class=""insights-workflow-title"">Standard Implementation Flow</div>
          <div class=""insights-workflow-nodes"">
            <div class=""iw-node""><i class=""fa-solid fa-clipboard-list iw-icon""></i> <span>Assess</span></div>
            <i class=""fa-solid fa-arrow-right iw-arrow""></i>
            <div class=""iw-node""><i class=""fa-solid fa-plug iw-icon""></i> <span>Integrate</span></div>
            <i class=""fa-solid fa-arrow-right iw-arrow""></i>
            <div class=""iw-node""><i class=""fa-solid fa-vial iw-icon""></i> <span>Test</span></div>
            <i class=""fa-solid fa-arrow-right iw-arrow""></i>
            <div class=""iw-node success""><i class=""fa-solid fa-rocket iw-icon""></i> <span>Deploy</span></div>
          </div>
        </div>

        <h2 id=""section-3"">3. Reliability &amp; Safeguards</h2>
        <p>To maintain stable operations, we recommend utilizing automatic retries, robust logging, and Human-in-the-Loop review gates for critical decisions.</p>

        <div class=""article-takeaways"" id=""key-takeaways"">
          <h3><i class=""fa-solid fa-circle-check""></i> Key Takeaways</h3>
          <ul>
            <li>Careful architecture accelerates operational efficiency while maintaining control over data.</li>
            <li>Structured validation prevents malformed requests and errors.</li>
            <li>Human approval guardrails are essential for high-impact actions.</li>
          </ul>
        </div>

        <div class=""article-service-callout"">
          <h4>Need this capability in your operations?</h4>
          <p>We build production-ready workflows and connected business platforms tailored to your stack.</p>
          <a href=""../../architecture.html"" class=""button button-primary"" style=""font-size:0.85rem; padding:8px 16px;"">Explore Architecture <i class=""fa-solid fa-arrow-right"" aria-hidden=""true""></i></a>
        </div>
      </article>";

        string newHtml = Regex.Replace(html, pattern, newBody, RegexOptions.Singleline);
        
        if (newHtml != html)
        {
            File.WriteAllText(filePath, newHtml);
            Console.WriteLine("Rewrote boilerplate in " + filePath);
        }
    }
}
